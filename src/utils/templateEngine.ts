// Template Engine - Sistema de substituição de variáveis dinâmicas
// Permite usar placeholders como {category}, {percentage}, {userName} nos blocos
// e substitui automaticamente pelos dados reais do quiz em runtime

import { StyleResult } from "@/types/quiz";
import { styleConfig } from "@/config/styleConfig";

interface TemplateContext {
  // Dados do usuário
  userName?: string;
  userEmail?: string;

  // Dados do quiz
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  totalSelections?: number;

  // Metadados
  currentDate?: string;
  quizId?: string;
}

// Mensagens personalizadas por categoria de estilo
const styleMessages: Record<
  string,
  {
    congratsMessage: string;
    powerMessage: string;
    ctaText: string;
    exclusive: string;
  }
> = {
  Natural: {
    congratsMessage: "você é uma mulher autêntica e espontânea!",
    powerMessage:
      "Mulheres com seu estilo conquistam admiração pela naturalidade e charme genuíno. Sua beleza está na simplicidade elegante.",
    ctaText: "ACESSE SEU GUIA NATURAL AGORA",
    exclusive: "Oferta Especial",
  },
  Clássico: {
    congratsMessage: "você possui elegância atemporal!",
    powerMessage:
      "Mulheres com seu estilo transmitem confiança e sofisticação. Você é vista como referência de bom gosto e refinamento.",
    ctaText: "ACESSE SEU GUIA CLÁSSICO AGORA",
    exclusive: "Oferta Especial",
  },
  Contemporâneo: {
    congratsMessage: "você tem o equilíbrio perfeito entre moderno e prático!",
    powerMessage:
      "Mulheres com seu estilo são admiradas pela versatilidade e atualidade. Você sempre parece estar à frente do seu tempo.",
    ctaText: "ACESSE SEU GUIA CONTEMPORÂNEO AGORA",
    exclusive: "Oferta Especial",
  },
  Elegante: {
    congratsMessage: "você possui presença e sofisticação únicos!",
    powerMessage:
      "Mulheres com seu estilo comandam respeito e admiração onde chegam. Sua elegância é sua marca registrada.",
    ctaText: "ACESSE SEU GUIA ELEGANTE AGORA",
    exclusive: "Oferta Especial",
  },
  Romântico: {
    congratsMessage: "você irradia feminilidade e delicadeza!",
    powerMessage:
      "Mulheres com seu estilo encantam pela suavidade e charme feminino. Você desperta o lado protetor das pessoas.",
    ctaText: "ACESSE SEU GUIA ROMÂNTICO AGORA",
    exclusive: "Oferta Especial",
  },
  Sexy: {
    congratsMessage: "você possui magnetismo e confiança únicos!",
    powerMessage:
      "Mulheres com seu estilo fascinam pela presença marcante e autoconfiança. Você comanda a atenção naturalmente.",
    ctaText: "ACESSE SEU GUIA SEXY AGORA",
    exclusive: "Oferta Especial",
  },
  Dramático: {
    congratsMessage: "você tem presença e força impressionantes!",
    powerMessage:
      "Mulheres com seu estilo lideram e inspiram por onde passam. Sua personalidade forte é seu maior trunfo.",
    ctaText: "ACESSE SEU GUIA DRAMÁTICO AGORA",
    exclusive: "Oferta Especial",
  },
  Criativo: {
    congratsMessage: "você é única e expressiva!",
    powerMessage:
      "Mulheres com seu estilo se destacam pela originalidade e criatividade. Você é uma obra de arte viva.",
    ctaText: "ACESSE SEU GUIA CRIATIVO AGORA",
    exclusive: "Oferta Especial",
  },
};

