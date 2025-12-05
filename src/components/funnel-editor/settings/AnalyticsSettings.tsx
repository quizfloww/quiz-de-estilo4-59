import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FunnelAnalyticsConfig } from '@/types/funnelConfig';

interface AnalyticsSettingsProps {
  config: FunnelAnalyticsConfig;
  onChange: (config: FunnelAnalyticsConfig) => void;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof FunnelAnalyticsConfig, value: string) => {
    onChange({ ...config, [field]: value || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ga-id">Google Analytics ID</Label>
        <Input
          id="ga-id"
          value={config.googleAnalyticsId || ''}
          onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
          placeholder="G-XXXXXXXXXX ou UA-XXXXXXXX-X"
        />
        <p className="text-xs text-muted-foreground">
          ID de medição do Google Analytics 4 ou Universal Analytics
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
        <Input
          id="gtm-id"
          value={config.gtmId || ''}
          onChange={(e) => handleChange('gtmId', e.target.value)}
          placeholder="GTM-XXXXXXX"
        />
        <p className="text-xs text-muted-foreground">
          Container ID do Google Tag Manager
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hotjar-id">Hotjar ID</Label>
        <Input
          id="hotjar-id"
          value={config.hotjarId || ''}
          onChange={(e) => handleChange('hotjarId', e.target.value)}
          placeholder="1234567"
        />
        <p className="text-xs text-muted-foreground">
          Site ID do Hotjar para mapas de calor e gravações
        </p>
      </div>

      <div className="p-4 rounded-md bg-muted/50">
        <p className="text-sm font-medium mb-2">💡 Dica</p>
        <p className="text-xs text-muted-foreground">
          O Facebook Pixel pode ser configurado na aba "Pixel". 
          Eventos personalizados são disparados automaticamente durante o fluxo do quiz.
        </p>
      </div>
    </div>
  );
};
