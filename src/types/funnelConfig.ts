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

export interface FunnelConfig {
  customDomain?: string;
  seo: FunnelSeoConfig;
  pixel: FunnelPixelConfig;
  utm: FunnelUtmConfig;
  branding: FunnelBrandingConfig;
  analytics: FunnelAnalyticsConfig;
}

// Default configuration for the main quiz template
export const DEFAULT_QUIZ_CONFIG: FunnelConfig = {
  seo: {
    title: 'Teste de Estilo Pessoal | Gisele Galvão',
    description: 'Descubra seu estilo de moda único com nosso teste gratuito. Identifique sua essência e transforme seu guarda-roupa!',
    keywords: ['estilo pessoal', 'consultoria de imagem', 'moda', 'quiz de estilo'],
    ogImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up',
  },
  pixel: {
    enabled: false,
    pixelId: '',
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
    logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt: 'Gisele Galvão',
    logoHeight: 56,
    primaryColor: '#B89B7A',
    secondaryColor: '#aa6b5d',
    backgroundColor: '#fffaf7',
    textColor: '#432818',
  },
  analytics: {},
};

// Empty configuration for blank funnels
export const EMPTY_FUNNEL_CONFIG: FunnelConfig = {
  seo: {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
  },
  pixel: {
    enabled: false,
    pixelId: '',
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
    logo: '',
    logoAlt: '',
    logoHeight: 56,
    primaryColor: '#B89B7A',
    secondaryColor: '#aa6b5d',
    backgroundColor: '#ffffff',
    textColor: '#333333',
  },
  analytics: {},
};
