import React, { useState } from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { QuizOption, QuizOptionItem } from "@/components/shared/QuizOption";

interface OptionsBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const OptionsBlock: React.FC<OptionsBlockProps> = ({
  content,
  isPreview,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const options = content.options || [];
  const displayType = content.displayType || "text";
  const hasImages = displayType === "both" || displayType === "image";

  // Novos controles de escala proporcional (igual ao ImageBlock)
  const optionImageScale = content.optionImageScale || 1;
  const optionImageMaxWidth = content.optionImageMaxWidth || 100;
  const optionImageBorderRadius = content.optionImageBorderRadius || 8;
  const optionImageBorderWidth = content.optionImageBorderWidth || 0;
  const optionImageBorderColor = content.optionImageBorderColor || "#B89B7A";

  const baseColumns = content.columns || (hasImages ? 2 : 1);
  // Limitar colunas a máximo 2 para melhor responsividade mobile
  const columns = Math.min(baseColumns, 2);
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

  // Estilo customizado para as imagens das opções
  const imageStyles: React.CSSProperties = {
    transform: `scale(${optionImageScale})`,
    transformOrigin: "center",
    maxWidth: `${optionImageMaxWidth}%`,
    borderRadius: `${optionImageBorderRadius}px`,
    border:
      optionImageBorderWidth > 0
        ? `${optionImageBorderWidth}px solid ${optionImageBorderColor}`
        : undefined,
  };

  // Layout em grid para opções com imagens
  if (hasImages) {
    return (
      <div
        className="grid gap-3 w-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {quizOptions.map((option) => (
          <QuizOption
            key={option.id}
            option={option}
            isSelected={selectedIds.includes(option.id)}
            displayType={displayType as "text" | "image" | "both"}
            imageStyles={imageStyles}
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
