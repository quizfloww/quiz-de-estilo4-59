/**
 * Schema de validação Zod para blocos do editor
 * Garante integridade e tipagem dos dados JSON consumidos
 */

import { z } from "zod";
import { CanvasBlockType } from "@/types/canvasBlocks";

// ============================================
// Schemas de Itens Aninhados
// ============================================

export const CanvasOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  imageUrl: z.string().url().optional(),
  image_url: z.string().url().optional(), // snake_case do banco
  styleCategory: z.string().optional(),
  points: z.number().optional(),
});

export const PriceAnchorItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  originalPrice: z.number().min(0),
});

export const TestimonialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  text: z.string(),
  imageUrl: z.string().url().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export const BenefitItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const BonusItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  value: z.string().optional(),
});

export const BeforeAfterItemSchema = z.object({
  id: z.string(),
  beforeImage: z.string().url(),
  afterImage: z.string().url(),
  name: z.string().optional(),
  description: z.string().optional(),
});

// ============================================
// Schema de Conteúdo do Bloco
// ============================================

export const CanvasBlockContentSchema = z
  .object({
    // ======== PROPRIEDADES GLOBAIS ========
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    accentColor: z.string().optional(),
    borderColor: z.string().optional(),

    fontFamily: z
      .enum(["default", "playfair", "inter", "roboto", "poppins"])
      .optional(),
    lineHeight: z.enum(["tight", "normal", "relaxed", "loose"]).optional(),

    borderRadiusStyle: z
      .enum(["none", "sm", "md", "lg", "xl", "2xl", "full"])
      .optional(),
    paddingSize: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),
    marginSize: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),

    // Header
    showLogo: z.boolean().optional(),
    logoUrl: z.string().optional(),
    showProgress: z.boolean().optional(),
    showBackButton: z.boolean().optional(),
    progress: z.number().min(0).max(100).optional(),

    // Text/Heading
    text: z.string().optional(),
    fontSize: z.enum(["sm", "base", "lg", "xl", "2xl", "3xl"]).optional(),
    fontWeight: z.enum(["normal", "medium", "semibold", "bold"]).optional(),
    textAlign: z.enum(["left", "center", "right"]).optional(),

    // Image
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
    maxWidth: z.string().optional(),
    borderRadius: z.string().optional(),
    imagePosition: z.enum(["top", "center", "bottom"]).optional(),
    imageAlignment: z.enum(["left", "center", "right"]).optional(),
    imageSize: z
      .enum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"])
      .optional(),

    // Input
    label: z.string().optional(),
    placeholder: z.string().optional(),
    inputType: z.enum(["text", "email", "tel"]).optional(),
    required: z.boolean().optional(),

    // Options
    displayType: z.enum(["text", "image", "both"]).optional(),
    multiSelect: z.number().optional(),
    autoAdvance: z.boolean().optional(),
    options: z.array(CanvasOptionSchema).optional(),
    columns: z
      .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
      .optional(),
    optionTextSize: z.enum(["xs", "sm", "base", "lg", "xl"]).optional(),
    optionImageSize: z
      .enum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"])
      .optional(),
    showCheckIcon: z.boolean().optional(),

    // Button
    buttonText: z.string().optional(),
    buttonVariant: z
      .enum(["primary", "secondary", "outline", "cta"])
      .optional(),
    fullWidth: z.boolean().optional(),
    buttonUrl: z.string().optional(),
    buttonColor: z.string().optional(), // Cor personalizada do botão

    // Spacer/Divider
    height: z.string().optional(),
    dividerStyle: z.enum(["solid", "dashed", "dotted", "elegant"]).optional(),
    dividerColor: z.string().optional(),
    dividerThickness: z.number().optional(),
    dividerWidth: z.number().optional(),

    // Scale
    scale: z.number().optional(),

    // Style Result
    showPercentage: z.boolean().optional(),
    showDescription: z.boolean().optional(),
    layout: z.enum(["side-by-side", "stacked"]).optional(),
    styleImageSize: z.enum(["sm", "md", "lg", "xl"]).optional(),
    stylePercentage: z.number().optional(), // Percentual do estilo
    styleDescription: z.string().optional(), // Descrição do estilo
    styleImageUrl: z.string().optional(), // URL da imagem do estilo

    // Secondary Styles
    maxSecondaryStyles: z.number().optional(),
    showSecondaryPercentage: z.boolean().optional(),

    // Style Progress
    showLabels: z.boolean().optional(),
    maxStylesShown: z.number().optional(),

    // Price Anchor
    priceItems: z.array(PriceAnchorItemSchema).optional(),
    totalOriginal: z.number().optional(),
    finalPrice: z.number().optional(),
    installments: z
      .object({
        count: z.number(),
        value: z.number(),
      })
      .optional(),
    discountBadge: z.string().optional(),
    currency: z.string().optional(),

    // Countdown
    hours: z.number().optional(),
    minutes: z.number().optional(),
    seconds: z.number().optional(),
    countdownVariant: z.enum(["dramatic", "simple", "minimal"]).optional(),
    expiryMessage: z.string().optional(),

    // Testimonial
    testimonial: TestimonialItemSchema.optional(),
    testimonialVariant: z.enum(["card", "quote", "minimal"]).optional(),

    // Benefits List
    benefits: z.array(BenefitItemSchema).optional(),
    benefitsLayout: z.enum(["list", "grid"]).optional(),
    benefitsColumns: z
      .union([z.literal(1), z.literal(2), z.literal(3)])
      .optional(),
    showBenefitIcons: z.boolean().optional(),

    // Guarantee
    guaranteeDays: z.number().optional(),
    guaranteeTitle: z.string().optional(),
    guaranteeDescription: z.string().optional(),
    guaranteeImageUrl: z.string().optional(),

    // CTA Offer
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
    ctaVariant: z.enum(["green", "brand", "gradient"]).optional(),
    urgencyText: z.string().optional(),
    showCtaIcon: z.boolean().optional(),

    // FAQ
    faqItems: z.array(FaqItemSchema).optional(),
    faqStyle: z.enum(["accordion", "list"]).optional(),

    // Social Proof
    socialProofText: z.string().optional(),
    socialProofIcon: z.enum(["users", "star", "check", "heart"]).optional(),
    socialProofVariant: z.enum(["badge", "banner", "minimal"]).optional(),

    // Personalized Hook
    hookTitle: z.string().optional(),
    hookSubtitle: z.string().optional(),
    hookStyle: z.enum(["elegant", "bold", "minimal"]).optional(),
    showCta: z.boolean().optional(),
    styleCategory: z.string().optional(), // Categoria de estilo personalizado
    userName: z.string().optional(), // Nome do usuário para personalização
    showStyleImage: z.boolean().optional(), // Exibir imagem do estilo
    powerMessage: z.string().optional(), // Mensagem motivacional de poder

    // Style Guide
    showSecondaryGuides: z.boolean().optional(),
    guideImageSize: z.enum(["sm", "md", "lg", "xl"]).optional(),
    showExclusiveBadge: z.boolean().optional(),

    // Before/After
    beforeAfterItems: z.array(BeforeAfterItemSchema).optional(),
    beforeAfterLayout: z.enum(["slider", "side-by-side", "stacked"]).optional(),
    beforeAfterTitle: z.string().optional(),

    // Motivation
    motivationTitle: z.string().optional(),
    motivationSubtitle: z.string().optional(),
    motivationPoints: z.array(z.string()).optional(),
    motivationImageUrl: z.string().optional(),

    // Bonus
    bonusItems: z.array(BonusItemSchema).optional(),
    bonusTitle: z.string().optional(),
    bonusSubtitle: z.string().optional(),

    // Testimonials (multiple)
    testimonials: z.array(TestimonialItemSchema).optional(),
    testimonialsLayout: z.enum(["carousel", "grid", "list"]).optional(),
    testimonialsTitle: z.string().optional(),

    // Mentor
    mentorName: z.string().optional(),
    mentorTitle: z.string().optional(),
    mentorDescription: z.string().optional(),
    mentorImageUrl: z.string().optional(),
    mentorCredentials: z.array(z.string()).optional(),

    // Secure Purchase
    securityBadges: z.array(z.string()).optional(),
    paymentMethods: z.array(z.string()).optional(),
    secureText: z.string().optional(),

    // Mobile Layout
    mobileLayout: z.enum(["stacked", "side-by-side", "auto"]).optional(),
    mentorImagePosition: z.enum(["top", "bottom"]).optional(),
    mobileColumns: z.union([z.literal(1), z.literal(2)]).optional(),
  })
  .passthrough(); // Permite campos extras para compatibilidade

