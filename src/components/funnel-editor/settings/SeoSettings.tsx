import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FunnelSeoConfig } from '@/types/funnelConfig';

interface SeoSettingsProps {
  config: FunnelSeoConfig;
  onChange: (config: FunnelSeoConfig) => void;
}

export const SeoSettings: React.FC<SeoSettingsProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof FunnelSeoConfig, value: string | string[]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="seo-title">Título da Página</Label>
        <Input
          id="seo-title"
          value={config.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Título para SEO"
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground">
          {config.title.length}/60 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-description">Meta Descrição</Label>
        <Textarea
          id="seo-description"
          value={config.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descrição para mecanismos de busca"
          maxLength={160}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {config.description.length}/160 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-keywords">Palavras-chave</Label>
        <Input
          id="seo-keywords"
          value={config.keywords.join(', ')}
          onChange={(e) => handleChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
          placeholder="estilo pessoal, moda, consultoria"
        />
        <p className="text-xs text-muted-foreground">
          Separe as palavras-chave por vírgulas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-og-image">Imagem Open Graph</Label>
        <Input
          id="seo-og-image"
          value={config.ogImage}
          onChange={(e) => handleChange('ogImage', e.target.value)}
          placeholder="https://..."
        />
        {config.ogImage && (
          <div className="mt-2 rounded-md overflow-hidden border">
            <img 
              src={config.ogImage} 
              alt="Preview OG" 
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Imagem exibida ao compartilhar nas redes sociais (1200x630px recomendado)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-favicon">Favicon (opcional)</Label>
        <Input
          id="seo-favicon"
          value={config.favicon || ''}
          onChange={(e) => handleChange('favicon', e.target.value)}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};
