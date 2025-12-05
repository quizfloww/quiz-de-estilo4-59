import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const IMAGE_SIZE_MAP = {
  sm: '200px',
  md: '384px',
  lg: '512px',
  xl: '640px',
  full: '100%',
};

export const ImageBlock: React.FC<ImageBlockProps> = ({ content, isPreview }) => {
  const imageSize = content.imageSize || 'md';
  const imageAlignment = content.imageAlignment || 'center';
  const imagePosition = content.imagePosition || 'center';
  const scale = content.scale || 1;
  const maxWidth = content.maxWidth || IMAGE_SIZE_MAP[imageSize];

  if (!content.imageUrl) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25',
          imageAlignment === 'left' && 'mr-auto',
          imageAlignment === 'center' && 'mx-auto',
          imageAlignment === 'right' && 'ml-auto',
        )}
        style={{ 
          maxWidth: maxWidth,
          aspectRatio: '4/3',
          width: '100%',
          transform: `scale(${scale})`,
          transformOrigin: imageAlignment === 'left' ? 'left center' : imageAlignment === 'right' ? 'right center' : 'center',
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
        'flex w-full',
        imageAlignment === 'left' && 'justify-start',
        imageAlignment === 'center' && 'justify-center',
        imageAlignment === 'right' && 'justify-end',
      )}
    >
      <img 
        src={content.imageUrl} 
        alt={content.imageAlt || 'Imagem'}
        className={cn(
          'w-full h-auto',
          imagePosition === 'top' && 'object-top',
          imagePosition === 'center' && 'object-center',
          imagePosition === 'bottom' && 'object-bottom',
          content.borderRadius && 'rounded-lg'
        )}
        style={{ 
          maxWidth: maxWidth,
          borderRadius: content.borderRadius,
          transform: `scale(${scale})`,
          transformOrigin: imageAlignment === 'left' ? 'left center' : imageAlignment === 'right' ? 'right center' : 'center',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
