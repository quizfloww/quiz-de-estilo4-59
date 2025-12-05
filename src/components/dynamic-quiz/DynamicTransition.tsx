import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FunnelStage } from '@/hooks/usePublicFunnel';

interface DynamicTransitionProps {
  stage: FunnelStage;
  onContinue: () => void;
}

export const DynamicTransition: React.FC<DynamicTransitionProps> = ({
  stage,
  onContinue,
}) => {
  const config = stage.config || {};

  const title = config.title || stage.title || 'Enquanto calculamos o seu resultado...';
  const subtitle = config.subtitle || 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.';
  const message = config.message || 'Responda com sinceridade. Isso é só entre você e a sua nova versão.';
  const buttonText = config.buttonText || 'Continuar';
  const imageUrl = config.imageUrl || '';

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto items-center">
      {imageUrl && (
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Transição"
            className="object-cover w-full h-auto rounded-lg max-w-80"
          />
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-center">
        {title}
      </h1>

      {subtitle && (
        <p className="text-center text-muted-foreground">
          {subtitle}
        </p>
      )}

      {message && (
        <Card className="w-full bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-center text-sm italic">
              "{message}"
            </p>
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full h-14"
        onClick={onContinue}
      >
        {buttonText}
      </Button>
    </div>
  );
};