// ============================================
// Schema de Estilo do Bloco
// ============================================

export const CanvasBlockStyleSchema = z
  .object({
    marginTop: z.string().optional(),
    marginBottom: z.string().optional(),
    paddingX: z.string().optional(),
    paddingY: z.string().optional(),
    backgroundColor: z.string().optional(),
  })
  .passthrough();

// ============================================
// Tipos de Blocos
// ============================================

const blockTypes = [
  "header",
  "heading",
  "text",
  "image",
  "input",
  "options",
  "button",
  "spacer",
  "divider",
  "styleResult",
  "secondaryStyles",
  "styleProgress",
  "personalizedHook",
  "styleGuide",
  "beforeAfter",
  "priceAnchor",
  "countdown",
  "testimonial",
  "testimonials",
  "benefitsList",
  "guarantee",
  "ctaOffer",
  "faq",
  "socialProof",
  "motivation",
  "bonus",
  "mentor",
  "securePurchase",
] as const;

export const CanvasBlockTypeSchema = z.enum(blockTypes);

// ============================================
// Schema Principal do Bloco
// ============================================

export const CanvasBlockSchema = z.object({
  id: z.string().min(1),
  type: CanvasBlockTypeSchema,
  order: z.number().int().min(0),
  content: CanvasBlockContentSchema,
  style: CanvasBlockStyleSchema.optional(),
});

