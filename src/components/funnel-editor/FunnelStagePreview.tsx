import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { FunnelStage } from '@/hooks/useFunnelStages';
import type { Funnel } from '@/hooks/useFunnels';

interface FunnelStagePreviewProps {
  stage: FunnelStage;
  funnel: Funnel;
}

export const FunnelStagePreview: React.FC<FunnelStagePreviewProps> = ({ stage, funnel }) => {
  const config = stage.config || {};
  const globalConfig = funnel.global_config || {};

  const renderHeader = () => (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {config.showLogo !== false && (
        <img 
          src={config.logoUrl || globalConfig.logoUrl || 'https://via.placeholder.com/96'} 
          alt="Logo" 
          className="max-w-24 h-auto"
        />
      )}
      {config.showProgress !== false && (
        <Progress value={25} className="w-full h-2" />
      )}
    </div>
  );

  const renderIntro = () => (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-row w-full justify-center relative">
        {config.allowBack && (
          <Button variant="ghost" size="icon" className="absolute left-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {renderHeader()}
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-4 max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold text-center">
          {config.title || stage.title || 'Teste de Estilo Pessoal'}
        </h1>
        
        {config.imageUrl && (
          <img 
            src={config.imageUrl} 
            alt="Intro" 
            className="w-full max-w-96 rounded-lg object-cover"
          />
        )}
        
        {config.subtitle && (
          <p className="text-center text-muted-foreground">{config.subtitle}</p>
        )}
        
        <div className="w-full space-y-2">
          <label className="text-sm font-medium">
            {config.inputLabel || 'NOME'} <span className="text-destructive">*</span>
          </label>
          <Input 
            placeholder={config.inputPlaceholder || 'Digite seu nome aqui...'} 
            className="h-12"
          />
        </div>
        
        <Button className="w-full h-14">
          {config.buttonText || 'Continuar'}
        </Button>
      </div>
    </div>
  );

  const renderQuestion = () => (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-row w-full justify-center relative">
        {config.allowBack !== false && (
          <Button variant="ghost" size="icon" className="absolute left-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {renderHeader()}
      </div>
      
      <div className="flex-1 flex flex-col gap-4 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-center">
          {config.question || stage.title || 'Qual sua preferência?'}
        </h1>
        
        <div className="space-y-2">
          {(config.options || []).length > 0 ? (
            config.options.map((option: any, index: number) => (
              <button
                key={option.id || index}
                className="w-full p-4 text-left border rounded-md hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-3"
              >
                {option.imageUrl && config.displayType !== 'text' && (
                  <img 
                    src={option.imageUrl} 
                    alt={option.text}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <span>{option.text}</span>
              </button>
            ))
          ) : (
            <div className="space-y-2">
              <button className="w-full p-4 text-left border rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                A) Opção exemplo 1
              </button>
              <button className="w-full p-4 text-left border rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                B) Opção exemplo 2
              </button>
              <button className="w-full p-4 text-left border rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                C) Opção exemplo 3
              </button>
            </div>
          )}
        </div>
        
        {!config.autoAdvance && (
          <Button className="w-full h-14">Continuar</Button>
        )}
      </div>
    </div>
  );

  const renderTransition = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 h-full text-center">
      <h1 className="text-2xl font-bold">
        {config.transitionTitle || 'Enquanto calculamos o seu resultado...'}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {config.transitionSubtitle || 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.'}
      </p>
      {config.transitionMessage && (
        <p className="text-sm italic text-muted-foreground">
          {config.transitionMessage}
        </p>
      )}
      <Button className="h-14 px-8">Continuar</Button>
    </div>
  );

  const renderResult = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 h-full text-center">
      <h1 className="text-3xl font-bold">Seu Resultado</h1>
      <p className="text-muted-foreground">
        Página de resultado será exibida aqui
      </p>
      <Button className="h-14 px-8">
        {config.ctaText || 'Ver minha análise completa'}
      </Button>
    </div>
  );

  const renderStrategic = () => renderQuestion();

  const renderContent = () => {
    switch (stage.type) {
      case 'intro':
        return renderIntro();
      case 'question':
        return renderQuestion();
      case 'strategic':
        return renderStrategic();
      case 'transition':
        return renderTransition();
      case 'result':
        return renderResult();
      default:
        return <div className="p-4">Tipo de etapa não suportado</div>;
    }
  };

  return (
    <div className="h-full overflow-auto">
      {renderContent()}
    </div>
  );
};
