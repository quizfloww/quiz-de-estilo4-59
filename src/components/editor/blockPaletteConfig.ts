/**
 * Constantes e configurações para o BlockPalette
 * Separado dos componentes para suportar Fast Refresh do React
 */

import { CanvasBlockType } from "@/types/canvasBlocks";

// ============================================
// Tipos
// ============================================

export interface BlockCategory {
  id: string;
  label: string;
  icon?: string;
  blocks: CanvasBlockType[];
  description?: string;
}

// ============================================
// Categorias Padrão
// ============================================

export const DEFAULT_BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: "basic",
    label: "Elementos Básicos",
    icon: "Layers",
    description: "Componentes fundamentais de layout",
    blocks: ["heading", "text", "image", "button", "spacer", "divider"],
  },
  {
    id: "quiz",
    label: "Quiz & Formulário",
    icon: "ClipboardList",
    description: "Elementos interativos para coleta de dados",
    blocks: ["header", "input", "options"],
  },
  {
    id: "result",
    label: "Resultado",
    icon: "Award",
    description: "Exibição de resultados e análises",
    blocks: [
      "styleResult",
      "secondaryStyles",
      "styleProgress",
      "personalizedHook",
      "styleGuide",
      "beforeAfter",
    ],
  },
  {
    id: "sales",
    label: "Vendas & Conversão",
    icon: "ShoppingCart",
    description: "Elementos de persuasão e conversão",
    blocks: [
      "priceAnchor",
      "countdown",
      "testimonial",
      "testimonials",
      "benefitsList",
      "guarantee",
      "ctaOffer",
      "faq",
      "socialProof",
    ],
  },
  {
    id: "extra",
    label: "Extras",
    icon: "Sparkles",
    description: "Elementos adicionais e especializados",
    blocks: ["motivation", "bonus", "mentor", "securePurchase"],
  },
];

// ============================================
// Descrições dos Blocos
// ============================================

export const BLOCK_DESCRIPTIONS: Partial<Record<CanvasBlockType, string>> = {
  heading: "Título em destaque",
  text: "Parágrafo de texto",
  image: "Imagem com ajustes",
  button: "Botão de ação",
  spacer: "Espaço em branco",
  divider: "Linha divisória",
  header: "Cabeçalho com logo e progresso",
  input: "Campo de entrada de texto",
  options: "Opções de seleção com imagens",
  styleResult: "Resultado do estilo predominante",
  secondaryStyles: "Estilos secundários identificados",
  styleProgress: "Barra de progresso dos estilos",
  personalizedHook: "Mensagem personalizada de boas-vindas",
  styleGuide: "Guia visual do estilo",
  beforeAfter: "Comparação antes/depois",
  priceAnchor: "Ancoragem de preço com descontos",
  countdown: "Contador regressivo de urgência",
  testimonial: "Depoimento individual",
  testimonials: "Carrossel de depoimentos",
  benefitsList: "Lista de benefícios",
  guarantee: "Selo de garantia",
  ctaOffer: "Botão de chamada para ação",
  faq: "Perguntas frequentes",
  socialProof: "Prova social e estatísticas",
  motivation: "Seção motivacional",
  bonus: "Lista de bônus",
  mentor: "Apresentação da mentora",
  securePurchase: "Selos de segurança",
};
