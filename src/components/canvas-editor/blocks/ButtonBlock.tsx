import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({ content, isPreview }) => {
  const variant = content.buttonVariant || 'primary';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <Button
      className={cn(
        'h-14 px-4 py-2 text-sm font-medium',
        content.fullWidth && 'min-w-full',
        variantClasses[variant]
      )}
      disabled={isPreview}
    >
      {content.buttonText || 'Continuar'}
    </Button>
  );
};
