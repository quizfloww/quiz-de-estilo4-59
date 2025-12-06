import {
  CanvasBlock,
  CanvasBlockType,
  CanvasBlockContent,
} from "@/types/canvasBlocks";
import { FunnelStage } from "@/hooks/useFunnelStages";
import { v4 as uuidv4 } from "uuid";

export const convertStageToBlocks = (
  stage: FunnelStage,
  totalStages: number,
  currentIndex: number
): CanvasBlock[] => {
  const blocks: CanvasBlock[] = [];
  const config = (stage.config as Record<string, any>) || {};
  let order = 0;

  // Calcular progresso
  const progress =
    totalStages > 0 ? ((currentIndex + 1) / totalStages) * 100 : 0;

  // 1. Header Block (sempre presente)
  blocks.push({
    id: `${stage.id}-header`,
    type: "header",
    order: order++,
    content: {
      showLogo: config.showLogo !== false,
      logoUrl:
        config.logoUrl ||
        "https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png",
      showProgress: config.showProgress !== false,
      showBackButton: config.allowBack !== false,
      progress,
    },
  });

  // 2. Heading Block baseado no tipo
  if (stage.type === "question" || stage.type === "strategic") {
    blocks.push({
      id: `${stage.id}-heading`,
      type: "heading",
      order: order++,
      content: {
        text: config.question || stage.title,
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  } else if (stage.type === "intro") {
    blocks.push({
      id: `${stage.id}-heading`,
      type: "heading",
      order: order++,
      content: {
        text: config.title || stage.title || "Teste de Estilo Pessoal",
        fontSize: "3xl",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  } else if (stage.type === "transition") {
    blocks.push({
      id: `${stage.id}-heading`,
      type: "heading",
      order: order++,
      content: {
        text:
          config.transitionTitle ||
          stage.title ||
          "Enquanto calculamos o seu resultado...",
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  } else if (stage.type === "result") {
    // Blocos especiais para resultado - seguindo a estrutura da ResultPage.tsx

    // 1. Personalized Hook (gancho personalizado)
    blocks.push({
      id: `${stage.id}-personalizedHook`,
      type: "personalizedHook",
      order: order++,
      content: {
        hookTitle: config.hookTitle || "",
        hookSubtitle: config.hookSubtitle || "",
        hookStyle: config.hookStyle || "elegant",
        showCta: config.showHookCta !== false,
      },
    });

    // 2. Countdown (urgência)
    blocks.push({
      id: `${stage.id}-countdown`,
      type: "countdown",
      order: order++,
      content: {
        hours: config.countdownHours ?? 2,
        minutes: config.countdownMinutes ?? 47,
        seconds: config.countdownSeconds ?? 33,
        countdownVariant: config.countdownVariant || "dramatic",
        expiryMessage:
          config.expiryMessage || "Esta oferta expira ao sair desta página!",
      },
    });

    // 3. Style Result
    blocks.push({
      id: `${stage.id}-styleResult`,
      type: "styleResult",
      order: order++,
      content: {
        showPercentage: config.showPercentage !== false,
        showDescription: config.showDescription !== false,
        layout: config.styleLayout || "stacked",
        styleImageSize: config.styleImageSize || "lg",
      },
    });

    // 4. Secondary Styles
    blocks.push({
      id: `${stage.id}-secondaryStyles`,
      type: "secondaryStyles",
      order: order++,
      content: {
        maxSecondaryStyles: config.maxSecondaryStyles ?? 3,
        showSecondaryPercentage: config.showSecondaryPercentage !== false,
      },
    });

    // 5. Style Guide Visual
    blocks.push({
      id: `${stage.id}-styleGuide`,
      type: "styleGuide",
      order: order++,
      content: {
        showSecondaryGuides: config.showSecondaryGuides !== false,
        guideImageSize: config.guideImageSize || "lg",
        showExclusiveBadge: config.showExclusiveBadge !== false,
        imageUrl: config.guideImageUrl || "",
      },
    });

    // 6. Benefits List (CTA Section)
    blocks.push({
      id: `${stage.id}-benefitsList`,
      type: "benefitsList",
      order: order++,
      content: {
        benefits: config.benefits || [],
        benefitsLayout: config.benefitsLayout || "list",
        benefitsColumns: config.benefitsColumns || 1,
        showBenefitIcons: config.showBenefitIcons !== false,
      },
    });

    // 7. Before/After Transformation
    blocks.push({
      id: `${stage.id}-beforeAfter`,
      type: "beforeAfter",
      order: order++,
      content: {
        beforeAfterItems: config.beforeAfterItems || [],
        beforeAfterLayout: config.beforeAfterLayout || "side-by-side",
        beforeAfterTitle: config.beforeAfterTitle || "Transformações Reais",
      },
    });

    // 8. Motivation Section
    blocks.push({
      id: `${stage.id}-motivation`,
      type: "motivation",
      order: order++,
      content: {
        motivationTitle: config.motivationTitle || "",
        motivationSubtitle: config.motivationSubtitle || "",
        motivationPoints: config.motivationPoints || [],
        motivationImageUrl: config.motivationImageUrl || "",
      },
    });

    // 9. Bonus Section
    blocks.push({
      id: `${stage.id}-bonus`,
      type: "bonus",
      order: order++,
      content: {
        bonusItems: config.bonusItems || [],
        bonusTitle: config.bonusTitle || "Bônus Exclusivos",
        bonusSubtitle: config.bonusSubtitle || "",
      },
    });

    // 10. Testimonials (múltiplos)
    blocks.push({
      id: `${stage.id}-testimonials`,
      type: "testimonials",
      order: order++,
      content: {
        testimonials: config.testimonials || [],
        testimonialsLayout: config.testimonialsLayout || "grid",
        testimonialsTitle:
          config.testimonialsTitle || "O Que Nossas Alunas Dizem",
      },
    });

    // 11. Price Anchor
    blocks.push({
      id: `${stage.id}-priceAnchor`,
      type: "priceAnchor",
      order: order++,
      content: {
        finalPrice: config.finalPrice ?? 39,
        totalOriginal: config.totalOriginal ?? 175,
        currency: config.currency || "R$",
        priceItems: config.priceItems || [],
        discountBadge: config.discountBadge || "-78% HOJE",
      },
    });

    // 12. Guarantee
    blocks.push({
      id: `${stage.id}-guarantee`,
      type: "guarantee",
      order: order++,
      content: {
        guaranteeDays: config.guaranteeDays ?? 7,
        guaranteeTitle:
          config.guaranteeTitle || "7 Dias de Garantia Incondicional",
        guaranteeDescription: config.guaranteeDescription || "",
        guaranteeImageUrl: config.guaranteeImageUrl || "",
      },
    });

    // 13. Mentor Section
    blocks.push({
      id: `${stage.id}-mentor`,
      type: "mentor",
      order: order++,
      content: {
        mentorName: config.mentorName || "Gisele Galvão",
        mentorTitle: config.mentorTitle || "Consultora de Imagem & Estilo",
        mentorDescription: config.mentorDescription || "",
        mentorImageUrl: config.mentorImageUrl || "",
        mentorCredentials: config.mentorCredentials || [],
      },
    });

    // 14. CTA Offer (principal)
    blocks.push({
      id: `${stage.id}-ctaOffer`,
      type: "ctaOffer",
      order: order++,
      content: {
        ctaText: config.ctaText || "GARANTIR MEU GUIA AGORA",
        ctaVariant: config.ctaVariant || "green",
        ctaUrl: config.ctaUrl || "",
        showCtaIcon: config.showCtaIcon !== false,
        urgencyText: config.urgencyText || "",
      },
    });

    // 15. Secure Purchase
    blocks.push({
      id: `${stage.id}-securePurchase`,
      type: "securePurchase",
      order: order++,
      content: {
        securityBadges: config.securityBadges || [],
        paymentMethods: config.paymentMethods || [],
        secureText: config.secureText || "",
      },
    });

    return blocks;
  }

  // 3. Image Block (se houver)
  if (config.imageUrl) {
    blocks.push({
      id: `${stage.id}-image`,
      type: "image",
      order: order++,
      content: {
        imageUrl: config.imageUrl,
        imageAlt: "Imagem",
        maxWidth: "384px",
        borderRadius: "0.5rem",
      },
    });
  }

  // 4. Text Block (subtítulo ou mensagem de transição)
  if (config.subtitle) {
    blocks.push({
      id: `${stage.id}-subtitle`,
      type: "text",
      order: order++,
      content: {
        text: config.subtitle,
        fontSize: "base",
        textAlign: "center",
      },
    });
  }

  if (config.transitionSubtitle) {
    blocks.push({
      id: `${stage.id}-transition-subtitle`,
      type: "text",
      order: order++,
      content: {
        text: config.transitionSubtitle,
        fontSize: "base",
        textAlign: "center",
      },
    });
  }

  if (config.transitionMessage) {
    blocks.push({
      id: `${stage.id}-transition-message`,
      type: "text",
      order: order++,
      content: {
        text: config.transitionMessage,
        fontSize: "sm",
        textAlign: "center",
      },
      style: {
        marginTop: "1rem",
      },
    });
  }

  // 5. Input Block (para intro)
  if (stage.type === "intro") {
    blocks.push({
      id: `${stage.id}-input`,
      type: "input",
      order: order++,
      content: {
        label: config.inputLabel || "NOME",
        placeholder: config.inputPlaceholder || "Digite seu nome aqui...",
        inputType: "text",
        required: true,
      },
    });
  }

  // 6. Spacer antes das opções
  if (config.options && config.options.length > 0) {
    blocks.push({
      id: `${stage.id}-spacer`,
      type: "spacer",
      order: order++,
      content: {
        height: "1rem",
      },
    });
  }

  // 7. Options Block (para questões)
  if (config.options && config.options.length > 0) {
    const hasImages = config.options.some((opt: any) => opt.imageUrl);

    blocks.push({
      id: `${stage.id}-options`,
      type: "options",
      order: order++,
      content: {
        displayType: config.displayType || (hasImages ? "both" : "text"),
        multiSelect: config.multiSelect || 1,
        autoAdvance: config.autoAdvance !== false,
        columns: config.columns ?? (hasImages ? 2 : 1),
        optionTextSize: config.optionTextSize || "base",
        optionImageSize: config.optionImageSize || "md",
        showCheckIcon: config.showCheckIcon !== false,
        options: config.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
          imageUrl: opt.imageUrl,
          styleCategory: opt.styleCategory,
          points: opt.points || 1,
        })),
      },
    });
  }

  // 8. Button Block
  blocks.push({
    id: `${stage.id}-button`,
    type: "button",
    order: order++,
    content: {
      buttonText: config.buttonText || "Continuar",
      buttonVariant: "primary",
      fullWidth: true,
    },
  });

  return blocks;
};

export const createEmptyBlock = (type: CanvasBlockType): CanvasBlock => {
  const id = uuidv4();

  const defaultContent: Record<CanvasBlockType, CanvasBlockContent> = {
    header: {
      showLogo: true,
      showProgress: true,
      showBackButton: true,
      progress: 0,
    },
    heading: {
      text: "Novo Título",
      fontSize: "2xl",
      fontWeight: "bold",
      textAlign: "center",
    },
    text: {
      text: "Novo texto",
      fontSize: "base",
      textAlign: "center",
    },
    image: {
      imageUrl: "",
      imageAlt: "Imagem",
      maxWidth: "384px",
    },
    input: {
      label: "Campo",
      placeholder: "Digite aqui...",
      inputType: "text",
      required: false,
    },
    options: {
      displayType: "text",
      multiSelect: 1,
      autoAdvance: true,
      options: [],
      columns: 1,
      optionTextSize: "base",
      optionImageSize: "md",
      showCheckIcon: true,
    },
    button: {
      buttonText: "Continuar",
      buttonVariant: "primary",
      fullWidth: true,
    },
    spacer: {
      height: "1rem",
    },
    divider: {},
    // Blocos de Resultado
    styleResult: {
      showPercentage: true,
      showDescription: true,
      layout: "stacked",
      styleImageSize: "lg",
    },
    secondaryStyles: {
      maxSecondaryStyles: 3,
      showSecondaryPercentage: true,
    },
    styleProgress: {
      showLabels: true,
      maxStylesShown: 8,
    },
    // Blocos de Oferta
    priceAnchor: {
      finalPrice: 39,
      totalOriginal: 175,
      currency: "R$",
    },
    countdown: {
      hours: 2,
      minutes: 47,
      seconds: 33,
      countdownVariant: "dramatic",
      expiryMessage: "Esta oferta expira ao sair desta página!",
    },
    testimonial: {
      testimonialVariant: "card",
    },
    benefitsList: {
      benefitsLayout: "list",
      benefitsColumns: 1,
      showBenefitIcons: true,
    },
    guarantee: {
      guaranteeDays: 7,
      guaranteeTitle: "7 Dias de Garantia Incondicional",
      guaranteeDescription: "",
      guaranteeImageUrl: "",
    },
    ctaOffer: {
      ctaText: "GARANTIR MEU GUIA AGORA",
      ctaVariant: "green",
      showCtaIcon: true,
      ctaUrl: "",
      urgencyText: "",
    },
    faq: {
      faqStyle: "accordion",
    },
    socialProof: {
      socialProofText: "+3.000 mulheres já descobriram seu estilo",
      socialProofIcon: "users",
      socialProofVariant: "badge",
    },
    // Novos blocos de Resultado
    personalizedHook: {
      hookTitle: "",
      hookSubtitle: "",
      hookStyle: "elegant",
      showCta: false,
    },
    styleGuide: {
      showSecondaryGuides: true,
      guideImageSize: "lg",
      showExclusiveBadge: true,
    },
    beforeAfter: {
      beforeAfterItems: [],
      beforeAfterLayout: "side-by-side",
      beforeAfterTitle: "Transformações Reais",
    },
    // Novos blocos de Vendas
    motivation: {
      motivationTitle: "Por Que Conhecer Seu Estilo Transforma Sua Vida",
      motivationSubtitle: "",
      motivationPoints: [],
      motivationImageUrl: "",
    },
    bonus: {
      bonusItems: [],
      bonusTitle: "Bônus Exclusivos",
      bonusSubtitle: "",
    },
    testimonials: {
      testimonials: [],
      testimonialsLayout: "grid",
      testimonialsTitle: "O Que Nossas Alunas Dizem",
    },
    mentor: {
      mentorName: "Gisele Galvão",
      mentorTitle: "Consultora de Imagem & Estilo",
      mentorDescription: "",
      mentorImageUrl: "",
      mentorCredentials: [],
    },
    securePurchase: {
      securityBadges: [],
      paymentMethods: [],
      secureText: "",
    },
  };

  return {
    id,
    type,
    order: 0,
    content: defaultContent[type],
  };
};

export const blocksToStageConfig = (
  blocks: CanvasBlock[]
): Record<string, any> => {
  const config: Record<string, any> = {};

  blocks.forEach((block) => {
    switch (block.type) {
      case "header":
        config.showLogo = block.content.showLogo;
        config.logoUrl = block.content.logoUrl;
        config.showProgress = block.content.showProgress;
        config.allowBack = block.content.showBackButton;
        break;
      case "heading":
        config.question = block.content.text;
        config.title = block.content.text;
        break;
      case "image":
        config.imageUrl = block.content.imageUrl;
        break;
      case "text":
        if (!config.subtitle) {
          config.subtitle = block.content.text;
        }
        break;
      case "input":
        config.inputLabel = block.content.label;
        config.inputPlaceholder = block.content.placeholder;
        break;
      case "options":
        config.options = block.content.options;
        config.displayType = block.content.displayType;
        config.multiSelect = block.content.multiSelect;
        config.autoAdvance = block.content.autoAdvance;
        config.columns = block.content.columns;
        config.optionTextSize = block.content.optionTextSize;
        config.optionImageSize = block.content.optionImageSize;
        config.showCheckIcon = block.content.showCheckIcon;
        break;
      case "button":
        config.buttonText = block.content.buttonText;
        break;
      case "styleResult":
        config.showPercentage = block.content.showPercentage;
        config.showDescription = block.content.showDescription;
        config.styleLayout = block.content.layout;
        config.styleImageSize = block.content.styleImageSize;
        break;
      case "secondaryStyles":
        config.maxSecondaryStyles = block.content.maxSecondaryStyles;
        config.showSecondaryPercentage = block.content.showSecondaryPercentage;
        break;
      case "priceAnchor":
        config.finalPrice = block.content.finalPrice;
        config.totalOriginal = block.content.totalOriginal;
        config.currency = block.content.currency;
        config.priceItems = block.content.priceItems;
        break;
      case "ctaOffer":
        config.ctaText = block.content.ctaText;
        config.ctaUrl = block.content.ctaUrl;
        config.ctaVariant = block.content.ctaVariant;
        config.showCtaIcon = block.content.showCtaIcon;
        config.urgencyText = block.content.urgencyText;
        break;
      case "guarantee":
        config.guaranteeDays = block.content.guaranteeDays;
        config.guaranteeTitle = block.content.guaranteeTitle;
        config.guaranteeDescription = block.content.guaranteeDescription;
        config.guaranteeImageUrl = block.content.guaranteeImageUrl;
        break;
      // Novos blocos de Resultado
      case "personalizedHook":
        config.hookTitle = block.content.hookTitle;
        config.hookSubtitle = block.content.hookSubtitle;
        config.hookStyle = block.content.hookStyle;
        config.showHookCta = block.content.showCta;
        break;
      case "styleGuide":
        config.showSecondaryGuides = block.content.showSecondaryGuides;
        config.guideImageSize = block.content.guideImageSize;
        config.showExclusiveBadge = block.content.showExclusiveBadge;
        config.guideImageUrl = block.content.imageUrl;
        break;
      case "beforeAfter":
        config.beforeAfterItems = block.content.beforeAfterItems;
        config.beforeAfterLayout = block.content.beforeAfterLayout;
        config.beforeAfterTitle = block.content.beforeAfterTitle;
        break;
      case "countdown":
        config.countdownHours = block.content.hours;
        config.countdownMinutes = block.content.minutes;
        config.countdownSeconds = block.content.seconds;
        config.countdownVariant = block.content.countdownVariant;
        config.expiryMessage = block.content.expiryMessage;
        break;
      case "benefitsList":
        config.benefits = block.content.benefits;
        config.benefitsLayout = block.content.benefitsLayout;
        config.benefitsColumns = block.content.benefitsColumns;
        config.showBenefitIcons = block.content.showBenefitIcons;
        break;
      // Novos blocos de Vendas
      case "motivation":
        config.motivationTitle = block.content.motivationTitle;
        config.motivationSubtitle = block.content.motivationSubtitle;
        config.motivationPoints = block.content.motivationPoints;
        config.motivationImageUrl = block.content.motivationImageUrl;
        break;
      case "bonus":
        config.bonusItems = block.content.bonusItems;
        config.bonusTitle = block.content.bonusTitle;
        config.bonusSubtitle = block.content.bonusSubtitle;
        break;
      case "testimonials":
        config.testimonials = block.content.testimonials;
        config.testimonialsLayout = block.content.testimonialsLayout;
        config.testimonialsTitle = block.content.testimonialsTitle;
        break;
      case "mentor":
        config.mentorName = block.content.mentorName;
        config.mentorTitle = block.content.mentorTitle;
        config.mentorDescription = block.content.mentorDescription;
        config.mentorImageUrl = block.content.mentorImageUrl;
        config.mentorCredentials = block.content.mentorCredentials;
        break;
      case "securePurchase":
        config.securityBadges = block.content.securityBadges;
        config.paymentMethods = block.content.paymentMethods;
        config.secureText = block.content.secureText;
        break;
    }
  });

  return config;
};
