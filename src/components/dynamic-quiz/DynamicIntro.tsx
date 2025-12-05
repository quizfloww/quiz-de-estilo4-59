import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FunnelStage } from '@/hooks/usePublicFunnel';

interface DynamicIntroProps {
  stage: FunnelStage;
  globalConfig: Record<string, any> | null;
  onContinue: (userName: string) => void;
}

export const DynamicIntro: React.FC<DynamicIntroProps> = ({
  stage,
  globalConfig,
  onContinue,
}) => {
  const [userName, setUserName] = useState('');
  const config = stage.config || {};

  const title = config.title || stage.title || 'Teste de Estilo Pessoal';
  const subtitle = config.subtitle || '';
  const imageUrl = config.imageUrl || '';
  const buttonText = config.buttonText || 'Continuar';
  const inputLabel = config.inputLabel || 'NOME';
  const inputPlaceholder = config.inputPlaceholder || 'Digite seu nome aqui...';
  const requireName = config.requireName !== false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireName && !userName.trim()) return;
    onContinue(userName.trim());
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center">{title}</h1>
      
      {subtitle && (
        <p className="text-center text-muted-foreground">{subtitle}</p>
      )}

      {imageUrl && (
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Imagem"
            className="object-cover w-full h-auto rounded-lg max-w-96"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {requireName && (
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="userName">
              {inputLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder={inputPlaceholder}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-base p-4"
              required
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-14 text-base"
          disabled={requireName && !userName.trim()}
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
};
