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
import { FunnelEffectsConfig } from "@/types/funnelConfig";
import { Sparkles, Clock, Move, ListOrdered } from "lucide-react";

interface EffectsSettingsProps {
  config: FunnelEffectsConfig;
  onChange: (config: FunnelEffectsConfig) => void;
}

export const EffectsSettings: React.FC<EffectsSettingsProps> = ({
  config,
  onChange,
}) => {
  const handleChange = <K extends keyof FunnelEffectsConfig>(
    field: K,
    value: FunnelEffectsConfig[K]
  ) => {
    onChange({ ...config, [field]: value });
  };

  const handleProgressColorChange = (
    phase: "normal" | "strategic" | "complete",
    value: string
  ) => {
    onChange({
      ...config,
      progressColors: {
        ...config.progressColors,
        [phase]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Efeitos de Fundo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Efeitos de Fundo</Label>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="floating-emojis" className="text-sm">
            Emojis Flutuantes
          </Label>
          <Switch
            id="floating-emojis"
            checked={config.enableFloatingEmojis}
            onCheckedChange={(checked) =>
              handleChange("enableFloatingEmojis", checked)
            }
          />
        </div>

        {config.enableFloatingEmojis && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Intensidade: {Math.round(config.effectsIntensity * 100)}%
              </Label>
              <Slider
                value={[config.effectsIntensity * 100]}
                onValueChange={([value]) =>
                  handleChange("effectsIntensity", value / 100)
                }
                min={10}
                max={100}
                step={10}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Emojis Intro
                </Label>
                <Input
                  value={config.customIntroEmojis?.join(" ") || "✨ 🌟 💫 ⭐"}
                  onChange={(e) =>
                    handleChange(
                      "customIntroEmojis",
                      e.target.value.split(/\s+/).filter(Boolean)
                    )
                  }
                  placeholder="✨ 🌟 💫"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Emojis Quiz
                </Label>
                <Input
                  value={config.customQuizEmojis?.join(" ") || "💭 🤔 💡 🧠"}
                  onChange={(e) =>
                    handleChange(
                      "customQuizEmojis",
                      e.target.value.split(/\s+/).filter(Boolean)
                    )
                  }
                  placeholder="💭 🤔 💡"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Emojis Estratégico
                </Label>
                <Input
                  value={
                    config.customStrategicEmojis?.join(" ") || "🎯 💎 🚀 ⚡"
                  }
                  onChange={(e) =>
                    handleChange(
                      "customStrategicEmojis",
                      e.target.value.split(/\s+/).filter(Boolean)
                    )
                  }
                  placeholder="🎯 💎 🚀"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Emojis Resultado
                </Label>
                <Input
                  value={config.customResultEmojis?.join(" ") || "🎉 🎊 🌟 ✨"}
                  onChange={(e) =>
                    handleChange(
                      "customResultEmojis",
                      e.target.value.split(/\s+/).filter(Boolean)
                    )
                  }
                  placeholder="🎉 🎊 🌟"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Barra de Progresso</Label>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Estilo da Barra
          </Label>
          <Select
            value={config.progressStyle}
            onValueChange={(value: "simple" | "morphing" | "minimal") =>
              handleChange("progressStyle", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simples</SelectItem>
              <SelectItem value="morphing">Morphing (com animação)</SelectItem>
              <SelectItem value="minimal">Minimalista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="progress-shimmer" className="text-sm">
            Efeito Shimmer
          </Label>
          <Switch
            id="progress-shimmer"
            checked={config.showProgressShimmer}
            onCheckedChange={(checked) =>
              handleChange("showProgressShimmer", checked)
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Normal</Label>
            <div className="flex gap-1">
              <Input
                type="color"
                value={config.progressColors?.normal || "#B89B7A"}
                onChange={(e) =>
                  handleProgressColorChange("normal", e.target.value)
                }
                className="w-10 h-8 p-1"
              />
              <Input
                value={config.progressColors?.normal || "#B89B7A"}
                onChange={(e) =>
                  handleProgressColorChange("normal", e.target.value)
                }
                className="flex-1 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Estratégico</Label>
            <div className="flex gap-1">
              <Input
                type="color"
                value={config.progressColors?.strategic || "#aa6b5d"}
                onChange={(e) =>
                  handleProgressColorChange("strategic", e.target.value)
                }
                className="w-10 h-8 p-1"
              />
              <Input
                value={config.progressColors?.strategic || "#aa6b5d"}
                onChange={(e) =>
                  handleProgressColorChange("strategic", e.target.value)
                }
                className="flex-1 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Completo</Label>
            <div className="flex gap-1">
              <Input
                type="color"
                value={config.progressColors?.complete || "#B89B7A"}
                onChange={(e) =>
                  handleProgressColorChange("complete", e.target.value)
                }
                className="w-10 h-8 p-1"
              />
              <Input
                value={config.progressColors?.complete || "#B89B7A"}
                onChange={(e) =>
                  handleProgressColorChange("complete", e.target.value)
                }
                className="flex-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animações de Transição */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Transições</Label>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Tipo de Transição
          </Label>
          <Select
            value={config.transitionType}
            onValueChange={(value: "fade" | "slide" | "scale" | "none") =>
              handleChange("transitionType", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide">Deslizar</SelectItem>
              <SelectItem value="scale">Escala</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.transitionType === "slide" && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Direção do Slide
            </Label>
            <Select
              value={config.transitionDirection || "left"}
              onValueChange={(value: "left" | "right" | "up" | "down") =>
                handleChange("transitionDirection", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
                <SelectItem value="up">Cima</SelectItem>
                <SelectItem value="down">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Duração: {config.transitionDuration}ms
          </Label>
          <Slider
            value={[config.transitionDuration]}
            onValueChange={([value]) =>
              handleChange("transitionDuration", value)
            }
            min={100}
            max={1000}
            step={50}
          />
        </div>
      </div>

      {/* Animações de Opções */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Animação das Opções</Label>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="stagger-options" className="text-sm">
            Animação em Sequência
          </Label>
          <Switch
            id="stagger-options"
            checked={config.staggerOptions}
            onCheckedChange={(checked) =>
              handleChange("staggerOptions", checked)
            }
          />
        </div>

        {config.staggerOptions && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Delay entre opções: {config.staggerDelay}ms
            </Label>
            <Slider
              value={[config.staggerDelay]}
              onValueChange={([value]) => handleChange("staggerDelay", value)}
              min={20}
              max={200}
              step={10}
            />
          </div>
        )}
      </div>
    </div>
  );
};
