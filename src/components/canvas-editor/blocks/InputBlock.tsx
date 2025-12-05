import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const InputBlock: React.FC<InputBlockProps> = ({ content, isPreview }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label className="text-sm font-medium">
        {content.label || 'Campo'}
        {content.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        type={content.inputType || 'text'}
        placeholder={content.placeholder || 'Digite aqui...'}
        className="h-10 w-full rounded-md border border-input bg-background p-4 text-base placeholder:opacity-50"
        disabled={isPreview}
      />
    </div>
  );
};
