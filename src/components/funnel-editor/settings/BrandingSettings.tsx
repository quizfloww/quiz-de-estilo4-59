import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FunnelBrandingConfig } from "@/types/funnelConfig";

interface BrandingSettingsProps {
  config: FunnelBrandingConfig;
  onChange: (config: FunnelBrandingConfig) => void;
}

export const BrandingSettings: React.FC<BrandingSettingsProps> = ({
  config,
  onChange,
}) => {
  const handleChange = (
    field: keyof FunnelBrandingConfig,
    value: string | number
  ) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Logo</Label>

        <div className="space-y-2">
          <Label htmlFor="logo-url" className="text-xs text-muted-foreground">
            URL do Logo
          </Label>
          <Input
            id="logo-url"
            value={config.logo}
            onChange={(e) => handleChange("logo", e.target.value)}
            placeholder="https://..."
          />
        </div>

        {config.logo && (
          <div className="p-4 rounded-md border bg-muted/20 flex justify-center">
            <img
              src={config.logo}
              alt={config.logoAlt || "Logo"}
              style={{ height: config.logoHeight }}
              className="object-contain"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="logo-alt" className="text-xs text-muted-foreground">
            Texto Alternativo
          </Label>
          <Input
            id="logo-alt"
            value={config.logoAlt}
            onChange={(e) => handleChange("logoAlt", e.target.value)}
            placeholder="Nome da marca"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Altura do Logo: {config.logoHeight}px
          </Label>
          <Slider
            value={[config.logoHeight]}
            onValueChange={([value]) => handleChange("logoHeight", value)}
            min={24}
            max={120}
            step={4}
          />
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Cores</Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="primary-color"
              className="text-xs text-muted-foreground"
            >
              Cor Primária
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="primary-color"
                value={config.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={config.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="secondary-color"
              className="text-xs text-muted-foreground"
            >
              Cor Secundária
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="secondary-color"
                value={config.secondaryColor}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={config.secondaryColor}
                onChange={(e) => handleChange("secondaryColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bg-color" className="text-xs text-muted-foreground">
              Cor de Fundo (Canvas/Páginas)
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="bg-color"
                value={config.backgroundColor}
                onChange={(e) =>
                  handleChange("backgroundColor", e.target.value)
                }
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) =>
                  handleChange("backgroundColor", e.target.value)
                }
                className="flex-1"
                placeholder="#FFFFFF"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Define a cor de fundo padrão do canvas e das páginas do funil
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="text-color"
              className="text-xs text-muted-foreground"
            >
              Cor do Texto
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="text-color"
                value={config.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={config.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preview</Label>
        <div
          className="p-6 rounded-md border"
          style={{ backgroundColor: config.backgroundColor }}
        >
          <p
            style={{ color: config.textColor }}
            className="text-lg font-semibold mb-2"
          >
            Título de Exemplo
          </p>
          <p
            style={{ color: config.textColor }}
            className="text-sm mb-4 opacity-80"
          >
            Texto de exemplo para visualizar as cores.
          </p>
          <button
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: config.primaryColor }}
          >
            Botão Primário
          </button>
        </div>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <Label htmlFor="font-family" className="text-xs text-muted-foreground">
          Fonte Personalizada (opcional)
        </Label>
        <Input
          id="font-family"
          value={config.fontFamily || ""}
          onChange={(e) => handleChange("fontFamily", e.target.value)}
          placeholder="Ex: Inter, Playfair Display"
        />
      </div>
    </div>
  );
};
