import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ content, isPreview }) => {
  if (!content.imageUrl) {
    return (
      <div 
        className="flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 mx-auto"
        style={{ 
          maxWidth: content.maxWidth || '384px',
          aspectRatio: '4/3',
          width: '100%',
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
    <div className="flex items-center justify-center w-full">
      <img 
        src={content.imageUrl} 
        alt={content.imageAlt || 'Imagem'}
        className={cn(
          'object-cover w-full h-auto',
          content.borderRadius && `rounded-lg`
        )}
        style={{ 
          maxWidth: content.maxWidth || '384px',
          borderRadius: content.borderRadius,
        }}
      />
    </div>
  );
};
