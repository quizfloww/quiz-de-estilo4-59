/**
 * BlockEditors - Editores inline para cada tipo de bloco
 *
 * Fornece interfaces de edição específicas para cada tipo de bloco,
 * garantindo uma experiência consistente e intuitiva.
 */

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CanvasBlock, CanvasBlockContent } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import type {
  FontSize,
  FontWeight,
  TextAlign,
  ImageSize,
  ImageAlignment,
  BorderRadiusStyle,
  ButtonVariant,
  DividerStyle,
  CtaVariant,
  CountdownVariant,
} from "./blockEditorConfig";

// ============================================
// Tipos
// ============================================

export interface BlockEditorProps {
  block: CanvasBlock;
  onChange: (updates: Partial<CanvasBlock>) => void;
  onClose: () => void;
}

// ============================================
// Helper para atualizar content
// ============================================

const useContentUpdater = (
  block: CanvasBlock,
  onChange: (updates: Partial<CanvasBlock>) => void
) => {
  return useCallback(
    (contentUpdates: Partial<CanvasBlockContent>) => {
      onChange({
        content: { ...block.content, ...contentUpdates },
      });
    },
    [block.content, onChange]
  );
};

// ============================================
// Editor de Heading
// ============================================

export const HeadingEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="heading-text">Texto do Título</Label>
        <Textarea
          id="heading-text"
          value={block.content.text || ""}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Digite o título..."
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tamanho</Label>
          <Select
            value={block.content.fontSize || "xl"}
            onValueChange={(value: FontSize) =>
              updateContent({ fontSize: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">Pequeno</SelectItem>
              <SelectItem value="lg">Médio</SelectItem>
              <SelectItem value="xl">Grande</SelectItem>
              <SelectItem value="2xl">Extra Grande</SelectItem>
              <SelectItem value="3xl">Muito Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Peso</Label>
          <Select
            value={block.content.fontWeight || "bold"}
            onValueChange={(value: FontWeight) =>
              updateContent({ fontWeight: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="semibold">Semi-bold</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Alinhamento</Label>
        <div className="flex gap-2">
          {["left", "center", "right"].map((align) => (
            <Button
              key={align}
              variant={
                block.content.textAlign === align ? "default" : "outline"
              }
              size="sm"
              onClick={() => updateContent({ textAlign: align as any })}
              className="flex-1 capitalize"
            >
              {align === "left"
                ? "Esquerda"
                : align === "center"
                ? "Centro"
                : "Direita"}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cor do Texto</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={block.content.textColor || "#000000"}
            onChange={(e) => updateContent({ textColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={block.content.textColor || "#000000"}
            onChange={(e) => updateContent({ textColor: e.target.value })}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// Editor de Text
// ============================================

export const TextEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-content">Conteúdo</Label>
        <Textarea
          id="text-content"
          value={block.content.text || ""}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Digite o texto..."
          className="min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tamanho</Label>
          <Select
            value={block.content.fontSize || "base"}
            onValueChange={(value) => updateContent({ fontSize: value as any })}
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
          <Label>Alinhamento</Label>
          <Select
            value={block.content.textAlign || "left"}
            onValueChange={(value) =>
              updateContent({ textAlign: value as any })
            }
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
      </div>
    </div>
  );
};

// ============================================
// Editor de Image
// ============================================

export const ImageEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-url">URL da Imagem</Label>
        <Input
          id="image-url"
          type="url"
          value={block.content.imageUrl || ""}
          onChange={(e) => updateContent({ imageUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-alt">Texto Alternativo</Label>
        <Input
          id="image-alt"
          value={block.content.imageAlt || ""}
          onChange={(e) => updateContent({ imageAlt: e.target.value })}
          placeholder="Descrição da imagem..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tamanho</Label>
          <Select
            value={block.content.imageSize || "md"}
            onValueChange={(value) =>
              updateContent({ imageSize: value as any })
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
              <SelectItem value="full">Largura Total</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Alinhamento</Label>
          <Select
            value={block.content.imageAlignment || "center"}
            onValueChange={(value) =>
              updateContent({ imageAlignment: value as any })
            }
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
      </div>

      <div className="space-y-2">
        <Label>Arredondamento</Label>
        <Select
          value={block.content.borderRadiusStyle || "md"}
          onValueChange={(value) =>
            updateContent({ borderRadiusStyle: value as any })
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
            <SelectItem value="full">Circular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// ============================================
// Editor de Button
// ============================================

export const ButtonEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="button-text">Texto do Botão</Label>
        <Input
          id="button-text"
          value={block.content.buttonText || ""}
          onChange={(e) => updateContent({ buttonText: e.target.value })}
          placeholder="Clique aqui"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="button-url">URL de Destino</Label>
        <Input
          id="button-url"
          type="url"
          value={block.content.buttonUrl || ""}
          onChange={(e) => updateContent({ buttonUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Estilo</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "primary", label: "Primário" },
            { value: "secondary", label: "Secundário" },
            { value: "outline", label: "Outline" },
            { value: "cta", label: "CTA" },
          ].map((style) => (
            <Button
              key={style.value}
              variant={
                block.content.buttonVariant === style.value
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                updateContent({ buttonVariant: style.value as any })
              }
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="button-fullwidth">Largura Total</Label>
        <Switch
          id="button-fullwidth"
          checked={block.content.fullWidth || false}
          onCheckedChange={(checked) => updateContent({ fullWidth: checked })}
        />
      </div>
    </div>
  );
};

// ============================================
// Editor de Spacer
// ============================================

export const SpacerEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);
  const heightValue = parseInt(block.content.height || "32", 10);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Altura do Espaçador</Label>
          <span className="text-sm text-muted-foreground">{heightValue}px</span>
        </div>
        <Slider
          value={[heightValue]}
          min={8}
          max={200}
          step={8}
          onValueChange={([value]) => updateContent({ height: `${value}px` })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>8px</span>
          <span>200px</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Editor de Divider
// ============================================

export const DividerEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Estilo</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "solid", label: "Sólido" },
            { value: "dashed", label: "Tracejado" },
            { value: "dotted", label: "Pontilhado" },
            { value: "elegant", label: "Elegante" },
          ].map((style) => (
            <Button
              key={style.value}
              variant={
                block.content.dividerStyle === style.value
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                updateContent({ dividerStyle: style.value as any })
              }
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={block.content.dividerColor || "#e5e7eb"}
            onChange={(e) => updateContent({ dividerColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={block.content.dividerColor || "#e5e7eb"}
            onChange={(e) => updateContent({ dividerColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Espessura</Label>
          <span className="text-sm text-muted-foreground">
            {block.content.dividerThickness || 1}px
          </span>
        </div>
        <Slider
          value={[block.content.dividerThickness || 1]}
          min={1}
          max={8}
          step={1}
          onValueChange={([value]) =>
            updateContent({ dividerThickness: value })
          }
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Largura</Label>
          <span className="text-sm text-muted-foreground">
            {block.content.dividerWidth || 100}%
          </span>
        </div>
        <Slider
          value={[block.content.dividerWidth || 100]}
          min={20}
          max={100}
          step={10}
          onValueChange={([value]) => updateContent({ dividerWidth: value })}
        />
      </div>
    </div>
  );
};

// ============================================
// Editor de CTA Offer
// ============================================

export const CtaOfferEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cta-text">Texto do CTA</Label>
        <Input
          id="cta-text"
          value={block.content.ctaText || ""}
          onChange={(e) => updateContent({ ctaText: e.target.value })}
          placeholder="QUERO MEU GUIA AGORA"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-url">URL de Destino</Label>
        <Input
          id="cta-url"
          type="url"
          value={block.content.ctaUrl || ""}
          onChange={(e) => updateContent({ ctaUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Estilo do Botão</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "green", label: "Verde" },
            { value: "brand", label: "Marca" },
            { value: "gradient", label: "Gradiente" },
          ].map((style) => (
            <Button
              key={style.value}
              variant={
                block.content.ctaVariant === style.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => updateContent({ ctaVariant: style.value as any })}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="urgency-text">Texto de Urgência (opcional)</Label>
        <Input
          id="urgency-text"
          value={block.content.urgencyText || ""}
          onChange={(e) => updateContent({ urgencyText: e.target.value })}
          placeholder="Oferta por tempo limitado!"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-icon">Mostrar Ícone</Label>
        <Switch
          id="show-icon"
          checked={block.content.showCtaIcon !== false}
          onCheckedChange={(checked) => updateContent({ showCtaIcon: checked })}
        />
      </div>
    </div>
  );
};

// ============================================
// Editor de Countdown
// ============================================

export const CountdownEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Horas</Label>
          <Input
            type="number"
            min={0}
            max={23}
            value={block.content.hours || 0}
            onChange={(e) =>
              updateContent({ hours: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Minutos</Label>
          <Input
            type="number"
            min={0}
            max={59}
            value={block.content.minutes || 15}
            onChange={(e) =>
              updateContent({ minutes: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Segundos</Label>
          <Input
            type="number"
            min={0}
            max={59}
            value={block.content.seconds || 0}
            onChange={(e) =>
              updateContent({ seconds: parseInt(e.target.value, 10) })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Estilo</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "dramatic", label: "Dramático" },
            { value: "simple", label: "Simples" },
            { value: "minimal", label: "Minimal" },
          ].map((style) => (
            <Button
              key={style.value}
              variant={
                block.content.countdownVariant === style.value
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                updateContent({ countdownVariant: style.value as any })
              }
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry-message">Mensagem ao Expirar</Label>
        <Input
          id="expiry-message"
          value={block.content.expiryMessage || ""}
          onChange={(e) => updateContent({ expiryMessage: e.target.value })}
          placeholder="Oferta expirada!"
        />
      </div>
    </div>
  );
};

// ============================================
// Editor de Guarantee
// ============================================

export const GuaranteeEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onClose,
}) => {
  const updateContent = useContentUpdater(block, onChange);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guarantee-days">Dias de Garantia</Label>
        <Input
          id="guarantee-days"
          type="number"
          min={1}
          value={block.content.guaranteeDays || 7}
          onChange={(e) =>
            updateContent({ guaranteeDays: parseInt(e.target.value, 10) })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guarantee-title">Título</Label>
        <Input
          id="guarantee-title"
          value={block.content.guaranteeTitle || ""}
          onChange={(e) => updateContent({ guaranteeTitle: e.target.value })}
          placeholder="Garantia Incondicional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guarantee-desc">Descrição</Label>
        <Textarea
          id="guarantee-desc"
          value={block.content.guaranteeDescription || ""}
          onChange={(e) =>
            updateContent({ guaranteeDescription: e.target.value })
          }
          placeholder="Se você não ficar satisfeita..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guarantee-image">URL da Imagem (opcional)</Label>
        <Input
          id="guarantee-image"
          type="url"
          value={block.content.guaranteeImageUrl || ""}
          onChange={(e) => updateContent({ guaranteeImageUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

// ============================================
// Mapeamento de Editores por Tipo
// ============================================

export const BLOCK_EDITORS: Partial<
  Record<string, React.FC<BlockEditorProps>>
> = {
  heading: HeadingEditor,
  text: TextEditor,
  image: ImageEditor,
  button: ButtonEditor,
  spacer: SpacerEditor,
  divider: DividerEditor,
  ctaOffer: CtaOfferEditor,
  countdown: CountdownEditor,
  guarantee: GuaranteeEditor,
};

/**
 * Retorna o editor apropriado para um tipo de bloco
 */
export const getBlockEditor = (
  blockType: string
): React.FC<BlockEditorProps> | null => {
  return BLOCK_EDITORS[blockType] || null;
};
