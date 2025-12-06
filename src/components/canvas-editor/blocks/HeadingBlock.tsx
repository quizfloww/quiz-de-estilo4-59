import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";

interface HeadingBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  content,
  isPreview,
}) => {
  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  const fontWeightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div 
      className="w-full p-2 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <h1
        className={cn(
          "w-full",
          fontSizeClasses[content.fontSize || "2xl"],
          fontWeightClasses[content.fontWeight || "bold"],
          textAlignClasses[content.textAlign || "center"]
        )}
        style={{ color: content.color || "#1a1a1a" }}
      >
        {content.text || "Título"}
      </h1>
    </div>
  );
};
