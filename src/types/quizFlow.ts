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
    descriptionText?: string; // Texto descritivo adicional
    resultUrl?: string; // URL para resultados personalizados
    finalPrice?: number; // Preço final para CTAs de venda
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
  }[];
}

export interface QuizFlowEditorState {
  config: QuizFlowConfig;
  activeStageId: string | null;
  isDirty: boolean;
  previewMode: "desktop" | "mobile";
}
