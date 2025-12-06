import React, { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FunnelConfig,
  EMPTY_FUNNEL_CONFIG,
  DEFAULT_QUIZ_CONFIG,
} from "@/types/funnelConfig";
import { GeneralSettings } from "./settings/GeneralSettings";
import { SeoSettings } from "./settings/SeoSettings";
import { PixelSettings } from "./settings/PixelSettings";
import { UtmSettings } from "./settings/UtmSettings";
import { BrandingSettings } from "./settings/BrandingSettings";
import { AnalyticsSettings } from "./settings/AnalyticsSettings";
import { EffectsSettings } from "./settings/EffectsSettings";
import { ResultsSettings } from "./settings/ResultsSettings";
import { StyleCategoriesSettings } from "./settings/StyleCategoriesSettings";
import { toast } from "sonner";

interface FunnelSettingsPanelProps {
  funnelId: string;
  funnelName: string;
  funnelSlug: string;
  globalConfig?: FunnelConfig | null;
  onSave: (updates: {
    name?: string;
    slug?: string;
    global_config?: FunnelConfig;
  }) => void;
}

export const FunnelSettingsPanel: React.FC<FunnelSettingsPanelProps> = ({
  funnelId,
  funnelName,
  funnelSlug,
  globalConfig,
  onSave,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(funnelName);
  const [slug, setSlug] = useState(funnelSlug);
  const [config, setConfig] = useState<FunnelConfig>(() => {
    if (globalConfig && typeof globalConfig === "object") {
      // Merge com defaults, garantindo que styleCategories tenha valores se vazio
      const merged = { ...EMPTY_FUNNEL_CONFIG, ...globalConfig };
      // Se não tiver categorias de estilo, usa as do DEFAULT_QUIZ_CONFIG
      if (!merged.styleCategories || merged.styleCategories.length === 0) {
        merged.styleCategories = DEFAULT_QUIZ_CONFIG.styleCategories;
      }
      return merged;
    }
    return EMPTY_FUNNEL_CONFIG;
  });

  useEffect(() => {
    setName(funnelName);
    setSlug(funnelSlug);
    if (globalConfig && typeof globalConfig === "object") {
      const merged = { ...EMPTY_FUNNEL_CONFIG, ...globalConfig };
      // Se não tiver categorias de estilo, usa as do DEFAULT_QUIZ_CONFIG
      if (!merged.styleCategories || merged.styleCategories.length === 0) {
        merged.styleCategories = DEFAULT_QUIZ_CONFIG.styleCategories;
      }
      setConfig(merged);
    }
  }, [funnelName, funnelSlug, globalConfig]);

  const handleGeneralChange = (field: string, value: string) => {
    if (field === "name") setName(value);
    if (field === "slug") setSlug(value);
    if (field === "customDomain") {
      setConfig((prev) => ({ ...prev, customDomain: value }));
    }
  };

  const handleSave = () => {
    onSave({
      name,
      slug,
      global_config: config,
    });
    toast.success("Configurações salvas!");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Funil
          </SheetTitle>
        </SheetHeader>

        <Tabs
          defaultValue="general"
          className="flex flex-col h-[calc(100vh-140px)]"
        >
          <div className="mx-4 mt-4 space-y-2">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="general" className="text-xs">
                Geral
              </TabsTrigger>
              <TabsTrigger value="branding" className="text-xs">
                Visual
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">
                Efeitos
              </TabsTrigger>
              <TabsTrigger value="results" className="text-xs">
                Resultados
              </TabsTrigger>
              <TabsTrigger value="styles" className="text-xs">
                Estilos
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="seo" className="text-xs">
                SEO
              </TabsTrigger>
              <TabsTrigger value="pixel" className="text-xs">
                Pixel
              </TabsTrigger>
              <TabsTrigger value="utm" className="text-xs">
                UTM
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">
                Analytics
              </TabsTrigger>
              <div /> {/* Espaço vazio para manter grid */}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-4 py-4">
            <TabsContent value="general" className="mt-0">
              <GeneralSettings
                name={name}
                slug={slug}
                customDomain={config.customDomain}
                onChange={handleGeneralChange}
              />
            </TabsContent>

            <TabsContent value="seo" className="mt-0">
              <SeoSettings
                config={config.seo}
                onChange={(seo) => setConfig((prev) => ({ ...prev, seo }))}
              />
            </TabsContent>

            <TabsContent value="pixel" className="mt-0">
              <PixelSettings
                config={config.pixel}
                onChange={(pixel) => setConfig((prev) => ({ ...prev, pixel }))}
              />
            </TabsContent>

            <TabsContent value="utm" className="mt-0">
              <UtmSettings
                config={config.utm}
                onChange={(utm) => setConfig((prev) => ({ ...prev, utm }))}
              />
            </TabsContent>

            <TabsContent value="branding" className="mt-0">
              <BrandingSettings
                config={config.branding}
                onChange={(branding) =>
                  setConfig((prev) => ({ ...prev, branding }))
                }
              />
            </TabsContent>

            <TabsContent value="effects" className="mt-0">
              <EffectsSettings
                config={config.effects}
                onChange={(effects) =>
                  setConfig((prev) => ({ ...prev, effects }))
                }
              />
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              <ResultsSettings
                config={config.results}
                onChange={(results) =>
                  setConfig((prev) => ({ ...prev, results }))
                }
              />
            </TabsContent>

            <TabsContent value="styles" className="mt-0">
              <StyleCategoriesSettings
                categories={config.styleCategories}
                onChange={(styleCategories) =>
                  setConfig((prev) => ({ ...prev, styleCategories }))
                }
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsSettings
                config={config.analytics}
                onChange={(analytics) =>
                  setConfig((prev) => ({ ...prev, analytics }))
                }
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="p-4 border-t mt-auto">
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
