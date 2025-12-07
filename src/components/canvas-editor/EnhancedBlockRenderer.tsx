// Enhanced Block Renderer - Renderer com suporte a templates, otimização e A/B
// Envolve blocos com features avançadas

import React from "react";
import {
  CanvasBlock,
  CanvasBlockContent,
  ABTestConfig,
  TestimonialItem,
  BenefitItem,
  BonusItem,
  BeforeAfterItem,
} from "@/types/canvasBlocks";
import { useQuiz } from "@/hooks/useQuiz";
import { useAuth } from "@/context/AuthContext";
import { useBlockABTest } from "@/hooks/useBlockABTest";
import { renderTemplate } from "@/utils/templateEngine";
import { optimizeImageUrl } from "@/utils/imageOptimization";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { useIsLowPerformanceDevice } from "@/hooks/use-mobile";

import { StyleResult } from "@/types/quiz";

interface TemplateContext {
  userName?: string;
  userEmail?: string;
  primaryStyle: StyleResult | null;
  secondaryStyles: StyleResult[];
  totalSelections: number;
  currentDate: string;
}

interface EnhancedBlockRendererProps {
  block: CanvasBlock;
  isPreview?: boolean;
  children: React.ReactNode;
}

export const EnhancedBlockRenderer: React.FC<EnhancedBlockRendererProps> = ({
  block,
  isPreview,
  children,
}) => {
  const { primaryStyle, secondaryStyles, totalSelections } = useQuiz();
  const { user } = useAuth();
  const isLowPerformance = useIsLowPerformanceDevice();

  // Teste A/B
  const abTestState = useBlockABTest(block.abTest);

  // Preparar contexto para templates
  const templateContext = {
    userName: user?.userName,
    userEmail: user?.email,
    primaryStyle,
    secondaryStyles,
    totalSelections,
    currentDate: new Date().toLocaleDateString("pt-BR"),
  };

  // Processar conteúdo com templates
  const enhancedContent = processBlockContent(block.content, templateContext);

  // Aplicar variante A/B se configurado
  const finalContent = applyABTestVariant(
    enhancedContent,
    block.abTest,
    abTestState.variant
  );

  // Wrapper com animação
  const renderWithAnimation = () => {
    // Sempre passar o conteúdo processado, mesmo sem animação
    const childWithContent = React.cloneElement(
      children as React.ReactElement,
      { content: finalContent }
    );

    // Se não tem animação ou é preview, retornar diretamente
    if (!block.animation || isPreview) {
      return childWithContent;
    }

    const shouldAnimate =
      !block.animation.disableOnLowPerformance || !isLowPerformance;

    // Se não deve animar, retornar sem wrapper
    if (!shouldAnimate) {
      return childWithContent;
    }

    // Com animação
    return (
      <AnimatedWrapper
        animation={block.animation.type}
        duration={block.animation.duration || 500}
        delay={block.animation.delay || 0}
        show={true}
      >
        {childWithContent}
      </AnimatedWrapper>
    );
  };

  return renderWithAnimation();
};

// Processa conteúdo do bloco substituindo templates e otimizando imagens
function processBlockContent(
  content: CanvasBlockContent,
  context: TemplateContext
): CanvasBlockContent {
  const processed = { ...content };

  // Processar campos de texto com templates
  const textFields = [
    "text",
    "label",
    "placeholder",
    "buttonText",
    "hookTitle",
    "hookSubtitle",
    "motivationTitle",
    "motivationSubtitle",
    "bonusTitle",
    "bonusSubtitle",
    "expiryMessage",
    "urgencyText",
    "ctaText",
    "guaranteeTitle",
    "guaranteeDescription",
    "mentorName",
    "mentorTitle",
    "mentorDescription",
    "socialProofText",
    "secureText",
    "testimonialsTitle",
    "beforeAfterTitle",
    "faqStyle",
  ];

  textFields.forEach((field) => {
    if (typeof processed[field] === "string") {
      processed[field] = renderTemplate(processed[field], context);
    }
  });

  // Processar arrays de texto
  if (Array.isArray(processed.motivationPoints)) {
    processed.motivationPoints = processed.motivationPoints.map((p: string) =>
      renderTemplate(p, context)
    );
  }

  // Otimizar URLs de imagens (apenas se não estiverem já otimizadas)
  const imageFields = [
    "imageUrl",
    "logoUrl",
    "styleImageUrl",
    "guideImageUrl",
    "motivationImageUrl",
    "mentorImageUrl",
    "guaranteeImageUrl",
  ];

  imageFields.forEach((field) => {
    if (typeof processed[field] === "string" && processed[field]) {
      const url = processed[field] as string;
      // Só otimizar se não tiver transformações já aplicadas
      if (!url.includes("w_") && !url.includes("q_") && !url.includes("f_")) {
        processed[field] = optimizeImageUrl(url, {
          quality: "auto:best",
          format: "auto",
        });
      }
    }
  });

  // Processar arrays de objetos (testimonials, benefits, etc)
  if (Array.isArray(processed.testimonials)) {
    processed.testimonials = processed.testimonials.map(
      (t: TestimonialItem) => ({
        ...t,
        name: renderTemplate(t.name || "", context),
        text: renderTemplate(t.text || "", context),
        imageUrl: t.imageUrl
          ? optimizeImageUrl(t.imageUrl, { width: 80, quality: "auto:best" })
          : undefined,
      })
    );
  }

  if (Array.isArray(processed.benefits)) {
    processed.benefits = processed.benefits.map((b: BenefitItem) => ({
      ...b,
      title: renderTemplate(b.title || "", context),
      description: renderTemplate(b.description || "", context),
    }));
  }

  if (Array.isArray(processed.bonusItems)) {
    processed.bonusItems = processed.bonusItems.map((b: BonusItem) => ({
      ...b,
      title: renderTemplate(b.title || "", context),
      description: renderTemplate(b.description || "", context),
      imageUrl: b.imageUrl
        ? optimizeImageUrl(b.imageUrl, { width: 300, quality: "auto:good" })
        : undefined,
    }));
  }

  if (Array.isArray(processed.beforeAfterItems)) {
    processed.beforeAfterItems = processed.beforeAfterItems.map(
      (item: BeforeAfterItem) => ({
        ...item,
        name: renderTemplate(item.name || "", context),
        description: renderTemplate(item.description || "", context),
        beforeImage: optimizeImageUrl(item.beforeImage, {
          width: 400,
          quality: "auto:good",
        }),
        afterImage: optimizeImageUrl(item.afterImage, {
          width: 400,
          quality: "auto:good",
        }),
      })
    );
  }

  return processed;
}

// Aplica variante de teste A/B
function applyABTestVariant(
  content: CanvasBlockContent,
  abTest: ABTestConfig | undefined,
  variant: string
): CanvasBlockContent {
  if (!abTest || !abTest.enabled) {
    return content;
  }

  const variantConfig = abTest.variants.find((v) => v.id === variant);
  if (!variantConfig) {
    return content;
  }

  // Merge do conteúdo da variante (suporta tanto content quanto contentOverrides)
  const variantContent =
    variantConfig.content || variantConfig.contentOverrides;
  if (!variantContent) {
    return content;
  }

  return {
    ...content,
    ...variantContent,
  };
}
