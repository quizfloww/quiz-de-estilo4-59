import React from 'react';
import { CanvasBlock } from '@/types/canvasBlocks';
import {
  HeaderBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  InputBlock,
  OptionsBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
} from './blocks';

interface BlockRendererProps {
  block: CanvasBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isPreview, isEditing }) => {
  switch (block.type) {
    case 'header':
      return <HeaderBlock content={block.content} isPreview={isPreview} />;
    case 'heading':
      return <HeadingBlock content={block.content} isPreview={isPreview} />;
    case 'text':
      return <TextBlock content={block.content} isPreview={isPreview} />;
    case 'image':
      return <ImageBlock content={block.content} isPreview={isPreview} />;
    case 'input':
      return <InputBlock content={block.content} isPreview={isPreview} />;
    case 'options':
      return <OptionsBlock content={block.content} isPreview={isPreview} />;
    case 'button':
      return <ButtonBlock content={block.content} isPreview={isPreview} />;
    case 'spacer':
      return <SpacerBlock content={block.content} isPreview={isPreview} isEditing={isEditing} />;
    case 'divider':
      return <DividerBlock content={block.content} isPreview={isPreview} />;
    default:
      return (
        <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground">
          Bloco desconhecido: {block.type}
        </div>
      );
  }
};
