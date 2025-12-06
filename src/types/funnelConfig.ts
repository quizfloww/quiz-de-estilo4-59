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

// Configuração de uma Categoria de Estilo
export interface StyleCategoryConfig {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string; // Descrição mais longa para a página de resultado
  imageUrl: string; // Imagem principal do estilo
  guideImageUrl?: string; // Imagem do guia/material
  characteristics?: string[]; // Características do estilo
  colors?: string[]; // Paleta de cores sugerida
  keywords?: string[]; // Palavras-chave do estilo
}

// Configurações de Resultados Personalizáveis
export interface FunnelResultsConfig {
  // Personalização com Nome do Usuário
  useUserName: boolean;
  greetingTemplate: string; // ex: "Olá, {nome}!"
  resultTitleTemplate: string; // ex: "{nome}, seu estilo predominante é:"
  fallbackName: string; // ex: "Visitante"

  // Layout da Página de Resultado
  resultLayout: "modern" | "classic" | "minimal" | "elegant";
  showPrimaryStyleImage: boolean;
  showPrimaryStyleDescription: boolean;
  primaryStyleImageSize: "sm" | "md" | "lg" | "xl";

  // Ranking e Percentuais
  showPercentages: boolean;
  showSecondaryStyles: boolean;
  maxSecondaryStyles: number; // ex: 3
  showProgressBars: boolean;
  percentageFormat: "number" | "bar" | "both";

  // Guia/Material de Estilo
  showStyleGuide: boolean;
  guideTitle: string; // ex: "Seu Guia de Estilo Personalizado"
  guideDescription?: string;
  showExclusiveBadge: boolean;
  exclusiveBadgeText: string; // ex: "EXCLUSIVO"

  // CTA e Oferta
  ctaEnabled: boolean;
  ctaText: string; // ex: "Garantir Meu Guia Agora"
  ctaUrl: string;
  ctaStyle: "primary" | "secondary" | "gradient" | "animated";
  showCtaIcon: boolean;

  // Preço e Urgência
  showPricing: boolean;
  originalPrice?: string; // ex: "R$ 175,00"
  currentPrice?: string; // ex: "R$ 39,00"
  installments?: string; // ex: "4x de R$ 10,86"
  discountBadge?: string; // ex: "-78% HOJE"

  // Urgência/Countdown
  showCountdown: boolean;
  countdownHours: number;
  countdownMinutes: number;
  countdownSeconds: number;
  countdownMessage?: string; // ex: "Oferta expira em:"

  // Seções da Página de Resultado
  showMentorSection: boolean;
  showTestimonials: boolean;
  showBeforeAfter: boolean;
  showBonusSection: boolean;
  showGuaranteeSection: boolean;
  showSecurePurchase: boolean;

  // Mentor/Especialista
  mentorName?: string;
  mentorTitle?: string;
  mentorDescription?: string;
  mentorImageUrl?: string;
  mentorCredentials?: string[];

  // Garantia
  guaranteeDays: number;
  guaranteeTitle?: string;
  guaranteeDescription?: string;
}

