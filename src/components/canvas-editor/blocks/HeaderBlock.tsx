import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HeaderBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({ content, isPreview }) => {
  return (
    <div className="flex flex-row w-full h-auto justify-center relative">
      {content.showBackButton && (
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-primary-foreground h-10 w-10 absolute left-0">
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      
      <div className="flex flex-col w-full max-w-md justify-start items-center gap-4">
        {content.showLogo && content.logoUrl && (
          <img 
            src={content.logoUrl} 
            alt="Logo" 
            className="max-w-24 h-auto object-cover"
            width={96}
            height={96}
          />
        )}
        
        {content.showProgress && (
          <Progress 
            value={content.progress || 0} 
            className="w-full h-2 bg-zinc-300"
          />
        )}
      </div>
    </div>
  );
};