/**
 * Substitui variáveis no template por valores reais
 *
 * Variáveis disponíveis:
 * - {userName} ou {nome} - Nome do usuário
 * - {category} ou {estilo} - Nome do estilo predominante
 * - {percentage} ou {porcentagem} - Percentual do estilo
 * - {score} ou {pontos} - Pontuação do estilo
 * - {description} ou {descrição} - Descrição do estilo
 * - {congratsMessage} - Mensagem de parabéns personalizada
 * - {powerMessage} - Mensagem de poder do estilo
 * - {ctaText} - Texto do CTA personalizado
 * - {styleImage} - URL da imagem do estilo
 * - {guideImage} - URL da imagem do guia
 */
export function renderTemplate(
  template: string,
  context: TemplateContext
): string {
  if (!template) return "";

  let result = template;
  const category = context.primaryStyle?.category || "";
  const percentage = context.primaryStyle?.percentage || 0;
  const score = context.primaryStyle?.score || 0;

  // Buscar configurações do estilo
  const styleInfo = category
    ? styleConfig[category as keyof typeof styleConfig]
    : null;
  const messages = category ? styleMessages[category] : null;

  // Substituições básicas
  const replacements: Record<string, string> = {
    "{userName}": context.userName || "Querida",
    "{nome}": context.userName || "Querida",
    "{category}": category,
    "{estilo}": category,
    "{percentage}": percentage.toString(),
    "{porcentagem}": percentage.toString(),
    "{score}": score.toString(),
    "{pontos}": score.toString(),
    "{description}": styleInfo?.description || "",
    "{descrição}": styleInfo?.description || "",
    "{styleImage}": styleInfo?.image || "",
    "{guideImage}": styleInfo?.guideImage || "",
    "{congratsMessage}": messages?.congratsMessage || "",
    "{powerMessage}": messages?.powerMessage || "",
    "{ctaText}": messages?.ctaText || "ACESSE SEU GUIA AGORA",
    "{currentDate}":
      context.currentDate || new Date().toLocaleDateString("pt-BR"),
  };

  // Aplicar todas as substituições
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, "g"), value);
  });

  return result;
}

/**
 * Verifica se uma string contém variáveis de template
 */
export function hasTemplateVariables(text: string): boolean {
  return /\{[a-zA-Z_]+\}/.test(text);
}

/**
 * Extrai todas as variáveis de um template
 */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{([a-zA-Z_]+)\}/g);
  return matches ? matches.map((m) => m.slice(1, -1)) : [];
}

/**
 * Valida se todas as variáveis do template são válidas
 */
export function validateTemplate(template: string): {
  valid: boolean;
  invalidVars: string[];
} {
  const validVars = [
    "userName",
    "nome",
    "category",
    "estilo",
    "percentage",
    "porcentagem",
    "score",
    "pontos",
    "description",
    "descrição",
    "congratsMessage",
    "powerMessage",
    "ctaText",
    "styleImage",
    "guideImage",
    "currentDate",
  ];

  const usedVars = extractVariables(template);
  const invalidVars = usedVars.filter((v) => !validVars.includes(v));

  return {
    valid: invalidVars.length === 0,
    invalidVars,
  };
}

/**
 * Obtém preview de um template com dados de exemplo
 */
export function getTemplatePreview(
  template: string,
  exampleCategory: string = "Elegante"
): string {
  const exampleContext: TemplateContext = {
    userName: "Maria",
    primaryStyle: {
      category: exampleCategory as StyleResult["category"],
      percentage: 65,
      score: 15,
    },
    currentDate: new Date().toLocaleDateString("pt-BR"),
  };

  return renderTemplate(template, exampleContext);
}

/**
 * Helper para obter mensagem personalizada por categoria
 */
export function getStyleMessage(
  category: string,
  messageType: "congratsMessage" | "powerMessage" | "ctaText"
): string {
  return styleMessages[category]?.[messageType] || "";
}

/**
 * Helper para obter todas as mensagens de um estilo
 */
export function getAllStyleMessages(category: string) {
  return styleMessages[category] || styleMessages["Natural"];
}
