import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StageOptionsEditor } from './StageOptionsEditor';
import type { FunnelStage } from '@/hooks/useFunnelStages';

interface StagePropertiesPanelProps {
  stage: FunnelStage;
  onUpdate: (updates: Partial<FunnelStage>) => void;
}

export const StagePropertiesPanel: React.FC<StagePropertiesPanelProps> = ({ stage, onUpdate }) => {
  const config = stage.config || {};

  const updateConfig = (key: string, value: any) => {
    onUpdate({
      config: { ...config, [key]: value },
    });
  };

  const renderHeaderConfig = () => (
    <Card>
      <CardHeader className="py-4">
        <p className="text-sm text-muted-foreground">Header</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-logo">Mostrar Logo</Label>
          <Switch
            id="show-logo"
            checked={config.showLogo !== false}
            onCheckedChange={(checked) => updateConfig('showLogo', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-progress">Mostrar Progresso</Label>
          <Switch
            id="show-progress"
            checked={config.showProgress !== false}
            onCheckedChange={(checked) => updateConfig('showProgress', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="allow-back">Permitir Voltar</Label>
          <Switch
            id="allow-back"
            checked={config.allowBack === true}
            onCheckedChange={(checked) => updateConfig('allowBack', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderTitleConfig = () => (
    <Card>
      <CardHeader className="py-4">
        <p className="text-sm text-muted-foreground">Título da Etapa</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stage-title">Nome da Etapa</Label>
          <Input
            id="stage-title"
            value={stage.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Digite o título..."
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderIntroConfig = () => (
    <>
      <Card>
        <CardHeader className="py-4">
          <p className="text-sm text-muted-foreground">Conteúdo</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intro-title">Título Principal</Label>
            <Input
              id="intro-title"
              value={config.title || ''}
              onChange={(e) => updateConfig('title', e.target.value)}
              placeholder="Teste de Estilo Pessoal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-subtitle">Subtítulo</Label>
            <Textarea
              id="intro-subtitle"
              value={config.subtitle || ''}
              onChange={(e) => updateConfig('subtitle', e.target.value)}
              placeholder="Descrição do quiz..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-image">URL da Imagem</Label>
            <Input
              id="intro-image"
              value={config.imageUrl || ''}
              onChange={(e) => updateConfig('imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4">
          <p className="text-sm text-muted-foreground">Campo de Nome</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-label">Label do Campo</Label>
            <Input
              id="input-label"
              value={config.inputLabel || ''}
              onChange={(e) => updateConfig('inputLabel', e.target.value)}
              placeholder="NOME"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-placeholder">Placeholder</Label>
            <Input
              id="input-placeholder"
              value={config.inputPlaceholder || ''}
              onChange={(e) => updateConfig('inputPlaceholder', e.target.value)}
              placeholder="Digite seu nome aqui..."
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4">
          <p className="text-sm text-muted-foreground">Botão</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="button-text">Texto do Botão</Label>
            <Input
              id="button-text"
              value={config.buttonText || ''}
              onChange={(e) => updateConfig('buttonText', e.target.value)}
              placeholder="Continuar"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderQuestionConfig = () => (
    <>
      <Card>
        <CardHeader className="py-4">
          <p className="text-sm text-muted-foreground">Pergunta</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Textarea
              id="question-text"
              value={config.question || ''}
              onChange={(e) => updateConfig('question', e.target.value)}
              placeholder="Qual sua preferência?"
            />
          </div>
          {stage.type === 'strategic' && (
            <div className="space-y-2">
              <Label htmlFor="question-image">Imagem da Pergunta</Label>
              <Input
                id="question-image"
                value={config.imageUrl || ''}
                onChange={(e) => updateConfig('imageUrl', e.target.value)}
                placeholder="https://..."
              />
              {config.imageUrl && (
                <img 
                  src={config.imageUrl} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md mt-2"
                />
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="display-type">Tipo de Exibição</Label>
            <Select
              value={config.displayType || 'text'}
              onValueChange={(value) => updateConfig('displayType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Apenas Texto</SelectItem>
                <SelectItem value="image">Apenas Imagem</SelectItem>
                <SelectItem value="both">Texto e Imagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="multi-select">Seleção</Label>
            <Select
              value={config.multiSelect ? String(config.multiSelect) : '1'}
              onValueChange={(value) => updateConfig('multiSelect', parseInt(value) > 1 ? parseInt(value) : false)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Única (avança ao clicar)</SelectItem>
                <SelectItem value="2">Múltipla (2 opções)</SelectItem>
                <SelectItem value="3">Múltipla (3 opções)</SelectItem>
                <SelectItem value="4">Múltipla (4 opções)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!config.multiSelect && (
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-advance">Avançar Automaticamente</Label>
              <Switch
                id="auto-advance"
                checked={config.autoAdvance !== false}
                onCheckedChange={(checked) => updateConfig('autoAdvance', checked)}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <StageOptionsEditor stageId={stage.id} />
    </>
  );

  const renderTransitionConfig = () => (
    <Card>
      <CardHeader className="py-4">
        <p className="text-sm text-muted-foreground">Conteúdo da Transição</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transition-title">Título</Label>
          <Input
            id="transition-title"
            value={config.transitionTitle || ''}
            onChange={(e) => updateConfig('transitionTitle', e.target.value)}
            placeholder="Enquanto calculamos o seu resultado..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transition-subtitle">Subtítulo</Label>
          <Textarea
            id="transition-subtitle"
            value={config.transitionSubtitle || ''}
            onChange={(e) => updateConfig('transitionSubtitle', e.target.value)}
            placeholder="Queremos te fazer algumas perguntas..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transition-message">Mensagem Motivacional</Label>
          <Input
            id="transition-message"
            value={config.transitionMessage || ''}
            onChange={(e) => updateConfig('transitionMessage', e.target.value)}
            placeholder="Responda com sinceridade..."
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderResultConfig = () => (
    <Card>
      <CardHeader className="py-4">
        <p className="text-sm text-muted-foreground">Página de Resultado</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="result-layout">Layout</Label>
          <Select
            value={config.resultLayout || 'classic'}
            onValueChange={(value) => updateConfig('resultLayout', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Clássico</SelectItem>
              <SelectItem value="modern">Moderno</SelectItem>
              <SelectItem value="minimal">Minimalista</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-percentages">Mostrar Porcentagens</Label>
          <Switch
            id="show-percentages"
            checked={config.showPercentages !== false}
            onCheckedChange={(checked) => updateConfig('showPercentages', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-text">Texto do CTA</Label>
          <Input
            id="cta-text"
            value={config.ctaText || ''}
            onChange={(e) => updateConfig('ctaText', e.target.value)}
            placeholder="Ver minha análise completa"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-url">URL do CTA</Label>
          <Input
            id="cta-url"
            value={config.ctaUrl || ''}
            onChange={(e) => updateConfig('ctaUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderTypeSpecificConfig = () => {
    switch (stage.type) {
      case 'intro':
        return renderIntroConfig();
      case 'question':
      case 'strategic':
        return renderQuestionConfig();
      case 'transition':
        return renderTransitionConfig();
      case 'result':
        return renderResultConfig();
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {renderTitleConfig()}
        {renderHeaderConfig()}
        {renderTypeSpecificConfig()}
      </div>
    </ScrollArea>
  );
};
