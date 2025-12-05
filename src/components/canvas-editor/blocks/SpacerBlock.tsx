import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';

interface SpacerBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
  isEditing?: boolean;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({ content, isPreview, isEditing }) => {
  return (
    <div 
      className={isEditing ? 'border border-dashed border-yellow-500 rounded-lg' : ''}
      style={{ 
        minHeight: content.height || '1rem',
        width: '100%',
      }}
    />
  );
};
