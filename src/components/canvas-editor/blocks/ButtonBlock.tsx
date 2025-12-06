import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Button } from "@/components/ui/button";
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

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  // Background color
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full flex justify-center p-2 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <Button
        className={cn(
          "h-12 md:h-14 px-4 md:px-6 py-2 text-sm md:text-base font-medium",
          content.fullWidth && "w-full",
          variantClasses[variant]
        )}
        disabled={isPreview}
      >
        {content.buttonText || "Continuar"}
      </Button>
    </div>
  );
};
