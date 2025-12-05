import React from 'react';
import { CanvasBlock, BLOCK_TYPE_LABELS } from '@/types/canvasBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

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

  const renderScaleControl = () => (
    <div className="space-y-2 pb-3 border-b">
      <Label>Escala</Label>
      <div className="flex items-center gap-3">
        <Slider
          value={[(block.content.scale || 1) * 100]}
          min={50}
          max={200}
          step={10}
          onValueChange={([value]) => updateContent('scale', value / 100)}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-12 text-right">
          {((block.content.scale || 1) * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );

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
      {renderScaleControl()}
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
      {renderScaleControl()}
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
      {renderScaleControl()}
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
        <Label>Tamanho</Label>
        <Select
          value={block.content.imageSize || 'md'}
          onValueChange={(value) => updateContent('imageSize', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">Muito Pequeno (100px)</SelectItem>
            <SelectItem value="sm">Pequeno (200px)</SelectItem>
            <SelectItem value="md">Médio (384px)</SelectItem>
            <SelectItem value="lg">Grande (512px)</SelectItem>
            <SelectItem value="xl">Extra Grande (640px)</SelectItem>
            <SelectItem value="2xl">2x Grande (800px)</SelectItem>
            <SelectItem value="3xl">3x Grande (960px)</SelectItem>
            <SelectItem value="full">Largura Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Alinhamento Horizontal</Label>
        <Select
          value={block.content.imageAlignment || 'center'}
          onValueChange={(value) => updateContent('imageAlignment', value)}
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
      <div className="space-y-2">
        <Label>Posição Vertical</Label>
        <Select
          value={block.content.imagePosition || 'center'}
          onValueChange={(value) => updateContent('imagePosition', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Topo</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="bottom">Base</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderInputProperties = () => (
    <>
      {renderScaleControl()}
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
      {renderScaleControl()}
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
        <Label>Tamanho do Texto</Label>
        <Select
          value={block.content.optionTextSize || 'base'}
          onValueChange={(value) => updateContent('optionTextSize', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">Extra Pequeno</SelectItem>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="base">Normal</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
            <SelectItem value="xl">Extra Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(block.content.displayType === 'image' || block.content.displayType === 'both') && (
        <div className="space-y-2">
          <Label>Tamanho das Imagens</Label>
          <Select
            value={block.content.optionImageSize || 'md'}
            onValueChange={(value) => updateContent('optionImageSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Muito Pequeno (64px)</SelectItem>
              <SelectItem value="sm">Pequeno (80px)</SelectItem>
              <SelectItem value="md">Médio (112px)</SelectItem>
              <SelectItem value="lg">Grande (160px)</SelectItem>
              <SelectItem value="xl">Extra Grande (208px)</SelectItem>
              <SelectItem value="2xl">2x Grande (288px)</SelectItem>
              <SelectItem value="3xl">3x Grande (384px)</SelectItem>
              <SelectItem value="full">Máximo (480px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
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
        <Label htmlFor="showCheckIcon">Mostrar Check</Label>
        <Switch
          id="showCheckIcon"
          checked={block.content.showCheckIcon !== false}
          onCheckedChange={(checked) => updateContent('showCheckIcon', checked)}
        />
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
      {renderScaleControl()}
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
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="height">Altura</Label>
        <Input
          id="height"
          value={block.content.height || '1rem'}
          onChange={(e) => updateContent('height', e.target.value)}
          placeholder="1rem"
        />
      </div>
    </>
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
