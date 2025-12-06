// Funnel Configuration Types

export interface FunnelSeoConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  favicon?: string;
}

export interface FunnelPixelConfig {
  enabled: boolean;
  pixelId: string;
  trackEvents: {
    pageView: boolean;
    quizStart: boolean;
    quizProgress: boolean;
    quizComplete: boolean;
    ctaClick: boolean;
  };
}

export interface FunnelUtmConfig {
  captureEnabled: boolean;
  defaultSource?: string;
  defaultMedium?: string;
  defaultCampaign?: string;
}

export interface FunnelBrandingConfig {
  logo: string;
  logoAlt: string;
  logoHeight: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
}

export interface FunnelAnalyticsConfig {
  googleAnalyticsId?: string;
  gtmId?: string;
  hotjarId?: string;
}

// Configurações de Efeitos Visuais Globais
export interface FunnelEffectsConfig {
  // Efeitos de Fundo (EnchantedBackground)
  enableFloatingEmojis: boolean;
  effectsIntensity: number; // 0 a 1
  customIntroEmojis?: string[]; // ex: ['✨', '🌟', '💫']
  customQuizEmojis?: string[]; // ex: ['💭', '🤔', '💡']
  customStrategicEmojis?: string[]; // ex: ['🎯', '💎', '🚀']
  customResultEmojis?: string[]; // ex: ['🎉', '🎊', '🌟']

  // Barra de Progresso
  progressStyle: "simple" | "morphing" | "minimal";
  showProgressShimmer: boolean;
  progressColors?: {
    normal?: string;
    strategic?: string;
    complete?: string;
  };

  // Animações de Transição
  transitionType: "fade" | "slide" | "scale" | "none";
  transitionDuration: number; // em ms
  transitionDirection?: "left" | "right" | "up" | "down";

  // Animações de Opções
  staggerOptions: boolean; // Animar opções em sequência
  staggerDelay: number; // Delay entre cada opção em ms
}

export interface FunnelConfig {
  customDomain?: string;
  seo: FunnelSeoConfig;
  pixel: FunnelPixelConfig;
  utm: FunnelUtmConfig;
  branding: FunnelBrandingConfig;
  analytics: FunnelAnalyticsConfig;
  effects: FunnelEffectsConfig;
}

// Default configuration for the main quiz template
export const DEFAULT_QUIZ_CONFIG: FunnelConfig = {
  seo: {
    title: "Teste de Estilo Pessoal | Gisele Galvão",
    description:
      "Descubra seu estilo de moda único com nosso teste gratuito. Identifique sua essência e transforme seu guarda-roupa!",
    keywords: [
      "estilo pessoal",
      "consultoria de imagem",
      "moda",
      "quiz de estilo",
    ],
    ogImage:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up",
  },
  pixel: {
    enabled: false,
    pixelId: "",
    trackEvents: {
      pageView: true,
      quizStart: true,
      quizProgress: true,
      quizComplete: true,
      ctaClick: true,
    },
  },
  utm: {
    captureEnabled: true,
  },
  branding: {
    logo: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
    logoAlt: "Gisele Galvão",
    logoHeight: 56,
    primaryColor: "#B89B7A",
    secondaryColor: "#aa6b5d",
    backgroundColor: "#fffaf7",
    textColor: "#432818",
  },
  analytics: {},
  effects: {
    // Efeitos de Fundo
    enableFloatingEmojis: true,
    effectsIntensity: 0.5,
    customIntroEmojis: ["✨", "🌟", "💫", "⭐"],
    customQuizEmojis: ["💭", "🤔", "💡", "🧠"],
    customStrategicEmojis: ["🎯", "💎", "🚀", "⚡"],
    customResultEmojis: ["🎉", "🎊", "🌟", "✨"],
    // Barra de Progresso
    progressStyle: "morphing",
    showProgressShimmer: true,
    progressColors: {
      normal: "#B89B7A",
      strategic: "#aa6b5d",
      complete: "#B89B7A",
    },
    // Animações de Transição
    transitionType: "slide",
    transitionDuration: 300,
    transitionDirection: "left",
    // Animações de Opções
    staggerOptions: true,
    staggerDelay: 50,
  },
};

// Empty configuration for blank funnels
export const EMPTY_FUNNEL_CONFIG: FunnelConfig = {
  seo: {
    title: "",
    description: "",
    keywords: [],
    ogImage: "",
  },
  pixel: {
    enabled: false,
    pixelId: "",
    trackEvents: {
      pageView: true,
      quizStart: true,
      quizProgress: true,
      quizComplete: true,
      ctaClick: true,
    },
  },
  utm: {
    captureEnabled: true,
  },
  branding: {
    logo: "",
    logoAlt: "",
    logoHeight: 56,
    primaryColor: "#B89B7A",
    secondaryColor: "#aa6b5d",
    backgroundColor: "#ffffff",
    textColor: "#333333",
  },
  analytics: {},
  effects: {
    enableFloatingEmojis: false,
    effectsIntensity: 0.5,
    progressStyle: "simple",
    showProgressShimmer: false,
    transitionType: "fade",
    transitionDuration: 300,
    staggerOptions: false,
    staggerDelay: 50,
  },
};
