import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStageOptions, useCreateOption, useUpdateOption, useDeleteOption, useReorderOptions, StageOption } from '@/hooks/useFunnelStages';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StageOptionsEditorProps {
  stageId: string;
  styleCategories?: Array<{ id: string; name: string }>;
}

const defaultCategories = [
  { id: 'natural', name: 'Natural' },
  { id: 'classico', name: 'Clássico' },
  { id: 'contemporaneo', name: 'Contemporâneo' },
  { id: 'elegante', name: 'Elegante' },
  { id: 'romantico', name: 'Romântico' },
  { id: 'sexy', name: 'Sexy' },
  { id: 'dramatico', name: 'Dramático' },
  { id: 'criativo', name: 'Criativo' },
];

interface SortableOptionItemProps {
  option: StageOption;
  index: number;
  isExpanded: boolean;
  styleCategories: Array<{ id: string; name: string }>;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<StageOption>) => void;
  onDelete: () => void;
}

const SortableOptionItem: React.FC<SortableOptionItemProps> = ({
  option,
  index,
  isExpanded,
  styleCategories,
  onToggleExpand,
  onUpdate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        border rounded-lg transition-all
        ${isExpanded ? 'bg-muted/50' : 'hover:bg-muted/30'}
        ${isDragging ? 'shadow-lg z-10' : ''}
      `}
    >
      {/* Collapsed View */}
      <div
        className="flex items-center gap-2 p-2 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing" onClick={(e) => e.stopPropagation()}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground w-6">{index + 1}.</span>
        <span className="flex-1 text-sm truncate">{option.text}</span>
        {option.image_url && (
          <Image className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        {option.style_category && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
            {styleCategories.find(c => c.id === option.style_category)?.name || option.style_category}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 border-t">
          <div className="space-y-2">
            <Label htmlFor={`text-${option.id}`} className="text-xs">Texto da Opção</Label>
            <Input
              id={`text-${option.id}`}
              value={option.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Digite o texto..."
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`image-${option.id}`} className="text-xs">URL da Imagem</Label>
            <Input
              id={`image-${option.id}`}
              value={option.image_url || ''}
              onChange={(e) => onUpdate({ image_url: e.target.value || null })}
              placeholder="https://..."
              className="h-9"
            />
            {option.image_url && (
              <img 
                src={option.image_url} 
                alt="Preview" 
                className="h-16 w-auto rounded border object-cover"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor={`category-${option.id}`} className="text-xs">Categoria</Label>
              <Select
                value={option.style_category || 'none'}
                onValueChange={(value) => onUpdate({ 
                  style_category: value === 'none' ? null : value 
                })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {styleCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`points-${option.id}`} className="text-xs">Pontos</Label>
              <Input
                id={`points-${option.id}`}
                type="number"
                min={0}
                value={option.points || 1}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
                className="h-9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const StageOptionsEditor: React.FC<StageOptionsEditorProps> = ({ 
  stageId,
  styleCategories = defaultCategories,
}) => {
  const { data: options, isLoading } = useStageOptions(stageId);
  const createOption = useCreateOption();
  const updateOption = useUpdateOption();
  const deleteOption = useDeleteOption();
  const reorderOptions = useReorderOptions();
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [localOptions, setLocalOptions] = useState<StageOption[]>([]);

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

  useEffect(() => {
    if (options) {
      setLocalOptions(options);
    }
  }, [options]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localOptions.findIndex(o => o.id === active.id);
      const newIndex = localOptions.findIndex(o => o.id === over.id);

      const newOptions = arrayMove(localOptions, oldIndex, newIndex);
      setLocalOptions(newOptions);

      // Update order_index in database
      const updates = newOptions.map((option, index) => ({
        id: option.id,
        order_index: index,
      }));

      reorderOptions.mutate({ stageId, options: updates });
    }
  };

  const handleAddOption = async () => {
    const nextOrder = localOptions.length;
    await createOption.mutateAsync({
      stage_id: stageId,
      text: `Opção ${nextOrder + 1}`,
      order_index: nextOrder,
      points: 1,
      style_category: null,
      image_url: null,
    });
  };

  const handleUpdateOption = (optionId: string, updates: Partial<StageOption>) => {
    updateOption.mutate({ id: optionId, ...updates });
  };

  const handleDeleteOption = (optionId: string) => {
    deleteOption.mutate({ id: optionId, stageId });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="py-4">
          <p className="text-sm text-muted-foreground">Opções</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-4 flex flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">Opções ({localOptions.length})</p>
        <Button size="sm" variant="outline" onClick={handleAddOption} disabled={createOption.isPending}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localOptions.map(o => o.id)}
            strategy={verticalListSortingStrategy}
          >
            {localOptions.map((option, index) => (
              <SortableOptionItem
                key={option.id}
                option={option}
                index={index}
                isExpanded={expandedOption === option.id}
                styleCategories={styleCategories}
                onToggleExpand={() => setExpandedOption(expandedOption === option.id ? null : option.id)}
                onUpdate={(updates) => handleUpdateOption(option.id, updates)}
                onDelete={() => handleDeleteOption(option.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {localOptions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma opção adicionada
          </p>
        )}
      </CardContent>
    </Card>
  );
};
