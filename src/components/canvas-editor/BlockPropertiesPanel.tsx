import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CanvasBlock,
  BLOCK_TYPE_LABELS,
  CanvasOption,
} from "@/types/canvasBlocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

export interface StyleCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

// Default categories fallback (when none provided by funnel)
const DEFAULT_STYLE_CATEGORIES: StyleCategory[] = [
  { id: "Natural", name: "Natural" },
  { id: "Clássico", name: "Clássico" },
  { id: "Contemporâneo", name: "Contemporâneo" },
  { id: "Elegante", name: "Elegante" },
  { id: "Romântico", name: "Romântico" },
  { id: "Sexy", name: "Sexy" },
  { id: "Dramático", name: "Dramático" },
  { id: "Criativo", name: "Criativo" },
];

interface BlockPropertiesPanelProps {
  block: CanvasBlock | null;
  onUpdateBlock: (block: CanvasBlock) => void;
  compact?: boolean;
  styleCategories?: StyleCategory[];
}

export const BlockPropertiesPanel: React.FC<BlockPropertiesPanelProps> = ({
  block,
  onUpdateBlock,
  compact = false,
  styleCategories = DEFAULT_STYLE_CATEGORIES,
}) => {
  // Use provided categories or fall back to defaults
  const categories =
    styleCategories.length > 0 ? styleCategories : DEFAULT_STYLE_CATEGORIES;

  if (!block) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">
          Selecione um bloco para editar suas propriedades
        </p>
      </div>
    );
  }

  const updateContent = (key: string, value: unknown) => {
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
          onValueChange={([value]) => updateContent("scale", value / 100)}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-12 text-right">
          {((block.content.scale || 1) * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );

  // ======== CONTROLES DE ESTILO GLOBAL ========
  const renderColorControl = (
    label: string,
    key: string,
    defaultColor: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={block.content[key] || defaultColor}
          onChange={(e) => updateContent(key, e.target.value)}
          className="w-12 h-10 p-1 cursor-pointer"
        />
        <Input
          value={block.content[key] || defaultColor}
          onChange={(e) => updateContent(key, e.target.value)}
          placeholder={defaultColor}
          className="flex-1"
        />
      </div>
    </div>
  );

  const renderGlobalStyleControls = (options?: {
    showBackground?: boolean;
    showText?: boolean;
    showAccent?: boolean;
    showBorder?: boolean;
    showFont?: boolean;
    showSpacing?: boolean;
  }) => {
    const {
      showBackground = true,
      showText = true,
      showAccent = false,
      showBorder = false,
      showFont = false,
      showSpacing = false,
    } = options || {};

    return (
      <div className="space-y-3 pt-3 border-t">
        <Label className="text-xs font-semibold text-muted-foreground uppercase">
          Estilos Avançados
        </Label>

        {showBackground &&
          renderColorControl("Cor de Fundo", "backgroundColor", "transparent")}
        {showText && renderColorControl("Cor do Texto", "textColor", "#1a1a1a")}
        {showAccent &&
          renderColorControl("Cor de Destaque", "accentColor", "#B89B7A")}
        {showBorder &&
          renderColorControl("Cor da Borda", "borderColor", "#e5e5e5")}

        {showFont && (
          <>
            <div className="space-y-2">
              <Label>Fonte</Label>
              <Select
                value={block.content.fontFamily || "default"}
                onValueChange={(value) => updateContent("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão do Sistema</SelectItem>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Altura da Linha</Label>
              <Select
                value={block.content.lineHeight || "normal"}
                onValueChange={(value) => updateContent("lineHeight", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Compacto</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="relaxed">Relaxado</SelectItem>
                  <SelectItem value="loose">Espaçado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {showBorder && (
          <div className="space-y-2">
            <Label>Arredondamento</Label>
            <Select
              value={block.content.borderRadiusStyle || "md"}
              onValueChange={(value) =>
                updateContent("borderRadiusStyle", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                <SelectItem value="sm">Pequeno</SelectItem>
                <SelectItem value="md">Médio</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
                <SelectItem value="xl">Extra Grande</SelectItem>
                <SelectItem value="2xl">Muito Grande</SelectItem>
                <SelectItem value="full">Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showSpacing && (
          <div className="space-y-2">
            <Label>Espaçamento Interno</Label>
            <Select
              value={block.content.paddingSize || "md"}
              onValueChange={(value) => updateContent("paddingSize", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                <SelectItem value="sm">Pequeno</SelectItem>
                <SelectItem value="md">Médio</SelectItem>
                <SelectItem value="lg">Grande</SelectItem>
                <SelectItem value="xl">Extra Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const renderHeaderProperties = () => (
    <>
      {renderScaleControl()}
      <div className="flex items-center justify-between">
        <Label htmlFor="showLogo">Mostrar Logo</Label>
        <Switch
          id="showLogo"
          checked={block.content.showLogo}
          onCheckedChange={(checked) => updateContent("showLogo", checked)}
        />
      </div>
      {block.content.showLogo && (
        <div className="space-y-2">
          <Label htmlFor="logoUrl">URL do Logo</Label>
          <Input
            id="logoUrl"
            value={block.content.logoUrl || ""}
            onChange={(e) => updateContent("logoUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Label htmlFor="showProgress">Mostrar Progresso</Label>
        <Switch
          id="showProgress"
          checked={block.content.showProgress}
          onCheckedChange={(checked) => updateContent("showProgress", checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showBackButton">Botão Voltar</Label>
        <Switch
          id="showBackButton"
          checked={block.content.showBackButton}
          onCheckedChange={(checked) =>
            updateContent("showBackButton", checked)
          }
        />
      </div>
      {renderGlobalStyleControls({ showBackground: true, showText: true })}
    </>
  );

  const renderHeadingProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={block.content.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          placeholder="Digite o título..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Select
          value={block.content.fontSize || "2xl"}
          onValueChange={(value) => updateContent("fontSize", value)}
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
          value={block.content.textAlign || "center"}
          onValueChange={(value) => updateContent("textAlign", value)}
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

      {/* Peso da Fonte */}
      <div className="space-y-2">
        <Label>Peso da Fonte</Label>
        <Select
          value={block.content.fontWeight || "bold"}
          onValueChange={(value) => updateContent("fontWeight", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="semibold">Semi-Bold</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderGlobalStyleControls({
        showBackground: false,
        showText: true,
        showFont: true,
      })}
    </>
  );

  const renderTextProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={block.content.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          placeholder="Digite o texto..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Select
          value={block.content.fontSize || "base"}
          onValueChange={(value) => updateContent("fontSize", value)}
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
          value={block.content.textAlign || "center"}
          onValueChange={(value) => updateContent("textAlign", value)}
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

      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showFont: true,
      })}
    </>
  );

  const renderImageProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={block.content.imageUrl || ""}
          onChange={(e) => updateContent("imageUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageAlt">Texto Alternativo</Label>
        <Input
          id="imageAlt"
          value={block.content.imageAlt || ""}
          onChange={(e) => updateContent("imageAlt", e.target.value)}
          placeholder="Descrição da imagem"
        />
      </div>
      <div className="space-y-2">
        <Label>Tamanho</Label>
        <Select
          value={block.content.imageSize || "md"}
          onValueChange={(value) => updateContent("imageSize", value)}
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
          value={block.content.imageAlignment || "center"}
          onValueChange={(value) => updateContent("imageAlignment", value)}
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
          value={block.content.imagePosition || "center"}
          onValueChange={(value) => updateContent("imagePosition", value)}
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

      {renderGlobalStyleControls({
        showBackground: false,
        showText: false,
        showBorder: true,
      })}
    </>
  );

  const renderInputProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="label">Rótulo</Label>
        <Input
          id="label"
          value={block.content.label || ""}
          onChange={(e) => updateContent("label", e.target.value)}
          placeholder="Nome do campo"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={block.content.placeholder || ""}
          onChange={(e) => updateContent("placeholder", e.target.value)}
          placeholder="Digite aqui..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inputType">Tipo</Label>
        <Select
          value={block.content.inputType || "text"}
          onValueChange={(value) => updateContent("inputType", value)}
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
          onCheckedChange={(checked) => updateContent("required", checked)}
        />
      </div>
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showBorder: true,
      })}
    </>
  );

  const renderOptionsProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="displayType">Tipo de Exibição</Label>
        <Select
          value={block.content.displayType || "text"}
          onValueChange={(value) => updateContent("displayType", value)}
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
          onValueChange={(value) => updateContent("columns", parseInt(value))}
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
          value={block.content.optionTextSize || "base"}
          onValueChange={(value) => updateContent("optionTextSize", value)}
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

      {(block.content.displayType === "image" ||
        block.content.displayType === "both") && (
        <div className="space-y-2">
          <Label>Tamanho das Imagens</Label>
          <Select
            value={block.content.optionImageSize || "md"}
            onValueChange={(value) => updateContent("optionImageSize", value)}
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
          onValueChange={(value) =>
            updateContent("multiSelect", parseInt(value))
          }
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
          onCheckedChange={(checked) => updateContent("showCheckIcon", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="autoAdvance">Avançar Automaticamente</Label>
        <Switch
          id="autoAdvance"
          checked={block.content.autoAdvance}
          onCheckedChange={(checked) => updateContent("autoAdvance", checked)}
        />
      </div>

      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          {block.content.options?.length || 0} opções configuradas
        </p>
      </div>

      {/* Lista editável de opções */}
      <div className="space-y-3 pt-2">
        {(block.content.options || []).map((opt: CanvasOption, idx: number) => {
          const hasNoCategory =
            !opt.styleCategory || opt.styleCategory === "none";
          const hasNoText = !opt.text?.trim();
          const hasWarning = hasNoCategory || hasNoText;

          return (
            <Card
              key={opt.id}
              className={`p-2 transition-colors ${
                hasWarning
                  ? "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10"
                  : ""
              }`}
            >
              {hasWarning && (
                <div className="mb-2 px-2 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs text-yellow-800 dark:text-yellow-200 flex items-center gap-1.5">
                  <span className="text-yellow-600">⚠</span>
                  {hasNoText && hasNoCategory
                    ? "Configure o texto e a categoria de estilo"
                    : hasNoText
                    ? "Configure o texto da opção"
                    : "Configure uma categoria de estilo para pontuação"}
                </div>
              )}

              {/* Preview da imagem */}
              {opt.imageUrl && (
                <div className="mb-3 rounded-md overflow-hidden border border-muted">
                  <img
                    src={opt.imageUrl}
                    alt={`Preview: ${opt.text || "Opção"}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Texto da Opção</Label>
                  <Textarea
                    value={opt.text || ""}
                    onChange={(e) => {
                      const newOptions = [...(block.content.options || [])];
                      newOptions[idx] = {
                        ...newOptions[idx],
                        text: e.target.value,
                      };
                      updateContent("options", newOptions);
                    }}
                    rows={2}
                    className={hasNoText ? "border-yellow-400" : ""}
                  />

                  <Label>URL da Imagem</Label>
                  <Input
                    value={opt.imageUrl || ""}
                    onChange={(e) => {
                      const newOptions = [...(block.content.options || [])];
                      newOptions[idx] = {
                        ...newOptions[idx],
                        imageUrl: e.target.value,
                      };
                      updateContent("options", newOptions);
                    }}
                    placeholder="https://..."
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Categoria de Estilo</Label>
                      <Select
                        value={opt.styleCategory || "none"}
                        onValueChange={(value) => {
                          const newOptions = [...(block.content.options || [])];
                          newOptions[idx] = {
                            ...newOptions[idx],
                            styleCategory: value === "none" ? "" : value,
                          };
                          updateContent("options", newOptions);
                        }}
                      >
                        <SelectTrigger
                          className={hasNoCategory ? "border-yellow-400" : ""}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Pontos</Label>
                      <Input
                        type="number"
                        value={String(opt.points ?? 1)}
                        onChange={(e) => {
                          const newOptions = [...(block.content.options || [])];
                          newOptions[idx] = {
                            ...newOptions[idx],
                            points: parseInt(e.target.value) || 0,
                          };
                          updateContent("options", newOptions);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-28 flex flex-col items-end gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        const newOptions = [...(block.content.options || [])];
                        if (idx > 0) {
                          const tmp = newOptions[idx - 1];
                          newOptions[idx - 1] = newOptions[idx];
                          newOptions[idx] = tmp;
                          updateContent("options", newOptions);
                        }
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        const newOptions = [...(block.content.options || [])];
                        if (idx < newOptions.length - 1) {
                          const tmp = newOptions[idx + 1];
                          newOptions[idx + 1] = newOptions[idx];
                          newOptions[idx] = tmp;
                          updateContent("options", newOptions);
                        }
                      }}
                    >
                      ↓
                    </button>
                  </div>
                  <div className="w-full">
                    <button
                      type="button"
                      className="btn btn-destructive btn-sm w-full"
                      onClick={() => {
                        const newOptions = [...(block.content.options || [])];
                        newOptions.splice(idx, 1);
                        updateContent("options", newOptions);
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const newOptions = [...(block.content.options || [])];
              newOptions.push({
                id: uuidv4(),
                text: "Nova opção",
                imageUrl: "",
                styleCategory: "",
                points: 1,
              });
              updateContent("options", newOptions);
            }}
          >
            Adicionar Opção
          </button>
        </div>
      </div>
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showBorder: true,
      })}
    </>
  );

  const renderButtonProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={block.content.buttonText || ""}
          onChange={(e) => updateContent("buttonText", e.target.value)}
          placeholder="Continuar"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buttonVariant">Estilo</Label>
        <Select
          value={block.content.buttonVariant || "primary"}
          onValueChange={(value) => updateContent("buttonVariant", value)}
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
          onCheckedChange={(checked) => updateContent("fullWidth", checked)}
        />
      </div>
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  const renderSpacerProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="height">Altura</Label>
        <Input
          id="height"
          value={block.content.height || "1rem"}
          onChange={(e) => updateContent("height", e.target.value)}
          placeholder="1rem"
        />
      </div>
      {renderGlobalStyleControls({ showBackground: true })}
    </>
  );

  const renderDividerProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label>Estilo</Label>
        <Select
          value={block.content.dividerStyle || "solid"}
          onValueChange={(value) => updateContent("dividerStyle", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Sólido</SelectItem>
            <SelectItem value="dashed">Tracejado</SelectItem>
            <SelectItem value="dotted">Pontilhado</SelectItem>
            <SelectItem value="elegant">Elegante (gradiente)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dividerColor">Cor</Label>
        <div className="flex gap-2">
          <Input
            id="dividerColor"
            type="color"
            value={block.content.dividerColor || "#B89B7A"}
            onChange={(e) => updateContent("dividerColor", e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={block.content.dividerColor || "#B89B7A"}
            onChange={(e) => updateContent("dividerColor", e.target.value)}
            placeholder="#B89B7A"
            className="flex-1"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Espessura: {block.content.dividerThickness || 1}px</Label>
        <Slider
          value={[block.content.dividerThickness || 1]}
          min={1}
          max={10}
          step={1}
          onValueChange={([value]) => updateContent("dividerThickness", value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Largura: {block.content.dividerWidth || 100}%</Label>
        <Slider
          value={[block.content.dividerWidth || 100]}
          min={10}
          max={100}
          step={5}
          onValueChange={([value]) => updateContent("dividerWidth", value)}
        />
      </div>
      {renderGlobalStyleControls({ showBackground: true })}
    </>
  );

  const renderStyleResultProperties = () => (
    <>
      {renderScaleControl()}
      <div className="flex items-center justify-between">
        <Label htmlFor="showPercentage">Mostrar Porcentagem</Label>
        <Switch
          id="showPercentage"
          checked={block.content.showPercentage !== false}
          onCheckedChange={(checked) =>
            updateContent("showPercentage", checked)
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showDescription">Mostrar Descrição</Label>
        <Switch
          id="showDescription"
          checked={block.content.showDescription !== false}
          onCheckedChange={(checked) =>
            updateContent("showDescription", checked)
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={block.content.layout || "stacked"}
          onValueChange={(value) => updateContent("layout", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stacked">Empilhado</SelectItem>
            <SelectItem value="side-by-side">Lado a Lado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Tamanho da Imagem</Label>
        <Select
          value={block.content.styleImageSize || "lg"}
          onValueChange={(value) => updateContent("styleImageSize", value)}
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
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  const renderSecondaryStylesProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label>Quantidade Máxima</Label>
        <Select
          value={String(block.content.maxSecondaryStyles || 3)}
          onValueChange={(value) =>
            updateContent("maxSecondaryStyles", parseInt(value))
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
        <Label htmlFor="showSecondaryPercentage">Mostrar Porcentagem</Label>
        <Switch
          id="showSecondaryPercentage"
          checked={block.content.showSecondaryPercentage !== false}
          onCheckedChange={(checked) =>
            updateContent("showSecondaryPercentage", checked)
          }
        />
      </div>
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  const renderPriceAnchorProperties = () => {
    const priceItems = block.content.priceItems || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label htmlFor="finalPrice">Preço Final</Label>
          <Input
            id="finalPrice"
            type="number"
            value={block.content.finalPrice || 39}
            onChange={(e) =>
              updateContent("finalPrice", parseFloat(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalOriginal">Preço Original Total</Label>
          <Input
            id="totalOriginal"
            type="number"
            value={block.content.totalOriginal || 175}
            onChange={(e) =>
              updateContent("totalOriginal", parseFloat(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountBadge">Badge de Desconto</Label>
          <Input
            id="discountBadge"
            value={block.content.discountBadge || ""}
            onChange={(e) => updateContent("discountBadge", e.target.value)}
            placeholder="-78%"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moeda</Label>
          <Input
            id="currency"
            value={block.content.currency || "R$"}
            onChange={(e) => updateContent("currency", e.target.value)}
            placeholder="R$"
          />
        </div>

        {/* Editor de Itens de Preço */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Itens de Preço ({priceItems.length})
          </Label>

          {priceItems.map(
            (
              item: { id: string; label: string; originalPrice: number },
              idx: number
            ) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Item {idx + 1}
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const newItems = priceItems.filter(
                          (_: unknown, i: number) => i !== idx
                        );
                        updateContent("priceItems", newItems);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <Input
                    value={item.label || ""}
                    onChange={(e) => {
                      const newItems = [...priceItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        label: e.target.value,
                      };
                      updateContent("priceItems", newItems);
                    }}
                    placeholder="Nome do item (ex: Guia de Estilo)"
                  />

                  <Input
                    type="number"
                    value={item.originalPrice || 0}
                    onChange={(e) => {
                      const newItems = [...priceItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        originalPrice: parseFloat(e.target.value),
                      };
                      updateContent("priceItems", newItems);
                    }}
                    placeholder="Preço original"
                  />
                </div>
              </Card>
            )
          )}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [
                ...priceItems,
                {
                  id: uuidv4(),
                  label: "",
                  originalPrice: 0,
                },
              ];
              updateContent("priceItems", newItems);
            }}
          >
            + Adicionar Item de Preço
          </button>
        </div>

        {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
      </>
    );
  };

  const renderCountdownProperties = () => (
    <>
      {renderScaleControl()}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <Label htmlFor="hours">Horas</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            max="23"
            value={block.content.hours ?? 2}
            onChange={(e) => updateContent("hours", parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minutes">Min</Label>
          <Input
            id="minutes"
            type="number"
            min="0"
            max="59"
            value={block.content.minutes ?? 47}
            onChange={(e) => updateContent("minutes", parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seconds">Seg</Label>
          <Input
            id="seconds"
            type="number"
            min="0"
            max="59"
            value={block.content.seconds ?? 33}
            onChange={(e) => updateContent("seconds", parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Estilo</Label>
        <Select
          value={block.content.countdownVariant || "dramatic"}
          onValueChange={(value) => updateContent("countdownVariant", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dramatic">Dramático</SelectItem>
            <SelectItem value="simple">Simples</SelectItem>
            <SelectItem value="minimal">Mínimo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryMessage">Mensagem</Label>
        <Input
          id="expiryMessage"
          value={block.content.expiryMessage || ""}
          onChange={(e) => updateContent("expiryMessage", e.target.value)}
          placeholder="Esta oferta expira..."
        />
      </div>

      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  const renderCtaOfferProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="ctaText">Texto do Botão</Label>
        <Input
          id="ctaText"
          value={block.content.ctaText || ""}
          onChange={(e) => updateContent("ctaText", e.target.value)}
          placeholder="GARANTIR MEU GUIA AGORA"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctaUrl">URL do Checkout</Label>
        <Input
          id="ctaUrl"
          value={block.content.ctaUrl || ""}
          onChange={(e) => updateContent("ctaUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label>Cor do Botão</Label>
        <Select
          value={block.content.ctaVariant || "green"}
          onValueChange={(value) => updateContent("ctaVariant", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="green">Verde</SelectItem>
            <SelectItem value="brand">Marca</SelectItem>
            <SelectItem value="gradient">Gradiente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="urgencyText">Texto de Urgência</Label>
        <Input
          id="urgencyText"
          value={block.content.urgencyText || ""}
          onChange={(e) => updateContent("urgencyText", e.target.value)}
          placeholder="Preço pode aumentar..."
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showCtaIcon">Mostrar Ícone</Label>
        <Switch
          id="showCtaIcon"
          checked={block.content.showCtaIcon !== false}
          onCheckedChange={(checked) => updateContent("showCtaIcon", checked)}
        />
      </div>

      {renderGlobalStyleControls({
        showBackground: false,
        showText: false,
        showAccent: true,
        showBorder: true,
      })}
    </>
  );

  const renderGuaranteeProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="guaranteeDays">Dias de Garantia</Label>
        <Input
          id="guaranteeDays"
          type="number"
          value={block.content.guaranteeDays || 7}
          onChange={(e) =>
            updateContent("guaranteeDays", parseInt(e.target.value))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guaranteeTitle">Título</Label>
        <Input
          id="guaranteeTitle"
          value={block.content.guaranteeTitle || ""}
          onChange={(e) => updateContent("guaranteeTitle", e.target.value)}
          placeholder="7 Dias de Garantia..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guaranteeDescription">Descrição</Label>
        <Textarea
          id="guaranteeDescription"
          value={block.content.guaranteeDescription || ""}
          onChange={(e) =>
            updateContent("guaranteeDescription", e.target.value)
          }
          placeholder="Se você não ficar satisfeita..."
          rows={3}
        />
      </div>

      {/* Subtítulo */}
      <div className="space-y-2">
        <Label htmlFor="guaranteeSubtitle">Subtítulo</Label>
        <Input
          id="guaranteeSubtitle"
          value={block.content.guaranteeSubtitle || ""}
          onChange={(e) => updateContent("guaranteeSubtitle", e.target.value)}
          placeholder="Risco Zero"
        />
      </div>

      {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
    </>
  );

  const renderTestimonialProperties = () => {
    const testimonial = block.content.testimonial || {
      id: "",
      name: "",
      role: "",
      text: "",
      imageUrl: "",
      rating: 5,
    };

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label>Estilo</Label>
          <Select
            value={block.content.testimonialVariant || "card"}
            onValueChange={(value) =>
              updateContent("testimonialVariant", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Cartão</SelectItem>
              <SelectItem value="quote">Citação</SelectItem>
              <SelectItem value="minimal">Mínimo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Editor do Depoimento */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Conteúdo do Depoimento
          </Label>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={testimonial.name || ""}
              onChange={(e) =>
                updateContent("testimonial", {
                  ...testimonial,
                  name: e.target.value,
                })
              }
              placeholder="Nome da cliente"
            />
          </div>

          <div className="space-y-2">
            <Label>Cargo/Descrição</Label>
            <Input
              value={testimonial.role || ""}
              onChange={(e) =>
                updateContent("testimonial", {
                  ...testimonial,
                  role: e.target.value,
                })
              }
              placeholder="Ex: Cliente há 2 anos"
            />
          </div>

          <div className="space-y-2">
            <Label>Depoimento</Label>
            <Textarea
              value={testimonial.text || ""}
              onChange={(e) =>
                updateContent("testimonial", {
                  ...testimonial,
                  text: e.target.value,
                })
              }
              placeholder="O que a cliente disse..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>URL da Foto</Label>
            <Input
              value={testimonial.imageUrl || ""}
              onChange={(e) =>
                updateContent("testimonial", {
                  ...testimonial,
                  imageUrl: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Avaliação (1-5)</Label>
            <Select
              value={String(testimonial.rating || 5)}
              onValueChange={(value) =>
                updateContent("testimonial", {
                  ...testimonial,
                  rating: parseInt(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 estrela</SelectItem>
                <SelectItem value="2">2 estrelas</SelectItem>
                <SelectItem value="3">3 estrelas</SelectItem>
                <SelectItem value="4">4 estrelas</SelectItem>
                <SelectItem value="5">5 estrelas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
      </>
    );
  };

  const renderBenefitsListProperties = () => {
    const benefits = block.content.benefits || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label>Layout</Label>
          <Select
            value={block.content.benefitsLayout || "list"}
            onValueChange={(value) => updateContent("benefitsLayout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">Lista</SelectItem>
              <SelectItem value="grid">Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {block.content.benefitsLayout === "grid" && (
          <div className="space-y-2">
            <Label>Colunas</Label>
            <Select
              value={String(block.content.benefitsColumns || 2)}
              onValueChange={(value) =>
                updateContent("benefitsColumns", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Coluna</SelectItem>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label htmlFor="showBenefitIcons">Mostrar Ícones</Label>
          <Switch
            id="showBenefitIcons"
            checked={block.content.showBenefitIcons !== false}
            onCheckedChange={(checked) =>
              updateContent("showBenefitIcons", checked)
            }
          />
        </div>

        {/* Editor de Benefícios */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Benefícios ({benefits.length})
          </Label>

          {benefits.map(
            (
              item: {
                id: string;
                title: string;
                description?: string;
                icon?: string;
              },
              idx: number
            ) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Benefício {idx + 1}
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const newItems = benefits.filter(
                          (_: unknown, i: number) => i !== idx
                        );
                        updateContent("benefits", newItems);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <Input
                    value={item.title || ""}
                    onChange={(e) => {
                      const newItems = [...benefits];
                      newItems[idx] = {
                        ...newItems[idx],
                        title: e.target.value,
                      };
                      updateContent("benefits", newItems);
                    }}
                    placeholder="Título do benefício"
                  />

                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => {
                      const newItems = [...benefits];
                      newItems[idx] = {
                        ...newItems[idx],
                        description: e.target.value,
                      };
                      updateContent("benefits", newItems);
                    }}
                    placeholder="Descrição (opcional)"
                    rows={2}
                  />

                  <Select
                    value={item.icon || "check"}
                    onValueChange={(value) => {
                      const newItems = [...benefits];
                      newItems[idx] = { ...newItems[idx], icon: value };
                      updateContent("benefits", newItems);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="check">✓ Check</SelectItem>
                      <SelectItem value="star">★ Estrela</SelectItem>
                      <SelectItem value="heart">♥ Coração</SelectItem>
                      <SelectItem value="arrow">→ Seta</SelectItem>
                      <SelectItem value="sparkle">✨ Brilho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            )
          )}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [
                ...benefits,
                {
                  id: uuidv4(),
                  title: "",
                  description: "",
                  icon: "check",
                },
              ];
              updateContent("benefits", newItems);
            }}
          >
            + Adicionar Benefício
          </button>
        </div>

        {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
      </>
    );
  };

  const renderFaqProperties = () => {
    const faqItems = block.content.faqItems || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label>Estilo</Label>
          <Select
            value={block.content.faqStyle || "accordion"}
            onValueChange={(value) => updateContent("faqStyle", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accordion">Acordeão</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Editor de FAQ */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Perguntas e Respostas ({faqItems.length})
          </Label>

          {faqItems.map(
            (
              item: { id: string; question: string; answer: string },
              idx: number
            ) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">FAQ {idx + 1}</Label>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const newItems = faqItems.filter(
                          (_: unknown, i: number) => i !== idx
                        );
                        updateContent("faqItems", newItems);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <Input
                    value={item.question || ""}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        question: e.target.value,
                      };
                      updateContent("faqItems", newItems);
                    }}
                    placeholder="Pergunta"
                  />

                  <Textarea
                    value={item.answer || ""}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        answer: e.target.value,
                      };
                      updateContent("faqItems", newItems);
                    }}
                    placeholder="Resposta"
                    rows={3}
                  />
                </div>
              </Card>
            )
          )}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [
                ...faqItems,
                {
                  id: uuidv4(),
                  question: "",
                  answer: "",
                },
              ];
              updateContent("faqItems", newItems);
            }}
          >
            + Adicionar Pergunta
          </button>
        </div>

        {renderGlobalStyleControls({ showBackground: true })}
      </>
    );
  };

  const renderSocialProofProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="socialProofText">Texto</Label>
        <Input
          id="socialProofText"
          value={block.content.socialProofText || ""}
          onChange={(e) => updateContent("socialProofText", e.target.value)}
          placeholder="+3.000 mulheres..."
        />
      </div>
      <div className="space-y-2">
        <Label>Ícone</Label>
        <Select
          value={block.content.socialProofIcon || "users"}
          onValueChange={(value) => updateContent("socialProofIcon", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="users">Usuários</SelectItem>
            <SelectItem value="star">Estrela</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="heart">Coração</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Variante</Label>
        <Select
          value={block.content.socialProofVariant || "badge"}
          onValueChange={(value) => updateContent("socialProofVariant", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="badge">Badge</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="minimal">Mínimo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  const renderStyleProgressProperties = () => (
    <>
      {renderScaleControl()}
      <div className="flex items-center justify-between">
        <Label htmlFor="showLabels">Mostrar Rótulos</Label>
        <Switch
          id="showLabels"
          checked={block.content.showLabels !== false}
          onCheckedChange={(checked) => updateContent("showLabels", checked)}
        />
      </div>
      <div className="space-y-2">
        <Label>Estilos Mostrados</Label>
        <Select
          value={String(block.content.maxStylesShown || 8)}
          onValueChange={(value) =>
            updateContent("maxStylesShown", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 estilos</SelectItem>
            <SelectItem value="6">6 estilos</SelectItem>
            <SelectItem value="8">8 estilos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  // === NOVOS BLOCOS DE RESULTADO ===

  const renderPersonalizedHookProperties = () => (
    <>
      {renderScaleControl()}
      {/* Configuração de Saudação Personalizada */}
      <div className="space-y-2 pb-3 mb-3 border-b border-muted">
        <Label className="text-muted-foreground text-xs uppercase">
          Saudação
        </Label>
        <div className="flex items-center justify-between">
          <Label htmlFor="showGreeting">Exibir saudação com nome</Label>
          <Switch
            id="showGreeting"
            checked={block.content.showGreeting !== false}
            onCheckedChange={(checked) =>
              updateContent("showGreeting", checked)
            }
          />
        </div>
        {block.content.showGreeting !== false && (
          <>
            <div className="space-y-1">
              <Label htmlFor="greetingTemplate">Modelo de saudação</Label>
              <Input
                id="greetingTemplate"
                value={block.content.greetingTemplate || "Olá, {nome}!"}
                onChange={(e) =>
                  updateContent("greetingTemplate", e.target.value)
                }
                placeholder="Olá, {nome}!"
              />
              <p className="text-xs text-muted-foreground">
                Use {"{nome}"} para inserir o nome do usuário
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="greetingSubtitle">Subtítulo da saudação</Label>
              <Input
                id="greetingSubtitle"
                value={
                  block.content.greetingSubtitle || "Seu Estilo Predominante é:"
                }
                onChange={(e) =>
                  updateContent("greetingSubtitle", e.target.value)
                }
                placeholder="Seu Estilo Predominante é:"
              />
            </div>
          </>
        )}
      </div>

      {/* Configuração do Gancho */}
      <div className="space-y-2">
        <Label htmlFor="hookTitle">Título do Gancho</Label>
        <Textarea
          id="hookTitle"
          value={block.content.hookTitle || ""}
          onChange={(e) => updateContent("hookTitle", e.target.value)}
          placeholder="Seu estilo revela..."
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hookSubtitle">Subtítulo</Label>
        <Textarea
          id="hookSubtitle"
          value={block.content.hookSubtitle || ""}
          onChange={(e) => updateContent("hookSubtitle", e.target.value)}
          placeholder="Você valoriza..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Estilo Visual</Label>
        <Select
          value={block.content.hookStyle || "elegant"}
          onValueChange={(value) => updateContent("hookStyle", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="elegant">Elegante</SelectItem>
            <SelectItem value="bold">Bold (Escuro)</SelectItem>
            <SelectItem value="minimal">Minimalista</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showCta">Mostrar CTA</Label>
        <Switch
          id="showCta"
          checked={block.content.showCta || false}
          onCheckedChange={(checked) => updateContent("showCta", checked)}
        />
      </div>

      {renderGlobalStyleControls({
        showBackground: true,
        showText: true,
        showAccent: true,
      })}
    </>
  );

  const renderStyleGuideProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="guideImageUrl">URL da Imagem do Guia</Label>
        <Input
          id="guideImageUrl"
          value={block.content.imageUrl || ""}
          onChange={(e) => updateContent("imageUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label>Tamanho da Imagem</Label>
        <Select
          value={block.content.guideImageSize || "lg"}
          onValueChange={(value) => updateContent("guideImageSize", value)}
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
      <div className="flex items-center justify-between">
        <Label htmlFor="showSecondaryGuides">Mostrar Guias Secundários</Label>
        <Switch
          id="showSecondaryGuides"
          checked={block.content.showSecondaryGuides !== false}
          onCheckedChange={(checked) =>
            updateContent("showSecondaryGuides", checked)
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showExclusiveBadge">Mostrar Badge "Exclusivo"</Label>
        <Switch
          id="showExclusiveBadge"
          checked={block.content.showExclusiveBadge !== false}
          onCheckedChange={(checked) =>
            updateContent("showExclusiveBadge", checked)
          }
        />
      </div>

      {renderGlobalStyleControls({
        showBackground: true,
        showAccent: true,
        showBorder: true,
      })}
    </>
  );

  const renderBeforeAfterProperties = () => {
    const items = block.content.beforeAfterItems || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label htmlFor="beforeAfterTitle">Título da Seção</Label>
          <Input
            id="beforeAfterTitle"
            value={block.content.beforeAfterTitle || ""}
            onChange={(e) => updateContent("beforeAfterTitle", e.target.value)}
            placeholder="Transformações Reais"
          />
        </div>
        <div className="space-y-2">
          <Label>Layout</Label>
          <Select
            value={block.content.beforeAfterLayout || "side-by-side"}
            onValueChange={(value) => updateContent("beforeAfterLayout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="side-by-side">Lado a Lado</SelectItem>
              <SelectItem value="stacked">Empilhado</SelectItem>
              <SelectItem value="slider">Slider</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Editor de Transformações */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Transformações ({items.length})
          </Label>

          {items.map(
            (
              item: {
                id: string;
                beforeImage: string;
                afterImage: string;
                name?: string;
                description?: string;
              },
              idx: number
            ) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Transformação {idx + 1}
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const newItems = items.filter(
                          (_: unknown, i: number) => i !== idx
                        );
                        updateContent("beforeAfterItems", newItems);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <Input
                    value={item.name || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx] = {
                        ...newItems[idx],
                        name: e.target.value,
                      };
                      updateContent("beforeAfterItems", newItems);
                    }}
                    placeholder="Nome da cliente"
                  />

                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx] = {
                        ...newItems[idx],
                        description: e.target.value,
                      };
                      updateContent("beforeAfterItems", newItems);
                    }}
                    placeholder="Descrição da transformação"
                    rows={2}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Imagem Antes</Label>
                      <Input
                        value={item.beforeImage || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx] = {
                            ...newItems[idx],
                            beforeImage: e.target.value,
                          };
                          updateContent("beforeAfterItems", newItems);
                        }}
                        placeholder="URL da imagem"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Imagem Depois</Label>
                      <Input
                        value={item.afterImage || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx] = {
                            ...newItems[idx],
                            afterImage: e.target.value,
                          };
                          updateContent("beforeAfterItems", newItems);
                        }}
                        placeholder="URL da imagem"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          )}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [
                ...items,
                {
                  id: uuidv4(),
                  beforeImage: "",
                  afterImage: "",
                  name: "",
                  description: "",
                },
              ];
              updateContent("beforeAfterItems", newItems);
            }}
          >
            + Adicionar Transformação
          </button>
        </div>
        {renderGlobalStyleControls({
          showBackground: true,
          showText: true,
          showAccent: true,
        })}
      </>
    );
  };

  // === NOVOS BLOCOS DE VENDAS ===

  const renderMotivationProperties = () => {
    const motivationPoints = block.content.motivationPoints || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label htmlFor="motivationTitle">Título</Label>
          <Input
            id="motivationTitle"
            value={block.content.motivationTitle || ""}
            onChange={(e) => updateContent("motivationTitle", e.target.value)}
            placeholder="Por Que Conhecer Seu Estilo..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motivationSubtitle">Subtítulo</Label>
          <Textarea
            id="motivationSubtitle"
            value={block.content.motivationSubtitle || ""}
            onChange={(e) =>
              updateContent("motivationSubtitle", e.target.value)
            }
            placeholder="Seu estilo é uma ferramenta poderosa..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motivationImageUrl">URL da Imagem (opcional)</Label>
          <Input
            id="motivationImageUrl"
            value={block.content.motivationImageUrl || ""}
            onChange={(e) =>
              updateContent("motivationImageUrl", e.target.value)
            }
            placeholder="https://..."
          />
        </div>

        {/* Editor de Pontos Motivacionais */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Pontos Motivacionais ({motivationPoints.length})
          </Label>

          {motivationPoints.map((point: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={point}
                onChange={(e) => {
                  const newItems = [...motivationPoints];
                  newItems[idx] = e.target.value;
                  updateContent("motivationPoints", newItems);
                }}
                placeholder={`Ponto ${idx + 1}`}
                className="flex-1"
              />
              <button
                type="button"
                className="px-2 text-xs text-destructive hover:bg-destructive/10 rounded"
                onClick={() => {
                  const newItems = motivationPoints.filter(
                    (_: unknown, i: number) => i !== idx
                  );
                  updateContent("motivationPoints", newItems);
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [...motivationPoints, ""];
              updateContent("motivationPoints", newItems);
            }}
          >
            + Adicionar Ponto
          </button>
        </div>

        {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
      </>
    );
  };

  const renderBonusProperties = () => {
    const bonusItems = block.content.bonusItems || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label htmlFor="bonusTitle">Título</Label>
          <Input
            id="bonusTitle"
            value={block.content.bonusTitle || ""}
            onChange={(e) => updateContent("bonusTitle", e.target.value)}
            placeholder="Bônus Exclusivos"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonusSubtitle">Subtítulo</Label>
          <Input
            id="bonusSubtitle"
            value={block.content.bonusSubtitle || ""}
            onChange={(e) => updateContent("bonusSubtitle", e.target.value)}
            placeholder="Além do Guia Principal..."
          />
        </div>

        {/* Editor de Bônus */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Itens de Bônus ({bonusItems.length})
          </Label>

          {bonusItems.map(
            (
              item: {
                id: string;
                title: string;
                description?: string;
                imageUrl?: string;
                value?: string;
              },
              idx: number
            ) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Bônus {idx + 1}
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const newItems = bonusItems.filter(
                          (_: unknown, i: number) => i !== idx
                        );
                        updateContent("bonusItems", newItems);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <Input
                    value={item.title || ""}
                    onChange={(e) => {
                      const newItems = [...bonusItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        title: e.target.value,
                      };
                      updateContent("bonusItems", newItems);
                    }}
                    placeholder="Título do bônus"
                  />

                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => {
                      const newItems = [...bonusItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        description: e.target.value,
                      };
                      updateContent("bonusItems", newItems);
                    }}
                    placeholder="Descrição"
                    rows={2}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={item.imageUrl || ""}
                      onChange={(e) => {
                        const newItems = [...bonusItems];
                        newItems[idx] = {
                          ...newItems[idx],
                          imageUrl: e.target.value,
                        };
                        updateContent("bonusItems", newItems);
                      }}
                      placeholder="URL da imagem"
                    />
                    <Input
                      value={item.value || ""}
                      onChange={(e) => {
                        const newItems = [...bonusItems];
                        newItems[idx] = {
                          ...newItems[idx],
                          value: e.target.value,
                        };
                        updateContent("bonusItems", newItems);
                      }}
                      placeholder="Valor (ex: R$97)"
                    />
                  </div>
                </div>
              </Card>
            )
          )}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [
                ...bonusItems,
                {
                  id: uuidv4(),
                  title: "",
                  description: "",
                  imageUrl: "",
                  value: "",
                },
              ];
              updateContent("bonusItems", newItems);
            }}
          >
            + Adicionar Bônus
          </button>
        </div>

        {/* Mobile Layout Controls */}
        <div className="space-y-2 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Layout Mobile
          </Label>
          <Select
            value={block.content.mobileLayout || "stacked"}
            onValueChange={(value) => updateContent("mobileLayout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stacked">Empilhado (1 coluna)</SelectItem>
              <SelectItem value="side-by-side">
                Lado a lado (2 colunas)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Como os bônus aparecem em celulares
          </p>
        </div>

        {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
      </>
    );
  };

  const renderTestimonialsProperties = () => {
    const testimonials = block.content.testimonials || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label htmlFor="testimonialsTitle">Título</Label>
          <Input
            id="testimonialsTitle"
            value={block.content.testimonialsTitle || ""}
            onChange={(e) => updateContent("testimonialsTitle", e.target.value)}
            placeholder="O Que Nossas Alunas Dizem"
          />
        </div>
        <div className="space-y-2">
          <Label>Layout</Label>
          <Select
            value={block.content.testimonialsLayout || "grid"}
            onValueChange={(value) =>
              updateContent("testimonialsLayout", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grade</SelectItem>
              <SelectItem value="carousel">Carrossel</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Editor de Depoimentos */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Depoimentos ({testimonials.length})
          </Label>

          {testimonials.map(
            (
              item: {
                id: string;
                name: string;
                role?: string;
                text: string;
                imageUrl?: string;
                rating?: number;
              },
              idx: number
            ) => (
              <Card key={item.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Depoimento {idx + 1}
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => {
                        const newItems = testimonials.filter(
                          (_: unknown, i: number) => i !== idx
                        );
                        updateContent("testimonials", newItems);
                      }}
                    >
                      Remover
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={item.name || ""}
                      onChange={(e) => {
                        const newItems = [...testimonials];
                        newItems[idx] = {
                          ...newItems[idx],
                          name: e.target.value,
                        };
                        updateContent("testimonials", newItems);
                      }}
                      placeholder="Nome"
                    />
                    <Input
                      value={item.role || ""}
                      onChange={(e) => {
                        const newItems = [...testimonials];
                        newItems[idx] = {
                          ...newItems[idx],
                          role: e.target.value,
                        };
                        updateContent("testimonials", newItems);
                      }}
                      placeholder="Cargo/Descrição"
                    />
                  </div>

                  <Textarea
                    value={item.text || ""}
                    onChange={(e) => {
                      const newItems = [...testimonials];
                      newItems[idx] = {
                        ...newItems[idx],
                        text: e.target.value,
                      };
                      updateContent("testimonials", newItems);
                    }}
                    placeholder="Depoimento"
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={item.imageUrl || ""}
                      onChange={(e) => {
                        const newItems = [...testimonials];
                        newItems[idx] = {
                          ...newItems[idx],
                          imageUrl: e.target.value,
                        };
                        updateContent("testimonials", newItems);
                      }}
                      placeholder="URL da foto"
                    />
                    <Select
                      value={String(item.rating || 5)}
                      onValueChange={(value) => {
                        const newItems = [...testimonials];
                        newItems[idx] = {
                          ...newItems[idx],
                          rating: parseInt(value),
                        };
                        updateContent("testimonials", newItems);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Avaliação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 ★</SelectItem>
                        <SelectItem value="2">2 ★</SelectItem>
                        <SelectItem value="3">3 ★</SelectItem>
                        <SelectItem value="4">4 ★</SelectItem>
                        <SelectItem value="5">5 ★</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )
          )}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [
                ...testimonials,
                {
                  id: uuidv4(),
                  name: "",
                  role: "",
                  text: "",
                  imageUrl: "",
                  rating: 5,
                },
              ];
              updateContent("testimonials", newItems);
            }}
          >
            + Adicionar Depoimento
          </button>
        </div>

        {/* Mobile Layout Controls */}
        <div className="space-y-2 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Layout Mobile
          </Label>
          <Select
            value={block.content.mobileLayout || "stacked"}
            onValueChange={(value) => updateContent("mobileLayout", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stacked">Empilhado (1 coluna)</SelectItem>
              <SelectItem value="side-by-side">
                Lado a lado (2+ colunas)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Como os depoimentos aparecem em celulares
          </p>
        </div>

        {renderGlobalStyleControls({ showBackground: true, showAccent: true })}
      </>
    );
  };

  const renderMentorProperties = () => (
    <>
      {renderScaleControl()}
      <div className="space-y-2">
        <Label htmlFor="mentorName">Nome da Mentora</Label>
        <Input
          id="mentorName"
          value={block.content.mentorName || ""}
          onChange={(e) => updateContent("mentorName", e.target.value)}
          placeholder="Gisele Galvão"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mentorTitle">Título/Cargo</Label>
        <Input
          id="mentorTitle"
          value={block.content.mentorTitle || ""}
          onChange={(e) => updateContent("mentorTitle", e.target.value)}
          placeholder="Consultora de Imagem & Estilo"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mentorDescription">Descrição</Label>
        <Textarea
          id="mentorDescription"
          value={block.content.mentorDescription || ""}
          onChange={(e) => updateContent("mentorDescription", e.target.value)}
          placeholder="Há mais de 10 anos ajudo mulheres..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mentorImageUrl">URL da Foto</Label>
        <Input
          id="mentorImageUrl"
          value={block.content.mentorImageUrl || ""}
          onChange={(e) => updateContent("mentorImageUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Mobile Layout Controls */}
      <div className="space-y-2 pt-3 border-t">
        <Label className="text-xs font-semibold text-muted-foreground uppercase">
          Layout Mobile
        </Label>
        <Select
          value={block.content.mobileLayout || "stacked"}
          onValueChange={(value) => updateContent("mobileLayout", value)}
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

      {block.content.mobileLayout !== "side-by-side" && (
        <div className="space-y-2">
          <Label>Posição da Foto (Mobile)</Label>
          <Select
            value={block.content.mentorImagePosition || "top"}
            onValueChange={(value) =>
              updateContent("mentorImagePosition", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Foto em cima</SelectItem>
              <SelectItem value="bottom">Foto embaixo</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Ordem da foto e texto no modo empilhado
          </p>
        </div>
      )}

      {renderGlobalStyleControls({
        showBackground: true,
        showAccent: true,
        showBorder: true,
      })}
    </>
  );

  const renderSecurePurchaseProperties = () => {
    const securityBadges = block.content.securityBadges || [];
    const paymentMethods = block.content.paymentMethods || [];

    return (
      <>
        {renderScaleControl()}
        <div className="space-y-2">
          <Label htmlFor="secureText">Texto de Segurança</Label>
          <Textarea
            id="secureText"
            value={block.content.secureText || ""}
            onChange={(e) => updateContent("secureText", e.target.value)}
            placeholder="Pagamento processado pela Hotmart..."
            rows={2}
          />
        </div>

        {/* Editor de Selos de Segurança */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Selos de Segurança ({securityBadges.length})
          </Label>

          {securityBadges.map((badge: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={badge}
                onChange={(e) => {
                  const newItems = [...securityBadges];
                  newItems[idx] = e.target.value;
                  updateContent("securityBadges", newItems);
                }}
                placeholder={`Selo ${idx + 1} (ex: Compra Segura)`}
                className="flex-1"
              />
              <button
                type="button"
                className="px-2 text-xs text-destructive hover:bg-destructive/10 rounded"
                onClick={() => {
                  const newItems = securityBadges.filter(
                    (_: unknown, i: number) => i !== idx
                  );
                  updateContent("securityBadges", newItems);
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [...securityBadges, ""];
              updateContent("securityBadges", newItems);
            }}
          >
            + Adicionar Selo
          </button>
        </div>

        {/* Editor de Formas de Pagamento */}
        <div className="space-y-3 pt-3 border-t">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">
            Formas de Pagamento ({paymentMethods.length})
          </Label>

          {paymentMethods.map((method: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={method}
                onChange={(e) => {
                  const newItems = [...paymentMethods];
                  newItems[idx] = e.target.value;
                  updateContent("paymentMethods", newItems);
                }}
                placeholder={`Método ${idx + 1} (ex: Cartão de Crédito)`}
                className="flex-1"
              />
              <button
                type="button"
                className="px-2 text-xs text-destructive hover:bg-destructive/10 rounded"
                onClick={() => {
                  const newItems = paymentMethods.filter(
                    (_: unknown, i: number) => i !== idx
                  );
                  updateContent("paymentMethods", newItems);
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="w-full py-2 text-sm border border-dashed rounded-md hover:bg-muted/50"
            onClick={() => {
              const newItems = [...paymentMethods, ""];
              updateContent("paymentMethods", newItems);
            }}
          >
            + Adicionar Método de Pagamento
          </button>
        </div>

        {renderGlobalStyleControls({ showBackground: true })}
      </>
    );
  };

  const renderProperties = () => {
    switch (block.type) {
      case "header":
        return renderHeaderProperties();
      case "heading":
        return renderHeadingProperties();
      case "text":
        return renderTextProperties();
      case "image":
        return renderImageProperties();
      case "input":
        return renderInputProperties();
      case "options":
        return renderOptionsProperties();
      case "button":
        return renderButtonProperties();
      case "spacer":
        return renderSpacerProperties();
      case "divider":
        return renderDividerProperties();
      // Blocos de Resultado
      case "styleResult":
        return renderStyleResultProperties();
      case "secondaryStyles":
        return renderSecondaryStylesProperties();
      case "styleProgress":
        return renderStyleProgressProperties();
      case "personalizedHook":
        return renderPersonalizedHookProperties();
      case "styleGuide":
        return renderStyleGuideProperties();
      case "beforeAfter":
        return renderBeforeAfterProperties();
      // Blocos de Oferta/Vendas
      case "priceAnchor":
        return renderPriceAnchorProperties();
      case "countdown":
        return renderCountdownProperties();
      case "ctaOffer":
        return renderCtaOfferProperties();
      case "testimonial":
        return renderTestimonialProperties();
      case "testimonials":
        return renderTestimonialsProperties();
      case "benefitsList":
        return renderBenefitsListProperties();
      case "guarantee":
        return renderGuaranteeProperties();
      case "faq":
        return renderFaqProperties();
      case "socialProof":
        return renderSocialProofProperties();
      case "motivation":
        return renderMotivationProperties();
      case "bonus":
        return renderBonusProperties();
      case "mentor":
        return renderMentorProperties();
      case "securePurchase":
        return renderSecurePurchaseProperties();
      default:
        return (
          <p className="text-sm text-muted-foreground">Bloco desconhecido</p>
        );
    }
  };

  // Compact mode renders just the properties without wrapper
  if (compact) {
    return <div className="space-y-4">{renderProperties()}</div>;
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
          <CardContent className="space-y-4">{renderProperties()}</CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
