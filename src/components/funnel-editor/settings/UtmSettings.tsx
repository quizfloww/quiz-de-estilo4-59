import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FunnelUtmConfig } from '@/types/funnelConfig';

interface UtmSettingsProps {
  config: FunnelUtmConfig;
  onChange: (config: FunnelUtmConfig) => void;
}

export const UtmSettings: React.FC<UtmSettingsProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Capturar UTMs</Label>
          <p className="text-xs text-muted-foreground">
            Salvar parâmetros UTM dos visitantes
          </p>
        </div>
        <Switch
          checked={config.captureEnabled}
          onCheckedChange={(checked) => onChange({ ...config, captureEnabled: checked })}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Valores Padrão (opcional)</p>
        <p className="text-xs text-muted-foreground">
          Usados quando o visitante não vem de uma campanha específica
        </p>

        <div className="space-y-2">
          <Label htmlFor="utm-source">UTM Source</Label>
          <Input
            id="utm-source"
            value={config.defaultSource || ''}
            onChange={(e) => onChange({ ...config, defaultSource: e.target.value })}
            placeholder="Ex: organic, direct"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm-medium">UTM Medium</Label>
          <Input
            id="utm-medium"
            value={config.defaultMedium || ''}
            onChange={(e) => onChange({ ...config, defaultMedium: e.target.value })}
            placeholder="Ex: website, referral"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm-campaign">UTM Campaign</Label>
          <Input
            id="utm-campaign"
            value={config.defaultCampaign || ''}
            onChange={(e) => onChange({ ...config, defaultCampaign: e.target.value })}
            placeholder="Ex: quiz_estilo_2024"
          />
        </div>
      </div>

      <div className="p-4 rounded-md bg-muted/50">
        <p className="text-sm font-medium mb-2">Exemplo de URL com UTMs:</p>
        <code className="text-xs text-muted-foreground break-all">
          /quiz/seu-quiz?utm_source=instagram&utm_medium=stories&utm_campaign=lancamento
        </code>
      </div>
    </div>
  );
};
