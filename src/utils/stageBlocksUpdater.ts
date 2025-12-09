/**
 * Utilitário para atualizar etapas do funil com blocos modulares
 *
 * Este arquivo fornece funções para:
 * 1. Aplicar template de blocos a uma etapa existente
 * 2. Criar nova etapa com blocos pré-configurados
 * 3. Migrar etapas antigas para o sistema de blocos
 */

import { supabase } from "@/integrations/supabase/client";
import { CanvasBlock } from "@/types/canvasBlocks";
import {
  resultStageBlocks,
  offerStageBlocks,
} from "@/data/templates/resultOfferBlocks";

interface UpdateStageWithBlocksParams {
  stageId: string;
  blocks: CanvasBlock[];
  backgroundColor?: string;
}

/**
 * Atualiza uma etapa existente com blocos modulares
 */
export async function updateStageWithBlocks({
  stageId,
  blocks,
  backgroundColor = "#FAF9F7",
}: UpdateStageWithBlocksParams): Promise<{ success: boolean; error?: string }> {
  try {
    const config = {
      blocks: blocks as unknown,
      canvasBackgroundColor: backgroundColor,
      redirectToResult: false, // Usar fluxo unificado
    } as Record<string, unknown>;

    const { error } = await supabase
      .from("funnel_stages")
      .update({
        config,
        updated_at: new Date().toISOString(),
      } as unknown as Record<string, unknown>)
      .eq("id", stageId);

    if (error) {
      console.error("Error updating stage with blocks:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception updating stage:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Aplica o template de resultado + oferta a uma etapa
 */
export async function applyResultOfferTemplate(
  stageId: string
): Promise<{ success: boolean; error?: string }> {
  const allBlocks = [...resultStageBlocks, ...offerStageBlocks];
  return updateStageWithBlocks({
    stageId,
    blocks: allBlocks,
    backgroundColor: "#FAF9F7",
  });
}

/**
 * Aplica apenas o template de resultado a uma etapa
 */
export async function applyResultTemplate(
  stageId: string
): Promise<{ success: boolean; error?: string }> {
  return updateStageWithBlocks({
    stageId,
    blocks: resultStageBlocks,
    backgroundColor: "#FAF9F7",
  });
}

/**
 * Aplica apenas o template de oferta a uma etapa
 */
export async function applyOfferTemplate(
  stageId: string
): Promise<{ success: boolean; error?: string }> {
  return updateStageWithBlocks({
    stageId,
    blocks: offerStageBlocks,
    backgroundColor: "#FAF9F7",
  });
}

/**
 * Encontra e atualiza a última etapa de um funil com blocos de resultado
 */
export async function updateFunnelResultStage(
  funnelId: string
): Promise<{ success: boolean; stageId?: string; error?: string }> {
  try {
    // Buscar a última etapa do funil (tipo result ou offer)
    const { data: stages, error: fetchError } = await supabase
      .from("funnel_stages")
      .select("id, type, order_index")
      .eq("funnel_id", funnelId)
      .in("type", ["result"])
      .order("order_index", { ascending: false })
      .limit(1);

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!stages || stages.length === 0) {
      // Se não encontrar etapa de resultado, pegar a última etapa
      const { data: lastStage, error: lastError } = await supabase
        .from("funnel_stages")
        .select("id, type, order_index")
        .eq("funnel_id", funnelId)
        .order("order_index", { ascending: false })
        .limit(1)
        .single();

      if (lastError || !lastStage) {
        return { success: false, error: "No stages found in funnel" };
      }

      const result = await applyResultOfferTemplate(lastStage.id);
      return { ...result, stageId: lastStage.id };
    }

    const targetStage = stages[0];
    const result = await applyResultOfferTemplate(targetStage.id);
    return { ...result, stageId: targetStage.id };
  } catch (err) {
    console.error("Exception in updateFunnelResultStage:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Lista de blocos disponíveis para cada tipo de etapa
 */
export const STAGE_TYPE_BLOCKS = {
  result: [
    "header",
    "heading",
    "text",
    "image",
    "styleResult",
    "secondaryStyles",
    "styleProgress",
    "personalizedHook",
    "styleGuide",
    "beforeAfter",
    "button",
    "spacer",
    "divider",
  ],
  offer: [
    "header",
    "heading",
    "text",
    "image",
    "countdown",
    "priceAnchor",
    "benefitsList",
    "bonus",
    "guarantee",
    "testimonials",
    "testimonial",
    "ctaOffer",
    "faq",
    "socialProof",
    "mentor",
    "motivation",
    "securePurchase",
    "button",
    "spacer",
    "divider",
  ],
  thankyou: [
    "header",
    "heading",
    "text",
    "image",
    "button",
    "spacer",
    "divider",
  ],
  upsell: [
    "header",
    "heading",
    "text",
    "image",
    "countdown",
    "priceAnchor",
    "benefitsList",
    "ctaOffer",
    "guarantee",
    "button",
    "spacer",
    "divider",
  ],
};

export default {
  updateStageWithBlocks,
  applyResultOfferTemplate,
  applyResultTemplate,
  applyOfferTemplate,
  updateFunnelResultStage,
  STAGE_TYPE_BLOCKS,
};