export interface FunnelConfig {
  customDomain?: string;
  seo: FunnelSeoConfig;
  pixel: FunnelPixelConfig;
  utm: FunnelUtmConfig;
  branding: FunnelBrandingConfig;
  analytics: FunnelAnalyticsConfig;
  effects: FunnelEffectsConfig;
  results: FunnelResultsConfig;
  styleCategories: StyleCategoryConfig[];
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
  results: {
    // Personalização com Nome do Usuário
    useUserName: true,
    greetingTemplate: "Olá, {nome}!",
    resultTitleTemplate: "{nome}, seu estilo predominante é:",
    fallbackName: "Visitante",

    // Layout da Página de Resultado
    resultLayout: "modern",
    showPrimaryStyleImage: true,
    showPrimaryStyleDescription: true,
    primaryStyleImageSize: "lg",

    // Ranking e Percentuais
    showPercentages: true,
    showSecondaryStyles: true,
    maxSecondaryStyles: 3,
    showProgressBars: true,
    percentageFormat: "both",

    // Guia/Material de Estilo
    showStyleGuide: true,
    guideTitle: "Seu Guia de Estilo Personalizado",
    guideDescription:
      "Um material exclusivo desenvolvido para ajudar você a aplicar seu estilo no dia a dia.",
    showExclusiveBadge: true,
    exclusiveBadgeText: "EXCLUSIVO",

    // CTA e Oferta
    ctaEnabled: true,
    ctaText: "Garantir Meu Guia Agora",
    ctaUrl:
      "https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912",
    ctaStyle: "primary",
    showCtaIcon: true,

    // Preço e Urgência
    showPricing: true,
    originalPrice: "R$ 175,00",
    currentPrice: "R$ 39,00",
    installments: "4x de R$ 10,86",
    discountBadge: "-78% HOJE",

    // Urgência/Countdown
    showCountdown: true,
    countdownHours: 2,
    countdownMinutes: 47,
    countdownSeconds: 33,
    countdownMessage: "Oferta expira em:",

    // Seções da Página de Resultado
    showMentorSection: true,
    showTestimonials: true,
    showBeforeAfter: true,
    showBonusSection: true,
    showGuaranteeSection: true,
    showSecurePurchase: true,

    // Mentor/Especialista
    mentorName: "Gisele Galvão",
    mentorTitle:
      "Consultora de Imagem e Estilo, Personal Branding e Especialista em Coloração Pessoal",
    mentorDescription:
      "Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico.",
    mentorImageUrl:
      "https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp",
    mentorCredentials: [
      "Especialista em Análise de Estilo",
      "Consultora de Imagem Certificada",
      "Mais de 5.000 mulheres transformadas",
    ],

    // Garantia
    guaranteeDays: 7,
    guaranteeTitle: "7 Dias de Garantia Incondicional",
    guaranteeDescription:
      "Se você não ficar satisfeita, devolvemos 100% do seu investimento.",
  },
  styleCategories: [
    {
      id: "Natural",
      name: "Natural",
      description: "Informal, espontânea, alegre, essencialista",
      detailedDescription:
        "Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
      characteristics: [
        "Conforto",
        "Praticidade",
        "Autenticidade",
        "Simplicidade",
      ],
      colors: ["#8B7355", "#A0522D", "#DEB887", "#F5F5DC"],
    },
    {
      id: "Clássico",
      name: "Clássico",
      description: "Conservadora, séria, organizada",
      detailedDescription:
        "Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp",
      characteristics: ["Elegância", "Atemporalidade", "Qualidade", "Tradição"],
      colors: ["#000080", "#800020", "#F5F5DC", "#FFFFF0"],
    },
    {
      id: "Contemporâneo",
      name: "Contemporâneo",
      description: "Informada, ativa, prática",
      detailedDescription:
        "Você busca um equilíbrio entre o clássico e o moderno, com peças práticas e atuais.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CONTEMPOR%C3%82NEO_vcklxe.webp",
      characteristics: ["Modernidade", "Praticidade", "Versatilidade", "Atual"],
      colors: ["#696969", "#2F4F4F", "#708090", "#DCDCDC"],
    },
    {
      id: "Elegante",
      name: "Elegante",
      description: "Exigente, sofisticada, seletiva",
      detailedDescription:
        "Você tem um olhar refinado para detalhes sofisticados e peças de alta qualidade.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_ELEGANTE_asez1q.webp",
      characteristics: ["Sofisticação", "Refinamento", "Luxo", "Exclusividade"],
      colors: ["#4B0082", "#800080", "#C0C0C0", "#FFD700"],
    },
    {
      id: "Romântico",
      name: "Romântico",
      description: "Feminina, meiga, delicada, sensível",
      detailedDescription:
        "Você valoriza a delicadeza e os detalhes femininos, com muita suavidade.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_ROM%C3%82NTICO_ci4hgk.webp",
      characteristics: ["Delicadeza", "Feminilidade", "Suavidade", "Romance"],
      colors: ["#FFB6C1", "#FFC0CB", "#E6E6FA", "#FFFACD"],
    },
    {
      id: "Sexy",
      name: "Sexy",
      description: "Glamorosa, vaidosa, sensual",
      detailedDescription:
        "Você gosta de valorizar suas curvas e exibir sua sensualidade com confiança.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071349/GUIA_SEXY_t5x2ov.webp",
      characteristics: ["Sensualidade", "Confiança", "Glamour", "Ousadia"],
      colors: ["#8B0000", "#000000", "#C0C0C0", "#FFD700"],
    },
    {
      id: "Dramático",
      name: "Dramático",
      description: "Cosmopolita, moderna e audaciosa",
      detailedDescription:
        "Você tem personalidade forte e gosta de causar impacto com seu visual.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745073346/GUIA_DRAM%C3%81TICO_mpn60d.webp",
      characteristics: ["Impacto", "Força", "Modernidade", "Audácia"],
      colors: ["#000000", "#FFFFFF", "#FF0000", "#C0C0C0"],
    },
    {
      id: "Criativo",
      name: "Criativo",
      description: "Exótica, aventureira, livre",
      detailedDescription:
        "Você aprecia a originalidade e não tem medo de ousar em combinações únicas.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp",
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_CRIATIVO_ntbzph.webp",
      characteristics: [
        "Originalidade",
        "Criatividade",
        "Liberdade",
        "Ousadia",
      ],
      colors: ["#FF6347", "#9400D3", "#00CED1", "#FFD700"],
    },
  ],
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
  results: {
    useUserName: false,
    greetingTemplate: "Olá!",
    resultTitleTemplate: "Seu estilo predominante é:",
    fallbackName: "Visitante",
    resultLayout: "modern",
    showPrimaryStyleImage: true,
    showPrimaryStyleDescription: true,
    primaryStyleImageSize: "md",
    showPercentages: true,
    showSecondaryStyles: true,
    maxSecondaryStyles: 3,
    showProgressBars: true,
    percentageFormat: "both",
    showStyleGuide: false,
    guideTitle: "",
    showExclusiveBadge: false,
    exclusiveBadgeText: "EXCLUSIVO",
    ctaEnabled: false,
    ctaText: "Saiba Mais",
    ctaUrl: "",
    ctaStyle: "primary",
    showCtaIcon: true,
    showPricing: false,
    showCountdown: false,
    countdownHours: 0,
    countdownMinutes: 0,
    countdownSeconds: 0,
    showMentorSection: false,
    showTestimonials: false,
    showBeforeAfter: false,
    showBonusSection: false,
    showGuaranteeSection: false,
    showSecurePurchase: false,
    guaranteeDays: 7,
  },
  styleCategories: [],
};
