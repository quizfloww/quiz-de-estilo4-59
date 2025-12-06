import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Card } from "@/components/ui/card";
import { styleConfig } from "@/config/styleConfig";
import { StyleCategory } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface StyleResultBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Dados de fallback para preview
const PREVIEW_STYLE = {
  name: "Natural",
  percentage: 85,
  description:
    "Você valoriza conforto, praticidade e autenticidade. Prefere peças versáteis que permitem liberdade de movimento e tem uma conexão especial com materiais naturais.",
  imageUrl:
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
};

// Mapeamento de molduras
const IMAGE_FRAME_STYLES: Record<string, React.CSSProperties> = {
  none: {},
  circle: { borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover" },
  rounded: { borderRadius: "16px" },
  "rounded-lg": { borderRadius: "24px" },
  square: { borderRadius: "0px" },
  "soft-square": { borderRadius: "8px" },
};

/**
 * StyleResultBlock - Design igual ao StyleResultSection.tsx real
 * - Card branco com border elegante
 * - Barra de progresso do estilo predominante
 * - Layout responsivo flex col/row
 * - Suporte a dados dinâmicos via styleConfig
 */
// Mapeamento de tamanhos de imagem
const IMAGE_SIZE_CLASSES: Record<string, string> = {
  sm: "max-w-[150px]",
  md: "max-w-[220px]",
  lg: "max-w-[300px]",
  xl: "max-w-[400px]",
};

export const StyleResultBlock: React.FC<StyleResultBlockProps> = ({
  content,
  isPreview,
}) => {
  const showPercentage = content.showPercentage !== false;
  const showDescription = content.showDescription !== false;
  const layout = content.layout || "stacked";
  const imageFrame = content.imageFrame || "rounded";
  const imageBorderWidth = content.imageBorderWidth || 0;
  const imageBorderColor = content.imageBorderColor || "#B89B7A";
  const imageSize = content.styleImageSize || "lg";
  const blockBackgroundColor = content.backgroundColor || "#ffffff";

  // Tenta usar categoria do content para dados dinâmicos
  const category = content.styleCategory as StyleCategory;
  const config = category ? styleConfig[category] : null;

  // Usa dados dinâmicos ou fallback
  const styleName = category || PREVIEW_STYLE.name;
  const percentage = content.stylePercentage ?? PREVIEW_STYLE.percentage;
  const description =
    content.styleDescription ||
    config?.description ||
    PREVIEW_STYLE.description;
  const imageUrl =
    content.styleImageUrl || config?.image || PREVIEW_STYLE.imageUrl;

  // Estilo da imagem baseado no formato de moldura
  const imageStyle: React.CSSProperties = {
    ...IMAGE_FRAME_STYLES[imageFrame],
    border:
      imageBorderWidth > 0
        ? `${imageBorderWidth}px solid ${imageBorderColor}`
        : undefined,
  };

  return (
    <Card
      className="p-4 sm:p-6 md:p-8 shadow-sm border border-[#B89B7A]/20 mb-8 md:mb-12"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      {/* Barra de Progresso do Estilo Predominante */}
      {showPercentage && (
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm sm:text-base font-medium text-[#432818]">
              Estilo Predominante
            </span>
            <span className="text-sm sm:text-base font-medium text-[#B89B7A]">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-[#F3E8E6] rounded-full h-2">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Layout Principal: Imagem e Descrição */}
      <div
        className={cn(
          "flex gap-6 md:gap-8 mb-6",
          layout === "stacked"
            ? "flex-col items-center"
            : "flex-col md:flex-row md:items-center"
        )}
      >
        {/* Imagem principal */}
        <div
          className={cn(
            "flex-shrink-0",
            layout === "stacked" ? "w-full max-w-md mx-auto" : "w-full md:w-1/2"
          )}
        >
          <img
            src={imageUrl}
            alt={`Estilo ${styleName}`}
            className={cn(
              "w-full h-auto shadow-md mx-auto",
              IMAGE_SIZE_CLASSES[imageSize]
            )}
            style={imageStyle}
          />
        </div>

        {/* Descrição do estilo */}
        {showDescription && (
          <div className={cn("flex-1", layout === "stacked" && "text-center")}>
            <h3 className="text-xl md:text-2xl font-playfair text-[#aa6b5d] mb-3">
              Estilo {styleName}
            </h3>
            <p className="text-base sm:text-lg text-[#432818] leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
