import React from 'react';
import { CanvasBlockType, BLOCK_TYPE_LABELS } from '@/types/canvasBlocks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layout, 
  Type, 
  AlignLeft, 
  Image, 
  TextCursor, 
  List, 
  MousePointer, 
  Maximize2, 
  Minus 
} from 'lucide-react';

interface BlocksSidebarProps {
  onAddBlock: (type: CanvasBlockType) => void;
}

const BLOCK_ICONS: Record<CanvasBlockType, React.ElementType> = {
  header: Layout,
  heading: Type,
  text: AlignLeft,
  image: Image,
  input: TextCursor,
  options: List,
  button: MousePointer,
  spacer: Maximize2,
  divider: Minus,
};

const BLOCK_CATEGORIES = [
  {
    name: 'Estrutura',
    blocks: ['header', 'spacer', 'divider'] as CanvasBlockType[],
  },
  {
    name: 'Conteúdo',
    blocks: ['heading', 'text', 'image'] as CanvasBlockType[],
  },
  {
    name: 'Interação',
    blocks: ['input', 'options', 'button'] as CanvasBlockType[],
  },
];

export const BlocksSidebar: React.FC<BlocksSidebarProps> = ({ onAddBlock }) => {
  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-3 border-b">
        <span className="font-medium text-sm">Blocos</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {BLOCK_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                {category.name}
              </p>
              <div className="grid grid-cols-1 gap-1">
                {category.blocks.map((blockType) => {
                  const Icon = BLOCK_ICONS[blockType];
                  return (
                    <Button
                      key={blockType}
                      variant="ghost"
                      size="sm"
                      className="h-auto py-2 px-2 justify-start gap-2 hover:bg-primary/10"
                      onClick={() => onAddBlock(blockType)}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{BLOCK_TYPE_LABELS[blockType]}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
