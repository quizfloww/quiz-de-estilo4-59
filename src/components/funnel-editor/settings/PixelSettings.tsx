import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FunnelPixelConfig } from '@/types/funnelConfig';

interface PixelSettingsProps {
  config: FunnelPixelConfig;
  onChange: (config: FunnelPixelConfig) => void;
}

export const PixelSettings: React.FC<PixelSettingsProps> = ({ config, onChange }) => {
  const handleToggle = (field: keyof FunnelPixelConfig['trackEvents']) => {
    onChange({
      ...config,
      trackEvents: {
        ...config.trackEvents,
        [field]: !config.trackEvents[field],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Ativar Facebook Pixel</Label>
          <p className="text-xs text-muted-foreground">
            Habilitar rastreamento de eventos
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
        />
      </div>

      {config.enabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="pixel-id">Pixel ID</Label>
            <Input
              id="pixel-id"
              value={config.pixelId}
              onChange={(e) => onChange({ ...config, pixelId: e.target.value })}
              placeholder="123456789012345"
            />
            <p className="text-xs text-muted-foreground">
              Encontre o ID no Gerenciador de Eventos do Facebook
            </p>
          </div>

          <div className="space-y-3">
            <Label>Eventos para Rastrear</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">PageView</p>
                  <p className="text-xs text-muted-foreground">Visualização de página</p>
                </div>
                <Switch
                  checked={config.trackEvents.pageView}
                  onCheckedChange={() => handleToggle('pageView')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">QuizStart</p>
                  <p className="text-xs text-muted-foreground">Início do quiz</p>
                </div>
                <Switch
                  checked={config.trackEvents.quizStart}
                  onCheckedChange={() => handleToggle('quizStart')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">QuizProgress</p>
                  <p className="text-xs text-muted-foreground">Progresso (cada etapa)</p>
                </div>
                <Switch
                  checked={config.trackEvents.quizProgress}
                  onCheckedChange={() => handleToggle('quizProgress')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">QuizComplete</p>
                  <p className="text-xs text-muted-foreground">Conclusão do quiz</p>
                </div>
                <Switch
                  checked={config.trackEvents.quizComplete}
                  onCheckedChange={() => handleToggle('quizComplete')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">CTA Click</p>
                  <p className="text-xs text-muted-foreground">Clique em ofertas</p>
                </div>
                <Switch
                  checked={config.trackEvents.ctaClick}
                  onCheckedChange={() => handleToggle('ctaClick')}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
