import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CanvasBlock } from "@/types/canvasBlocks";
import { syncBlocksToDatabase } from "@/utils/syncBlocksToDatabase";

export interface PublishValidation {
  isValid: boolean;
  errors: ValidationItem[];
  warnings: ValidationItem[];
}

export interface ValidationItem {
  id: string;
  message: string;
  type: "error" | "warning";
}

export interface PublishResult {
  success: boolean;
  publicUrl: string;
  message: string;
}

export const usePublishFunnel = (funnelId: string | undefined) => {
  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);

  const validateFunnel = async (
    stages: any[],
    stageBlocks: Record<string, CanvasBlock[]>,
    funnelSlug: string
  ): Promise<PublishValidation> => {
    console.clear();
    console.log(
      "%c🔥 NOVA VALIDAÇÃO - TIMESTAMP: " + new Date().toISOString(),
      "background: #222; color: #ff6b6b; font-size: 20px; font-weight: bold;"
    );
    setIsValidating(true);
    const errors: ValidationItem[] = [];
    const warnings: ValidationItem[] = [];

    try {
      // Check if slug is unique among published funnels
      const { data: existingFunnels } = await supabase
        .from("funnels")
        .select("id, slug")
        .eq("slug", funnelSlug)
        .eq("status", "published")
        .neq("id", funnelId || "");

      if (existingFunnels && existingFunnels.length > 0) {
        errors.push({
          id: "slug-unique",
          message: `Já existe um funil publicado com o slug "${funnelSlug}"`,
          type: "error",
        });
      }

      // Check for intro stage
      const introStages = stages.filter((s) => s.type === "intro");
      if (introStages.length === 0) {
        errors.push({
          id: "intro-required",
          message: "É necessário pelo menos uma etapa de introdução",
          type: "error",
        });
      }

      // Check for question stages
      const questionStages = stages.filter(
        (s) => s.type === "question" || s.type === "strategic"
      );
      if (questionStages.length === 0) {
        errors.push({
          id: "questions-required",
          message: "É necessário pelo menos uma etapa de pergunta",
          type: "error",
        });
      }

      // VALIDAÇÃO DE OPÇÕES COMPLETAMENTE DESABILITADA - 2024-12-07 15:35
      // NÃO VALIDA MAIS SE HÁ OPÇÕES CONFIGURADAS
      console.log(
        "⚠️ VALIDAÇÃO DE OPÇÕES DESABILITADA - Versão 2024-12-07 15:35"
      );

      // Check if question stages have valid options (WARNINGS ONLY - não bloqueia publicação)
      // CÓDIGO COMENTADO PARA TESTE - SE AINDA APARECER "não possui opções" É CACHE DO NAVEGADOR
      /*
      for (const stage of questionStages) {
        const blocks = stageBlocks[stage.id] || [];
        const optionsBlock = blocks.find((b) => b.type === "options");

        if (!optionsBlock) {
          // VERSÃO 2024-12-07 15:30 - WARNINGS NÃO BLOQUEIAM
          console.log(
            "🟡 AVISO (não bloqueia):",
            stage.title,
            "- Adicionando a WARNINGS"
          );
          warnings.push({
            id: `options-${stage.id}`,
            message: `A etapa "${stage.title}" não possui opções configuradas`,
            type: "warning",
          });
        } else {
          const options = optionsBlock.content?.options || [];
          if (options.length < 2) {
            warnings.push({
              id: `options-count-${stage.id}`,
              message: `A etapa "${stage.title}" tem apenas ${options.length} opção(ões) - recomendamos pelo menos 2`,
              type: "warning",
            });
          }
        }
      }
      */

      // Check for result stage (warning only)
      const resultStages = stages.filter((s) => s.type === "result");
      if (resultStages.length === 0) {
        warnings.push({
          id: "result-recommended",
          message: "Recomendamos adicionar uma etapa de resultado",
          type: "warning",
        });
      }

      // Check for logo configuration (warning only)
      const hasLogo = stages.some((stage) => {
        const blocks = stageBlocks[stage.id] || [];
        const headerBlock = blocks.find((b) => b.type === "header");
        return headerBlock?.content?.logoUrl;
      });

      if (!hasLogo) {
        warnings.push({
          id: "logo-recommended",
          message: "Recomendamos configurar uma logo para o funil",
          type: "warning",
        });
      }

      // Check for empty stages - DESABILITADO (permite publicar sem blocos)
      // for (const stage of stages) {
      //   const blocks = stageBlocks[stage.id] || [];
      //   if (blocks.length === 0) {
      //     warnings.push({
      //       id: `empty-stage-${stage.id}`,
      //       message: `A etapa "${stage.title}" não possui blocos configurados`,
      //       type: 'warning',
      //     });
      //   }
      // }
    } catch (error) {
      console.error("Error validating funnel:", error);
      errors.push({
        id: "validation-error",
        message: "Erro ao validar o funil",
        type: "error",
      });
    } finally {
      setIsValidating(false);
    }

    console.log("=".repeat(80));
    console.log("📊 VALIDAÇÃO FINAL - VERSÃO 2024-12-07 15:35:", {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      isValid: errors.length === 0,
    });
    console.log("❌ Errors:", errors);
    console.log("⚠️ Warnings:", warnings);
    console.log("=".repeat(80));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  const publishMutation = useMutation({
    mutationFn: async ({
      stages,
      stageBlocks,
    }: {
      stages: any[];
      stageBlocks: Record<string, CanvasBlock[]>;
    }): Promise<PublishResult> => {
      if (!funnelId) {
        throw new Error("Funnel ID is required");
      }

      // Sync all blocks to database
      await syncBlocksToDatabase(funnelId, stages, stageBlocks);

      // Update funnel status to published
      const { error } = await supabase
        .from("funnels")
        .update({ status: "published" })
        .eq("id", funnelId);

      if (error) throw error;

      // Get the funnel slug for the URL
      const { data: funnel } = await supabase
        .from("funnels")
        .select("slug")
        .eq("id", funnelId)
        .single();

      const publicUrl = `/quiz/${funnel?.slug || ""}`;

      return {
        success: true,
        publicUrl,
        message: "Funil publicado com sucesso!",
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["funnel", funnelId] });
      queryClient.invalidateQueries({ queryKey: ["funnels"] });
      toast.success(result.message);
    },
    onError: (error: Error) => {
      toast.error("Erro ao publicar funil: " + error.message);
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async () => {
      if (!funnelId) {
        throw new Error("Funnel ID is required");
      }

      const { error } = await supabase
        .from("funnels")
        .update({ status: "draft" })
        .eq("id", funnelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funnel", funnelId] });
      queryClient.invalidateQueries({ queryKey: ["funnels"] });
      toast.success("Funil despublicado");
    },
    onError: (error: Error) => {
      toast.error("Erro ao despublicar: " + error.message);
    },
  });

  return {
    validateFunnel,
    publishFunnel: publishMutation.mutateAsync,
    unpublishFunnel: unpublishMutation.mutateAsync,
    isValidating,
    isPublishing: publishMutation.isPending,
    isUnpublishing: unpublishMutation.isPending,
  };
};
