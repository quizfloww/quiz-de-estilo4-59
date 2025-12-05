import React from 'react';
import { CanvasBlock, BLOCK_TYPE_LABELS } from '@/types/canvasBlocks';
import { FunnelStage } from '@/hooks/useFunnelStages';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockPropertiesPanel } from './BlockPropertiesPanel';

interface PropertiesColumnProps {
  activeStage: FunnelStage | null;
  selectedBlock: CanvasBlock | null;
  headerBlock: CanvasBlock | null;
  onUpdateStage: (updates: Partial<FunnelStage>) => void;
  onUpdateBlock: (block: CanvasBlock) => void;
}

export const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
  activeStage,
  selectedBlock,
  headerBlock,
  onUpdateStage,
  onUpdateBlock,
}) => {
  const updateHeaderContent = (key: string, value: any) => {
    if (!headerBlock) return;
    onUpdateBlock({
      ...headerBlock,
      content: {
        ...headerBlock.content,
        [key]: value,
      },
    });
  };

  if (!activeStage) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-4">
        <p className="text-sm text-center">Selecione uma etapa para editar suas propriedades</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Card 1: Título da Etapa */}
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Título da Etapa</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="stepName">Nome da Etapa</Label>
              <Input
                id="stepName"
                value={activeStage.title}
                onChange={(e) => onUpdateStage({ title: e.target.value })}
                placeholder="Digite aqui..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Configurações de Header */}
        {headerBlock && (
          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm text-muted-foreground">Header</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-logo" className="text-sm">Mostrar Logo</Label>
                <Switch
                  id="show-logo"
                  checked={headerBlock.content.showLogo}
                  onCheckedChange={(checked) => updateHeaderContent('showLogo', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress" className="text-sm">Mostrar Progresso</Label>
                <Switch
                  id="show-progress"
                  checked={headerBlock.content.showProgress}
                  onCheckedChange={(checked) => updateHeaderContent('showProgress', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-return" className="text-sm">Permitir Voltar</Label>
                <Switch
                  id="allow-return"
                  checked={headerBlock.content.showBackButton}
                  onCheckedChange={(checked) => updateHeaderContent('showBackButton', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card 3: Propriedades do Bloco Selecionado */}
        {selectedBlock && selectedBlock.type !== 'header' && (
          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm text-muted-foreground">
                {BLOCK_TYPE_LABELS[selectedBlock.type]}
              </p>
            </CardHeader>
            <CardContent>
              <BlockPropertiesPanel
                block={selectedBlock}
                onUpdateBlock={onUpdateBlock}
                compact
              />
            </CardContent>
          </Card>
        )}

        {/* Espaçador para visual */}
        <div className="py-4" />
      </div>
    </ScrollArea>
  );
};
