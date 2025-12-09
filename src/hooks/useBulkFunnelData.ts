import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

// Stage types que correspondem ao banco de dados
type StageType = "intro" | "question" | "result" | "strategic" | "transition";

interface StageToInsert {
  funnel_id: string;
  type: StageType;
  title: string;
  order_index: number;
  is_enabled: boolean;
  config: Database["public"]["Tables"]["funnel_stages"]["Insert"]["config"];
}

interface OptionToInsert {
  stage_id: string;
  text: string;
  image_url: string | null;
  style_category: string | null;
  points: number;
  order_index: number;
}

interface BulkInsertData {
  funnelId: string;
  stages: Omit<StageToInsert, "funnel_id">[];
  optionsMap: Map<number, Omit<OptionToInsert, "stage_id">[]>; // key = order_index
}

export const useBulkInsertFunnelData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ funnelId, stages, optionsMap }: BulkInsertData) => {
      // 1. Insert all stages
      const stagesToInsert: StageToInsert[] = stages.map((stage) => ({
        ...stage,
        funnel_id: funnelId,
      }));

      const { data: insertedStages, error: stagesError } = await supabase
        .from("funnel_stages")
        .insert(stagesToInsert)
        .select("id, order_index");

      if (stagesError) throw stagesError;
      if (!insertedStages) throw new Error("No stages returned");

      // 2. Build options with correct stage_ids
      const allOptions: OptionToInsert[] = [];

      for (const stage of insertedStages) {
        const stageOptions = optionsMap.get(stage.order_index);
        if (stageOptions && stageOptions.length > 0) {
          stageOptions.forEach((option) => {
            allOptions.push({
              ...option,
              stage_id: stage.id,
            });
          });
        }
      }

      // 3. Insert all options if any
      if (allOptions.length > 0) {
        const { error: optionsError } = await supabase
          .from("stage_options")
          .insert(allOptions);

        if (optionsError) throw optionsError;
      }

      return {
        funnelId,
        stagesCount: insertedStages.length,
        optionsCount: allOptions.length,
      };
    },
    onSuccess: (data) => {
      // Invalidar ambas as queries para garantir que o editor carregue as opções
      queryClient.invalidateQueries({
        queryKey: ["funnel-stages", data.funnelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["funnel-stages-with-options", data.funnelId],
      });
      toast.success(
        `Funil criado com ${data.stagesCount} etapas e ${data.optionsCount} opções!`
      );
    },
    onError: (error) => {
      console.error("Bulk insert error:", error);
      toast.error("Erro ao criar etapas do funil: " + error.message);
    },
  });
};
