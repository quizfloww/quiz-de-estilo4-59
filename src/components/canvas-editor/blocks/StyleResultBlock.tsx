import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Card } from "@/components/ui/card";
import { styleConfig } from "@/config/styleConfig";
import { StyleCategory } from "@/types/quiz";

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

/**
 * StyleResultBlock - Design igual ao StyleResultSection.tsx real
 * - Card branco com border elegante
 * - Barra de progresso do estilo predominante
 * - Layout responsivo flex col/row
 * - Suporte a dados dinâmicos via styleConfig
 */
export const StyleResultBlock: React.FC<StyleResultBlockProps> = ({
  content,
  isPreview,
}) => {
  const showPercentage = content.showPercentage !== false;
  const showDescription = content.showDescription !== false;

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

  return (
    <Card className="p-4 sm:p-6 md:p-8 bg-white shadow-sm border border-[#B89B7A]/20 mb-8 md:mb-12">
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
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-6">
        {/* Imagem principal */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img
            src={imageUrl}
            alt={`Estilo ${styleName}`}
            className="w-full h-auto rounded-lg shadow-md mx-auto max-w-[238px] md:max-w-none"
          />
        </div>

        {/* Descrição do estilo */}
        {showDescription && (
          <div className="flex-1">
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
