import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Settings, Plus, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFunnel, useUpdateFunnel } from '@/hooks/useFunnels';
import { useFunnelStages, useCreateStage, useUpdateStage, useDeleteStage } from '@/hooks/useFunnelStages';
import { toast } from 'sonner';
import { FunnelStagePreview } from '@/components/funnel-editor/FunnelStagePreview';
import { StagePropertiesPanel } from '@/components/funnel-editor/StagePropertiesPanel';
import type { Database } from '@/integrations/supabase/types';

type StageType = Database['public']['Enums']['stage_type'];

const stageTypeLabels: Record<StageType, string> = {
  intro: 'Introdução',
  question: 'Questão',
  strategic: 'Estratégica',
  transition: 'Transição',
  result: 'Resultado',
};

export default function FunnelEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: funnel, isLoading: loadingFunnel } = useFunnel(id);
  const { data: stages, isLoading: loadingStages } = useFunnelStages(id);
  const updateFunnel = useUpdateFunnel();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (stages && stages.length > 0 && !activeStageId) {
      setActiveStageId(stages[0].id);
    }
  }, [stages, activeStageId]);

  const activeStage = stages?.find(s => s.id === activeStageId);

  const handleAddStage = async (type: StageType) => {
    if (!id) return;
    const nextOrder = (stages?.length || 0);
    await createStage.mutateAsync({
      funnel_id: id,
      type,
      title: `${stageTypeLabels[type]} ${nextOrder + 1}`,
      order_index: nextOrder,
      is_enabled: true,
      config: {},
    });
  };

  const handleSave = async () => {
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
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
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
                {stages?.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`
                      flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                      ${activeStageId === stage.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}
                    `}
                    onClick={() => setActiveStageId(stage.id)}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
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
                        deleteStage.mutate({ id: stage.id, funnelId: id! });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {stages?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Adicione uma etapa para começar
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Preview Area */}
        <ResizablePanel defaultSize={50}>
          <div className="h-full flex items-center justify-center bg-muted/30 p-4">
            <div className={`
              bg-background rounded-lg shadow-lg overflow-hidden transition-all
              ${previewMode === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full max-w-3xl h-full'}
            `}>
              {activeStage ? (
                <FunnelStagePreview stage={activeStage} funnel={funnel} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Selecione uma etapa para visualizar
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Properties Panel */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="h-full border-l">
            {activeStage ? (
              <StagePropertiesPanel 
                stage={activeStage} 
                onUpdate={(updates) => updateStage.mutate({ id: activeStage.id, ...updates })}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Selecione uma etapa para editar
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
