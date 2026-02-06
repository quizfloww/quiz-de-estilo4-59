"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import {
  getIntroConfigFromEditor,
  getGlobalConfigFromEditor,
} from "@/utils/quizConfigAdapter";

// Default fallback URLs
const DEFAULT_LOGO_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2";
const DEFAULT_INTRO_IMAGE_URL =
  "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up";

interface QuizIntroProps {
  onStart: (nome: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  showProgress?: boolean;
  progressValue?: number;
}

/**
 * QuizIntro - Componente da página inicial do quiz
 * Layout baseado no código de referência do editor
 */
const QuizIntro: React.FC<QuizIntroProps> = ({ 
  onStart, 
  showBackButton = false,
  onBack,
  showProgress = true,
  progressValue = 7.14 // ~1/14 do total de etapas
}) => {
  const [nome, setNome] = useState("");

  // Load config from editor
  const introConfig = useMemo(() => getIntroConfigFromEditor(), []);
  const globalConfig = useMemo(() => getGlobalConfigFromEditor(), []);

  // Get values from editor config or use defaults
  const logoUrl = introConfig?.logoUrl || globalConfig?.logoUrl || DEFAULT_LOGO_URL;
  const imageUrl = introConfig?.imageUrl || DEFAULT_INTRO_IMAGE_URL;
  const title = introConfig?.title || "Teste de Estilo Pessoal";
  const inputLabel = introConfig?.inputLabel || "NOME";
  const inputPlaceholder = introConfig?.inputPlaceholder || "Digite seu nome aqui...";
  const buttonText = introConfig?.buttonText || "Continuar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onStart(nome);
  };

  return (
    <div className="group relative main-content w-full min-h-full mx-auto">
      <div className="flex flex-col gap-4 md:gap-6 h-full justify-between p-3 md:p-5 pb-10">
        {/* Header com logo e barra de progresso */}
        <div className="grid gap-4 opacity-100">
          <div className="flex flex-row w-full h-auto justify-center relative">
            {/* Botão Voltar */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 hover:bg-primary hover:text-foreground"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            {/* Logo e Progresso */}
            <div className="flex flex-col w-full max-w-md justify-start items-center gap-4">
              <img
                width={96}
                height={96}
                className="max-w-24 object-cover"
                alt="Logo"
                src={logoUrl}
                loading="eager"
              />
              {showProgress && (
                <Progress value={progressValue} className="w-full h-2" />
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="main-content w-full relative mx-auto max-w-md h-full">
          <div className="flex flex-row flex-wrap pb-10 gap-4">
            {/* Título */}
            <div className="min-w-full">
              <h1 className="min-w-full text-3xl font-bold text-center">
                {title}
              </h1>
            </div>

            {/* Imagem */}
            <div className="min-w-full flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Imagem"
                className="object-cover w-full h-auto rounded-lg max-w-96"
                loading="eager"
              />
            </div>

            {/* Input de Nome */}
            <form onSubmit={handleSubmit} className="min-w-full space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <label className="text-sm font-medium leading-none">
                  {inputLabel} <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder={inputPlaceholder}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="text-base p-4"
                  required
                />
              </div>

              {/* Botão Continuar */}
              <Button
                type="submit"
                className="min-w-full h-14"
                disabled={!nome.trim()}
              >
                {buttonText}
              </Button>
            </form>
          </div>
        </div>

        {/* Spacer inferior */}
        <div className="pt-10 md:pt-24"></div>
      </div>
    </div>
  );
};

export default QuizIntro;
