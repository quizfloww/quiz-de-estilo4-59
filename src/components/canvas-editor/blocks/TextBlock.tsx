import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";

interface TextBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, isPreview }) => {
  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
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
      <p
        className={cn(
          "w-full text-muted-foreground",
          fontSizeClasses[content.fontSize || "base"],
          textAlignClasses[content.textAlign || "center"]
        )}
      >
        {content.text || "Texto"}
      </p>
    </div>
  );
};
