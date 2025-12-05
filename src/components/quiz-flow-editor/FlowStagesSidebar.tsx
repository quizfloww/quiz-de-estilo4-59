import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuizFlowStage } from '@/types/quizFlow';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  GripVertical,
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Home,
  HelpCircle,
  ArrowRightLeft,
  Trophy,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowStagesSidebarProps {
  stages: QuizFlowStage[];
  activeStageId: string | null;
  onStageSelect: (id: string) => void;
  onAddStage: (type: QuizFlowStage['type']) => void;
  onDeleteStage: (id: string) => void;
  onDuplicateStage: (id: string) => void;
  onToggleStage: (id: string) => void;
}

const StageIcon: React.FC<{ type: QuizFlowStage['type'] }> = ({ type }) => {
  const icons = {
    intro: Home,
    question: HelpCircle,
    transition: ArrowRightLeft,
    strategic: Sparkles,
    result: Trophy
  };
  const Icon = icons[type];
  return <Icon className="h-4 w-4" />;
};

const SortableStageItem: React.FC<{
  stage: QuizFlowStage;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggle: () => void;
}> = ({ stage, isActive, onClick, onDelete, onDuplicate, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors group',
        isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted',
        isDragging && 'opacity-50',
        !stage.isEnabled && 'opacity-50'
      )}
      onClick={onClick}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-muted p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className={cn(
        'flex items-center justify-center w-6 h-6 rounded',
        stage.type === 'intro' && 'bg-blue-500/10 text-blue-500',
        stage.type === 'question' && 'bg-green-500/10 text-green-500',
        stage.type === 'strategic' && 'bg-purple-500/10 text-purple-500',
        stage.type === 'transition' && 'bg-orange-500/10 text-orange-500',
        stage.type === 'result' && 'bg-yellow-500/10 text-yellow-500'
      )}>
        <StageIcon type={stage.type} />
      </div>

      <span className="flex-1 text-sm truncate">{stage.title}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {stage.isEnabled ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Desativar
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Ativar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const FlowStagesSidebar: React.FC<FlowStagesSidebarProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onAddStage,
  onDeleteStage,
  onDuplicateStage,
  onToggleStage
}) => {
  return (
    <div className="flex flex-col h-full border-r bg-card">
      <div className="p-3 border-b">
        <h3 className="font-medium text-sm">Etapas do Quiz</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {stages.length} etapas • {stages.filter(s => s.isEnabled).length} ativas
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {stages.map((stage) => (
            <SortableStageItem
              key={stage.id}
              stage={stage}
              isActive={stage.id === activeStageId}
              onClick={() => onStageSelect(stage.id)}
              onDelete={() => onDeleteStage(stage.id)}
              onDuplicate={() => onDuplicateStage(stage.id)}
              onToggle={() => onToggleStage(stage.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Etapa
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem onClick={() => onAddStage('intro')}>
              <Home className="h-4 w-4 mr-2 text-blue-500" />
              Introdução
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddStage('question')}>
              <HelpCircle className="h-4 w-4 mr-2 text-green-500" />
              Questão
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddStage('strategic')}>
              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
              Questão Estratégica
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddStage('transition')}>
              <ArrowRightLeft className="h-4 w-4 mr-2 text-orange-500" />
              Transição
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddStage('result')}>
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              Resultado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
