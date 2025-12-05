import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { getTransitionConfigFromEditor, getGlobalConfigFromEditor } from '@/utils/quizConfigAdapter';

interface MainTransitionProps {
  onProceedToStrategicQuestions: () => void;
}

export const MainTransition: React.FC<MainTransitionProps> = ({
  onProceedToStrategicQuestions,
}) => {
  // Load config from editor
  const transitionConfig = useMemo(() => getTransitionConfigFromEditor(), []);
  const globalConfig = useMemo(() => getGlobalConfigFromEditor(), []);
  
  // Get values from editor config or use defaults
  const title = transitionConfig?.title || 'Enquanto calculamos o seu resultado...';
  const subtitle = transitionConfig?.subtitle || 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.';
  const message = transitionConfig?.message || 'Responda com sinceridade. Isso é só entre você e a sua nova versão.';
  const primaryColor = globalConfig?.primaryColor || '#B89B7A';
  const secondaryColor = globalConfig?.secondaryColor || '#432818';

  return (
    <div className="min-h-screen bg-[#FAF9F7] px-4 py-10 flex items-start justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <Card className="p-8 space-y-8 bg-white shadow-lg border-[#B89B7A]/20 mb-10">
          <h2 
            className="text-2xl font-playfair text-center tracking-normal font-bold mt-4"
            style={{ color: secondaryColor }}
          >
            {title}
          </h2>
          
          <p className="text-[#1A1818]/90 text-lg">
            {subtitle.split(/(experiência|completa)/gi).map((part, index) => {
              if (part.toLowerCase() === 'experiência' || part.toLowerCase() === 'completa') {
                return <strong key={index} style={{ color: secondaryColor }}>{part}</strong>;
              }
              return part;
            })}
          </p>
          
          <p className="text-[#1A1818]/90 text-lg">
            A ideia é simples: te ajudar a enxergar com mais <strong style={{ color: secondaryColor }}>clareza</strong> onde você está agora — e para onde pode ir com mais <strong style={{ color: secondaryColor }}>intenção</strong>, <strong style={{ color: secondaryColor }}>leveza</strong> e <strong style={{ color: secondaryColor }}>autenticidade</strong>.
          </p>
          
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              background: `linear-gradient(to right, ${primaryColor}10, ${secondaryColor}10)`,
              borderColor: `${primaryColor}33`
            }}
          >
            <p 
              className="italic text-center font-medium text-lg"
              style={{ color: secondaryColor }}
            >
              {message.split(/(sinceridade|nova versão)/gi).map((part, index) => {
                if (part.toLowerCase() === 'sinceridade' || part.toLowerCase() === 'nova versão') {
                  return <strong key={index} className="not-italic" style={{ color: secondaryColor }}>{part}</strong>;
                }
                return part;
              })}
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              variant="default" 
              size="lg"
              onClick={onProceedToStrategicQuestions}
              className="text-white hover:opacity-90 focus:ring-2"
              style={{ 
                backgroundColor: primaryColor,
                '--tw-ring-color': primaryColor
              } as React.CSSProperties}
            >
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
