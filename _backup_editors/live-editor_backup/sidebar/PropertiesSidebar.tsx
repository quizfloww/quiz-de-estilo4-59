
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Settings } from 'lucide-react';
import { EditorStage, EditorComponent } from '../LiveQuizEditor';

interface PropertiesSidebarProps {
  selectedComponent?: EditorComponent;
  stage?: EditorStage;
  onUpdateComponent: (updates: Partial<EditorComponent>) => void;
  onUpdateStage: (updates: Partial<EditorStage>) => void;
  onDeleteComponent: () => void;
}

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  selectedComponent,
  stage,
  onUpdateComponent,
  onUpdateStage,
  onDeleteComponent
}) => {
  if (!selectedComponent && !stage) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <div className="text-sm">Selecione um componente ou etapa para editar</div>
        </div>
      </div>
    );
  }

  if (selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Propriedades</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteComponent}
              className="w-8 h-8 p-0 text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 capitalize">{selectedComponent.type}</p>
        </div>

        {/* Propriedades */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Posição */}
          <Card className="p-3 bg-[#1A1F2C] border-gray-600">
            <Label className="text-xs font-medium text-gray-300 mb-2 block">Posição</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-400">X</Label>
                <Input
                  type="number"
                  value={selectedComponent.position.x}
                  onChange={(e) => onUpdateComponent({
                    position: { ...selectedComponent.position, x: Number(e.target.value) }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Y</Label>
                <Input
                  type="number"
                  value={selectedComponent.position.y}
                  onChange={(e) => onUpdateComponent({
                    position: { ...selectedComponent.position, y: Number(e.target.value) }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
              </div>
            </div>
          </Card>

          {/* Tamanho */}
          <Card className="p-3 bg-[#1A1F2C] border-gray-600">
            <Label className="text-xs font-medium text-gray-300 mb-2 block">Tamanho</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-400">Largura</Label>
                <Input
                  type="number"
                  value={selectedComponent.size.width}
                  onChange={(e) => onUpdateComponent({
                    size: { ...selectedComponent.size, width: Number(e.target.value) }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Altura</Label>
                <Input
                  type="number"
                  value={selectedComponent.size.height}
                  onChange={(e) => onUpdateComponent({
                    size: { ...selectedComponent.size, height: Number(e.target.value) }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
              </div>
            </div>
          </Card>

          {/* Conteúdo */}
          <Card className="p-3 bg-[#1A1F2C] border-gray-600">
            <Label className="text-xs font-medium text-gray-300 mb-2 block">Conteúdo</Label>
            
            {selectedComponent.type === 'heading' && (
              <div className="space-y-2">
                <Input
                  placeholder="Título"
                  value={selectedComponent.content.title || ''}
                  onChange={(e) => onUpdateComponent({
                    content: { ...selectedComponent.content, title: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
                <Select
                  value={selectedComponent.content.level || 'h2'}
                  onValueChange={(value) => onUpdateComponent({
                    content: { ...selectedComponent.content, level: value }
                  })}
                >
                  <SelectTrigger className="h-8 bg-[#252A3A] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedComponent.type === 'text' && (
              <Textarea
                placeholder="Texto"
                value={selectedComponent.content.text || ''}
                onChange={(e) => onUpdateComponent({
                  content: { ...selectedComponent.content, text: e.target.value }
                })}
                className="bg-[#252A3A] border-gray-600 text-white resize-none"
                rows={4}
              />
            )}

            {selectedComponent.type === 'image' && (
              <div className="space-y-2">
                <Input
                  placeholder="URL da imagem"
                  value={selectedComponent.content.src || ''}
                  onChange={(e) => onUpdateComponent({
                    content: { ...selectedComponent.content, src: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
                <Input
                  placeholder="Texto alternativo"
                  value={selectedComponent.content.alt || ''}
                  onChange={(e) => onUpdateComponent({
                    content: { ...selectedComponent.content, alt: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
              </div>
            )}

            {selectedComponent.type === 'button' && (
              <div className="space-y-2">
                <Input
                  placeholder="Texto do botão"
                  value={selectedComponent.content.text || ''}
                  onChange={(e) => onUpdateComponent({
                    content: { ...selectedComponent.content, text: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
                <Input
                  placeholder="URL de destino"
                  value={selectedComponent.content.href || ''}
                  onChange={(e) => onUpdateComponent({
                    content: { ...selectedComponent.content, href: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600 text-white"
                />
              </div>
            )}
          </Card>

          {/* Estilo */}
          <Card className="p-3 bg-[#1A1F2C] border-gray-600">
            <Label className="text-xs font-medium text-gray-300 mb-2 block">Estilo</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-400">Cor de fundo</Label>
                <Input
                  type="color"
                  value={selectedComponent.style.backgroundColor || '#ffffff'}
                  onChange={(e) => onUpdateComponent({
                    style: { ...selectedComponent.style, backgroundColor: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Cor do texto</Label>
                <Input
                  type="color"
                  value={selectedComponent.style.color || '#000000'}
                  onChange={(e) => onUpdateComponent({
                    style: { ...selectedComponent.style, color: e.target.value }
                  })}
                  className="h-8 bg-[#252A3A] border-gray-600"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Propriedades da etapa
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Configurações da Etapa</h3>
        <p className="text-xs text-gray-400">{stage?.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="p-3 bg-[#1A1F2C] border-gray-600">
          <Label className="text-xs font-medium text-gray-300 mb-2 block">Nome da Etapa</Label>
          <Input
            value={stage?.name || ''}
            onChange={(e) => onUpdateStage({ name: e.target.value })}
            className="h-8 bg-[#252A3A] border-gray-600 text-white"
          />
        </Card>

        <Card className="p-3 bg-[#1A1F2C] border-gray-600">
          <Label className="text-xs font-medium text-gray-300 mb-2 block">Tipo</Label>
          <Select
            value={stage?.type}
            onValueChange={(value) => onUpdateStage({ type: value as EditorStage['type'] })}
          >
            <SelectTrigger className="h-8 bg-[#252A3A] border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intro">Introdução</SelectItem>
              <SelectItem value="question">Questão</SelectItem>
              <SelectItem value="result">Resultado</SelectItem>
              <SelectItem value="offer">Oferta</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>
    </div>
  );
};

export default PropertiesSidebar;
