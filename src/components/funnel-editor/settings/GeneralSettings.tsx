import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GeneralSettingsProps {
  name: string;
  slug: string;
  customDomain?: string;
  onChange: (field: string, value: string) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  name,
  slug,
  customDomain,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Funil</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex: Quiz de Estilo Pessoal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/quiz/</span>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="meu-quiz"
            className="flex-1"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          URL de acesso: /quiz/{slug || 'meu-quiz'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customDomain">Domínio Personalizado (opcional)</Label>
        <Input
          id="customDomain"
          value={customDomain || ''}
          onChange={(e) => onChange('customDomain', e.target.value)}
          placeholder="Ex: quiz.seudominio.com"
        />
        <p className="text-xs text-muted-foreground">
          Configure um domínio personalizado para este funil
        </p>
      </div>
    </div>
  );
};
