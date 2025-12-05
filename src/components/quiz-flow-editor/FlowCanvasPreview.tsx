import React, { useState } from 'react';
import { QuizFlowStage, QuizFlowConfig } from '@/types/quizFlow';
import { cn } from '@/lib/utils';
import { ArrowLeft, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FlowCanvasPreviewProps {
  stage: QuizFlowStage | null;
  previewMode: 'desktop' | 'mobile';
  globalConfig: QuizFlowConfig['globalConfig'];
  totalStages: number;
  currentStageIndex: number;
}

// Default fallback URLs matching QuizIntro
const DEFAULT_LOGO_URL = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2';
const DEFAULT_INTRO_IMAGE_URL = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up';

export const FlowCanvasPreview: React.FC<FlowCanvasPreviewProps> = ({
  stage,
  previewMode,
  globalConfig,
  totalStages,
  currentStageIndex
}) => {
  // Estado para simular seleção de opções no preview
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (!stage) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <p className="text-muted-foreground">Selecione uma etapa para visualizar</p>
      </div>
    );
  }

  const progress = totalStages > 0 ? ((currentStageIndex + 1) / totalStages) * 100 : 0;
  const primaryColor = globalConfig.primaryColor || '#B89B7A';
  const secondaryColor = globalConfig.secondaryColor || '#432818';

  // Toggle option selection for preview
  const handleOptionClick = (optionId: string, maxSelect: number = 3, isStrategic: boolean = false) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        // Para questões estratégicas, não permite desmarcar
        if (isStrategic) return prev;
        return prev.filter(id => id !== optionId);
      }
      if (isStrategic) {
        // Para estratégicas, substitui seleção anterior
        return [optionId];
      }
      if (prev.length >= maxSelect) {
        return [...prev.slice(1), optionId];
      }
      return [...prev, optionId];
    });
  };

  // Render subtitle with highlighted words (matching QuizIntro)
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(Chega|Você)/g);
    return parts.map((part, index) => {
      if (part === 'Chega' || part === 'Você') {
        return <span key={index} style={{ color: primaryColor }}>{part}</span>;
      }
      return part;
    });
  };

  const renderIntroStage = () => {
    const logoUrl = stage.config.logoUrl || globalConfig.logoUrl || DEFAULT_LOGO_URL;
    const imageUrl = stage.config.imageUrl || DEFAULT_INTRO_IMAGE_URL;
    const subtitle = stage.config.subtitle || 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.';
    const inputLabel = stage.config.inputLabel || 'NOME';
    const inputPlaceholder = stage.config.inputPlaceholder || 'Digite seu nome aqui...';
    const buttonText = stage.config.buttonText || 'Continuar';

    return (
      <main className="flex flex-col items-center justify-start min-h-full bg-gradient-to-b from-white to-gray-50 py-6">
        {/* Header with Logo */}
        <header className="w-full max-w-sm px-4 space-y-6 mx-auto">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-auto mx-auto"
                style={{
                  objectFit: 'contain',
                  maxWidth: '120px',
                }}
              />
              {/* Barra dourada */}
              <div
                className="h-[3px] rounded-full mt-1.5 mx-auto"
                style={{
                  backgroundColor: primaryColor,
                  width: '200px',
                  maxWidth: '90%',
                }}
              />
            </div>
          </div>

          {/* Título with highlighted words */}
          <h1
            className="text-xl md:text-2xl font-bold text-center leading-tight px-2"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              color: secondaryColor,
            }}
          >
            {renderHighlightedText(subtitle)}
          </h1>
        </header>

        <section className="w-full max-w-sm px-4 space-y-4 mx-auto mt-4">
          {/* Imagem */}
          <div className="w-full max-w-sm mx-auto">
            <div
              className="w-full overflow-hidden rounded-lg shadow-sm"
              style={{ maxHeight: '200px' }}
            >
              <div className="relative w-full h-full bg-[#F8F5F0]">
                <img
                  src={imageUrl}
                  alt="Descubra seu estilo predominante"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Texto descritivo */}
          <p className="text-xs text-center leading-relaxed px-2 text-gray-600">
            Em poucos minutos, descubra seu{' '}
            <span className="font-semibold" style={{ color: primaryColor }}>
              Estilo Predominante
            </span>{' '}
            — e aprenda a montar looks que realmente refletem sua{' '}
            <span className="font-semibold" style={{ color: secondaryColor }}>
              essência
            </span>, com praticidade e{' '}
            <span className="font-semibold" style={{ color: secondaryColor }}>
              confiança
            </span>.
          </p>

          {/* Formulário */}
          <div className="mt-4">
            <div className="w-full space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: secondaryColor }}
                >
                  {inputLabel} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={inputPlaceholder}
                  className="w-full p-2.5 bg-white rounded-md border-2"
                  style={{ borderColor: primaryColor }}
                />
              </div>
              
              <button
                className="w-full py-3 px-4 text-sm font-semibold rounded-md shadow-md text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: primaryColor }}
              >
                {buttonText}
              </button>

              <p className="text-xs text-center text-gray-500 pt-1">
                Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa{' '}
                <span className="underline" style={{ color: primaryColor }}>
                  política de privacidade
                </span>
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full max-w-sm px-4 mt-auto pt-4 text-center mx-auto">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados
          </p>
        </footer>
      </main>
    );
  };

  const renderQuestionStage = () => {
    const question = stage.config.question || 'Pergunta não definida';
    const options = stage.config.options || [];
    const displayType = stage.config.displayType || 'text';
    const multiSelect = stage.config.multiSelect || 3;
    const isStrategic = stage.type === 'strategic';
    const hasImageOptions = displayType === 'both' || displayType === 'image';

    return (
      <div className="flex flex-col gap-4 h-full p-3">
        {/* Header */}
        <div className="flex flex-row w-full h-auto justify-center relative">
          {stage.config.allowBack && (
            <button className="absolute left-0 p-2 hover:bg-muted rounded-md transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex flex-col w-full max-w-sm justify-start items-center gap-4">
            {stage.config.showLogo && (
              <img
                src={stage.config.logoUrl || globalConfig.logoUrl || DEFAULT_LOGO_URL}
                alt="Logo"
                className="max-w-24 object-cover"
              />
            )}
            {stage.config.showProgress && (
              <div className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: primaryColor,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Question Content */}
        <div className={cn(
          "w-full mx-auto pb-5",
          isStrategic ? "max-w-3xl" : "max-w-6xl"
        )}>
          {/* Question Title */}
          <h2
            className={cn(
              "font-semibold text-center mb-5 px-3 pt-3 tracking-normal",
              isStrategic 
                ? "text-lg md:text-xl font-bold" 
                : "text-base md:text-lg"
            )}
            style={{ 
              color: secondaryColor,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            {question}
          </h2>

          {/* Strategic Question Image */}
          {isStrategic && stage.config.imageUrl && (
            <div className="w-full mb-6">
              <img 
                src={stage.config.imageUrl} 
                alt="Question visual" 
                className="w-full max-w-md mx-auto rounded-lg shadow-sm" 
              />
            </div>
          )}

          {/* Options Grid - MATCHING QUIZ PUBLIC */}
          <div className={cn(
            "grid h-full",
            hasImageOptions 
              ? "grid-cols-2 gap-2 px-1"
              : "grid-cols-1 gap-3 px-2",
            isStrategic && "gap-4"
          )}>
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option.id, multiSelect, isStrategic)}
                  className={cn(
                    "relative h-full flex flex-col rounded-lg overflow-hidden cursor-pointer",
                    "transition-all duration-300",
                    // Estilos base
                    "bg-[#FEFEFE]",
                    // Estilos para opções de texto
                    !hasImageOptions && cn(
                      "p-4 border-2",
                      isSelected 
                        ? "shadow-lg" 
                        : "shadow-sm hover:shadow-md"
                    ),
                    // Estilos para opções com imagem
                    hasImageOptions && cn(
                      isSelected 
                        ? "shadow-xl ring-2 ring-offset-2" 
                        : "shadow-sm hover:shadow-lg"
                    ),
                    // Transform no hover
                    !isSelected && "hover:scale-[1.02]",
                    isSelected && isStrategic && "transform -translate-y-1"
                  )}
                  style={{
                    borderColor: !hasImageOptions 
                      ? (isSelected ? '#b29670' : primaryColor) 
                      : 'transparent',
                    boxShadow: isSelected 
                      ? (hasImageOptions 
                          ? `0 12px 24px rgba(0, 0, 0, 0.2)` 
                          : `0 4px 8px rgba(178, 150, 112, 0.35)`)
                      : undefined,
                    backgroundColor: isSelected && !hasImageOptions 
                      ? '#faf6f1' 
                      : '#FEFEFE',
                    ...(hasImageOptions && isSelected && {
                      '--tw-ring-color': primaryColor,
                    } as React.CSSProperties)
                  }}
                >
                  {/* Option Image */}
                  {hasImageOptions && option.imageUrl && (
                    <div className={cn(
                      "relative w-full aspect-square overflow-hidden",
                      isSelected && "brightness-105"
                    )}>
                      <img
                        src={option.imageUrl}
                        alt={option.text}
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-300",
                          !isSelected && "hover:scale-105"
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Option Text */}
                  <p className={cn(
                    "leading-relaxed transition-colors duration-200",
                    hasImageOptions 
                      ? "text-xs py-1 px-2 mt-auto font-medium" 
                      : cn(
                          "text-sm",
                          isStrategic && "text-base"
                        )
                  )}
                  style={{ color: secondaryColor }}
                  >
                    {option.text}
                  </p>

                  {/* Indicador de seleção - Check */}
                  {isSelected && (
                    isStrategic ? (
                      // Check maior para questões estratégicas
                      <div 
                        className="absolute -top-1 -right-1 h-7 w-7 rounded-full flex items-center justify-center shadow-lg animate-scale-in"
                        style={{ backgroundColor: '#b29670' }}
                      >
                        <Check className="h-5 w-5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      // Check menor para questões normais
                      <div 
                        className="absolute -top-0.5 -right-0.5 animate-scale-in"
                        style={{ color: '#b29670' }}
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* Continue Button (if not auto-advance) */}
          {!stage.config.autoAdvance && (
            <Button
              className={cn(
                "w-full h-14 mt-4 text-white transition-all duration-300",
                selectedOptions.length > 0 
                  ? "hover:shadow-lg hover:scale-[1.01]" 
                  : "opacity-70"
              )}
              style={{ backgroundColor: primaryColor }}
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderTransitionStage = () => {
    const title = stage.config.transitionTitle || 'Enquanto calculamos o seu resultado...';
    const subtitle = stage.config.transitionSubtitle || 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.';
    const message = stage.config.transitionMessage || 'Responda com sinceridade. Isso é só entre você e a sua nova versão.';

    return (
      <div className="flex flex-col items-center justify-center gap-6 text-center py-12 px-4">
        {/* Spinner */}
        <div
          className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${primaryColor} transparent ${primaryColor} ${primaryColor}` }}
        />
        
        {/* Title */}
        <h1 
          className="text-xl md:text-2xl font-bold animate-fade-in"
          style={{ color: secondaryColor }}
        >
          {title}
        </h1>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-muted-foreground max-w-md text-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {subtitle}
          </p>
        )}
        
        {/* Motivational Message */}
        {message && (
          <p 
            className="text-sm italic max-w-sm px-4 py-2 rounded-lg animate-fade-in"
            style={{ 
              color: primaryColor,
              backgroundColor: `${primaryColor}10`,
              animationDelay: '0.2s'
            }}
          >
            "{message}"
          </p>
        )}
      </div>
    );
  };

  const renderResultStage = () => {
    return (
      <div className="flex flex-col items-center gap-6 text-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold animate-fade-in" style={{ color: secondaryColor }}>
          Seu Resultado
        </h1>
        <div 
          className="w-full max-w-md p-6 rounded-xl border animate-scale-in"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)`,
          }}
        >
          <p className="text-lg font-medium">Estilo Predominante</p>
          <p className="text-3xl font-bold mt-2" style={{ color: primaryColor }}>
            Natural
          </p>
          {stage.config.showPercentages && (
            <p className="text-sm text-muted-foreground mt-1">85% de compatibilidade</p>
          )}
        </div>
        <Button 
          className="w-full max-w-md h-14 text-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
          style={{ backgroundColor: primaryColor }}
        >
          {stage.config.ctaText || 'Ver oferta especial'}
        </Button>
      </div>
    );
  };

  const renderStageContent = () => {
    switch (stage.type) {
      case 'intro':
        return renderIntroStage();
      case 'question':
      case 'strategic':
        return renderQuestionStage();
      case 'transition':
        return renderTransitionStage();
      case 'result':
        return renderResultStage();
      default:
        return <p className="text-muted-foreground">Tipo de etapa não suportado</p>;
    }
  };

  return (
    <div className="h-full flex flex-col items-center bg-muted/30 overflow-auto p-4">
      <div
        className={cn(
          'bg-white rounded-lg shadow-lg overflow-hidden transition-all',
          previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-2xl'
        )}
        style={{
          minHeight: previewMode === 'mobile' ? '667px' : '500px'
        }}
      >
        {renderStageContent()}
      </div>
    </div>
  );
};
