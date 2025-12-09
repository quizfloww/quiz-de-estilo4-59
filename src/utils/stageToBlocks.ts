import {
  CanvasBlock,
  CanvasBlockType,
  CanvasBlockContent,
} from "@/types/canvasBlocks";
import { FunnelStage } from "@/hooks/useFunnelStages";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Helpers Tipados para Extração de Config
// ============================================

function getConfigString(
  config: Record<string, unknown>,
  key: string,
  defaultValue: string = ""
): string {
  const value = config[key];
  return typeof value === "string" ? value : defaultValue;
}

function getConfigBoolean(
  config: Record<string, unknown>,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = config[key];
  return typeof value === "boolean" ? value : defaultValue;
}

function getConfigNumber(
  config: Record<string, unknown>,
  key: string,
  defaultValue: number = 0
): number {
  const value = config[key];
  return typeof value === "number" ? value : defaultValue;
}

function getConfigArray<T = unknown>(
  config: Record<string, unknown>,
  key: string,
  defaultValue: T[] = []
): T[] {
  const value = config[key];
  return Array.isArray(value) ? value : defaultValue;
}

// ============================================
// Conversão de Stage para Blocos
// ============================================

export const convertStageToBlocks = (
  stage: FunnelStage,
  totalStages: number,
  currentIndex: number
): CanvasBlock[] => {
  const blocks: CanvasBlock[] = [];
  const config = (stage.config as Record<string, unknown>) || {};
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
      showLogo: getConfigBoolean(config, "showLogo", true),
      logoUrl: getConfigString(
        config,
        "logoUrl",
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.png"
      ),
      showProgress: getConfigBoolean(config, "showProgress", true),
      showBackButton: getConfigBoolean(config, "allowBack", true),
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
        text: getConfigString(config, "question", stage.title),
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  } else if (stage.type === "intro") {
    // Para intro, o subtitle é o texto principal (como na página publicada)
    blocks.push({
      id: `${stage.id}-heading`,
      type: "heading",
      order: order++,
      content: {
        text: getConfigString(
          config,
          "subtitle",
          getConfigString(
            config,
            "title",
            stage.title ||
              "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você."
          )
        ),
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
        color: "#432818", // Cor padrão do tema da Gisele Galvão
      },
    });
  } else if (stage.type === "transition") {
    blocks.push({
      id: `${stage.id}-heading`,
      type: "heading",
      order: order++,
      content: {
        text: getConfigString(
          config,
          "transitionTitle",
          stage.title || "Enquanto calculamos o seu resultado..."
        ),
        fontSize: "2xl",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  } else if (stage.type === "result") {
    // Blocos especiais para resultado - seguindo a estrutura da ResultPage.tsx

    // 1. Personalized Hook (gancho personalizado com saudação)
    blocks.push({
      id: `${stage.id}-personalizedHook`,
      type: "personalizedHook",
      order: order++,
      content: {
        // Saudação personalizada com nome do usuário
        showGreeting: getConfigBoolean(config, "showGreeting", true),
        greetingTemplate: getConfigString(
          config,
          "greetingTemplate",
          "Olá, {nome}!"
        ),
        greetingSubtitle: getConfigString(
          config,
          "greetingSubtitle",
          "Seu Estilo Predominante é:"
        ),
        // Gancho de resultado
        hookTitle: getConfigString(config, "hookTitle", ""),
        hookSubtitle: getConfigString(config, "hookSubtitle", ""),
        hookStyle: getConfigString(config, "hookStyle", "elegant") as "bold" | "elegant" | "minimal",
        showCta: getConfigBoolean(config, "showHookCta", true),
      },
    });

    // 2. Countdown (urgência)
    blocks.push({
      id: `${stage.id}-countdown`,
      type: "countdown",
      order: order++,
      content: {
        hours: getConfigNumber(config, "countdownHours", 2),
        minutes: getConfigNumber(config, "countdownMinutes", 47),
        seconds: getConfigNumber(config, "countdownSeconds", 33),
        countdownVariant: getConfigString(config, "countdownVariant", "dramatic") as "dramatic" | "minimal" | "simple",
        expiryMessage: getConfigString(config, "expiryMessage", "Esta oferta expira ao sair desta página!"),
      },
    });

    // 3. Style Result
    blocks.push({
      id: `${stage.id}-styleResult`,
      type: "styleResult",
      order: order++,
      content: {
        showPercentage: getConfigBoolean(config, "showPercentage", true),
        showDescription: getConfigBoolean(config, "showDescription", true),
        layout: getConfigString(config, "styleLayout", "stacked") as "side-by-side" | "stacked",
        styleImageSize: getConfigString(config, "styleImageSize", "lg") as "sm" | "md" | "lg" | "xl",
      },
    });

    // 4. Secondary Styles
    blocks.push({
      id: `${stage.id}-secondaryStyles`,
      type: "secondaryStyles",
      order: order++,
      content: {
        maxSecondaryStyles: getConfigNumber(config, "maxSecondaryStyles", 3),
        showSecondaryPercentage: getConfigBoolean(config, "showSecondaryPercentage", true),
      },
    });

    // 5. Style Guide Visual
    blocks.push({
      id: `${stage.id}-styleGuide`,
      type: "styleGuide",
      order: order++,
      content: {
        showSecondaryGuides: getConfigBoolean(config, "showSecondaryGuides", true),
        guideImageSize: getConfigString(config, "guideImageSize", "lg") as "sm" | "md" | "lg" | "xl",
        showExclusiveBadge: getConfigBoolean(config, "showExclusiveBadge", true),
        imageUrl: getConfigString(config, "guideImageUrl", ""),
      },
    });

    // 6. Benefits List (CTA Section)
    blocks.push({
      id: `${stage.id}-benefitsList`,
      type: "benefitsList",
      order: order++,
      content: {
        benefits: getConfigArray(config, "benefits", []),
        benefitsLayout: getConfigString(config, "benefitsLayout", "list") as "grid" | "list",
        benefitsColumns: (getConfigNumber(config, "benefitsColumns", 1) || 1) as 1 | 2 | 3,
        showBenefitIcons: getConfigBoolean(config, "showBenefitIcons", true),
      },
    });

    // 7. Before/After Transformation
    blocks.push({
      id: `${stage.id}-beforeAfter`,
      type: "beforeAfter",
      order: order++,
      content: {
        beforeAfterItems: getConfigArray(config, "beforeAfterItems", [
          {
            id: "transformation-adriana",
            beforeImage:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430335/ADRIANA-_ANTES_E_DEPOIS_ttgifc.png",
            afterImage:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430335/ADRIANA-_ANTES_E_DEPOIS_ttgifc.png",
            name: "Adriana",
            description:
              "De básico para elegante, mantendo o conforto e autenticidade",
          },
          {
            id: "transformation-mariangela",
            beforeImage:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430348/MARIANGELA_-_ANTES_E_DEPOIS_ipuoap.png",
            afterImage:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430348/MARIANGELA_-_ANTES_E_DEPOIS_ipuoap.png",
            name: "Mariangela",
            description:
              "Do casual ao sofisticado, valorizando seu tipo de corpo",
          },
        ]),
        beforeAfterLayout: getConfigString(config, "beforeAfterLayout", "side-by-side") as "side-by-side" | "slider" | "stacked",
        beforeAfterTitle: getConfigString(config, "beforeAfterTitle", "Transformações Reais"),
      },
    });

    // 8. Motivation Section
    blocks.push({
      id: `${stage.id}-motivation`,
      type: "motivation",
      order: order++,
      content: {
        motivationTitle: getConfigString(config, "motivationTitle", ""),
        motivationSubtitle: getConfigString(config, "motivationSubtitle", ""),
        motivationPoints: getConfigArray<string>(config, "motivationPoints", []),
        motivationImageUrl: getConfigString(config, "motivationImageUrl", ""),
      },
    });

    // 9. Bonus Section
    blocks.push({
      id: `${stage.id}-bonus`,
      type: "bonus",
      order: order++,
      content: {
        bonusItems: getConfigArray(config, "bonusItems", []),
        bonusTitle: getConfigString(config, "bonusTitle", "Bônus Exclusivos"),
        bonusSubtitle: getConfigString(config, "bonusSubtitle", ""),
      },
    });

    // 10. Testimonials (múltiplos)
    blocks.push({
      id: `${stage.id}-testimonials`,
      type: "testimonials",
      order: order++,
      content: {
        testimonials: getConfigArray(config, "testimonials", [
          {
            id: "1",
            name: "Sônia",
            role: "Cliente",
            text: "Incrível como descobrir meu estilo mudou minha autoestima. Agora sei exatamente o que comprar!",
            imageUrl:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_S%C3%94NIA_q0g9cq.png",
            rating: 5,
          },
          {
            id: "2",
            name: "Patrícia",
            role: "Cliente",
            text: "O guia é muito completo! Finalmente entendi como valorizar meu corpo e personalidade.",
            imageUrl:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_PATR%C3%8DCIA_x0mhud.png",
            rating: 5,
          },
          {
            id: "3",
            name: "Mariangela",
            role: "Cliente",
            text: "Transformação incrível! Antes eu comprava por impulso, agora tenho direcionamento claro.",
            imageUrl:
              "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_MARIANGELA_sj7lki.png",
            rating: 5,
          },
        ]),
        testimonialsLayout: getConfigString(config, "testimonialsLayout", "grid") as "carousel" | "grid" | "list",
        testimonialsTitle: getConfigString(config, "testimonialsTitle", "O que dizem nossas clientes"),
      },
    });

    // 11. Price Anchor
    blocks.push({
      id: `${stage.id}-priceAnchor`,
      type: "priceAnchor",
      order: order++,
      content: {
        finalPrice: getConfigNumber(config, "finalPrice", 39),
        totalOriginal: getConfigNumber(config, "totalOriginal", 175),
        currency: getConfigString(config, "currency", "R$"),
        priceItems: getConfigArray(config, "priceItems", []),
        discountBadge: getConfigString(config, "discountBadge", "-78% HOJE"),
      },
    });

    // 12. Guarantee
    blocks.push({
      id: `${stage.id}-guarantee`,
      type: "guarantee",
      order: order++,
      content: {
        guaranteeDays: getConfigNumber(config, "guaranteeDays", 7),
        guaranteeTitle: getConfigString(config, "guaranteeTitle", "7 Dias de Garantia Incondicional"),
        guaranteeDescription: getConfigString(config, "guaranteeDescription", ""),
        guaranteeImageUrl: getConfigString(config, "guaranteeImageUrl", ""),
      },
    });

    // 13. Mentor Section
    blocks.push({
      id: `${stage.id}-mentor`,
      type: "mentor",
      order: order++,
      content: {
        mentorName: getConfigString(config, "mentorName", "Gisele Galvão"),
        mentorTitle: getConfigString(config, "mentorTitle", "Consultora de Imagem e Estilo, Personal Branding, Estrategista de Marca pessoal e Especialista em coloração pessoal com Certificação internacional"),
        mentorDescription: getConfigString(config, "mentorDescription", "Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal."),
        mentorImageUrl: getConfigString(config, "mentorImageUrl", "https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp"),
        mentorCredentials: getConfigArray<string>(config, "mentorCredentials", [
          "Especialista em Análise de Estilo",
          "Consultora de Imagem Certificada",
          "Mais de 5.000 mulheres transformadas",
        ]),
      },
    });

    // 14. CTA Offer (principal)
    blocks.push({
      id: `${stage.id}-ctaOffer`,
      type: "ctaOffer",
      order: order++,
      content: {
        ctaText: getConfigString(config, "ctaText", "GARANTIR MEU GUIA AGORA"),
        ctaVariant: getConfigString(config, "ctaVariant", "green") as "green" | "brand" | "gradient",
        ctaUrl: getConfigString(config, "ctaUrl", ""),
        showCtaIcon: getConfigBoolean(config, "showCtaIcon", true),
        urgencyText: getConfigString(config, "urgencyText", ""),
      },
    });

    // 15. Secure Purchase
    blocks.push({
      id: `${stage.id}-securePurchase`,
      type: "securePurchase",
      order: order++,
      content: {
        securityBadges: getConfigArray<string>(config, "securityBadges", []),
        paymentMethods: getConfigArray<string>(config, "paymentMethods", []),
        secureText: getConfigString(config, "secureText", ""),
      },
    });

    return blocks;
  }

  // 3. Image Block (se houver)
  const imageUrl = getConfigString(config, "imageUrl", "");
  if (imageUrl) {
    blocks.push({
      id: `${stage.id}-image`,
      type: "image",
      order: order++,
      content: {
        imageUrl,
        imageAlt: "Imagem",
        maxWidth: "384px",
        borderRadius: "0.5rem",
      },
    });
  }

  // 4. Text Block (subtítulo ou mensagem de transição)
  const subtitle = getConfigString(config, "subtitle", "");
  if (subtitle) {
    blocks.push({
      id: `${stage.id}-subtitle`,
      type: "text",
      order: order++,
      content: {
        text: subtitle,
        fontSize: "base",
        textAlign: "center",
      },
    });
  }

  const transitionSubtitle = getConfigString(config, "transitionSubtitle", "");
  if (transitionSubtitle) {
    blocks.push({
      id: `${stage.id}-transition-subtitle`,
      type: "text",
      order: order++,
      content: {
        text: transitionSubtitle,
        fontSize: "base",
        textAlign: "center",
      },
    });
  }

  const transitionMessage = getConfigString(config, "transitionMessage", "");
  if (transitionMessage) {
    blocks.push({
      id: `${stage.id}-transition-message`,
      type: "text",
      order: order++,
      content: {
        text: transitionMessage,
        fontSize: "sm",
        textAlign: "center",
      },
      style: {
        marginTop: "1rem",
      },
    });
  }

  // 5. Description Text (para intro - texto explicativo antes do input)
  const descriptionText = getConfigString(config, "descriptionText", "");
  if (stage.type === "intro" && descriptionText) {
    blocks.push({
      id: `${stage.id}-description`,
      type: "text",
      order: order++,
      content: {
        text: descriptionText,
        fontSize: "sm",
        textAlign: "center",
        textColor: "#6B7280",
      },
    });
  }

  // 6. Input Block (para intro)
  if (stage.type === "intro") {
    blocks.push({
      id: `${stage.id}-input`,
      type: "input",
      order: order++,
      content: {
        label: getConfigString(config, "inputLabel", "NOME"),
        placeholder: getConfigString(config, "inputPlaceholder", "Digite seu nome aqui..."),
        inputType: "text",
        required: true,
      },
    });
  }

  // 6. Spacer antes das opções
  const options = getConfigArray<{ id: string; text: string; imageUrl?: string; image_url?: string; styleCategory?: string; points?: number }>(config, "options", []);
  if (options.length > 0) {
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
  if (options.length > 0) {
    const hasImages = options.some((opt) => opt.imageUrl || opt.image_url);

    blocks.push({
      id: `${stage.id}-options`,
      type: "options",
      order: order++,
      content: {
        displayType: getConfigString(config, "displayType", hasImages ? "both" : "text") as "text" | "image" | "both",
        multiSelect: getConfigNumber(config, "multiSelect", 1),
        autoAdvance: getConfigBoolean(config, "autoAdvance", true),
        columns: (getConfigNumber(config, "columns", hasImages ? 2 : 1) || 1) as 1 | 2 | 3 | 4,
        optionTextSize: getConfigString(config, "optionTextSize", "base") as "xs" | "sm" | "base" | "lg" | "xl",
        optionImageSize: getConfigString(config, "optionImageSize", "md") as "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full",
        showCheckIcon: getConfigBoolean(config, "showCheckIcon", true),
        options: options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          imageUrl: opt.imageUrl || opt.image_url,
          image_url: opt.image_url || opt.imageUrl,
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
      buttonText: getConfigString(config, "buttonText", "Continuar"),
      buttonVariant: "primary",
      fullWidth: true,
    },
  });

  // 9. Privacy Text (para intro)
  const privacyText = getConfigString(config, "privacyText", "");
  if (stage.type === "intro" && privacyText) {
    blocks.push({
      id: `${stage.id}-privacy`,
      type: "text",
      order: order++,
      content: {
        text: privacyText,
        fontSize: "sm",
        textAlign: "center",
        textColor: "#9CA3AF",
      },
    });
  }

  // 10. Footer Text (para intro)
  const footerText = getConfigString(config, "footerText", "");
  if (stage.type === "intro" && footerText) {
    blocks.push({
      id: `${stage.id}-footer`,
      type: "text",
      order: order++,
      content: {
        text: footerText,
        fontSize: "sm" as const,
        textAlign: "center",
        textColor: "#9CA3AF", // text-gray-400
      },
    });
  }

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
      beforeAfterItems: [
        {
          id: "transformation-adriana",
          beforeImage:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430335/ADRIANA-_ANTES_E_DEPOIS_ttgifc.png",
          afterImage:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430335/ADRIANA-_ANTES_E_DEPOIS_ttgifc.png",
          name: "Adriana",
          description:
            "De básico para elegante, mantendo o conforto e autenticidade",
        },
        {
          id: "transformation-mariangela",
          beforeImage:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430348/MARIANGELA_-_ANTES_E_DEPOIS_ipuoap.png",
          afterImage:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430348/MARIANGELA_-_ANTES_E_DEPOIS_ipuoap.png",
          name: "Mariangela",
          description:
            "Do casual ao sofisticado, valorizando seu tipo de corpo",
        },
      ],
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
      testimonials: [
        {
          id: "1",
          name: "Sônia",
          role: "Cliente",
          text: "Incrível como descobrir meu estilo mudou minha autoestima. Agora sei exatamente o que comprar!",
          imageUrl:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_S%C3%94NIA_q0g9cq.png",
          rating: 5,
        },
        {
          id: "2",
          name: "Patrícia",
          role: "Cliente",
          text: "O guia é muito completo! Finalmente entendi como valorizar meu corpo e personalidade.",
          imageUrl:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_PATR%C3%8DCIA_x0mhud.png",
          rating: 5,
        },
        {
          id: "3",
          name: "Mariangela",
          role: "Cliente",
          text: "Transformação incrível! Antes eu comprava por impulso, agora tenho direcionamento claro.",
          imageUrl:
            "https://res.cloudinary.com/der8kogzu/image/upload/v1752430304/DEPOIMENTO_COM_IMAGEM_-_MARIANGELA_sj7lki.png",
          rating: 5,
        },
      ],
      testimonialsLayout: "grid",
      testimonialsTitle: "O que dizem nossas clientes",
    },
    mentor: {
      mentorName: "Gisele Galvão",
      mentorTitle:
        "Consultora de Imagem e Estilo, Personal Branding, Estrategista de Marca pessoal e Especialista em coloração pessoal com Certificação internacional",
      mentorDescription:
        "Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal.",
      mentorImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp",
      mentorCredentials: [
        "Especialista em Análise de Estilo",
        "Consultora de Imagem Certificada",
        "Mais de 5.000 mulheres transformadas",
      ],
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
): Record<string, unknown> => {
  const config: Record<string, unknown> = {};

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
