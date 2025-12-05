import React from 'react';
import { CanvasBlock, BLOCK_TYPE_LABELS } from '@/types/canvasBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlockPropertiesPanelProps {
  block: CanvasBlock | null;
  onUpdateBlock: (block: CanvasBlock) => void;
  compact?: boolean;
}

export const BlockPropertiesPanel: React.FC<BlockPropertiesPanelProps> = ({
  block,
  onUpdateBlock,
  compact = false,
}) => {
  if (!block) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  const updateContent = (key: string, value: any) => {
    onUpdateBlock({
      ...block,
      content: {
        ...block.content,
        [key]: value,
      },
    });
  };

  const renderHeaderProperties = () => (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="showLogo">Mostrar Logo</Label>
        <Switch
          id="showLogo"
          checked={block.content.showLogo}
          onCheckedChange={(checked) => updateContent('showLogo', checked)}
        />
      </div>
      {block.content.showLogo && (
        <div className="space-y-2">
          <Label htmlFor="logoUrl">URL do Logo</Label>
          <Input
            id="logoUrl"
            value={block.content.logoUrl || ''}
            onChange={(e) => updateContent('logoUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Label htmlFor="showProgress">Mostrar Progresso</Label>
        <Switch
          id="showProgress"
          checked={block.content.showProgress}
          onCheckedChange={(checked) => updateContent('showProgress', checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showBackButton">Botão Voltar</Label>
        <Switch
          id="showBackButton"
          checked={block.content.showBackButton}
          onCheckedChange={(checked) => updateContent('showBackButton', checked)}
        />
      </div>
    </>
  );

  const renderHeadingProperties = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={block.content.text || ''}
          onChange={(e) => updateContent('text', e.target.value)}
          placeholder="Digite o título..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Select
          value={block.content.fontSize || '2xl'}
          onValueChange={(value) => updateContent('fontSize', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="base">Normal</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
            <SelectItem value="xl">Extra Grande</SelectItem>
            <SelectItem value="2xl">2x Grande</SelectItem>
            <SelectItem value="3xl">3x Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="textAlign">Alinhamento</Label>
        <Select
          value={block.content.textAlign || 'center'}
          onValueChange={(value) => updateContent('textAlign', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderTextProperties = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={block.content.text || ''}
          onChange={(e) => updateContent('text', e.target.value)}
          placeholder="Digite o texto..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Select
          value={block.content.fontSize || 'base'}
          onValueChange={(value) => updateContent('fontSize', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="base">Normal</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="textAlign">Alinhamento</Label>
        <Select
          value={block.content.textAlign || 'center'}
          onValueChange={(value) => updateContent('textAlign', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderImageProperties = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={block.content.imageUrl || ''}
          onChange={(e) => updateContent('imageUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageAlt">Texto Alternativo</Label>
        <Input
          id="imageAlt"
          value={block.content.imageAlt || ''}
          onChange={(e) => updateContent('imageAlt', e.target.value)}
          placeholder="Descrição da imagem"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxWidth">Largura Máxima</Label>
        <Input
          id="maxWidth"
          value={block.content.maxWidth || '384px'}
          onChange={(e) => updateContent('maxWidth', e.target.value)}
          placeholder="384px"
        />
      </div>
    </>
  );

  const renderInputProperties = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="label">Rótulo</Label>
        <Input
          id="label"
          value={block.content.label || ''}
          onChange={(e) => updateContent('label', e.target.value)}
          placeholder="Nome do campo"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={block.content.placeholder || ''}
          onChange={(e) => updateContent('placeholder', e.target.value)}
          placeholder="Digite aqui..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inputType">Tipo</Label>
        <Select
          value={block.content.inputType || 'text'}
          onValueChange={(value) => updateContent('inputType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texto</SelectItem>
            <SelectItem value="email">E-mail</SelectItem>
            <SelectItem value="tel">Telefone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="required">Obrigatório</Label>
        <Switch
          id="required"
          checked={block.content.required}
          onCheckedChange={(checked) => updateContent('required', checked)}
        />
      </div>
    </>
  );

  const renderOptionsProperties = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="displayType">Tipo de Exibição</Label>
        <Select
          value={block.content.displayType || 'text'}
          onValueChange={(value) => updateContent('displayType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Apenas Texto</SelectItem>
            <SelectItem value="image">Apenas Imagem</SelectItem>
            <SelectItem value="both">Imagem + Texto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="columns">Colunas</Label>
        <Select
          value={String(block.content.columns || 1)}
          onValueChange={(value) => updateContent('columns', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Coluna</SelectItem>
            <SelectItem value="2">2 Colunas</SelectItem>
            <SelectItem value="3">3 Colunas</SelectItem>
            <SelectItem value="4">4 Colunas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="multiSelect">Seleção Múltipla</Label>
        <Select
          value={String(block.content.multiSelect || 1)}
          onValueChange={(value) => updateContent('multiSelect', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 opção</SelectItem>
            <SelectItem value="2">2 opções</SelectItem>
            <SelectItem value="3">3 opções</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="autoAdvance">Avançar Automaticamente</Label>
        <Switch
          id="autoAdvance"
          checked={block.content.autoAdvance}
          onCheckedChange={(checked) => updateContent('autoAdvance', checked)}
        />
      </div>
      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          {block.content.options?.length || 0} opções configuradas
        </p>
      </div>
    </>
  );

  const renderButtonProperties = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={block.content.buttonText || ''}
          onChange={(e) => updateContent('buttonText', e.target.value)}
          placeholder="Continuar"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonVariant">Estilo</Label>
        <Select
          value={block.content.buttonVariant || 'primary'}
          onValueChange={(value) => updateContent('buttonVariant', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primário</SelectItem>
            <SelectItem value="secondary">Secundário</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="fullWidth">Largura Total</Label>
        <Switch
          id="fullWidth"
          checked={block.content.fullWidth}
          onCheckedChange={(checked) => updateContent('fullWidth', checked)}
        />
      </div>
    </>
  );

  const renderSpacerProperties = () => (
    <div className="space-y-2">
      <Label htmlFor="height">Altura</Label>
      <Input
        id="height"
        value={block.content.height || '1rem'}
        onChange={(e) => updateContent('height', e.target.value)}
        placeholder="1rem"
      />
    </div>
  );

  const renderProperties = () => {
    switch (block.type) {
      case 'header':
        return renderHeaderProperties();
      case 'heading':
        return renderHeadingProperties();
      case 'text':
        return renderTextProperties();
      case 'image':
        return renderImageProperties();
      case 'input':
        return renderInputProperties();
      case 'options':
        return renderOptionsProperties();
      case 'button':
        return renderButtonProperties();
      case 'spacer':
        return renderSpacerProperties();
      case 'divider':
        return <p className="text-sm text-muted-foreground">Sem propriedades configuráveis</p>;
      default:
        return <p className="text-sm text-muted-foreground">Bloco desconhecido</p>;
    }
  };

  // Compact mode renders just the properties without wrapper
  if (compact) {
    return (
      <div className="space-y-4">
        {renderProperties()}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {BLOCK_TYPE_LABELS[block.type]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderProperties()}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
