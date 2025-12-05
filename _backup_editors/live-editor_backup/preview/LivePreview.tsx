
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditorStage, EditorComponent } from '../LiveQuizEditor';
import { QuizIntroPreview } from './components/QuizIntroPreview';
import { QuestionPreview } from './components/QuestionPreview';
import { ResultPreview } from './components/ResultPreview';
import { OfferPreview } from './components/OfferPreview';

interface LivePreviewProps {
  stage?: EditorStage;
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string | null) => void;
  onUpdateComponent: (componentId: string, updates: Partial<EditorComponent>) => void;
  isPreviewMode: boolean;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  stage,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  isPreviewMode
}) => {
  if (!stage) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAF9F7]">
        <div className="text-center text-gray-500">
          <div className="text-lg font-semibold mb-2">Selecione uma etapa</div>
          <div className="text-sm">Escolha uma etapa na sidebar para começar a editar</div>
        </div>
      </div>
    );
  }

  const renderStagePreview = () => {
    switch (stage.type) {
      case 'intro':
        return (
          <QuizIntroPreview
            stage={stage}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            onUpdateComponent={onUpdateComponent}
            isPreviewMode={isPreviewMode}
          />
        );
      case 'question':
        return (
          <QuestionPreview
            stage={stage}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            onUpdateComponent={onUpdateComponent}
            isPreviewMode={isPreviewMode}
          />
        );
      case 'result':
        return (
          <ResultPreview
            stage={stage}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            onUpdateComponent={onUpdateComponent}
            isPreviewMode={isPreviewMode}
          />
        );
      case 'offer':
        return (
          <OfferPreview
            stage={stage}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            onUpdateComponent={onUpdateComponent}
            isPreviewMode={isPreviewMode}
          />
        );
      default:
        return <div className="p-8 text-center text-gray-500">Tipo de etapa não suportado</div>;
    }
  };

  return (
    <div className="h-full relative">
      {/* Header da Preview */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#432818]">{stage.name}</h2>
          <Badge variant="secondary" className="bg-[#B89B7A] text-white">
            {stage.type}
          </Badge>
          <Badge variant="outline" className="text-[#432818]">
            {stage.components.length} componentes
          </Badge>
        </div>
        
        {!isPreviewMode && (
          <div className="text-xs text-gray-500">
            Clique nos elementos para editar
          </div>
        )}
      </div>

      {/* Área de Preview */}
      <div className="h-[calc(100%-73px)] overflow-auto">
        {renderStagePreview()}
      </div>
    </div>
  );
};

export default LivePreview;
