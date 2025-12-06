import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImageBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Mapeamento de sombras
const SHADOW_MAP: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

export const ImageBlock: React.FC<ImageBlockProps> = ({
  content,
  isPreview,
}) => {
  const imageAlignment = content.imageAlignment || "center";
  const imagePosition = content.imagePosition || "center";

  // Novos controles de escala proporcional
  const imageScale = content.imageScale || 1;
  const imageMaxWidth = content.imageMaxWidth || 100;
  const imageBorderRadius = content.imageBorderRadius || 0;
  const imageBorderWidth = content.imageBorderWidth || 0;
  const imageBorderColor = content.imageBorderColor || "#e5e5e5";
  const imageShadow = content.imageShadow || "none";

  // Estilo da imagem
  const imageStyle: React.CSSProperties = {
    maxWidth: `${imageMaxWidth}%`,
    width: "100%",
    height: "auto",
    transform: `scale(${imageScale})`,
    transformOrigin:
      imageAlignment === "left"
        ? "left center"
        : imageAlignment === "right"
        ? "right center"
        : "center",
    borderRadius: `${imageBorderRadius}px`,
    border:
      imageBorderWidth > 0
        ? `${imageBorderWidth}px solid ${imageBorderColor}`
        : "none",
    boxShadow: SHADOW_MAP[imageShadow] || "none",
    objectFit: "cover" as const,
  };

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  if (!content.imageUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/25 p-2 rounded-lg",
          imageAlignment === "left" && "mr-auto",
          imageAlignment === "center" && "mx-auto",
          imageAlignment === "right" && "ml-auto"
        )}
        style={{
          maxWidth: `${imageMaxWidth}%`,
          aspectRatio: "4/3",
          width: "100%",
          transform: `scale(${imageScale})`,
          transformOrigin:
            imageAlignment === "left"
              ? "left center"
              : imageAlignment === "right"
              ? "right center"
              : "center",
          borderRadius: `${imageBorderRadius}px`,
          backgroundColor: blockBackgroundColor,
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm">Adicionar imagem</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full p-2 rounded-lg",
        imageAlignment === "left" && "justify-start",
        imageAlignment === "center" && "justify-center",
        imageAlignment === "right" && "justify-end"
      )}
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <img
        src={content.imageUrl}
        alt={content.imageAlt || "Imagem"}
        className={cn(
          imagePosition === "top" && "object-top",
          imagePosition === "center" && "object-center",
          imagePosition === "bottom" && "object-bottom"
        )}
        style={imageStyle}
      />
    </div>
  );
};
