import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, GripVertical, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useFunnel, useUpdateFunnel } from '@/hooks/useFunnels';
import { useFunnelStagesWithOptions, useCreateStage, useUpdateStage, useDeleteStage, useReorderStages, FunnelStage } from '@/hooks/useFunnelStages';
import { toast } from 'sonner';
import { FunnelSettingsPanel } from '@/components/funnel-editor/FunnelSettingsPanel';
import { StageCanvasEditor, BlocksSidebar, PropertiesColumn, TestModeOverlay } from '@/components/canvas-editor';
import { CanvasBlock, CanvasBlockType } from '@/types/canvasBlocks';
import { convertStageToBlocks, createEmptyBlock, blocksToStageConfig } from '@/utils/stageToBlocks';
import type { Database } from '@/integrations/supabase/types';
import { FunnelConfig } from '@/types/funnelConfig';
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

type StageType = Database['public']['Enums']['stage_type'];

const stageTypeLabels: Record<StageType, string> = {
  intro: 'Introdução',
  question: 'Questão',
  strategic: 'Estratégica',
  transition: 'Transição',
  result: 'Resultado',
};

interface SortableStageItemProps {
  stage: FunnelStage;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const SortableStageItem: React.FC<SortableStageItemProps> = ({ stage, isActive, onClick, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

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
        flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors group
        ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}
        ${isDragging ? 'shadow-lg' : ''}
      `}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{stage.title}</p>
        <p className="text-xs text-muted-foreground">{stageTypeLabels[stage.type]}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default function FunnelEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: funnel, isLoading: loadingFunnel } = useFunnel(id);
  const { data: stages, isLoading: loadingStages } = useFunnelStagesWithOptions(id);
  const updateFunnel = useUpdateFunnel();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  const reorderStages = useReorderStages();
  
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [localStages, setLocalStages] = useState<FunnelStage[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);
  
  // Canvas blocks state
  const [stageBlocks, setStageBlocks] = useState<Record<string, CanvasBlock[]>>({});
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

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
    if (stages) {
      setLocalStages(stages);
    }
  }, [stages]);

  useEffect(() => {
    if (localStages.length > 0 && !activeStageId) {
      setActiveStageId(localStages[0].id);
    }
  }, [localStages, activeStageId]);

  // Convert active stage to blocks when it changes
  useEffect(() => {
    if (activeStageId && localStages.length > 0) {
      const stageIndex = localStages.findIndex(s => s.id === activeStageId);
      const stage = localStages[stageIndex];
      
      if (stage && !stageBlocks[activeStageId]) {
        const blocks = convertStageToBlocks(stage, localStages.length, stageIndex);
        setStageBlocks(prev => ({
          ...prev,
          [activeStageId]: blocks,
        }));
      }
      
      // Reset selected block when changing stages
      setSelectedBlockId(null);
    }
  }, [activeStageId, localStages]);

  const activeStage = localStages.find(s => s.id === activeStageId);
  const activeStageIndex = localStages.findIndex(s => s.id === activeStageId);
  const currentBlocks = activeStageId ? stageBlocks[activeStageId] || [] : [];
  const selectedBlock = currentBlocks.find(b => b.id === selectedBlockId) || null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localStages.findIndex(s => s.id === active.id);
      const newIndex = localStages.findIndex(s => s.id === over.id);

      const newStages = arrayMove(localStages, oldIndex, newIndex);
      setLocalStages(newStages);

      const updates = newStages.map((stage, index) => ({
        id: stage.id,
        order_index: index,
      }));

      reorderStages.mutate({ funnelId: id!, stages: updates });
    }
  };

  const handleAddStage = async (type: StageType) => {
    if (!id) return;
    const nextOrder = localStages.length;
    await createStage.mutateAsync({
      funnel_id: id,
      type,
      title: `${stageTypeLabels[type]} ${nextOrder + 1}`,
      order_index: nextOrder,
      is_enabled: true,
      config: {},
    });
  };

  const handleBlocksChange = (newBlocks: CanvasBlock[]) => {
    if (!activeStageId) return;
    
    setStageBlocks(prev => ({
      ...prev,
      [activeStageId]: newBlocks,
    }));
  };

  const handleAddBlock = (type: CanvasBlockType) => {
    if (!activeStageId) return;
    
    const newBlock = createEmptyBlock(type);
    newBlock.order = currentBlocks.length;
    
    const newBlocks = [...currentBlocks, newBlock];
    handleBlocksChange(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (updatedBlock: CanvasBlock) => {
    if (!activeStageId) return;
    
    const newBlocks = currentBlocks.map(block =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    handleBlocksChange(newBlocks);
  };

  const handleSelectBlock = (blockId: string | null) => {
    setSelectedBlockId(blockId);
  };

  // Find header block for properties column
  const headerBlock = currentBlocks.find(b => b.type === 'header') || null;

  const handleSave = async () => {
    // Save all stages with their blocks converted back to config
    for (const [stageId, blocks] of Object.entries(stageBlocks)) {
      const config = blocksToStageConfig(blocks);
      await updateStage.mutateAsync({ id: stageId, config });
    }
    toast.success('Funil salvo com sucesso!');
  };

  if (loadingFunnel || loadingStages) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-14 border-b flex items-center px-4 gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 flex">
          <Skeleton className="w-64 h-full" />
          <Skeleton className="flex-1 h-full" />
          <Skeleton className="w-80 h-full" />
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Funil não encontrado</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/funnels">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold">{funnel.name}</h1>
            <span className="text-xs text-muted-foreground">/{funnel.slug}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              Desktop
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              Mobile
            </Button>
          </div>
          <FunnelSettingsPanel
            funnelId={funnel.id}
            funnelName={funnel.name}
            funnelSlug={funnel.slug}
            globalConfig={funnel.global_config as FunnelConfig | null}
            onSave={(updates) => updateFunnel.mutate({ id: funnel.id, ...updates })}
          />
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsTestMode(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quiz/${funnel.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Stages Sidebar */}
        <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
          <div className="h-full flex flex-col border-r">
            <div className="p-3 border-b flex items-center justify-between">
              <span className="font-medium text-sm">Etapas</span>
              <Select onValueChange={(type) => handleAddStage(type as StageType)}>
                <SelectTrigger className="w-auto h-8">
                  <Plus className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intro">Introdução</SelectItem>
                  <SelectItem value="question">Questão</SelectItem>
                  <SelectItem value="strategic">Estratégica</SelectItem>
                  <SelectItem value="transition">Transição</SelectItem>
                  <SelectItem value="result">Resultado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localStages.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {localStages.map((stage) => (
                      <SortableStageItem
                        key={stage.id}
                        stage={stage}
                        isActive={activeStageId === stage.id}
                        onClick={() => setActiveStageId(stage.id)}
                        onDelete={() => deleteStage.mutate({ id: stage.id, funnelId: id! })}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {localStages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Adicione uma etapa para começar
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Blocks Sidebar */}
        <ResizablePanel defaultSize={12} minSize={10} maxSize={18}>
          <BlocksSidebar onAddBlock={handleAddBlock} />
        </ResizablePanel>

        <ResizableHandle />

        {/* Canvas Editor Area */}
        <ResizablePanel defaultSize={51}>
          <div className="h-full flex flex-col">
            {activeStage ? (
              <StageCanvasEditor
                stage={activeStage}
                totalStages={localStages.length}
                currentIndex={activeStageIndex}
                previewMode={previewMode}
                isPreview={false}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onBlocksChange={handleBlocksChange}
                blocks={currentBlocks}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/30">
                Selecione uma etapa para editar
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Properties Column */}
        <ResizablePanel defaultSize={22} minSize={18} maxSize={30}>
          <div className="h-full border-l">
            <PropertiesColumn
              activeStage={activeStage || null}
              selectedBlock={selectedBlock}
              headerBlock={headerBlock}
              onUpdateStage={(updates) => {
                if (activeStage) {
                  updateStage.mutate({ id: activeStage.id, ...updates });
                }
              }}
              onUpdateBlock={handleUpdateBlock}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Test Mode Overlay */}
      {isTestMode && (
        <TestModeOverlay
          stages={localStages}
          stageBlocks={stageBlocks}
          globalConfig={funnel.global_config as FunnelConfig | null}
          onExit={() => setIsTestMode(false)}
        />
      )}
    </div>
  );
}
