import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Block } from '@/types/editor';
import { X, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeaderBlockEditor from './block-editors/HeaderBlockEditor';
import HeadlineBlockEditor from './block-editors/HeadlineBlockEditor';
import TextBlockEditor from './block-editors/TextBlockEditor';
import ImageBlockEditor from './block-editors/ImageBlockEditor';
import BenefitsBlockEditor from './block-editors/BenefitsBlockEditor';
import PricingBlockEditor from './block-editors/PricingBlockEditor';
import GuaranteeBlockEditor from './block-editors/GuaranteeBlockEditor';
import CTABlockEditor from './block-editors/CTABlockEditor';
import StyleResultBlockEditor from './block-editors/StyleResultBlockEditor';
import SecondaryStylesBlockEditor from './block-editors/SecondaryStylesBlockEditor';
import HeroSectionBlockEditor from './block-editors/HeroSectionBlockEditor';
import ProductsBlockEditor from './block-editors/ProductsBlockEditor';
import TestimonialsBlockEditor from './block-editors/TestimonialsBlockEditor';
import SpacerBlockEditor from './block-editors/SpacerBlockEditor';
import VideoBlockEditor from './block-editors/VideoBlockEditor';
import TwoColumnBlockEditor from './block-editors/TwoColumnBlockEditor';
import IconBlockEditor from './block-editors/IconBlockEditor';
import FAQBlockEditor from './block-editors/FAQBlockEditor';
import CarouselBlockEditor from './block-editors/CarouselBlockEditor';
import CustomCodeBlockEditor from './block-editors/CustomCodeBlockEditor';
import AnimationBlockEditor from './block-editors/AnimationBlockEditor';
import StyleEditor from './style-editors/StyleEditor';

interface PropertiesPanelProps {
  selectedBlockId: string | null;
  blocks: Block[];
  onClose: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete
}) => {
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);
  
  if (!selectedBlock) {
    return (
      <div className="h-full flex flex-col border-l">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Propriedades</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <p className="text-[#8F7A6A]">
            Selecione um bloco para editar suas propriedades
          </p>
        </div>
      </div>
    );
  }
  
  const getBlockTitle = () => {
    switch (selectedBlock.type) {
      case 'header':
        return 'Cabeçalho';
      case 'headline':
        return 'Título e Subtítulo';
      case 'text':
        return 'Texto';
      case 'image':
        return 'Imagem';
      case 'benefits':
        return 'Benefícios';
      case 'pricing':
        return 'Preço';
      case 'guarantee':
        return 'Garantia';
      case 'cta':
        return 'Botão de Ação';
      case 'style-result':
        return 'Estilo Principal';
      case 'secondary-styles':
        return 'Estilos Secundários';
      case 'hero-section':
        return 'Seção Hero';
      case 'products':
        return 'Produtos';
      case 'testimonials':
        return 'Depoimentos';
      case 'spacer':
        return 'Espaçamento';
      case 'video':
        return 'Vídeo';
      case 'two-column':
        return 'Duas Colunas';
      case 'icon':
        return 'Ícone Decorativo';
      case 'faq':
        return 'Perguntas Frequentes';
      case 'carousel':
        return 'Carrossel de Imagens';
      case 'custom-code':
        return 'Código Personalizado';
      case 'animation-block':
        return 'Bloco com Animação';
      default:
        return 'Componente';
    }
  };
  
  const renderContentEditor = () => {
    switch (selectedBlock.type) {
      case 'header':
        return <HeaderBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'headline':
        return <HeadlineBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'text':
        return <TextBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'image':
        return <ImageBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'benefits':
        return <BenefitsBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'pricing':
        return <PricingBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'guarantee':
        return <GuaranteeBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'cta':
        return <CTABlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'style-result':
        return <StyleResultBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'secondary-styles':
        return <SecondaryStylesBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'hero-section':
        return <HeroSectionBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'products':
        return <ProductsBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'testimonials':
        return <TestimonialsBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'spacer':
        return <SpacerBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'video':
        return <VideoBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'two-column':
        return <TwoColumnBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'icon':
        return <IconBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'faq':
        return <FAQBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'carousel':
        return <CarouselBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'custom-code':
        return <CustomCodeBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      case 'animation-block':
        return <AnimationBlockEditor block={selectedBlock} onUpdate={(content) => onUpdate(selectedBlock.id, content)} />;
      default:
        return <div>Editor não disponível para este tipo de bloco</div>;
    }
  };
  
  return (
    <div className="h-full flex flex-col border-l">
      <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 className="font-semibold">{getBlockTitle()}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(selectedBlock.id)}
            className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-4 sticky top-0 bg-white z-10">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="style">Estilo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="mt-0">
              {renderContentEditor()}
            </TabsContent>
            
            <TabsContent value="style" className="mt-0">
              <StyleEditor
                style={selectedBlock.content.style || {}}
                onUpdate={(style) => onUpdate(selectedBlock.id, { style })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};
