import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CanvasBlock, BLOCK_TYPE_LABELS } from '@/types/canvasBlocks';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableCanvasBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isPreview: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const SortableCanvasBlock: React.FC<SortableCanvasBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onSelect,
  onDelete,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  if (isPreview) {
    return (
      <div 
        className="min-w-full relative"
        style={{
          marginTop: block.style?.marginTop,
          marginBottom: block.style?.marginBottom,
        }}
      >
        <BlockRenderer block={block} isPreview />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/block relative min-w-full rounded-md transition-all',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        !isPreview && 'hover:ring-2 hover:ring-primary/50 cursor-pointer'
      )}
      onClick={onSelect}
    >
      {/* Toolbar do bloco */}
      {!isPreview && (
        <div 
          className={cn(
            'absolute -top-8 left-0 right-0 flex items-center justify-between opacity-0 group-hover/block:opacity-100 transition-opacity z-10',
            isSelected && 'opacity-100'
          )}
        >
          <div className="flex items-center gap-1 bg-background border rounded-md shadow-sm px-2 py-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {BLOCK_TYPE_LABELS[block.type]}
            </span>
          </div>
          
          <div className="flex items-center gap-1 bg-background border rounded-md shadow-sm">
            {onDuplicate && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo do bloco */}
      <div 
        className={cn(
          'min-w-full',
          !isPreview && 'p-2'
        )}
        style={{
          marginTop: block.style?.marginTop,
          marginBottom: block.style?.marginBottom,
        }}
      >
        <BlockRenderer block={block} isEditing={isSelected} />
      </div>
    </div>
  );
};
