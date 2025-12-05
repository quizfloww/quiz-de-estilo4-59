import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface StyleResultBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

// Dados de exemplo para preview
const PREVIEW_STYLE = {
  name: 'Natural',
  percentage: 85,
  description: 'Seu estilo predominante é Natural! Você valoriza conforto, praticidade e autenticidade. Prefere peças versáteis que permitem liberdade de movimento.',
  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
};

export const StyleResultBlock: React.FC<StyleResultBlockProps> = ({ content, isPreview }) => {
  const showPercentage = content.showPercentage !== false;
  const showDescription = content.showDescription !== false;
  const layout = content.layout || 'stacked';
  const imageSize = content.styleImageSize || 'lg';
  
  const imageSizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  return (
    <div className={cn(
      'w-full p-6 rounded-xl bg-gradient-to-br from-[#fffaf7] to-[#fff5eb] border border-[#B89B7A]/20',
      layout === 'side-by-side' && 'flex flex-row items-center gap-6'
    )}>
      {/* Imagem do Estilo */}
      <div className={cn(
        'flex justify-center',
        layout === 'stacked' && 'mb-6'
      )}>
        <div className={cn(
          'rounded-full overflow-hidden border-4 border-[#B89B7A]/30 shadow-lg',
          imageSizeClasses[imageSize]
        )}>
          <img
            src={PREVIEW_STYLE.imageUrl}
            alt={PREVIEW_STYLE.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className={cn(
        'flex-1',
        layout === 'stacked' && 'text-center'
      )}>
        <h2 className="text-2xl md:text-3xl font-bold text-[#432818] mb-2">
          Seu Estilo Predominante:
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-[#B89B7A] mb-4">
          {PREVIEW_STYLE.name}
        </h3>

        {showPercentage && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#8F7A6A]">Compatibilidade</span>
              <span className="text-lg font-bold text-[#B89B7A]">{PREVIEW_STYLE.percentage}%</span>
            </div>
            <Progress 
              value={PREVIEW_STYLE.percentage} 
              className="h-3 bg-[#B89B7A]/20"
            />
          </div>
        )}

        {showDescription && (
          <p className="text-[#5A4A3A] leading-relaxed">
            {PREVIEW_STYLE.description}
          </p>
        )}
      </div>
    </div>
  );
};
