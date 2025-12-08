import React, { useMemo } from "react";
import { FunnelStage } from "@/hooks/usePublicFunnel";
import { CanvasBlock } from "@/types/canvasBlocks";
import { BlockRenderer } from "@/components/canvas-editor/BlockRenderer";
import { convertStageToBlocks } from "@/utils/stageToBlocks";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FunnelStage as EditorFunnelStage } from "@/hooks/useFunnelStages";

interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

interface DynamicStageRendererProps {
  stage: FunnelStage;
  stages: FunnelStage[];
  stageIndex: number;
  globalConfig: Record<string, unknown> | null;
  styleCategories?: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }> | null;
  // Quiz context
  userName?: string;
  quizResult?: {
    primaryStyle: StyleResult | null;
    secondaryStyles: StyleResult[];
  } | null;
  // Callbacks
  onContinue?: () => void;
  onPrevious?: () => void;
  onOptionSelect?: (optionId: string) => void;
  selectedOptions?: string[];
  // Display settings
  previewMode?: "desktop" | "mobile";
  backgroundColor?: string;
}

/**
 * DynamicStageRenderer - Renderiza uma etapa usando os blocos modulares do editor
 *
 * Este componente converte o config da etapa de volta para blocos e renderiza
 * cada bloco usando o BlockRenderer. Suporta todos os tipos de blocos:
 * - header, heading, text, image, button, spacer, divider
 * - options, input (para quiz)
 * - styleResult, secondaryStyles, styleProgress (para resultado)
 * - priceAnchor, countdown, testimonials, benefitsList, guarantee, ctaOffer, faq, socialProof (para oferta)
 * - bonus, mentor, motivation, beforeAfter, styleGuide, personalizedHook, securePurchase
 */
export const DynamicStageRenderer: React.FC<DynamicStageRendererProps> = ({
  stage,
  stages,
  stageIndex,
  globalConfig,
  styleCategories,
  userName,
  quizResult,
  onContinue,
  onPrevious,
  onOptionSelect,
  selectedOptions = [],
  previewMode = "desktop",
  backgroundColor,
}) => {
  // Convert stage config back to blocks
  const blocks = useMemo(() => {
    // Check if stage has blocks array directly in config (from JSON import)
    const config = (stage.config || {}) as Record<string, unknown>;
    const blocksArray = config.blocks;

    if (Array.isArray(blocksArray)) {
      return blocksArray as CanvasBlock[];
    }

    // Otherwise, convert stage config to blocks using the utility
    // Cast to EditorFunnelStage which is compatible with convertStageToBlocks
    return convertStageToBlocks(
      stage as unknown as EditorFunnelStage,
      stages.length,
      stageIndex
    );
  }, [stage, stages.length, stageIndex]);

  // Inject dynamic data into blocks
  const enrichedBlocks = useMemo(() => {
    return blocks.map((block) => {
      const enriched = { ...block, content: { ...block.content } };

      // Inject user name into templates
      if (enriched.content.text && typeof enriched.content.text === "string") {
        enriched.content.text = enriched.content.text.replace(
          /\{\{userName\}\}/g,
          userName || "Visitante"
        );
      }
      if (
        enriched.content.title &&
        typeof enriched.content.title === "string"
      ) {
        enriched.content.title = enriched.content.title.replace(
          /\{\{userName\}\}/g,
          userName || "Visitante"
        );
      }

      // Inject quiz result into result blocks
      if (quizResult && quizResult.primaryStyle) {
        if (block.type === "styleResult") {
          enriched.content.primaryStyle = quizResult.primaryStyle;
          enriched.content.styleCategories = styleCategories;
        }
        if (block.type === "secondaryStyles") {
          enriched.content.secondaryStyles = quizResult.secondaryStyles;
          enriched.content.styleCategories = styleCategories;
        }
        if (block.type === "styleProgress") {
          enriched.content.allStyles = [
            quizResult.primaryStyle,
            ...quizResult.secondaryStyles,
          ];
        }
        if (block.type === "personalizedHook") {
          enriched.content.primaryStyle = quizResult.primaryStyle.category;
        }
        if (block.type === "styleGuide") {
          const categoryInfo = styleCategories?.find(
            (c) =>
              c.id === quizResult.primaryStyle?.category ||
              c.name === quizResult.primaryStyle?.category
          );
          enriched.content.styleCategory = quizResult.primaryStyle.category;
          enriched.content.guideImageUrl = categoryInfo?.imageUrl;
        }
      }

      // Inject options from stage_options table
      if (block.type === "options" && stage.options?.length > 0) {
        enriched.content.options = stage.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          imageUrl: opt.image_url,
          styleCategory: opt.style_category,
          points: opt.points,
          isSelected: selectedOptions.includes(opt.id),
        }));
        enriched.content.onSelect = onOptionSelect;
        enriched.content.selectedOptions = selectedOptions;
      }

      // Inject button callbacks
      if (block.type === "button") {
        if (
          enriched.content.action === "continue" ||
          enriched.content.action === "next"
        ) {
          enriched.content.onClick = onContinue;
        }
        if (
          enriched.content.action === "previous" ||
          enriched.content.action === "back"
        ) {
          enriched.content.onClick = onPrevious;
        }
      }

      return enriched;
    });
  }, [
    blocks,
    userName,
    quizResult,
    styleCategories,
    stage.options,
    selectedOptions,
    onOptionSelect,
    onContinue,
    onPrevious,
  ]);

  // Get background color
  const stageConfigTyped = (stage.config || {}) as Record<string, unknown>;
  const globalConfigTyped = (globalConfig || {}) as Record<string, unknown>;
  const brandingConfig = (globalConfigTyped.branding || {}) as Record<
    string,
    unknown
  >;

  const bgColor =
    backgroundColor ||
    (stageConfigTyped.canvasBackgroundColor as string) ||
    (brandingConfig.backgroundColor as string) ||
    "#FAF9F7";

  return (
    <div
      className={cn(
        "flex-1 overflow-hidden",
        previewMode === "mobile" && "flex justify-center"
      )}
    >
      <ScrollArea className="h-full">
        <div
          className={cn(
            "min-h-full mx-auto p-4",
            previewMode === "mobile" ? "max-w-[390px]" : "max-w-2xl"
          )}
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex flex-col gap-4">
            {enrichedBlocks.map((block) => (
              <div key={block.id} className="min-w-full relative">
                <BlockRenderer block={block} isPreview />
              </div>
            ))}

            {/* Fallback if no blocks */}
            {enrichedBlocks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum bloco configurado para esta etapa.</p>
                <p className="text-sm mt-2">
                  Configure os blocos no editor do funil.
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DynamicStageRenderer;
