import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FunnelResultsConfig } from "@/types/funnelConfig";
import {
  User,
  Layout,
  BarChart3,
  BookOpen,
  ShoppingCart,
  DollarSign,
  Clock,
  Grid3X3,
  UserCircle,
  Shield,
} from "lucide-react";

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
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={["user"]}>
        {/* Personalização com Nome */}
        <AccordionItem value="user">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personalização com Nome
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-username" className="text-sm">
                Usar nome do usuário
              </Label>
              <Switch
                id="use-username"
                checked={config.useUserName}
                onCheckedChange={(checked) =>
                  handleChange("useUserName", checked)
                }
              />
            </div>

            {config.useUserName && (
              <>
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
                    onChange={(e) =>
                      handleChange("fallbackName", e.target.value)
                    }
                    placeholder="Visitante"
                  />
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Layout de Resultado */}
        <AccordionItem value="layout">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout do Resultado
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
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
                Tamanho da imagem
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
          </AccordionContent>
        </AccordionItem>

        {/* Ranking e Percentuais */}
        <AccordionItem value="ranking">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Ranking e Percentuais
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
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
              <div className="space-y-2">
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
          </AccordionContent>
        </AccordionItem>

        {/* Guia de Estilo */}
        <AccordionItem value="guide">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Guia de Estilo
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Mostrar guia de estilo</Label>
              <Switch
                checked={config.showStyleGuide}
                onCheckedChange={(checked) =>
                  handleChange("showStyleGuide", checked)
                }
              />
            </div>

            {config.showStyleGuide && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Título do guia
                  </Label>
                  <Input
                    value={config.guideTitle}
                    onChange={(e) => handleChange("guideTitle", e.target.value)}
                    placeholder="Seu Guia de Estilo Personalizado"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Descrição do guia
                  </Label>
                  <Textarea
                    value={config.guideDescription || ""}
                    onChange={(e) =>
                      handleChange("guideDescription", e.target.value)
                    }
                    placeholder="Um material exclusivo..."
                    rows={2}
                  />
                </div>

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
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* CTA e Oferta */}
        <AccordionItem value="cta">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              CTA e Oferta
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Habilitar CTA</Label>
              <Switch
                checked={config.ctaEnabled}
                onCheckedChange={(checked) =>
                  handleChange("ctaEnabled", checked)
                }
              />
            </div>

            {config.ctaEnabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Texto do botão
                  </Label>
                  <Input
                    value={config.ctaText}
                    onChange={(e) => handleChange("ctaText", e.target.value)}
                    placeholder="Garantir Meu Guia Agora"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    URL de destino
                  </Label>
                  <Input
                    value={config.ctaUrl}
                    onChange={(e) => handleChange("ctaUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Estilo do botão
                  </Label>
                  <Select
                    value={config.ctaStyle}
                    onValueChange={(
                      value: "primary" | "secondary" | "gradient" | "animated"
                    ) => handleChange("ctaStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primário</SelectItem>
                      <SelectItem value="secondary">Secundário</SelectItem>
                      <SelectItem value="gradient">Gradiente</SelectItem>
                      <SelectItem value="animated">Animado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Mostrar ícone no botão</Label>
                  <Switch
                    checked={config.showCtaIcon}
                    onCheckedChange={(checked) =>
                      handleChange("showCtaIcon", checked)
                    }
                  />
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Preço e Urgência */}
        <AccordionItem value="pricing">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Preço e Desconto
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Mostrar preços</Label>
              <Switch
                checked={config.showPricing}
                onCheckedChange={(checked) =>
                  handleChange("showPricing", checked)
                }
              />
            </div>

            {config.showPricing && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Preço original
                    </Label>
                    <Input
                      value={config.originalPrice || ""}
                      onChange={(e) =>
                        handleChange("originalPrice", e.target.value)
                      }
                      placeholder="R$ 175,00"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Preço atual
                    </Label>
                    <Input
                      value={config.currentPrice || ""}
                      onChange={(e) =>
                        handleChange("currentPrice", e.target.value)
                      }
                      placeholder="R$ 39,00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Parcelamento
                  </Label>
                  <Input
                    value={config.installments || ""}
                    onChange={(e) =>
                      handleChange("installments", e.target.value)
                    }
                    placeholder="4x de R$ 10,86"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Badge de desconto
                  </Label>
                  <Input
                    value={config.discountBadge || ""}
                    onChange={(e) =>
                      handleChange("discountBadge", e.target.value)
                    }
                    placeholder="-78% HOJE"
                  />
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Countdown */}
        <AccordionItem value="countdown">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Countdown de Urgência
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Mostrar countdown</Label>
              <Switch
                checked={config.showCountdown}
                onCheckedChange={(checked) =>
                  handleChange("showCountdown", checked)
                }
              />
            </div>

            {config.showCountdown && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Horas
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={config.countdownHours}
                      onChange={(e) =>
                        handleChange("countdownHours", parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Minutos
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={config.countdownMinutes}
                      onChange={(e) =>
                        handleChange(
                          "countdownMinutes",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Segundos
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={config.countdownSeconds}
                      onChange={(e) =>
                        handleChange(
                          "countdownSeconds",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Mensagem do countdown
                  </Label>
                  <Input
                    value={config.countdownMessage || ""}
                    onChange={(e) =>
                      handleChange("countdownMessage", e.target.value)
                    }
                    placeholder="Oferta expira em:"
                  />
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Seções da Página */}
        <AccordionItem value="sections">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Seções da Página
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Seção do mentor</Label>
              <Switch
                checked={config.showMentorSection}
                onCheckedChange={(checked) =>
                  handleChange("showMentorSection", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Depoimentos</Label>
              <Switch
                checked={config.showTestimonials}
                onCheckedChange={(checked) =>
                  handleChange("showTestimonials", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Antes e Depois</Label>
              <Switch
                checked={config.showBeforeAfter}
                onCheckedChange={(checked) =>
                  handleChange("showBeforeAfter", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Seção de bônus</Label>
              <Switch
                checked={config.showBonusSection}
                onCheckedChange={(checked) =>
                  handleChange("showBonusSection", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Garantia</Label>
              <Switch
                checked={config.showGuaranteeSection}
                onCheckedChange={(checked) =>
                  handleChange("showGuaranteeSection", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Compra segura</Label>
              <Switch
                checked={config.showSecurePurchase}
                onCheckedChange={(checked) =>
                  handleChange("showSecurePurchase", checked)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Mentor/Especialista */}
        <AccordionItem value="mentor">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Mentor/Especialista
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input
                value={config.mentorName || ""}
                onChange={(e) => handleChange("mentorName", e.target.value)}
                placeholder="Gisele Galvão"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Título</Label>
              <Input
                value={config.mentorTitle || ""}
                onChange={(e) => handleChange("mentorTitle", e.target.value)}
                placeholder="Consultora de Imagem e Estilo"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                URL da imagem
              </Label>
              <Input
                value={config.mentorImageUrl || ""}
                onChange={(e) => handleChange("mentorImageUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea
                value={config.mentorDescription || ""}
                onChange={(e) =>
                  handleChange("mentorDescription", e.target.value)
                }
                placeholder="Apaixonada por ajudar mulheres..."
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Garantia */}
        <AccordionItem value="guarantee">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Garantia
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Dias de garantia: {config.guaranteeDays}
              </Label>
              <Slider
                value={[config.guaranteeDays]}
                onValueChange={([value]) =>
                  handleChange("guaranteeDays", value)
                }
                min={0}
                max={30}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Título da garantia
              </Label>
              <Input
                value={config.guaranteeTitle || ""}
                onChange={(e) => handleChange("guaranteeTitle", e.target.value)}
                placeholder="7 Dias de Garantia Incondicional"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Descrição da garantia
              </Label>
              <Textarea
                value={config.guaranteeDescription || ""}
                onChange={(e) =>
                  handleChange("guaranteeDescription", e.target.value)
                }
                placeholder="Se você não ficar satisfeita..."
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
