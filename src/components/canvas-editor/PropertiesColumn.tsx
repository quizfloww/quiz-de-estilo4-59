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
import { StyleCategory } from "./BlockPropertiesPanel";

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
  styleCategories?: StyleCategory[];
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
  styleCategories = [],
}) => {
  const updateHeaderContent = (key: string, value: unknown) => {
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

  const stageConfig = (activeStage.config as Record<string, unknown>) || {};
  const getConfigValue = <T,>(key: string, defaultValue: T): T => {
    const value = stageConfig[key];
    return (value !== undefined && value !== null ? value : defaultValue) as T;
  };
  const updateStageConfig = (key: string, value: unknown) => {
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
          value={getConfigValue("subtitle", "")}
          onChange={(event) =>
            updateStageConfig("subtitle", event.target.value)
          }
          placeholder="Texto curto que explica o que o usuário vai vivenciar"
        />
      </div>
      <div className="space-y-1">
        <Label>URL da Imagem (opcional)</Label>
        <Input
          value={getConfigValue("imageUrl", "")}
          onChange={(event) =>
            updateStageConfig("imageUrl", event.target.value)
          }
          placeholder="https://"
        />
      </div>
      <div className="space-y-1">
        <Label>Label do campo</Label>
        <Input
          value={getConfigValue("inputLabel", "NOME")}
          onChange={(event) =>
            updateStageConfig("inputLabel", event.target.value)
          }
        />
      </div>
      <div className="space-y-1">
        <Label>Placeholder do campo</Label>
        <Input
          value={getConfigValue("inputPlaceholder", "Digite seu nome...")}
          onChange={(event) =>
            updateStageConfig("inputPlaceholder", event.target.value)
          }
        />
      </div>
    </CardContent>
  );

  const renderQuestionConfig = () => {
    const displayType = getConfigValue<string>("displayType", "text");

    return (
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label>Pergunta principal</Label>
          <Textarea
            value={getConfigValue("question", "")}
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
            value={displayType}
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
              value={getConfigValue("multiSelect", 1)}
              onChange={(event) =>
                updateStageConfig("multiSelect", Number(event.target.value))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Avanço automático</Label>
            <Switch
              checked={getConfigValue("autoAdvance", true)}
              onCheckedChange={(checked) =>
                updateStageConfig("autoAdvance", checked)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Colunas de opções</Label>
            <Select
              value={String(getConfigValue("columns", 1))}
              onValueChange={(value) =>
                updateStageConfig("columns", Number(value))
              }
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
          <div className="space-y-1">
            <Label>Mostrar ícone de seleção</Label>
            <Switch
              checked={getConfigValue("showCheckIcon", true)}
              onCheckedChange={(checked) =>
                updateStageConfig("showCheckIcon", checked)
              }
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Tamanho do texto das opções</Label>
          <Select
            value={getConfigValue("optionTextSize", "base")}
            onValueChange={(value) =>
              updateStageConfig("optionTextSize", value)
            }
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
        {(displayType === "image" || displayType === "both") && (
          <div className="space-y-1">
            <Label>Tamanho das imagens</Label>
            <Select
              value={getConfigValue("optionImageSize", "md")}
              onValueChange={(value) =>
                updateStageConfig("optionImageSize", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Pequeno</SelectItem>
                <SelectItem value="sm">Pequeno</SelectItem>
                <SelectItem value="md">Médio</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
                <SelectItem value="xl">Extra Grande</SelectItem>
                <SelectItem value="2xl">2x Grande</SelectItem>
                <SelectItem value="3xl">3x Grande</SelectItem>
                <SelectItem value="full">Largura Total</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    );
  };

  const renderTransitionConfig = () => (
    <CardContent className="space-y-3">
      <div className="space-y-1">
        <Label>Título de transição</Label>
        <Input
          value={getConfigValue("transitionTitle", "")}
          onChange={(event) =>
            updateStageConfig("transitionTitle", event.target.value)
          }
        />
      </div>
      <div className="space-y-1">
        <Label>Subtítulo</Label>
        <Textarea
          value={getConfigValue("transitionSubtitle", "")}
          onChange={(event) =>
            updateStageConfig("transitionSubtitle", event.target.value)
          }
          placeholder="Conte algo positivo enquanto o resultado é preparado"
        />
      </div>
      <div className="space-y-1">
        <Label>Mensagem complementar</Label>
        <Textarea
          value={getConfigValue("transitionMessage", "")}
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
            value={getConfigValue("finalPrice", "")}
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
            value={getConfigValue("totalOriginal", "")}
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
          value={getConfigValue("currency", "R$")}
          onChange={(event) =>
            updateStageConfig("currency", event.target.value)
          }
        />
      </div>
      <div className="space-y-1">
        <Label>Texto do botão</Label>
        <Input
          value={getConfigValue("ctaText", "")}
          onChange={(event) => updateStageConfig("ctaText", event.target.value)}
          placeholder="GARANTIR MEU GUIA AGORA"
        />
      </div>
      <div className="space-y-1">
        <Label>URL do botão</Label>
        <Input
          value={getConfigValue("ctaUrl", "")}
          onChange={(event) => updateStageConfig("ctaUrl", event.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="space-y-1">
        <Label>Variante do botão</Label>
        <Select
          onValueChange={(value) => updateStageConfig("ctaVariant", value)}
          value={getConfigValue("ctaVariant", "green")}
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
          value={getConfigValue("urgencyText", "")}
          onChange={(event) =>
            updateStageConfig("urgencyText", event.target.value)
          }
          placeholder="Vagas limitadas"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Ícone do botão</Label>
        <Switch
          checked={getConfigValue("showCtaIcon", true)}
          onCheckedChange={(checked) =>
            updateStageConfig("showCtaIcon", checked)
          }
        />
      </div>
      <div className="pt-4 border-t border-muted/50 space-y-3">
        <div className="flex items-center justify-between">
          <Label>Mostrar porcentagem principal</Label>
          <Switch
            checked={getConfigValue("showPercentage", true)}
            onCheckedChange={(checked) =>
              updateStageConfig("showPercentage", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Mostrar descrição</Label>
          <Switch
            checked={getConfigValue("showDescription", true)}
            onCheckedChange={(checked) =>
              updateStageConfig("showDescription", checked)
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Layout do resultado</Label>
          <Select
            value={getConfigValue("styleLayout", "stacked")}
            onValueChange={(value) => updateStageConfig("styleLayout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stacked">Empilhado</SelectItem>
              <SelectItem value="side-by-side">Lado a lado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tamanho da imagem</Label>
          <Select
            value={getConfigValue("styleImageSize", "lg")}
            onValueChange={(value) =>
              updateStageConfig("styleImageSize", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Pequeno</SelectItem>
              <SelectItem value="md">Médio</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
              <SelectItem value="xl">Extra Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="pt-4 border-t border-muted/50 space-y-3">
        <div className="space-y-1">
          <Label>Quantidade máxima de estilos</Label>
          <Select
            value={String(getConfigValue("maxSecondaryStyles", 3))}
            onValueChange={(value) =>
              updateStageConfig("maxSecondaryStyles", Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 estilo</SelectItem>
              <SelectItem value="2">2 estilos</SelectItem>
              <SelectItem value="3">3 estilos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label>Mostrar porcentagem dos secundários</Label>
          <Switch
            checked={getConfigValue("showSecondaryPercentage", true)}
            onCheckedChange={(checked) =>
              updateStageConfig("showSecondaryPercentage", checked)
            }
          />
        </div>
      </div>
      <div className="pt-4 border-t border-muted/50 space-y-3">
        <div className="space-y-1">
          <Label>Dias de garantia</Label>
          <Input
            type="number"
            min={0}
            value={getConfigValue("guaranteeDays", 7)}
            onChange={(event) =>
              updateStageConfig("guaranteeDays", Number(event.target.value))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Título da garantia</Label>
          <Input
            value={getConfigValue("guaranteeTitle", "7 Dias de Garantia")}
            onChange={(event) =>
              updateStageConfig("guaranteeTitle", event.target.value)
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Descrição da garantia</Label>
          <Textarea
            value={getConfigValue("guaranteeDescription", "")}
            onChange={(event) =>
              updateStageConfig("guaranteeDescription", event.target.value)
            }
            placeholder="Texto complementa a confiança"
          />
        </div>
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

  // Quando um bloco está selecionado, mostrar ele primeiro e em destaque
  const hasSelectedBlock = selectedBlock && selectedBlock.type !== "header";

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* BLOCO SELECIONADO - Aparece primeiro quando selecionado */}
        {hasSelectedBlock && (
          <Card className="border-primary/50 shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between bg-primary/5 rounded-t-lg">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Editando
                </p>
                <p className="text-sm font-medium text-primary">
                  {BLOCK_TYPE_LABELS[selectedBlock.type]}
                </p>
              </div>
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
            <CardContent className="pt-4">
              <BlockPropertiesPanel
                block={selectedBlock}
                onUpdateBlock={onUpdateBlock}
                compact
                styleCategories={styleCategories}
              />
            </CardContent>
          </Card>
        )}

        {/* Mensagem quando nenhum bloco está selecionado */}
        {!hasSelectedBlock && (
          <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
            <p className="text-sm">
              👆 Clique em um bloco para editar suas propriedades
            </p>
          </div>
        )}

        {/* SEÇÕES SECUNDÁRIAS - Aparecem abaixo e mais discretas */}
        <details
          className={hasSelectedBlock ? "group" : "group open"}
          open={!hasSelectedBlock}
        >
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground uppercase tracking-wide py-2 hover:text-foreground transition-colors">
            ⚙️ Configurações da Etapa
          </summary>
          <div className="space-y-4 pt-2">
            {/* Card: Cor de Fundo do Canvas */}
            <Card>
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Cor de Fundo do Canvas
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={getConfigValue("canvasBackgroundColor", "#ffffff")}
                      onChange={(e) =>
                        updateStageConfig(
                          "canvasBackgroundColor",
                          e.target.value
                        )
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={getConfigValue("canvasBackgroundColor", "#ffffff")}
                      onChange={(e) =>
                        updateStageConfig(
                          "canvasBackgroundColor",
                          e.target.value
                        )
                      }
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Título da Etapa */}
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

            {/* Header Config */}
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
          </div>
        </details>

        {/* Espaçador para visual */}
        <div className="py-4" />
      </div>
    </ScrollArea>
  );
};
