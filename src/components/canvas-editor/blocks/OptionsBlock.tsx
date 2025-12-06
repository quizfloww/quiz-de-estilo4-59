import React, { useState } from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { QuizOption, QuizOptionItem } from "@/components/shared/QuizOption";

interface OptionsBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Tamanhos em pixels para cálculo do grid
const IMAGE_SIZES: Record<string, number> = {
  xs: 64,
  sm: 80,
  md: 112,
  lg: 160,
  xl: 208,
  "2xl": 288,
  "3xl": 384,
  full: 480,
};

export const OptionsBlock: React.FC<OptionsBlockProps> = ({
  content,
  isPreview,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const options = content.options || [];
  const displayType = content.displayType || "text";
  const hasImages = displayType === "both" || displayType === "image";
  const imageSize = (content.optionImageSize || "md") as
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "full";
  const imageSizePx = IMAGE_SIZES[imageSize] || 112;
  const isLargeImage = ["2xl", "3xl", "full"].includes(imageSize);
  const baseColumns = content.columns || (hasImages ? 2 : 1);
  // Limitar colunas a máximo 2 para melhor responsividade mobile
  const columns = Math.min(isLargeImage && baseColumns > 2 ? 2 : baseColumns, 2);
  const showCheckIcon = content.showCheckIcon !== false;
  const textSize = (content.optionTextSize || "base") as
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl";
  const scale = content.scale || 1;

  const handleSelect = (optionId: string) => {
    const maxSelect = content.multiSelect || 1;

    if (selectedIds.includes(optionId)) {
      setSelectedIds(selectedIds.filter((id) => id !== optionId));
    } else {
      if (maxSelect === 1) {
        setSelectedIds([optionId]);
      } else if (selectedIds.length < maxSelect) {
        setSelectedIds([...selectedIds, optionId]);
      }
    }
  };

  // Converter opções para o formato do QuizOption
  const quizOptions: QuizOptionItem[] = options.map((opt: any) => ({
    id: opt.id,
    text: opt.text,
    imageUrl: opt.imageUrl,
    styleCategory: opt.styleCategory,
  }));

  if (quizOptions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <span className="text-muted-foreground text-sm">
          Nenhuma opção configurada
        </span>
      </div>
    );
  }

  // Layout em grid para opções com imagens
  if (hasImages) {
    const cellMinWidth = imageSizePx + 24;

    return (
      <div
        className="grid gap-3 w-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          gridTemplateColumns: `repeat(${columns}, minmax(${cellMinWidth}px, 1fr))`,
        }}
      >
        {quizOptions.map((option) => (
          <QuizOption
            key={option.id}
            option={option}
            isSelected={selectedIds.includes(option.id)}
            displayType={displayType as "text" | "image" | "both"}
            imageSize={imageSize}
            textSize={textSize}
            showCheckIcon={showCheckIcon}
            onClick={handleSelect}
            variant="brand"
          />
        ))}
      </div>
    );
  }

  // Layout em lista para opções só com texto
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top center",
      }}
    >
      <div className="flex flex-col items-start justify-start gap-2 w-full">
        {quizOptions.map((option) => (
          <QuizOption
            key={option.id}
            option={option}
            isSelected={selectedIds.includes(option.id)}
            displayType="text"
            textSize={textSize}
            showCheckIcon={showCheckIcon}
            onClick={handleSelect}
            variant="brand"
          />
        ))}
      </div>
    </div>
  );
};
