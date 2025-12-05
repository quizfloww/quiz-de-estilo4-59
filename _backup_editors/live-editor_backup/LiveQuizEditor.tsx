
import React, { useState, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Settings, 
  ArrowLeft,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';
import StagesSidebar from './sidebar/StagesSidebar';
import ComponentsSidebar from './sidebar/ComponentsSidebar';
import LivePreview from './preview/LivePreview';
import PropertiesSidebar from './sidebar/PropertiesSidebar';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { useLiveEditor } from '@/hooks/useLiveEditor';
import { toast } from '@/components/ui/use-toast';

export interface EditorStage {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'result' | 'offer';
  order: number;
  components: EditorComponent[];
  settings: Record<string, any>;
}

export interface EditorComponent {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const LiveQuizEditor: React.FC = () => {
  const {
    stages,
    activeStageId,
    selectedComponentId,
    isPreviewMode,
    setActiveStage,
    setSelectedComponent,
    addStage,
    updateStage,
    deleteStage,
    addComponent,
    updateComponent,
    deleteComponent,
    togglePreview,
    saveEditor,
    loadEditor
  } = useLiveEditor();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveEditor();
      toast({
        title: "Editor salvo",
        description: "Todas as alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o editor.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStage = (type: EditorStage['type']) => {
    const newStage: EditorStage = {
      id: `stage-${Date.now()}`,
      name: `${type === 'intro' ? 'Introdução' : type === 'question' ? 'Questão' : type === 'result' ? 'Resultado' : 'Oferta'} ${stages.length + 1}`,
      type,
      order: stages.length,
      components: [],
      settings: {}
    };
    
    addStage(newStage);
    setActiveStage(newStage.id);
  };

  const activeStage = stages.find(s => s.id === activeStageId);
  const selectedComponent = activeStage?.components.find(c => c.id === selectedComponentId);

  return (
    <div className="h-screen flex flex-col bg-[#1A1F2C] text-white">
      {/* Toolbar Superior */}
      <div className="border-b border-gray-700 bg-[#252A3A] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Editor de Quiz ao Vivo</h1>
            <Badge variant="secondary" className="bg-[#B89B7A] text-white">
              {stages.length} Etapas
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewMode ? 'Editar' : 'Preview'}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#B89B7A] hover:bg-[#A1835D] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Área Principal do Editor */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar Esquerda - Etapas */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full bg-[#252A3A] border-r border-gray-700">
              <StagesSidebar
                stages={stages}
                activeStageId={activeStageId}
                onStageSelect={setActiveStage}
                onAddStage={handleAddStage}
                onUpdateStage={updateStage}
                onDeleteStage={deleteStage}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Sidebar Central - Componentes */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
            <div className="h-full bg-[#2A2F3E] border-r border-gray-700">
              <ComponentsSidebar
                onAddComponent={(type) => {
                  if (activeStageId) {
                    const newComponent: EditorComponent = {
                      id: `component-${Date.now()}`,
                      type,
                      content: {},
                      style: {},
                      position: { x: 50, y: 50 },
                      size: { width: 300, height: 100 }
                    };
                    addComponent(activeStageId, newComponent);
                    setSelectedComponent(newComponent.id);
                  }
                }}
                stageType={activeStage?.type}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Área Central - Preview/Edição */}
          <ResizablePanel defaultSize={45}>
            <div className="h-full bg-[#FAF9F7] overflow-auto">
              <LivePreview
                stage={activeStage}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponent}
                onUpdateComponent={(componentId, updates) => {
                  if (activeStageId) {
                    updateComponent(activeStageId, componentId, updates);
                  }
                }}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Sidebar Direita - Propriedades */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full bg-[#252A3A] border-l border-gray-700">
              <PropertiesSidebar
                selectedComponent={selectedComponent}
                stage={activeStage}
                onUpdateComponent={(updates) => {
                  if (activeStageId && selectedComponentId) {
                    updateComponent(activeStageId, selectedComponentId, updates);
                  }
                }}
                onUpdateStage={(updates) => {
                  if (activeStageId) {
                    updateStage(activeStageId, updates);
                  }
                }}
                onDeleteComponent={() => {
                  if (activeStageId && selectedComponentId) {
                    deleteComponent(activeStageId, selectedComponentId);
                    setSelectedComponent(null);
                  }
                }}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default LiveQuizEditor;
