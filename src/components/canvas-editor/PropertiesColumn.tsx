import React from "react";
import {
  CanvasBlock,
  CanvasBlockType,
  BLOCK_TYPE_LABELS,
} from "@/types/canvasBlocks";
import { FunnelStage } from "@/hooks/useFunnelStages";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BlockPropertiesPanel } from "./BlockPropertiesPanel";
import { Copy, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PropertiesColumnProps {
  activeStage: FunnelStage | null;
  selectedBlock: CanvasBlock | null;
  headerBlock: CanvasBlock | null;
  onUpdateStage: (updates: Partial<FunnelStage>) => void;
  onUpdateBlock: (block: CanvasBlock) => void;
  onApplyBlockToAll?: (block: CanvasBlock, blockType: CanvasBlockType) => void;
  onApplyHeaderToAll?: (headerBlock: CanvasBlock) => void;
  onApplyStageConfigToAll?: (stage: FunnelStage) => void;
  similarBlocksCount?: number;
  similarStagesCount?: number;
}

export const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
  activeStage,
  selectedBlock,
  headerBlock,
  onUpdateStage,
  onUpdateBlock,
  onApplyBlockToAll,
  onApplyHeaderToAll,
  onApplyStageConfigToAll,
  similarBlocksCount = 0,
  similarStagesCount = 0,
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
        <p className="text-sm text-center">
          Selecione uma etapa para editar suas propriedades
        </p>
      </div>
    );
  }

  const stageConfig = (activeStage.config as Record<string, any>) || {};
  const updateStageConfig = (key: string, value: any) => {
    onUpdateStage({
      config: {
        ...stageConfig,
        [key]: value,
      },
    });
  };

  const renderIntroConfig = () => (
    <CardContent className="space-y-3">
      <div className="space-y-1">
        <Label>Subtítulo</Label>
        <Textarea
          value={stageConfig.subtitle || ""}
          onChange={(event) =>
            updateStageConfig("subtitle", event.target.value)
          }
          placeholder="Texto curto que explica o que o usuário vai vivenciar"
        />
      </div>
      <div className="space-y-1">
        <Label>URL da Imagem (opcional)</Label>
        <Input
          value={stageConfig.imageUrl || ""}
          onChange={(event) =>
            updateStageConfig("imageUrl", event.target.value)
          }
          placeholder="https://"
        />
      </div>
      <div className="space-y-1">
        <Label>Label do campo</Label>
        <Input
          value={stageConfig.inputLabel || "NOME"}
          onChange={(event) =>
            updateStageConfig("inputLabel", event.target.value)
          }
        />
      </div>
      <div className="space-y-1">
        <Label>Placeholder do campo</Label>
        <Input
          value={stageConfig.inputPlaceholder || "Digite seu nome..."}
          onChange={(event) =>
            updateStageConfig("inputPlaceholder", event.target.value)
          }
        />
      </div>
    </CardContent>
  );

  const renderQuestionConfig = () => (
    <CardContent className="space-y-3">
      <div className="space-y-1">
        <Label>Pergunta principal</Label>
        <Textarea
          value={stageConfig.question || ""}
          onChange={(event) =>
            updateStageConfig("question", event.target.value)
          }
          placeholder="Qual estilo combina com sua personalidade?"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="display-type">Visualização das opções</Label>
        <Select
          onValueChange={(value) => updateStageConfig("displayType", value)}
          value={stageConfig.displayType || "text"}
        >
          <SelectTrigger id="display-type" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Apenas texto</SelectItem>
            <SelectItem value="image">Apenas imagem</SelectItem>
            <SelectItem value="both">Texto + imagem</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label>Seleções simultâneas</Label>
          <Input
            type="number"
            min={1}
            value={stageConfig.multiSelect ?? 1}
            onChange={(event) =>
              updateStageConfig("multiSelect", Number(event.target.value))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Avanço automático</Label>
          <Switch
            checked={stageConfig.autoAdvance !== false}
            onCheckedChange={(checked) =>
              updateStageConfig("autoAdvance", checked)
            }
          />
        </div>
      </div>
    </CardContent>
  );

  const renderTransitionConfig = () => (
    <CardContent className="space-y-3">
      <div className="space-y-1">
        <Label>Título de transição</Label>
        <Input
          value={stageConfig.transitionTitle || ""}
          onChange={(event) =>
            updateStageConfig("transitionTitle", event.target.value)
          }
        />
      </div>
      <div className="space-y-1">
        <Label>Subtítulo</Label>
        <Textarea
          value={stageConfig.transitionSubtitle || ""}
          onChange={(event) =>
            updateStageConfig("transitionSubtitle", event.target.value)
          }
          placeholder="Conte algo positivo enquanto o resultado é preparado"
        />
      </div>
      <div className="space-y-1">
        <Label>Mensagem complementar</Label>
        <Textarea
          value={stageConfig.transitionMessage || ""}
          onChange={(event) =>
            updateStageConfig("transitionMessage", event.target.value)
          }
          placeholder="Adicione contexto ou próximo passo"
        />
      </div>
    </CardContent>
  );

  const renderResultConfig = () => (
    <CardContent className="space-y-3">
      <div className="flex gap-2">
        <div className="space-y-1 flex-1">
          <Label>Preço final</Label>
          <Input
            type="number"
            value={stageConfig.finalPrice ?? ""}
            onChange={(event) =>
              updateStageConfig("finalPrice", Number(event.target.value))
            }
            placeholder="39"
          />
        </div>
        <div className="space-y-1 flex-1">
          <Label>Total original</Label>
          <Input
            type="number"
            value={stageConfig.totalOriginal ?? ""}
            onChange={(event) =>
              updateStageConfig("totalOriginal", Number(event.target.value))
            }
            placeholder="175"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Moeda</Label>
        <Input
          value={stageConfig.currency || "R$"}
          onChange={(event) =>
            updateStageConfig("currency", event.target.value)
          }
        />
      </div>
      <div className="space-y-1">
        <Label>Texto do botão</Label>
        <Input
          value={stageConfig.ctaText || ""}
          onChange={(event) => updateStageConfig("ctaText", event.target.value)}
          placeholder="GARANTIR MEU GUIA AGORA"
        />
      </div>
      <div className="space-y-1">
        <Label>URL do botão</Label>
        <Input
          value={stageConfig.ctaUrl || ""}
          onChange={(event) => updateStageConfig("ctaUrl", event.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="space-y-1">
        <Label>Variante do botão</Label>
        <Select
          onValueChange={(value) => updateStageConfig("ctaVariant", value)}
          value={stageConfig.ctaVariant || "green"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="green">Verde</SelectItem>
            <SelectItem value="brand">Primária</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Texto de urgência</Label>
        <Input
          value={stageConfig.urgencyText || ""}
          onChange={(event) =>
            updateStageConfig("urgencyText", event.target.value)
          }
          placeholder="Vagas limitadas"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Ícone do botão</Label>
        <Switch
          checked={stageConfig.showCtaIcon !== false}
          onCheckedChange={(checked) =>
            updateStageConfig("showCtaIcon", checked)
          }
        />
      </div>
    </CardContent>
  );

  const renderStageSpecificConfig = () => {
    switch (activeStage.type) {
      case "intro":
        return renderIntroConfig();
      case "question":
      case "strategic":
        return renderQuestionConfig();
      case "transition":
        return renderTransitionConfig();
      case "result":
        return renderResultConfig();
      default:
        return null;
    }
  };
  const stageSpecificConfigContent = renderStageSpecificConfig();

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

        {stageSpecificConfigContent && (
          <Card>
            <CardHeader className="pb-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Configurações da etapa
              </p>
              {onApplyStageConfigToAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => onApplyStageConfigToAll(activeStage)}
                >
                  <Copy className="h-3 w-3" />
                  Aplicar ao mesmo tipo
                </Button>
              )}
            </CardHeader>
            {stageSpecificConfigContent}
          </Card>
        )}

        {/* Card 2: Configurações de Header */}
        {headerBlock && (
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">Header</p>
              {onApplyHeaderToAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => onApplyHeaderToAll(headerBlock)}
                >
                  <Copy className="h-3 w-3" />
                  Aplicar a todas
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-logo" className="text-sm">
                  Mostrar Logo
                </Label>
                <Switch
                  id="show-logo"
                  checked={headerBlock.content.showLogo}
                  onCheckedChange={(checked) =>
                    updateHeaderContent("showLogo", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress" className="text-sm">
                  Mostrar Progresso
                </Label>
                <Switch
                  id="show-progress"
                  checked={headerBlock.content.showProgress}
                  onCheckedChange={(checked) =>
                    updateHeaderContent("showProgress", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-return" className="text-sm">
                  Permitir Voltar
                </Label>
                <Switch
                  id="allow-return"
                  checked={headerBlock.content.showBackButton}
                  onCheckedChange={(checked) =>
                    updateHeaderContent("showBackButton", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card 3: Propriedades do Bloco Selecionado */}
        {selectedBlock && selectedBlock.type !== "header" && (
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {BLOCK_TYPE_LABELS[selectedBlock.type]}
              </p>
              {onApplyBlockToAll && similarBlocksCount > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Aplicar
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onApplyBlockToAll(selectedBlock, selectedBlock.type)
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Todos os blocos "{BLOCK_TYPE_LABELS[selectedBlock.type]}"
                      ({similarBlocksCount})
                    </DropdownMenuItem>
                    {onApplyStageConfigToAll && similarStagesCount > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onApplyStageConfigToAll(activeStage)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Todas etapas do mesmo tipo ({similarStagesCount})
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
