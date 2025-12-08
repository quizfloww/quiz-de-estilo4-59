import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StageOption {
  id: string;
  stage_id: string;
  text: string;
  image_url: string | null;
  style_category: string | null;
  points: number | null;
  order_index: number;
}

export interface FunnelStage {
  id: string;
  funnel_id: string;
  type:
    | "intro"
    | "question"
    | "strategic"
    | "transition"
    | "result"
    | "offer"
    | "upsell"
    | "thankyou"
    | "page";
  title: string;
  order_index: number;
  is_enabled: boolean | null;
  config: Record<string, any> | null;
  options: StageOption[];
}

export interface PublicFunnel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  global_config: Record<string, any> | null;
  style_categories: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }> | null;
  stages: FunnelStage[];
}

export const usePublicFunnel = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["public-funnel", slug],
    queryFn: async (): Promise<PublicFunnel | null> => {
      if (!slug) return null;

      // Fetch the funnel by slug (must be published)
      const { data: funnel, error: funnelError } = await supabase
        .from("funnels")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (funnelError) throw funnelError;
      if (!funnel) return null;

      // Fetch all stages for this funnel
      const { data: stages, error: stagesError } = await supabase
        .from("funnel_stages")
        .select("*")
        .eq("funnel_id", funnel.id)
        .eq("is_enabled", true)
        .order("order_index", { ascending: true });

      if (stagesError) throw stagesError;

      // Fetch all options for all stages
      const stageIds = stages?.map((s) => s.id) || [];
      let options: StageOption[] = [];

      if (stageIds.length > 0) {
        const { data: optionsData, error: optionsError } = await supabase
          .from("stage_options")
          .select("*")
          .in("stage_id", stageIds)
          .order("order_index", { ascending: true });

        if (optionsError) throw optionsError;
        options = optionsData || [];
      }

      // Map options to their stages
      const stagesWithOptions: FunnelStage[] = (stages || []).map((stage) => ({
        ...stage,
        type: stage.type as FunnelStage["type"],
        config: stage.config as Record<string, any> | null,
        options: options.filter((opt) => opt.stage_id === stage.id),
      }));

      return {
        id: funnel.id,
        name: funnel.name,
        slug: funnel.slug,
        description: funnel.description,
        global_config: funnel.global_config as Record<string, any> | null,
        style_categories:
          funnel.style_categories as PublicFunnel["style_categories"],
        stages: stagesWithOptions,
      };
    },
    enabled: !!slug,
  });
};

export const useSaveFunnelResponse = () => {
  return useMutation({
    mutationFn: async (data: {
      funnel_id: string;
      participant_name: string | null;
      participant_email: string | null;
      answers: Record<string, string[]>;
      results: Record<string, any>;
    }) => {
      const { data: response, error } = await supabase
        .from("funnel_responses")
        .insert({
          funnel_id: data.funnel_id,
          participant_name: data.participant_name,
          participant_email: data.participant_email,
          answers: data.answers,
          results: data.results,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return response;
    },
  });
};
