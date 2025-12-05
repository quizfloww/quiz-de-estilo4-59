import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SecondaryStylesBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Dados de exemplo para preview
const PREVIEW_STYLES = [
  { name: 'Clássico', percentage: 65, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp' },
  { name: 'Elegante', percentage: 45, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp' },
  { name: 'Romântico', percentage: 30, imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp' },
];

export const SecondaryStylesBlock: React.FC<SecondaryStylesBlockProps> = ({ content, isPreview }) => {
  const maxStyles = content.maxSecondaryStyles || 3;
  const showPercentage = content.showSecondaryPercentage !== false;
  
  const stylesToShow = PREVIEW_STYLES.slice(0, maxStyles);

  return (
    <div className="w-full space-y-4">
      <h3 className="text-xl font-semibold text-[#432818] text-center mb-4">
        Seus Estilos Secundários
      </h3>
      
      <div className="grid gap-3">
        {stylesToShow.map((style, index) => (
          <div 
            key={style.name}
            className="flex items-center gap-4 p-4 rounded-lg bg-white border border-[#B89B7A]/20 shadow-sm"
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B89B7A]/30 flex-shrink-0">
              <img
                src={style.imageUrl}
                alt={style.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[#432818]">{style.name}</span>
                {showPercentage && (
                  <span className="text-sm font-semibold text-[#B89B7A]">{style.percentage}%</span>
                )}
              </div>
              <Progress 
                value={style.percentage} 
                className="h-2 bg-[#B89B7A]/20"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
