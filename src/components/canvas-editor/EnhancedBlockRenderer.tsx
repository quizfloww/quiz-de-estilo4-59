// Enhanced Block Renderer - Renderer com suporte a templates, otimização e A/B
// Envolve blocos com features avançadas

import React from "react";
import { CanvasBlock } from "@/types/canvasBlocks";
import { useQuiz } from "@/hooks/useQuiz";
import { useAuth } from "@/context/AuthContext";
import { useBlockABTest } from "@/hooks/useBlockABTest";
import { renderTemplate } from "@/utils/templateEngine";
import { optimizeImageUrl } from "@/utils/imageOptimization";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { useIsLowPerformanceDevice } from "@/hooks/use-mobile";

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
    if (!block.animation || isPreview) {
      return (
        <>
          {React.cloneElement(children as React.ReactElement, {
            content: finalContent,
          })}
        </>
      );
    }

    const shouldAnimate =
      !block.animation.disableOnLowPerformance || !isLowPerformance;

    if (!shouldAnimate) {
      return (
        <>
          {React.cloneElement(children as React.ReactElement, {
            content: finalContent,
          })}
        </>
      );
    }

    return (
      <AnimatedWrapper
        animation={block.animation.type as any}
        duration={block.animation.duration}
        delay={block.animation.delay}
        show={true}
      >
        {React.cloneElement(children as React.ReactElement, {
          content: finalContent,
        })}
      </AnimatedWrapper>
    );
  };

  return renderWithAnimation();
};

// Processa conteúdo do bloco substituindo templates e otimizando imagens
function processBlockContent(content: any, context: any): any {
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

  // Otimizar URLs de imagens
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
      processed[field] = optimizeImageUrl(processed[field], {
        quality: "auto:best",
        format: "auto",
      });
    }
  });

  // Processar arrays de objetos (testimonials, benefits, etc)
  if (Array.isArray(processed.testimonials)) {
    processed.testimonials = processed.testimonials.map((t: any) => ({
      ...t,
      name: renderTemplate(t.name || "", context),
      text: renderTemplate(t.text || "", context),
      imageUrl: t.imageUrl
        ? optimizeImageUrl(t.imageUrl, { width: 80, quality: "auto:best" })
        : undefined,
    }));
  }

  if (Array.isArray(processed.benefits)) {
    processed.benefits = processed.benefits.map((b: any) => ({
      ...b,
      title: renderTemplate(b.title || "", context),
      description: renderTemplate(b.description || "", context),
    }));
  }

  if (Array.isArray(processed.bonusItems)) {
    processed.bonusItems = processed.bonusItems.map((b: any) => ({
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
      (item: any) => ({
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
  content: any,
  abTest: any,
  variant: "A" | "B" | "C"
): any {
  if (!abTest || !abTest.enabled) {
    return content;
  }

  const variantConfig = abTest.variants.find((v: any) => v.id === variant);
  if (!variantConfig || !variantConfig.content) {
    return content;
  }

  // Merge do conteúdo da variante
  return {
    ...content,
    ...variantConfig.content,
  };
}
