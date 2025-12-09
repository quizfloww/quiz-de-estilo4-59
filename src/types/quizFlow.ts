import { CanvasBlock } from "@/types/canvasBlocks";

export type QuizStageType =
  | "intro"
  | "question"
  | "transition"
  | "strategic"
  | "result";

export interface QuizFlowOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
}

export interface QuizFlowTestimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  imageUrl?: string;
  rating?: number;
}

export interface QuizFlowStage {
  id: string;
  type: QuizStageType;
  order: number;
  title: string;
  isEnabled: boolean;
  config: {
    // Header config
    showLogo?: boolean;
    showProgress?: boolean;
    allowBack?: boolean;
    logoUrl?: string;

    // Intro specific
    subtitle?: string;
    imageUrl?: string;
    inputLabel?: string;
    inputPlaceholder?: string;
    buttonText?: string;
    privacyText?: string;
    footerText?: string;

    // Question specific
    question?: string;
    options?: QuizFlowOption[];
    displayType?: "text" | "image" | "both";
    multiSelect?: number;
    autoAdvance?: boolean;

    // Transition specific
    transitionTitle?: string;
    transitionSubtitle?: string;
    transitionMessage?: string;

    // Result specific
    resultLayout?: "classic" | "modern" | "minimal";
    showPercentages?: boolean;
    ctaText?: string;
    ctaUrl?: string;
    descriptionText?: string;
    resultUrl?: string;
    finalPrice?: number;
    originalPrice?: number;
    guaranteeDays?: number;
    guaranteeTitle?: string;
    guaranteeDescription?: string;
    mentorName?: string;
    mentorTitle?: string;
    mentorImageUrl?: string;
    mentorDescription?: string;
    benefits?: string[];
    testimonials?: QuizFlowTestimonial[];
    ctaVariant?: string;
    showCtaIcon?: boolean;
    urgencyText?: string;
    securityBadges?: string[];
    paymentMethods?: string[];
    secureText?: string;
    showPercentage?: boolean;
    showDescription?: boolean;
    styleLayout?: string;
    styleImageSize?: string;
    maxSecondaryStyles?: number;
    showSecondaryPercentage?: boolean;
    blocks?: CanvasBlock[];
    currency?: string;
    priceItems?: Array<{ title: string; description: string }>;
    heroImage?: string;
    heroImage2?: string;
    countdownHours?: number;
    countdownMinutes?: number;
    countdownSeconds?: number;
    countdownVariant?: string;
    expiryMessage?: string;
    greetingTitle?: string;
    greetingSubtitle?: string;
    hookTitle?: string;
    hookSubtitle?: string;
    hookStyle?: string;
    showHookCta?: boolean;
    guideImageUrl?: string;
    benefitsLayout?: string;
    benefitsColumns?: number;
    showBenefitIcons?: boolean;
    beforeAfterItems?: unknown[];
    beforeAfterLayout?: string;
    beforeAfterTitle?: string;
    motivationTitle?: string;
    motivationSubtitle?: string;
    motivationPoints?: unknown[];
    motivationImageUrl?: string;
    products?: Array<{ url: string; alt: string }>;
    bonusItems?: unknown[];
    testimonials_extended?: unknown[];
    faqItems?: unknown[];
    // Allow any additional config properties
    [key: string]: unknown;
  };
}

export interface QuizFlowConfig {
  id: string;
  name: string;
  version: string;
  stages: QuizFlowStage[];
  globalConfig: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  styleCategories: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    guideImage?: string;
  }[];
}

export interface QuizFlowEditorState {
  config: QuizFlowConfig;
  activeStageId: string | null;
  isDirty: boolean;
  previewMode: "desktop" | "mobile";
}
