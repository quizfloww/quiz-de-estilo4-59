
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/types/editor';
import {
  Heading1,
  Type,
  Image,
  CreditCard,
  CheckCircle,
  MessageSquareQuote,
  Award,
  LayoutGrid,
  PanelTop,
  GripVertical,
  Video,
  Columns,
  BaggageClaim
} from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: BlockType) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  // Component category definitions
  const componentCategories = [
    {
      title: 'Estrutura',
      components: [
        { type: 'header', icon: <PanelTop size={16} />, label: 'Cabeçalho' },
        { type: 'two-column', icon: <Columns size={16} />, label: 'Duas Colunas' },
        { type: 'spacer', icon: <GripVertical size={16} />, label: 'Espaçador' },
      ]
    },
    {
      title: 'Conteúdo',
      components: [
        { type: 'headline', icon: <Heading1 size={16} />, label: 'Título' },
        { type: 'text', icon: <Type size={16} />, label: 'Texto' },
        { type: 'image', icon: <Image size={16} />, label: 'Imagem' },
        { type: 'video', icon: <Video size={16} />, label: 'Vídeo' },
      ]
    },
    {
      title: 'Resultado',
      components: [
        { type: 'style-result', icon: <BaggageClaim size={16} />, label: 'Estilo Principal' },
        { type: 'secondary-styles', icon: <LayoutGrid size={16} />, label: 'Estilos Secundários' },
      ]
    },
    {
      title: 'Vendas',
      components: [
        { type: 'pricing', icon: <CreditCard size={16} />, label: 'Preço' },
        { type: 'benefits', icon: <CheckCircle size={16} />, label: 'Benefícios' },
        { type: 'testimonials', icon: <MessageSquareQuote size={16} />, label: 'Depoimentos' },
        { type: 'guarantee', icon: <Award size={16} />, label: 'Garantia' },
        { type: 'cta', icon: <Award size={16} />, label: 'Chamada para Ação' },
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-medium text-[#432818]">Componentes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Arraste ou clique nos componentes para adicionar à sua página
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-6">
          {componentCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xs text-[#8F7A6A] uppercase font-medium tracking-wide">
                {category.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.components.map((component, compIndex) => (
                  <Button
                    key={compIndex}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 px-3 justify-start gap-2 hover:bg-[#FAF9F7]"
                    onClick={() => onComponentSelect(component.type as BlockType)}
                  >
                    <span className="text-[#B89B7A]">{component.icon}</span>
                    <span className="text-xs">{component.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
