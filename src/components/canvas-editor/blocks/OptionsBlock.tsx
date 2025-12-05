import React, { useState } from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface OptionsBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

const TEXT_SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

// Tamanhos em pixels para cálculo do grid
const IMAGE_SIZES: Record<string, number> = {
  xs: 64,
  sm: 80,
  md: 112,
  lg: 160,
  xl: 208,
  '2xl': 288,
  '3xl': 384,
  full: 480,
};

export const OptionsBlock: React.FC<OptionsBlockProps> = ({ content, isPreview }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const options = content.options || [];
  const displayType = content.displayType || 'text';
  const hasImages = displayType === 'both' || displayType === 'image';
  const imageSize = content.optionImageSize || 'md';
  const imageSizePx = IMAGE_SIZES[imageSize] || 112;
  const isLargeImage = ['2xl', '3xl', 'full'].includes(imageSize);
  const baseColumns = content.columns || (hasImages ? 2 : 1);
  const columns = isLargeImage && baseColumns > 2 ? 2 : baseColumns;
  const showCheckIcon = content.showCheckIcon !== false;
  const textSizeClass = TEXT_SIZE_CLASSES[content.optionTextSize || 'base'];
  const scale = content.scale || 1;

  const handleSelect = (optionId: string) => {
    const maxSelect = content.multiSelect || 1;
    
    if (selectedIds.includes(optionId)) {
      setSelectedIds(selectedIds.filter(id => id !== optionId));
    } else {
      if (maxSelect === 1) {
        setSelectedIds([optionId]);
      } else if (selectedIds.length < maxSelect) {
        setSelectedIds([...selectedIds, optionId]);
      }
    }
  };

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <span className="text-muted-foreground text-sm">Nenhuma opção configurada</span>
      </div>
    );
  }

  // Layout em grid para opções com imagens
  if (hasImages) {
    // Calcular tamanho mínimo da célula baseado no tamanho da imagem + padding
    const cellMinWidth = imageSizePx + 24; // 24px para padding
    
    return (
      <div 
        className="grid gap-3 w-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          gridTemplateColumns: `repeat(${columns}, minmax(${cellMinWidth}px, 1fr))`,
        }}
      >
        {options.map((option, index) => {
          const isSelected = selectedIds.includes(option.id);
          
          return (
            <button
              key={option.id || index}
              onClick={() => handleSelect(option.id)}
              className={cn(
                'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 bg-background transition-all duration-300',
                isSelected 
                  ? 'border-[#b29670]' 
                  : 'border-input hover:border-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
              )}
              style={{
                boxShadow: isSelected 
                  ? '0 4px 12px rgba(178, 150, 112, 0.3)' 
                  : undefined,
              }}
            >
              {/* Check Icon */}
              {isSelected && showCheckIcon && (
                <div className="absolute -top-0.5 -right-0.5 bg-[#b29670] rounded-bl-md p-0.5">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}
              
              {option.imageUrl && (
                <div 
                  className="overflow-hidden rounded-md flex-shrink-0"
                  style={{ width: imageSizePx, height: imageSizePx }}
                >
                  <img 
                    src={option.imageUrl} 
                    alt={option.text}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {displayType === 'both' && (
                <span className={cn('text-center font-medium line-clamp-2', textSizeClass)}>
                  {option.text}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Layout em lista para opções só com texto
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
    <div className="flex flex-col items-start justify-start gap-2 w-full">
      {options.map((option, index) => {
        const isSelected = selectedIds.includes(option.id);
        
        return (
          <button
            key={option.id || index}
            onClick={() => handleSelect(option.id)}
            className={cn(
              'relative whitespace-normal rounded-md font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-2 bg-background min-w-full gap-2 flex py-4 px-4 flex-row items-center justify-start text-left',
              textSizeClass,
              isSelected 
                ? 'border-[#b29670]' 
                : 'border-input hover:border-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
            )}
            style={{
              boxShadow: isSelected 
                ? '0 4px 12px rgba(178, 150, 112, 0.3)' 
                : undefined,
            }}
          >
            {/* Check Icon */}
            {isSelected && showCheckIcon && (
              <div className="absolute -top-0.5 -right-0.5 bg-[#b29670] rounded-bl-md p-0.5">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
            )}
            
            <div className="break-words w-full">
              <p dangerouslySetInnerHTML={{ __html: option.text }} />
            </div>
          </button>
        );
      })}
      </div>
    </div>
  );
};
