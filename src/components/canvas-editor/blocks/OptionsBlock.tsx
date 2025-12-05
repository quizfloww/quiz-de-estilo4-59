import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';

interface OptionsBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const OptionsBlock: React.FC<OptionsBlockProps> = ({ content, isPreview }) => {
  const options = content.options || [];
  const displayType = content.displayType || 'text';
  const hasImages = displayType === 'both' || displayType === 'image';
  const columns = content.columns || (hasImages ? 2 : 1);

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <span className="text-muted-foreground text-sm">Nenhuma opção configurada</span>
      </div>
    );
  }

  // Layout em grid para opções com imagens
  if (hasImages) {
    return (
      <div 
        className={cn(
          'grid gap-3 w-full',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-3',
          columns === 4 && 'grid-cols-4',
        )}
      >
        {options.map((option, index) => (
          <button
            key={option.id || index}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary hover:text-primary-foreground transition-colors overflow-hidden"
          >
            {option.imageUrl && (
              <div className="w-full aspect-square overflow-hidden rounded-md">
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="text-xs text-center font-medium line-clamp-2">
              {option.text}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Layout em lista para opções só com texto
  return (
    <div className="flex flex-col items-start justify-start gap-2 w-full">
      {options.map((option, index) => (
        <button
          key={option.id || index}
          className="whitespace-normal rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-primary hover:text-primary-foreground min-w-full gap-2 flex py-4 px-4 flex-row items-center justify-start text-left"
        >
          <div className="break-words w-full">
            <p dangerouslySetInnerHTML={{ __html: option.text }} />
          </div>
        </button>
      ))}
    </div>
  );
};
