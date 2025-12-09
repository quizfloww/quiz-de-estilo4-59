/**
 * Template de blocos para etapa de Resultado + Oferta
 *
 * Esta configuração pode ser usada para atualizar a etapa 20 do funil
 * "Quiz de Estilo Pessoal" para usar o sistema de blocos modulares.
 *
 * COMO USAR:
 * 1. No editor do funil (/admin/funnels/:id/edit), selecione a etapa de resultado
 * 2. Use o botão JSON para importar esta configuração
 * 3. Ou adicione os blocos manualmente usando a sidebar
 *
 * Os blocos são renderizados na ordem em que aparecem no array.
 * Cada bloco é independente e pode ser reordenado verticalmente.
 */

import { CanvasBlock } from "@/types/canvasBlocks";

/**
 * Blocos modulares para a etapa de RESULTADO
 */
export const resultStageBlocks: CanvasBlock[] = [
  // 1. Header com logo
  {
    id: "block-header-1",
    type: "header",
    order: 0,
    content: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      showProgress: false,
      backgroundColor: "transparent",
    },
    style: {
      marginBottom: "1rem",
    },
  },

  // 2. Título do resultado
  {
    id: "block-heading-result",
    type: "heading",
    order: 1,
    content: {
      text: "{{userName}}, seu estilo predominante é:",
      level: "h1",
      textAlign: "center",
      textColor: "#432818",
      fontFamily: "playfair",
    },
  },

  // 3. Bloco de Resultado do Estilo (dinâmico)
  {
    id: "block-style-result",
    type: "styleResult",
    order: 2,
    content: {
      showImage: true,
      showPercentage: true,
      showDescription: true,
      imagePosition: "left",
      // Os dados do resultado são injetados dinamicamente
    },
  },

  // 4. Estilos secundários
  {
    id: "block-secondary-styles",
    type: "secondaryStyles",
    order: 3,
    content: {
      title: "Seus estilos complementares",
      showPercentages: true,
      maxStyles: 3,
    },
  },

  // 5. Divisor
  {
    id: "block-divider-1",
    type: "divider",
    order: 4,
    content: {
      style: "gradient",
      color: "#B89B7A",
    },
  },

  // 6. Hook Personalizado
  {
    id: "block-personalized-hook",
    type: "personalizedHook",
    order: 5,
    content: {
      title: "O que isso significa para você?",
      description:
        "Seu estilo {{primaryStyle}} revela muito sobre sua personalidade e como você se apresenta ao mundo. Mas conhecer seu estilo é apenas o primeiro passo...",
    },
  },

  // 7. Transformação Antes/Depois
  {
    id: "block-before-after",
    type: "beforeAfter",
    order: 6,
    content: {
      beforeAfterTitle: "Veja a transformação",
      beforeAfterItems: [
        {
          id: "ba-1",
          beforeImage:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/before-example.webp",
          afterImage:
            "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/after-example.webp",
          name: "Maria",
          description: "De confusa a confiante em seu estilo",
        },
      ],
    },
  },

  // 8. Espaçador
  {
    id: "block-spacer-1",
    type: "spacer",
    order: 7,
    content: {
      height: "2rem",
    },
  },
];

/**
 * Blocos modulares para a etapa de OFERTA
 */
