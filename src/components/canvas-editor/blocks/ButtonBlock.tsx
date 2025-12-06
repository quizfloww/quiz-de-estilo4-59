import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";

interface ButtonBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  content,
  isPreview,
}) => {
  const variant = content.buttonVariant || "primary";

  // Cores do tema Gisele Galvão
  const primaryColor = content.buttonColor || "#B89B7A";

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: primaryColor,
      color: "#FFFFFF",
    },
    secondary: {
      backgroundColor: "#432818",
      color: "#FFFFFF",
    },
    outline: {
      backgroundColor: "transparent",
      border: `2px solid ${primaryColor}`,
      color: primaryColor,
    },
  };

  // Background color do container
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full flex justify-center p-2 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <button
        className={cn(
          "h-12 md:h-14 px-4 md:px-6 py-2 text-sm md:text-base font-semibold rounded-md",
          "shadow-md transition-all duration-300",
          "hover:shadow-lg hover:scale-[1.01]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          content.fullWidth && "w-full",
          isPreview && "cursor-default"
        )}
        style={{
          ...variantStyles[variant],
          // @ts-ignore
          "--tw-ring-color": primaryColor,
        }}
        disabled={isPreview}
      >
        {content.buttonText || "Continuar"}
      </button>
    </div>
  );
};
