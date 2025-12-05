
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  GripVertical, 
  Eye, 
  Settings, 
  Trash2,
  FileText,
  HelpCircle,
  Target,
  ShoppingCart
} from 'lucide-react';
import { EditorStage } from '../LiveQuizEditor';

interface StagesSidebarProps {
  stages: EditorStage[];
  activeStageId: string | null;
  onStageSelect: (stageId: string) => void;
  onAddStage: (type: EditorStage['type']) => void;
  onUpdateStage: (stageId: string, updates: Partial<EditorStage>) => void;
  onDeleteStage: (stageId: string) => void;
}

const StagesSidebar: React.FC<StagesSidebarProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onAddStage,
  onUpdateStage,
  onDeleteStage
}) => {
  const getStageIcon = (type: EditorStage['type']) => {
    switch (type) {
      case 'intro': return <FileText className="w-4 h-4" />;
      case 'question': return <HelpCircle className="w-4 h-4" />;
      case 'result': return <Target className="w-4 h-4" />;
      case 'offer': return <ShoppingCart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStageColor = (type: EditorStage['type']) => {
    switch (type) {
      case 'intro': return 'bg-blue-500';
      case 'question': return 'bg-purple-500';
      case 'result': return 'bg-green-500';
      case 'offer': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-3">Etapas do Funil</h3>
        
        {/* Botões de Adicionar */}
        <div className="space-y-2">
          <Button
            onClick={() => onAddStage('intro')}
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-gray-600 text-gray-300 hover:text-white"
          >
            <Plus className="w-3 h-3 mr-2" />
            Introdução
          </Button>
          
          <Button
            onClick={() => onAddStage('question')}
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-gray-600 text-gray-300 hover:text-white"
          >
            <Plus className="w-3 h-3 mr-2" />
            Questão
          </Button>
          
          <Button
            onClick={() => onAddStage('result')}
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-gray-600 text-gray-300 hover:text-white"
          >
            <Plus className="w-3 h-3 mr-2" />
            Resultado
          </Button>
          
          <Button
            onClick={() => onAddStage('offer')}
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs border-gray-600 text-gray-300 hover:text-white"
          >
            <Plus className="w-3 h-3 mr-2" />
            Oferta
          </Button>
        </div>
      </div>

      {/* Lista de Etapas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {stages.map((stage, index) => (
          <Card
            key={stage.id}
            className={`p-3 cursor-pointer transition-all border ${
              activeStageId === stage.id
                ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                : 'border-gray-600 bg-[#1A1F2C] hover:border-gray-500'
            }`}
            onClick={() => onStageSelect(stage.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <GripVertical className="w-3 h-3 text-gray-500" />
                <div className={`w-2 h-2 rounded-full ${getStageColor(stage.type)}`} />
                <span className="text-xs font-medium text-white">
                  Etapa {index + 1}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                >
                  <Settings className="w-3 h-3" />
                </Button>
                
                {stages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-gray-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStage(stage.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStageIcon(stage.type)}
                <span className="text-xs text-gray-300 truncate max-w-20">
                  {stage.name}
                </span>
              </div>
              
              <Badge 
                variant="secondary" 
                className="text-xs bg-gray-700 text-gray-300"
              >
                {stage.components.length}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StagesSidebar;
