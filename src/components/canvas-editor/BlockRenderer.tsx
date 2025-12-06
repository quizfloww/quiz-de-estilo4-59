import React from "react";
import { CanvasBlock } from "@/types/canvasBlocks";
import {
  HeaderBlock,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  InputBlock,
  OptionsBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  StyleResultBlock,
  SecondaryStylesBlock,
  StyleProgressBlock,
  PriceAnchorBlock,
  CountdownBlock,
  TestimonialBlock,
  TestimonialsBlock,
  BenefitsListBlock,
  GuaranteeBlock,
  CtaOfferBlock,
  FaqBlock,
  SocialProofBlock,
  PersonalizedHookBlock,
  StyleGuideBlock,
  BeforeAfterBlock,
  MotivationBlock,
  BonusBlock,
  MentorBlock,
  SecurePurchaseBlock,
} from "./blocks";

interface BlockRendererProps {
  block: CanvasBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isPreview,
  isEditing,
}) => {
  switch (block.type) {
    case "header":
      return <HeaderBlock content={block.content} isPreview={isPreview} />;
    case "heading":
      return <HeadingBlock content={block.content} isPreview={isPreview} />;
    case "text":
      return <TextBlock content={block.content} isPreview={isPreview} />;
    case "image":
      return <ImageBlock content={block.content} isPreview={isPreview} />;
    case "input":
      return <InputBlock content={block.content} isPreview={isPreview} />;
    case "options":
      return <OptionsBlock content={block.content} isPreview={isPreview} />;
    case "button":
      return <ButtonBlock content={block.content} isPreview={isPreview} />;
    case "spacer":
      return (
        <SpacerBlock
          content={block.content}
          isPreview={isPreview}
          isEditing={isEditing}
        />
      );
    case "divider":
      return <DividerBlock content={block.content} isPreview={isPreview} />;
    // Blocos de Resultado
    case "styleResult":
      return <StyleResultBlock content={block.content} isPreview={isPreview} />;
    case "secondaryStyles":
      return (
        <SecondaryStylesBlock content={block.content} isPreview={isPreview} />
      );
    case "styleProgress":
      return (
        <StyleProgressBlock content={block.content} isPreview={isPreview} />
      );
    case "personalizedHook":
      return (
        <PersonalizedHookBlock content={block.content} isPreview={isPreview} />
      );
    case "styleGuide":
      return <StyleGuideBlock content={block.content} isPreview={isPreview} />;
    case "beforeAfter":
      return <BeforeAfterBlock content={block.content} isPreview={isPreview} />;
    // Blocos de Oferta/Vendas
    case "priceAnchor":
      return <PriceAnchorBlock content={block.content} isPreview={isPreview} />;
    case "countdown":
      return <CountdownBlock content={block.content} isPreview={isPreview} />;
    case "testimonial":
      return <TestimonialBlock content={block.content} isPreview={isPreview} />;
    case "testimonials":
      return (
        <TestimonialsBlock content={block.content} isPreview={isPreview} />
      );
    case "benefitsList":
      return (
        <BenefitsListBlock content={block.content} isPreview={isPreview} />
      );
    case "guarantee":
      return <GuaranteeBlock content={block.content} isPreview={isPreview} />;
    case "ctaOffer":
      return <CtaOfferBlock content={block.content} isPreview={isPreview} />;
    case "faq":
      return <FaqBlock content={block.content} isPreview={isPreview} />;
    case "socialProof":
      return <SocialProofBlock content={block.content} isPreview={isPreview} />;
    case "motivation":
      return <MotivationBlock content={block.content} isPreview={isPreview} />;
    case "bonus":
      return <BonusBlock content={block.content} isPreview={isPreview} />;
    case "mentor":
      return <MentorBlock content={block.content} isPreview={isPreview} />;
    case "securePurchase":
      return (
        <SecurePurchaseBlock content={block.content} isPreview={isPreview} />
      );
    default:
      return (
        <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground">
          Bloco desconhecido: {block.type}
        </div>
      );
  }
};
