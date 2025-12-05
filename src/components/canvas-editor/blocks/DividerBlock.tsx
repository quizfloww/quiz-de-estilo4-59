import React from 'react';
import { CanvasBlockContent } from '@/types/canvasBlocks';
import { Separator } from '@/components/ui/separator';

interface DividerBlockProps {
  content: CanvasBlockContent;
  isPreview?: boolean;
}

export const DividerBlock: React.FC<DividerBlockProps> = ({ content, isPreview }) => {
  return (
    <Separator className="w-full my-2" />
  );
};
