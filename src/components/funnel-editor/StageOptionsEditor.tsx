import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStageOptions, useCreateOption, useUpdateOption, useDeleteOption, StageOption } from '@/hooks/useFunnelStages';
import { Skeleton } from '@/components/ui/skeleton';

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

export const StageOptionsEditor: React.FC<StageOptionsEditorProps> = ({ 
  stageId,
  styleCategories = defaultCategories,
}) => {
  const { data: options, isLoading } = useStageOptions(stageId);
  const createOption = useCreateOption();
  const updateOption = useUpdateOption();
  const deleteOption = useDeleteOption();
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const handleAddOption = async () => {
    const nextOrder = options?.length || 0;
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
        <p className="text-sm text-muted-foreground">Opções ({options?.length || 0})</p>
        <Button size="sm" variant="outline" onClick={handleAddOption} disabled={createOption.isPending}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {options?.map((option, index) => (
          <div
            key={option.id}
            className={`
              border rounded-lg transition-all
              ${expandedOption === option.id ? 'bg-muted/50' : 'hover:bg-muted/30'}
            `}
          >
            {/* Collapsed View */}
            <div
              className="flex items-center gap-2 p-2 cursor-pointer"
              onClick={() => setExpandedOption(expandedOption === option.id ? null : option.id)}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
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
                  handleDeleteOption(option.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>

            {/* Expanded View */}
            {expandedOption === option.id && (
              <div className="p-3 pt-0 space-y-3 border-t">
                <div className="space-y-2">
                  <Label htmlFor={`text-${option.id}`} className="text-xs">Texto da Opção</Label>
                  <Input
                    id={`text-${option.id}`}
                    value={option.text}
                    onChange={(e) => handleUpdateOption(option.id, { text: e.target.value })}
                    placeholder="Digite o texto..."
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`image-${option.id}`} className="text-xs">URL da Imagem</Label>
                  <Input
                    id={`image-${option.id}`}
                    value={option.image_url || ''}
                    onChange={(e) => handleUpdateOption(option.id, { image_url: e.target.value || null })}
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
                      onValueChange={(value) => handleUpdateOption(option.id, { 
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
                      onChange={(e) => handleUpdateOption(option.id, { points: parseInt(e.target.value) || 1 })}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {options?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma opção adicionada
          </p>
        )}
      </CardContent>
    </Card>
  );
};
