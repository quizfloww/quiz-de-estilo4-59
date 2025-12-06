import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const InputBlock: React.FC<InputBlockProps> = ({
  content,
  isPreview,
}) => {
  // Background color
  const blockBackgroundColor = content.backgroundColor;

  return (
    <div
      className="w-full grid items-center gap-1.5 px-2 sm:px-0 p-2 rounded-lg"
      style={{ backgroundColor: blockBackgroundColor }}
    >
      <Label className="text-sm sm:text-base font-medium">
        {content.label || "Campo"}
        {content.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type={content.inputType || "text"}
        placeholder={content.placeholder || "Digite aqui..."}
        className="h-10 sm:h-12 w-full rounded-md border border-input bg-background px-3 sm:px-4 py-2 text-sm sm:text-base placeholder:opacity-50"
        disabled={isPreview}
      />
    </div>
  );
};
