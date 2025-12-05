
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getIntroConfigFromEditor, getGlobalConfigFromEditor } from '@/utils/quizConfigAdapter';

// Design tokens centralizados - apenas os essenciais
const defaultColors = {
  primary: '#B89B7A',
  primaryDark: '#A1835D',
  secondary: '#432818',
  background: '#FEFEFE',
  backgroundAlt: '#F8F5F0',
  text: '#432818',
  textLight: '#6B7280',
  border: '#E5E7EB',
};

// Default fallback URLs
const DEFAULT_LOGO_URL = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2';
const DEFAULT_INTRO_IMAGE_URL = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up';

interface QuizIntroProps {
  onStart: (nome: string) => void;
}

/**
 * QuizIntro - Componente da página inicial do quiz
 * Agora integrado com o editor para customização dinâmica
 */
const QuizIntro: React.FC<QuizIntroProps> = ({ onStart }) => {
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  
  // Load config from editor
  const introConfig = useMemo(() => getIntroConfigFromEditor(), []);
  const globalConfig = useMemo(() => getGlobalConfigFromEditor(), []);
  
  // Get values from editor config or use defaults
  const logoUrl = introConfig?.logoUrl || globalConfig?.logoUrl || DEFAULT_LOGO_URL;
  const imageUrl = introConfig?.imageUrl || DEFAULT_INTRO_IMAGE_URL;
  const subtitle = introConfig?.subtitle || 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.';
  const inputLabel = introConfig?.inputLabel || 'NOME';
  const inputPlaceholder = introConfig?.inputPlaceholder || 'Digite seu nome aqui...';
  const buttonText = introConfig?.buttonText || 'Continuar';
  const primaryColor = globalConfig?.primaryColor || defaultColors.primary;
  const secondaryColor = globalConfig?.secondaryColor || defaultColors.secondary;
  
  // Função simplificada de submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setError('Por favor, digite seu nome para continuar');
      return;
    }
    
    setError('');
    onStart(nome);
    
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('user-interaction');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('component-mounted');
    }
    
    const reportLcpRendered = () => {
      if (typeof window !== 'undefined' && window.QUIZ_PERF) {
        window.QUIZ_PERF.mark('lcp_rendered');
      }
    };
    
    requestAnimationFrame(() => {
      requestAnimationFrame(reportLcpRendered);
    });
  }, []);

  // Parse subtitle to highlight specific words
  const renderSubtitle = () => {
    // Simple highlighting for "Chega" and "Você"
    const parts = subtitle.split(/(Chega|Você)/g);
    return parts.map((part, index) => {
      if (part === 'Chega' || part === 'Você') {
        return <span key={index} style={{ color: primaryColor }}>{part}</span>;
      }
      return part;
    });
  };

  return (
    <main
      className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
      data-section="intro"
    >
      <a 
        href="#quiz-form" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white px-4 py-2 rounded-md shadow-md"
        style={{ color: secondaryColor }}
      >
        Pular para o formulário
      </a>
      
      <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
        {/* Logo from editor config */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-auto mx-auto"
              width={120}
              height={50}
              loading="eager"
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
              }}
            />
            {/* Barra dourada */}
            <div
              className="h-[3px] rounded-full mt-1.5"
              style={{
                backgroundColor: primaryColor,
                width: '300px',
                maxWidth: '90%',
                margin: '0 auto',
              }}
            />
          </div>
        </div>

        {/* Título from editor config */}
        <h1
          className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl playfair-display"
          style={{
            fontFamily: globalConfig?.fontFamily ? `"${globalConfig.fontFamily}", serif` : '"Playfair Display", serif',
            fontWeight: 400,
            color: secondaryColor,
          }}
        >
          {renderSubtitle()}
        </h1>
      </header>

      <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
        {/* Imagem from editor config */}
        <div className="mt-2 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
          <div
            className="w-full overflow-hidden rounded-lg shadow-sm"
            style={{ maxHeight: '300px' }}
          >
            <div className="relative w-full h-full bg-[#F8F5F0]">
              <img
                src={imageUrl}
                alt="Descubra seu estilo predominante"
                className="w-full h-full object-contain"
                loading="eager"
                id="lcp-image"
              />
            </div>
          </div>
        </div>

        {/* Texto descritivo */}
        <p className="text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600">
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
        <div id="quiz-form" className="mt-8">
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-6"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: secondaryColor }}
              >
                {inputLabel} <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder={inputPlaceholder}
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (error) setError('');
                }}
                className={cn(
                  "w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-offset-2",
                  error 
                    ? "border-red-500 focus:ring-red-500" 
                    : ""
                )}
                style={{
                  borderColor: error ? undefined : primaryColor,
                }}
                autoFocus
                aria-required="true"
                autoComplete="off"
                inputMode="text"
                maxLength={32}
                aria-invalid={!!error}
                aria-describedby={error ? "name-error" : undefined}
                required
              />
              {error && (
                <p id="name-error" className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>
            
            <button
              type="submit"
              className={cn(
                'w-full py-2 px-3 text-sm font-semibold rounded-md shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'sm:py-3 sm:px-4 sm:text-base',
                'md:py-3.5 md:text-lg',
                nome.trim() 
                  ? 'text-white hover:shadow-lg transform hover:scale-[1.01]' 
                  : 'text-white/90 cursor-not-allowed'
              )}
              style={{
                backgroundColor: nome.trim() ? primaryColor : `${primaryColor}80`,
                '--tw-ring-color': primaryColor,
              } as React.CSSProperties}
              aria-disabled={!nome.trim()}
            >
              <span className="flex items-center justify-center gap-2">
                {nome.trim() ? buttonText : 'Digite seu nome para continuar'}
              </span>
            </button>

            <p className="text-xs text-center text-gray-500 pt-1">
              Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa{' '}
              <a 
                href="#" 
                className="underline focus:outline-none focus:ring-1 rounded"
                style={{ color: primaryColor }}
              >
                política de privacidade
              </a>
            </p>
          </form>
        </div>
      </section>
      
      <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados
        </p>
      </footer>
    </main>
  );
};

export default QuizIntro;
