import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

interface StyleCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  guideImage?: string;
}

interface SecondaryStylesBlockProps {
  content: CanvasBlockContent & {
    secondaryStyles?: StyleResult[];
    styleCategories?: StyleCategory[];
  };
  isPreview?: boolean;
}

// Dados de exemplo para preview
const PREVIEW_STYLES = [
  {
    name: "Clássico",
    percentage: 65,
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
  },
  {
    name: "Elegante",
    percentage: 45,
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
  },
  {
    name: "Romântico",
    percentage: 30,
    imageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
  },
];

// Mapeamento de molduras
const getImageFrameClass = (frame: string): string => {
  switch (frame) {
    case "none":
      return "";
    case "circle":
      return "rounded-full";
    case "rounded":
      return "rounded-lg";
    case "rounded-lg":
      return "rounded-xl";
    case "square":
      return "rounded-none";
    case "soft-square":
      return "rounded-md";
    default:
      return "rounded-full";
  }
};

export const SecondaryStylesBlock: React.FC<SecondaryStylesBlockProps> = ({
  content,
  isPreview,
}) => {
  const maxStyles = content.maxSecondaryStyles || content.maxStyles || 3;
  const showPercentage =
    content.showSecondaryPercentage !== false &&
    content.showPercentages !== false;
  const imageFrame = content.imageFrame || "circle";
  const imageBorderWidth = content.imageBorderWidth || 2;
  const imageBorderColor = content.imageBorderColor || "#B89B7A";
  const blockBackgroundColor = content.backgroundColor || "transparent";
  const title = content.title || "Seus Estilos Secundários";

  // Usar dados dinâmicos se disponíveis, senão fallback para preview
  const dynamicStyles = content.secondaryStyles;
  const styleCategories = content.styleCategories;

  // Mapear os estilos secundários para o formato de exibição
  const stylesToShow = React.useMemo(() => {
    if (dynamicStyles && dynamicStyles.length > 0 && styleCategories) {
      return dynamicStyles.slice(0, maxStyles).map((style) => {
        const categoryInfo = styleCategories.find(
          (c) => c.id === style.category || c.name === style.category
        );
        return {
          name: style.category,
          percentage: Math.round(style.percentage),
          imageUrl: categoryInfo?.imageUrl || PREVIEW_STYLES[0].imageUrl,
        };
      });
    }
    // Fallback para preview
    return PREVIEW_STYLES.slice(0, maxStyles);
  }, [dynamicStyles, styleCategories, maxStyles]);

  const imageStyle: React.CSSProperties = {
    border: `${imageBorderWidth}px solid ${imageBorderColor}30`,
  };

  return (
    <div
      className="w-full space-y-4 p-4 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <h3 className="text-xl font-semibold text-[#432818] text-center mb-4">
        {title}
      </h3>

      <div className="grid gap-3">
        {stylesToShow.map((style, index) => (
          <div
            key={`${style.name}-${index}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-white border border-[#B89B7A]/20 shadow-sm"
          >
            {/* Thumbnail */}
            <div
              className={cn(
                "w-12 h-12 overflow-hidden flex-shrink-0",
                getImageFrameClass(imageFrame)
              )}
              style={imageStyle}
            >
              <img
                src={style.imageUrl}
                alt={style.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[#432818]">{style.name}</span>
                {showPercentage && (
                  <span className="text-sm font-semibold text-[#B89B7A]">
                    {style.percentage}%
                  </span>
                )}
              </div>
              <Progress
                value={style.percentage}
                className="h-2 bg-[#B89B7A]/20"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
