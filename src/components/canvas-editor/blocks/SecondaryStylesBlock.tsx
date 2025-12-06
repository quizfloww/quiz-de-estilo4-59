import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SecondaryStylesBlockProps {
  content: CanvasBlockContent;
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
  const maxStyles = content.maxSecondaryStyles || 3;
  const showPercentage = content.showSecondaryPercentage !== false;
  const imageFrame = content.imageFrame || "circle";
  const imageBorderWidth = content.imageBorderWidth || 2;
  const imageBorderColor = content.imageBorderColor || "#B89B7A";
  const blockBackgroundColor = content.backgroundColor || "transparent";

  const stylesToShow = PREVIEW_STYLES.slice(0, maxStyles);

  const imageStyle: React.CSSProperties = {
    border: `${imageBorderWidth}px solid ${imageBorderColor}30`,
  };

  return (
    <div
      className="w-full space-y-4 p-4 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <h3 className="text-xl font-semibold text-[#432818] text-center mb-4">
        Seus Estilos Secundários
      </h3>

      <div className="grid gap-3">
        {stylesToShow.map((style, index) => (
          <div
            key={style.name}
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
