import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CanvasBlock } from "@/types/canvasBlocks";
import { SortableCanvasBlock } from "./SortableCanvasBlock";
import { FunnelStage } from "@/hooks/useFunnelStages";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StageCanvasEditorProps {
  stage: FunnelStage;
  totalStages: number;
  currentIndex: number;
  previewMode: "desktop" | "mobile";
  isPreview?: boolean;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onBlocksChange: (blocks: CanvasBlock[]) => void;
  blocks: CanvasBlock[];
}

export const StageCanvasEditor: React.FC<StageCanvasEditorProps> = ({
  stage,
  totalStages,
  currentIndex,
  previewMode,
  isPreview = false,
  selectedBlockId,
  onSelectBlock,
  onBlocksChange,
  blocks,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex).map(
          (block, index) => ({
            ...block,
            order: index,
          })
        );
        onBlocksChange(newBlocks);
      }
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }));
    onBlocksChange(newBlocks);
    if (selectedBlockId === blockId) {
      onSelectBlock(null);
    }
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === blockId);
    if (!blockToDuplicate) return;

    const blockIndex = blocks.findIndex((block) => block.id === blockId);
    const newBlock: CanvasBlock = {
      ...blockToDuplicate,
      id: `${blockToDuplicate.id}-copy-${Date.now()}`,
      order: blockIndex + 1,
    };

    const newBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1),
    ].map((block, index) => ({ ...block, order: index }));

    onBlocksChange(newBlocks);
    onSelectBlock(newBlock.id);
  };

  const optionBlock = blocks.find((block) => block.type === "options");
  const optionItems = optionBlock?.content?.options || [];
  const optionWarnings = optionItems.some(
    (option: any) => !option.text && !option.imageUrl
  );

  return (
    <div
      className={cn(
        "flex-1 overflow-hidden bg-muted/30",
        previewMode === "mobile" && "flex justify-center"
      )}
    >
      <ScrollArea className="h-full">
        <div
          className={cn(
            "min-h-full bg-background mx-auto p-4",
            previewMode === "mobile" ? "max-w-[390px]" : "max-w-2xl"
          )}
        >
          <div className="flex flex-col gap-4">
            {isPreview ? (
              // Modo preview - sem drag and drop
              blocks.map((block) => (
                <SortableCanvasBlock
                  key={block.id}
                  block={block}
                  isSelected={false}
                  isPreview={true}
                  onSelect={() => {}}
                />
              ))
            ) : (
              // Modo edição - com drag and drop
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={blocks.map((block) => block.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-6 pb-20">
                    {blocks.map((block) => (
                      <SortableCanvasBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        isPreview={false}
                        onSelect={() => onSelectBlock(block.id)}
                        onDelete={() => handleDeleteBlock(block.id)}
                        onDuplicate={() => handleDuplicateBlock(block.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
