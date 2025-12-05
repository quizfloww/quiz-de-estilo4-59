import React from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Monitor, Smartphone } from 'lucide-react';
import { useQuizFlowEditor } from '@/hooks/useQuizFlowEditor';
import { FlowStagesSidebar } from './FlowStagesSidebar';
import { FlowCanvasPreview } from './FlowCanvasPreview';
import { FlowPropertiesPanel } from './FlowPropertiesPanel';
import { Skeleton } from '@/components/ui/skeleton';

export const QuizFlowEditor: React.FC = () => {
  const {
    config,
    activeStageId,
    isDirty,
    previewMode,
    loading,
    getActiveStage,
    setActiveStageId,
    setPreviewMode,
    addStage,
    updateStage,
    updateStageConfig,
    deleteStage,
    duplicateStage,
    moveStage,
    addOption,
    updateOption,
    deleteOption,
    moveOption,
    saveConfig,
    resetConfig
  } = useQuizFlowEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveStage(String(active.id), String(over.id));
    }
  };

  const activeStage = getActiveStage();

  if (loading) {
    return (
      <div className="flex flex-col h-full gap-4 p-4">
        <Skeleton className="h-12 w-full" />
        <div className="flex-1 flex gap-4">
          <Skeleton className="h-full w-64" />
          <Skeleton className="h-full flex-1" />
          <Skeleton className="h-full w-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{config.name}</h2>
          {isDirty && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Não salvo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="rounded-r-none"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="rounded-l-none"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={resetConfig}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Resetar
          </Button>
          <Button size="sm" onClick={saveConfig}>
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Stages Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={config.stages.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <FlowStagesSidebar
                  stages={config.stages}
                  activeStageId={activeStageId}
                  onStageSelect={setActiveStageId}
                  onAddStage={addStage}
                  onDeleteStage={deleteStage}
                  onDuplicateStage={duplicateStage}
                  onToggleStage={(id) => {
                    const stage = config.stages.find(s => s.id === id);
                    if (stage) {
                      updateStage(id, { isEnabled: !stage.isEnabled });
                    }
                  }}
                />
              </SortableContext>
            </DndContext>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas Preview */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <FlowCanvasPreview
              stage={activeStage}
              previewMode={previewMode}
              globalConfig={config.globalConfig}
              totalStages={config.stages.filter(s => s.isEnabled).length}
              currentStageIndex={activeStage ? config.stages.filter(s => s.isEnabled).findIndex(s => s.id === activeStage.id) + 1 : 0}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <FlowPropertiesPanel
              stage={activeStage}
              styleCategories={config.styleCategories}
              onUpdateStage={(updates) => activeStageId && updateStage(activeStageId, updates)}
              onUpdateConfig={(updates) => activeStageId && updateStageConfig(activeStageId, updates)}
              onAddOption={() => activeStageId && addOption(activeStageId)}
              onUpdateOption={(optionId, updates) => activeStageId && updateOption(activeStageId, optionId, updates)}
              onDeleteOption={(optionId) => activeStageId && deleteOption(activeStageId, optionId)}
              onMoveOption={(draggedId, targetId) => activeStageId && moveOption(activeStageId, draggedId, targetId)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
