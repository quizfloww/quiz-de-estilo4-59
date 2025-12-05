import React from 'react';
import { QuizFlowStage, QuizFlowConfig } from '@/types/quizFlow';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FlowCanvasPreviewProps {
  stage: QuizFlowStage | null;
  previewMode: 'desktop' | 'mobile';
  globalConfig: QuizFlowConfig['globalConfig'];
  totalStages: number;
  currentStageIndex: number;
}

export const FlowCanvasPreview: React.FC<FlowCanvasPreviewProps> = ({
  stage,
  previewMode,
  globalConfig,
  totalStages,
  currentStageIndex
}) => {
  if (!stage) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <p className="text-muted-foreground">Selecione uma etapa para visualizar</p>
      </div>
    );
  }

  const progress = totalStages > 0 ? (currentStageIndex / totalStages) * 100 : 0;

  const renderStageContent = () => {
    switch (stage.type) {
      case 'intro':
        return (
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">{stage.title}</h1>
            {stage.config.imageUrl && (
              <img
                src={stage.config.imageUrl}
                alt="Intro"
                className="w-full max-w-sm rounded-lg object-cover"
              />
            )}
            {stage.config.subtitle && (
              <p className="text-muted-foreground max-w-md">{stage.config.subtitle}</p>
            )}
            <div className="w-full max-w-sm space-y-2">
              <Label>{stage.config.inputLabel || 'NOME'} <span className="text-destructive">*</span></Label>
              <Input placeholder={stage.config.inputPlaceholder || 'Digite seu nome...'} />
            </div>
            <Button className="w-full max-w-sm h-14" size="lg">
              {stage.config.buttonText || 'Continuar'}
            </Button>
          </div>
        );

      case 'question':
      case 'strategic':
        return (
          <div className="flex flex-col gap-6">
            <h1 className="text-xl md:text-2xl font-bold text-center">
              {stage.config.question || 'Pergunta não definida'}
            </h1>
            <div className="space-y-3">
              {stage.config.options?.map((option) => (
                <button
                  key={option.id}
                  className={cn(
                    'w-full p-4 rounded-lg border bg-card hover:bg-primary/5 hover:border-primary/50 transition-all text-left',
                    stage.config.displayType === 'both' && option.imageUrl && 'flex items-center gap-4'
                  )}
                >
                  {stage.config.displayType === 'both' && option.imageUrl && (
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    />
                  )}
                  <span className="flex-1">{option.text}</span>
                </button>
              ))}
            </div>
            {!stage.config.autoAdvance && (
              <Button className="w-full h-14" size="lg">
                Continuar
              </Button>
            )}
          </div>
        );

      case 'transition':
        return (
          <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <h1 className="text-xl md:text-2xl font-bold">
              {stage.config.transitionTitle || 'Calculando seu resultado...'}
            </h1>
            {stage.config.transitionSubtitle && (
              <p className="text-muted-foreground max-w-md">
                {stage.config.transitionSubtitle}
              </p>
            )}
            {stage.config.transitionMessage && (
              <p className="text-sm italic text-muted-foreground max-w-sm">
                "{stage.config.transitionMessage}"
              </p>
            )}
          </div>
        );

      case 'result':
        return (
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">Seu Resultado</h1>
            <div className="w-full max-w-md p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border">
              <p className="text-lg font-medium">Estilo Predominante</p>
              <p className="text-3xl font-bold text-primary mt-2">Natural</p>
              {stage.config.showPercentages && (
                <p className="text-sm text-muted-foreground mt-1">85% de compatibilidade</p>
              )}
            </div>
            <Button className="w-full max-w-md h-14" size="lg">
              {stage.config.ctaText || 'Ver oferta especial'}
            </Button>
          </div>
        );

      default:
        return <p className="text-muted-foreground">Tipo de etapa não suportado</p>;
    }
  };

  return (
    <div className="h-full flex flex-col items-center bg-muted/30 overflow-auto p-4">
      <div
        className={cn(
          'bg-background rounded-lg shadow-lg overflow-hidden transition-all',
          previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-2xl'
        )}
        style={{
          minHeight: previewMode === 'mobile' ? '667px' : '500px'
        }}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 p-4 border-b">
          <div className="flex items-center justify-center relative">
            {stage.config.allowBack && (
              <button className="absolute left-0 p-2 hover:bg-muted rounded-md">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {stage.config.showLogo && (
              <img
                src={stage.config.logoUrl || globalConfig.logoUrl}
                alt="Logo"
                className="h-12 w-12 object-contain"
              />
            )}
          </div>
          {stage.config.showProgress && (
            <Progress value={progress} className="h-2" />
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
};
