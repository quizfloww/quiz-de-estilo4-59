import React from 'react';
import { QuizFlowStage, QuizFlowOption } from '@/types/quizFlow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowPropertiesPanelProps {
  stage: QuizFlowStage | null;
  styleCategories: { id: string; name: string }[];
  onUpdateStage: (updates: Partial<QuizFlowStage>) => void;
  onUpdateConfig: (updates: Partial<QuizFlowStage['config']>) => void;
  onAddOption: () => void;
  onUpdateOption: (optionId: string, updates: Partial<QuizFlowOption>) => void;
  onDeleteOption: (optionId: string) => void;
  onMoveOption: (draggedId: string, targetId: string) => void;
}

export const FlowPropertiesPanel: React.FC<FlowPropertiesPanelProps> = ({
  stage,
  styleCategories,
  onUpdateStage,
  onUpdateConfig,
  onAddOption,
  onUpdateOption,
  onDeleteOption
}) => {
  if (!stage) {
    return (
      <div className="flex items-center justify-center h-full border-l bg-card">
        <p className="text-muted-foreground text-sm">Selecione uma etapa para editar</p>
      </div>
    );
  }

  return (
    <div className="h-full border-l bg-card flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Propriedades</h3>
        <p className="text-xs text-muted-foreground mt-1">{stage.type}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Stage Title */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Título da Etapa</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Input
                value={stage.title}
                onChange={(e) => onUpdateStage({ title: e.target.value })}
                placeholder="Nome da etapa"
              />
            </CardContent>
          </Card>

          {/* Header Settings */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Header</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-logo" className="text-sm">Mostrar Logo</Label>
                <Switch
                  id="show-logo"
                  checked={stage.config.showLogo ?? true}
                  onCheckedChange={(checked) => onUpdateConfig({ showLogo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress" className="text-sm">Mostrar Progresso</Label>
                <Switch
                  id="show-progress"
                  checked={stage.config.showProgress ?? true}
                  onCheckedChange={(checked) => onUpdateConfig({ showProgress: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-back" className="text-sm">Permitir Voltar</Label>
                <Switch
                  id="allow-back"
                  checked={stage.config.allowBack ?? true}
                  onCheckedChange={(checked) => onUpdateConfig({ allowBack: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Intro specific */}
          {stage.type === 'intro' && (
            <>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Conteúdo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Subtítulo</Label>
                    <Textarea
                      value={stage.config.subtitle || ''}
                      onChange={(e) => onUpdateConfig({ subtitle: e.target.value })}
                      placeholder="Subtítulo da introdução"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">URL da Imagem</Label>
                    <Input
                      value={stage.config.imageUrl || ''}
                      onChange={(e) => onUpdateConfig({ imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Label do Campo</Label>
                    <Input
                      value={stage.config.inputLabel || ''}
                      onChange={(e) => onUpdateConfig({ inputLabel: e.target.value })}
                      placeholder="NOME"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Placeholder</Label>
                    <Input
                      value={stage.config.inputPlaceholder || ''}
                      onChange={(e) => onUpdateConfig({ inputPlaceholder: e.target.value })}
                      placeholder="Digite seu nome..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Texto do Botão</Label>
                    <Input
                      value={stage.config.buttonText || ''}
                      onChange={(e) => onUpdateConfig({ buttonText: e.target.value })}
                      placeholder="Continuar"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Question/Strategic specific */}
          {(stage.type === 'question' || stage.type === 'strategic') && (
            <>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Pergunta</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Texto da Pergunta</Label>
                    <Textarea
                      value={stage.config.question || ''}
                      onChange={(e) => onUpdateConfig({ question: e.target.value })}
                      placeholder="Digite a pergunta..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Tipo de Exibição</Label>
                    <Select
                      value={stage.config.displayType || 'text'}
                      onValueChange={(value) => onUpdateConfig({ displayType: value as 'text' | 'image' | 'both' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Apenas Texto</SelectItem>
                        <SelectItem value="image">Apenas Imagem</SelectItem>
                        <SelectItem value="both">Texto + Imagem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Seleções Permitidas</Label>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      value={stage.config.multiSelect || 1}
                      onChange={(e) => onUpdateConfig({ multiSelect: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-advance" className="text-sm">Avançar Automaticamente</Label>
                    <Switch
                      id="auto-advance"
                      checked={stage.config.autoAdvance ?? false}
                      onCheckedChange={(checked) => onUpdateConfig({ autoAdvance: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Options */}
              <Card>
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Opções</CardTitle>
                  <Button variant="outline" size="sm" onClick={onAddOption}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {stage.config.options?.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-start gap-2 p-2 rounded-md border bg-muted/30"
                    >
                      <button className="mt-2 cursor-grab">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={option.text}
                          onChange={(e) => onUpdateOption(option.id, { text: e.target.value })}
                          placeholder="Texto da opção"
                          className="h-8 text-sm"
                        />
                        {(stage.config.displayType === 'image' || stage.config.displayType === 'both') && (
                          <Input
                            value={option.imageUrl || ''}
                            onChange={(e) => onUpdateOption(option.id, { imageUrl: e.target.value })}
                            placeholder="URL da imagem"
                            className="h-8 text-sm"
                          />
                        )}
                        {stage.type === 'question' && (
                          <Select
                            value={option.styleCategory || ''}
                            onValueChange={(value) => onUpdateOption(option.id, { styleCategory: value })}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {styleCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => onDeleteOption(option.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* Transition specific */}
          {stage.type === 'transition' && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Conteúdo da Transição</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Título</Label>
                  <Input
                    value={stage.config.transitionTitle || ''}
                    onChange={(e) => onUpdateConfig({ transitionTitle: e.target.value })}
                    placeholder="Enquanto calculamos..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Subtítulo</Label>
                  <Textarea
                    value={stage.config.transitionSubtitle || ''}
                    onChange={(e) => onUpdateConfig({ transitionSubtitle: e.target.value })}
                    placeholder="Subtítulo"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Mensagem</Label>
                  <Textarea
                    value={stage.config.transitionMessage || ''}
                    onChange={(e) => onUpdateConfig({ transitionMessage: e.target.value })}
                    placeholder="Mensagem motivacional"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result specific */}
          {stage.type === 'result' && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Configuração do Resultado</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Layout</Label>
                  <Select
                    value={stage.config.resultLayout || 'modern'}
                    onValueChange={(value) => onUpdateConfig({ resultLayout: value as 'classic' | 'modern' | 'minimal' })}
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
                  <Label htmlFor="show-percentages" className="text-sm">Mostrar Porcentagens</Label>
                  <Switch
                    id="show-percentages"
                    checked={stage.config.showPercentages ?? true}
                    onCheckedChange={(checked) => onUpdateConfig({ showPercentages: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Texto do CTA</Label>
                  <Input
                    value={stage.config.ctaText || ''}
                    onChange={(e) => onUpdateConfig({ ctaText: e.target.value })}
                    placeholder="Ver oferta especial"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">URL do CTA</Label>
                  <Input
                    value={stage.config.ctaUrl || ''}
                    onChange={(e) => onUpdateConfig({ ctaUrl: e.target.value })}
                    placeholder="/oferta"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
