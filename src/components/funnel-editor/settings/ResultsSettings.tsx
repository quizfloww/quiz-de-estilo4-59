import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FunnelResultsConfig } from "@/types/funnelConfig";
import { User, Layout, BarChart3, BookOpen, Info } from "lucide-react";

interface ResultsSettingsProps {
  config: FunnelResultsConfig;
  onChange: (config: FunnelResultsConfig) => void;
}

export const ResultsSettings: React.FC<ResultsSettingsProps> = ({
  config,
  onChange,
}) => {
  const handleChange = <K extends keyof FunnelResultsConfig>(
    field: K,
    value: FunnelResultsConfig[K]
  ) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Nota informativa */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
        <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <p className="text-muted-foreground">
          Configure aqui as opções globais da página de resultado. Para editar
          blocos específicos (preço, mentoria, garantia, CTA), selecione o bloco
          no canvas.
        </p>
      </div>

      {/* Personalização com Nome */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Personalização com Nome</Label>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="use-username" className="text-sm">
            Usar nome do usuário
          </Label>
          <Switch
            id="use-username"
            checked={config.useUserName}
            onCheckedChange={(checked) => handleChange("useUserName", checked)}
          />
        </div>

        {config.useUserName && (
          <div className="space-y-3 pl-2 border-l-2 border-muted">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Template de saudação
              </Label>
              <Input
                value={config.greetingTemplate}
                onChange={(e) =>
                  handleChange("greetingTemplate", e.target.value)
                }
                placeholder="Olá, {nome}!"
              />
              <p className="text-xs text-muted-foreground">
                Use {"{nome}"} onde deseja inserir o nome
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Template do título do resultado
              </Label>
              <Input
                value={config.resultTitleTemplate}
                onChange={(e) =>
                  handleChange("resultTitleTemplate", e.target.value)
                }
                placeholder="{nome}, seu estilo predominante é:"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Nome padrão (fallback)
              </Label>
              <Input
                value={config.fallbackName}
                onChange={(e) => handleChange("fallbackName", e.target.value)}
                placeholder="Visitante"
              />
            </div>
          </div>
        )}
      </div>

      {/* Layout de Resultado */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Layout className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Layout do Resultado</Label>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Estilo do Layout
          </Label>
          <Select
            value={config.resultLayout}
            onValueChange={(
              value: "modern" | "classic" | "minimal" | "elegant"
            ) => handleChange("resultLayout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Moderno</SelectItem>
              <SelectItem value="classic">Clássico</SelectItem>
              <SelectItem value="minimal">Minimalista</SelectItem>
              <SelectItem value="elegant">Elegante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Mostrar imagem do estilo</Label>
          <Switch
            checked={config.showPrimaryStyleImage}
            onCheckedChange={(checked) =>
              handleChange("showPrimaryStyleImage", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Mostrar descrição do estilo</Label>
          <Switch
            checked={config.showPrimaryStyleDescription}
            onCheckedChange={(checked) =>
              handleChange("showPrimaryStyleDescription", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Tamanho da imagem principal
          </Label>
          <Select
            value={config.primaryStyleImageSize}
            onValueChange={(value: "sm" | "md" | "lg" | "xl") =>
              handleChange("primaryStyleImageSize", value)
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

      {/* Ranking e Percentuais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Ranking e Percentuais</Label>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Mostrar percentuais</Label>
          <Switch
            checked={config.showPercentages}
            onCheckedChange={(checked) =>
              handleChange("showPercentages", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Mostrar estilos secundários</Label>
          <Switch
            checked={config.showSecondaryStyles}
            onCheckedChange={(checked) =>
              handleChange("showSecondaryStyles", checked)
            }
          />
        </div>

        {config.showSecondaryStyles && (
          <div className="space-y-2 pl-2 border-l-2 border-muted">
            <Label className="text-xs text-muted-foreground">
              Máximo de estilos secundários: {config.maxSecondaryStyles}
            </Label>
            <Slider
              value={[config.maxSecondaryStyles]}
              onValueChange={([value]) =>
                handleChange("maxSecondaryStyles", value)
              }
              min={1}
              max={5}
              step={1}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label className="text-sm">Mostrar barras de progresso</Label>
          <Switch
            checked={config.showProgressBars}
            onCheckedChange={(checked) =>
              handleChange("showProgressBars", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Formato do percentual
          </Label>
          <Select
            value={config.percentageFormat}
            onValueChange={(value: "number" | "bar" | "both") =>
              handleChange("percentageFormat", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Apenas número</SelectItem>
              <SelectItem value="bar">Apenas barra</SelectItem>
              <SelectItem value="both">Número e barra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Guia de Estilo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Exibição do Guia</Label>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Mostrar imagem do guia</Label>
          <Switch
            checked={config.showStyleGuide}
            onCheckedChange={(checked) =>
              handleChange("showStyleGuide", checked)
            }
          />
        </div>

        {config.showStyleGuide && (
          <div className="space-y-3 pl-2 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Mostrar badge exclusivo</Label>
              <Switch
                checked={config.showExclusiveBadge}
                onCheckedChange={(checked) =>
                  handleChange("showExclusiveBadge", checked)
                }
              />
            </div>

            {config.showExclusiveBadge && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Texto do badge
                </Label>
                <Input
                  value={config.exclusiveBadgeText}
                  onChange={(e) =>
                    handleChange("exclusiveBadgeText", e.target.value)
                  }
                  placeholder="EXCLUSIVO"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