export const offerStageBlocks: CanvasBlock[] = [
  // 1. Header
  {
    id: "block-header-offer",
    type: "header",
    order: 0,
    content: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      showProgress: false,
    },
  },

  // 2. Countdown de urgência
  {
    id: "block-countdown",
    type: "countdown",
    order: 1,
    content: {
      title: "Oferta especial expira em:",
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      showDays: false,
      backgroundColor: "#FEF3C7",
      textColor: "#92400E",
    },
  },

  // 3. Título da oferta
  {
    id: "block-offer-title",
    type: "heading",
    order: 2,
    content: {
      text: "Guia Completo de Estilo {{primaryStyle}}",
      level: "h1",
      textAlign: "center",
      textColor: "#432818",
    },
  },

  // 4. Subtítulo
  {
    id: "block-offer-subtitle",
    type: "text",
    order: 3,
    content: {
      text: "Descubra como aplicar seu estilo no dia a dia com nosso guia exclusivo e personalizado.",
      textAlign: "center",
      textColor: "#1A1818",
    },
  },

  // 5. Imagem do guia de estilo
  {
    id: "block-style-guide",
    type: "styleGuide",
    order: 4,
    content: {
      title: "Seu Guia Personalizado",
      description: "Mais de 50 páginas de conteúdo exclusivo",
    },
  },

  // 6. Âncora de preço
  {
    id: "block-price-anchor",
    type: "priceAnchor",
    order: 5,
    content: {
      title: "Valor real de tudo que você recebe:",
      items: [
        { id: "pa-1", label: "Guia Completo de Estilo", originalPrice: 297 },
        {
          id: "pa-2",
          label: "Paleta de Cores Personalizada",
          originalPrice: 97,
        },
        {
          id: "pa-3",
          label: "Checklist de Peças Essenciais",
          originalPrice: 47,
        },
        { id: "pa-4", label: "E-book de Combinações", originalPrice: 67 },
      ],
      totalLabel: "Valor total:",
      currentPriceLabel: "Hoje por apenas:",
      currentPrice: 97,
      installments: 12,
      installmentValue: 9.7,
      currency: "R$",
    },
  },

  // 7. Lista de benefícios
  {
    id: "block-benefits",
    type: "benefitsList",
    order: 6,
    content: {
      title: "O que você vai receber:",
      benefits: [
        {
          id: "b-1",
          title: "Guia completo do seu estilo",
          description: "Com exemplos práticos e visuais",
        },
        {
          id: "b-2",
          title: "Paleta de cores ideal",
          description: "Cores que valorizam seu tom de pele",
        },
        {
          id: "b-3",
          title: "Lista de peças essenciais",
          description: "Itens que não podem faltar no seu guarda-roupa",
        },
        {
          id: "b-4",
          title: "Dicas de combinação",
          description: "Como montar looks incríveis",
        },
      ],
      checkColor: "#22C55E",
    },
  },

  // 8. Bônus
  {
    id: "block-bonus",
    type: "bonus",
    order: 7,
    content: {
      bonusTitle: "🎁 Bônus Exclusivos",
      bonusItems: [
        {
          id: "bonus-1",
          title: "Acesso ao grupo VIP",
          description:
            "Comunidade exclusiva de mulheres que valorizam seu estilo",
          value: "R$ 197",
        },
        {
          id: "bonus-2",
          title: "Consultoria express",
          description: "30 minutos de consultoria online",
          value: "R$ 297",
        },
      ],
    },
  },

  // 9. CTA principal
  {
    id: "block-cta-main",
    type: "ctaOffer",
    order: 8,
    content: {
      buttonText: "QUERO MEU GUIA AGORA",
      buttonUrl: "https://pay.hotmart.com/W98977034C?checkoutMode=10",
      price: "R$ 97,00",
      currency: "R$",
      backgroundColor: "#22C55E",
      textColor: "#FFFFFF",
      showArrow: true,
    },
  },

  // 10. Garantia
  {
    id: "block-guarantee",
    type: "guarantee",
    order: 9,
    content: {
      title: "Garantia Incondicional de 7 Dias",
      description:
        "Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.",
      days: 7,
      badgeColor: "#22C55E",
    },
  },

  // 11. Depoimentos
  {
    id: "block-testimonials",
    type: "testimonials",
    order: 10,
    content: {
      testimonialsTitle: "O que dizem nossas alunas:",
      testimonials: [
        {
          id: "t-1",
          name: "Ana Paula",
          role: "Empresária",
          text: "O guia mudou completamente minha forma de me vestir. Agora sei exatamente o que comprar!",
          rating: 5,
        },
        {
          id: "t-2",
          name: "Carla Santos",
          role: "Advogada",
          text: "Finalmente entendi porque algumas roupas me valorizavam e outras não. Vale muito a pena!",
          rating: 5,
        },
        {
          id: "t-3",
          name: "Julia Mendes",
          role: "Designer",
          text: "Super prático e didático. As dicas são fáceis de aplicar no dia a dia.",
          rating: 5,
        },
      ],
      testimonialsLayout: "carousel",
    },
  },

  // 12. Mentora
  {
    id: "block-mentor",
    type: "mentor",
    order: 11,
    content: {
      name: "Gisele Galvão",
      title: "Consultora de Imagem e Estilo",
      bio: "Há mais de 10 anos ajudando mulheres a descobrirem e expressarem sua melhor versão através do estilo pessoal.",
      imageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/mentor-gisele.webp",
      credentials: [
        "Formação Internacional em Consultoria de Imagem",
        "Especialista em Coloração Pessoal",
        "Mais de 5.000 alunas transformadas",
      ],
    },
  },

  // 13. FAQ
  {
    id: "block-faq",
    type: "faq",
    order: 12,
    content: {
      title: "Perguntas Frequentes",
      faqItems: [
        {
          id: "faq-1",
          question: "O guia serve para qualquer idade?",
          answer:
            "Sim! O guia é baseado no seu estilo pessoal, que é único e atemporal. As dicas funcionam para mulheres de qualquer idade.",
        },
        {
          id: "faq-2",
          question: "Preciso ter muito dinheiro para aplicar as dicas?",
          answer:
            "Não! O guia ensina a valorizar o que você já tem e fazer compras inteligentes, economizando dinheiro a longo prazo.",
        },
        {
          id: "faq-3",
          question: "Por quanto tempo tenho acesso?",
          answer:
            "O acesso é vitalício! Você pode consultar o guia sempre que quiser.",
        },
      ],
    },
  },

  // 14. CTA Final
  {
    id: "block-cta-final",
    type: "ctaOffer",
    order: 13,
    content: {
      buttonText: "SIM, QUERO TRANSFORMAR MEU ESTILO!",
      buttonUrl: "https://pay.hotmart.com/W98977034C?checkoutMode=10",
      price: "R$ 97,00",
      backgroundColor: "#22C55E",
      textColor: "#FFFFFF",
      showArrow: true,
    },
  },

  // 15. Compra segura
  {
    id: "block-secure",
    type: "securePurchase",
    order: 14,
    content: {
      title: "Compra 100% Segura",
      badges: ["ssl", "hotmart", "guarantee"],
    },
  },
];

/**
 * Configuração completa de uma etapa de resultado/oferta
 * com blocos modulares independentes e reordenáveis
 */
export const resultOfferStageConfig = {
  type: "result",
  title: "Resultado e Oferta",
  is_enabled: true,
  config: {
    blocks: [...resultStageBlocks, ...offerStageBlocks],
    canvasBackgroundColor: "#FAF9F7",
    // Desabilitar redirecionamento para usar fluxo unificado
    redirectToResult: false,
  },
};

export default resultOfferStageConfig;