// ============================================
// Schema de Estado do Canvas
// ============================================

export const CanvasStateSchema = z.object({
  blocks: z.array(CanvasBlockSchema),
  selectedBlockId: z.string().nullable(),
});

// ============================================
// Schema de Configuração do Editor
// ============================================

export const EditorConfigSchema = z.object({
  blocks: z.array(CanvasBlockSchema),
  globalStyles: z
    .object({
      backgroundColor: z.string().optional(),
      fontFamily: z.string().optional(),
      textColor: z.string().optional(),
      accentColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      buttonStyle: z.string().optional(),
      headingStyle: z.string().optional(),
      spacing: z.string().optional(),
      borderRadius: z.string().optional(),
    })
    .passthrough()
    .optional(),
  settings: z
    .object({
      showLogo: z.boolean().optional(),
      showNavigation: z.boolean().optional(),
      showFooter: z.boolean().optional(),
    })
    .passthrough()
    .optional(),
  version: z.string().optional(),
  timestamp: z.number().optional(),
});

// ============================================
// Tipos Inferidos
// ============================================

export type ValidatedCanvasBlock = z.infer<typeof CanvasBlockSchema>;
export type ValidatedCanvasState = z.infer<typeof CanvasStateSchema>;
export type ValidatedEditorConfig = z.infer<typeof EditorConfigSchema>;

// ============================================
// Funções de Validação
// ============================================

export function validateBlock(data: unknown): ValidatedCanvasBlock {
  return CanvasBlockSchema.parse(data);
}

export function safeValidateBlock(data: unknown) {
  return CanvasBlockSchema.safeParse(data);
}

export function validateBlocks(data: unknown[]): ValidatedCanvasBlock[] {
  return z.array(CanvasBlockSchema).parse(data);
}

export function safeValidateBlocks(data: unknown) {
  return z.array(CanvasBlockSchema).safeParse(data);
}

export function validateEditorConfig(data: unknown): ValidatedEditorConfig {
  return EditorConfigSchema.parse(data);
}

export function safeValidateEditorConfig(data: unknown) {
  return EditorConfigSchema.safeParse(data);
}

/**
 * Valida e sanitiza blocos, retornando apenas os válidos
 */
export function sanitizeBlocks(data: unknown[]): ValidatedCanvasBlock[] {
  const validBlocks: ValidatedCanvasBlock[] = [];

  for (const item of data) {
    const result = safeValidateBlock(item);
    if (result.success) {
      validBlocks.push(result.data);
    } else {
      console.warn("Bloco inválido ignorado:", result.error.format());
    }
  }

  return validBlocks;
}

/**
 * Verifica se um tipo de bloco é válido
 */
export function isValidBlockType(type: string): type is CanvasBlockType {
  return (blockTypes as readonly string[]).includes(type);
}
