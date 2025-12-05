
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Type, 
  Image, 
  MousePointer, 
  Layout, 
  List, 
  Star,
  User,
  Award,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  Gift,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { EditorStage } from '../LiveQuizEditor';

interface ComponentsSidebarProps {
  onAddComponent: (type: string) => void;
  stageType?: EditorStage['type'];
}

const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onAddComponent,
  stageType
}) => {
  const getComponentsForStage = (type?: EditorStage['type']) => {
    const baseComponents = [
      { type: 'heading', label: 'Título', icon: Type },
      { type: 'text', label: 'Texto', icon: Type },
      { type: 'image', label: 'Imagem', icon: Image },
      { type: 'button', label: 'Botão', icon: MousePointer },
      { type: 'divider', label: 'Divisor', icon: Layout },
    ];

    if (type === 'intro') {
      return [
        ...baseComponents,
        { type: 'quiz-intro', label: 'Intro Quiz', icon: Target },
        { type: 'name-input', label: 'Campo Nome', icon: User },
      ];
    }

    if (type === 'question') {
      return [
        ...baseComponents,
        { type: 'question', label: 'Questão', icon: Target },
        { type: 'options', label: 'Opções', icon: List },
        { type: 'progress', label: 'Progresso', icon: Zap },
      ];
    }

    if (type === 'result') {
      return [
        ...baseComponents,
        { type: 'style-result', label: 'Resultado', icon: Award },
        { type: 'secondary-styles', label: 'Estilos Sec.', icon: Star },
        { type: 'transformation', label: 'Transformação', icon: Zap },
        { type: 'testimonial', label: 'Depoimento', icon: MessageSquare },
      ];
    }

    if (type === 'offer') {
      return [
        ...baseComponents,
        { type: 'product', label: 'Produto', icon: ShoppingBag },
        { type: 'pricing', label: 'Preços', icon: CreditCard },
        { type: 'bonus', label: 'Bônus', icon: Gift },
        { type: 'guarantee', label: 'Garantia', icon: Shield },
        { type: 'testimonial', label: 'Depoimento', icon: MessageSquare },
        { type: 'cta', label: 'Call to Action', icon: Target },
      ];
    }

    return baseComponents;
  };

  const components = getComponentsForStage(stageType);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Componentes</h3>
        <p className="text-xs text-gray-400 mt-1">
          {stageType ? `Para ${stageType}` : 'Selecione uma etapa'}
        </p>
      </div>

      {/* Lista de Componentes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <Button
              key={component.type}
              variant="outline"
              className="w-full justify-start h-auto p-3 border-gray-600 text-gray-300 hover:text-white hover:border-[#B89B7A]"
              onClick={() => onAddComponent(component.type)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#B89B7A]/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#B89B7A]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{component.label}</div>
                  <div className="text-xs text-gray-500 capitalize">{component.type}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentsSidebar;
