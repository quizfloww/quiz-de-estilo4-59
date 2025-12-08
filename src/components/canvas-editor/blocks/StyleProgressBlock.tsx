import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Progress } from "@/components/ui/progress";

interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

interface StyleProgressBlockProps {
  content: CanvasBlockContent & {
    allStyles?: StyleResult[];
  };
  isPreview?: boolean;
}

// Cores por estilo
const STYLE_COLORS: Record<string, string> = {
  Natural: "#8B9D83",
  Clássico: "#6B7B8C",
  Contemporâneo: "#7AB8B8",
  Elegante: "#B89B7A",
  Romântico: "#D4A5A5",
  Sexy: "#C45C5C",
  Dramático: "#5C5C5C",
  Criativo: "#9B7AB8",
};

// Dados de exemplo para preview
const PREVIEW_ALL_STYLES = [
  { name: "Natural", percentage: 85, color: "#8B9D83" },
  { name: "Clássico", percentage: 65, color: "#6B7B8C" },
  { name: "Elegante", percentage: 45, color: "#B89B7A" },
  { name: "Romântico", percentage: 30, color: "#D4A5A5" },
  { name: "Sexy", percentage: 25, color: "#C45C5C" },
  { name: "Dramático", percentage: 20, color: "#5C5C5C" },
  { name: "Criativo", percentage: 15, color: "#9B7AB8" },
  { name: "Contemporâneo", percentage: 10, color: "#7AB8B8" },
];

export const StyleProgressBlock: React.FC<StyleProgressBlockProps> = ({
  content,
  isPreview,
}) => {
  const showLabels = content.showLabels !== false;
  const maxStyles = content.maxStylesShown || 8;
  const blockBackgroundColor = content.backgroundColor || "#ffffff";

  // Usar dados dinâmicos se disponíveis
  const dynamicStyles = content.allStyles;

  const stylesToShow = React.useMemo(() => {
    if (dynamicStyles && dynamicStyles.length > 0) {
      return dynamicStyles.slice(0, maxStyles).map((style) => ({
        name: style.category,
        percentage: Math.round(style.percentage),
        color: STYLE_COLORS[style.category] || "#B89B7A",
      }));
    }
    return PREVIEW_ALL_STYLES.slice(0, maxStyles);
  }, [dynamicStyles, maxStyles]);

  return (
    <div
      className="w-full p-6 rounded-xl border border-[#B89B7A]/20"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <h3 className="text-lg font-semibold text-[#432818] text-center mb-6">
        Distribuição dos Estilos
      </h3>

      <div className="space-y-4">
        {stylesToShow.map((style) => (
          <div key={style.name} className="space-y-1">
            {showLabels && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5A4A3A] font-medium">{style.name}</span>
                <span className="text-[#8F7A6A]">{style.percentage}%</span>
              </div>
            )}
            <div className="relative h-3 bg-[#F5F0EB] rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${style.percentage}%`,
                  backgroundColor: style.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
