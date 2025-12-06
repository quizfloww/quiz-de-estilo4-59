import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";

interface DividerBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

/**
 * DividerBlock - Divisor customizável
 * Props editáveis: dividerStyle, dividerColor, dividerThickness, dividerWidth
 */
export const DividerBlock: React.FC<DividerBlockProps> = ({
  content,
  isPreview,
}) => {
  const style = content.dividerStyle || "solid";
  const color = content.dividerColor || "#B89B7A";
  const thickness = content.dividerThickness || 1;
  const width = content.dividerWidth || 100;

  const styleClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
    elegant: "",
  };

  // Estilo elegante com gradiente
  if (style === "elegant") {
    return (
      <div className="w-full flex justify-center my-4 sm:my-6">
        <div
          className="h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"
          style={{ width: `${width}%` }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-2 sm:my-4">
      <hr
        className={cn("border-t-0", styleClasses[style])}
        style={{
          width: `${width}%`,
          borderTopWidth: `${thickness}px`,
          borderTopColor: color,
          borderTopStyle: style as "solid" | "dashed" | "dotted",
        }}
      />
    </div>
  );
};
