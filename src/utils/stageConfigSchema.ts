/**
 * Schema de validação Zod para configurações de etapas (stages)
 * Garante integridade dos dados de configuração de funis
 */

import { z } from "zod";

// ============================================
// Schema de Opções de Quiz
// ============================================

export const QuizFlowOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  imageUrl: z.string().url().optional(),
  styleCategory: z.string().optional(),
  points: z.number().optional(),
});

// ============================================
// Schema de Configuração de Etapa
// ============================================

export const StageConfigSchema = z
  .object({
    // Header config
    showLogo: z.boolean().optional(),
    showProgress: z.boolean().optional(),
    allowBack: z.boolean().optional(),
    logoUrl: z.string().url().optional(),

    // Intro specific
    subtitle: z.string().optional(),
    imageUrl: z.string().url().optional(),
    inputLabel: z.string().optional(),
    inputPlaceholder: z.string().optional(),
    buttonText: z.string().optional(),

    // Question specific
    question: z.string().optional(),
    options: z.array(QuizFlowOptionSchema).optional(),
    displayType: z.enum(["text", "image", "both"]).optional(),
    multiSelect: z.number().optional(),
    autoAdvance: z.boolean().optional(),

    // Transition specific
    transitionTitle: z.string().optional(),
    transitionSubtitle: z.string().optional(),
    transitionMessage: z.string().optional(),

    // Result specific
    resultLayout: z.enum(["classic", "modern", "minimal"]).optional(),
    showPercentages: z.boolean().optional(),
    ctaText: z.string().optional(),
    ctaUrl: z.string().url().optional(),
    descriptionText: z.string().optional(), // Texto descritivo adicional
    resultUrl: z.string().url().optional(), // URL para resultados personalizados
  })
  .passthrough(); // Permite campos extras para compatibilidade

// ============================================
// Tipo TypeScript derivado do schema
// ============================================

export type StageConfig = z.infer<typeof StageConfigSchema>;

// ============================================
// Função de validação
// ============================================

/**
 * Valida uma configuração de etapa contra o schema
 * @param config - Configuração a ser validada
 * @returns Resultado da validação com sucesso ou erro
 */
export function validateStageConfig(config: unknown): {
  success: boolean;
  data?: StageConfig;
  error?: z.ZodError;
} {
  const result = StageConfigSchema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error,
  };
}

/**
 * Valida e sanitiza uma configuração de etapa
 * Remove campos inválidos e mantém apenas os válidos
 * @param config - Configuração a ser sanitizada
 * @returns Configuração validada e limpa
 */
export function sanitizeStageConfig(config: unknown): StageConfig {
  const result = StageConfigSchema.safeParse(config);

  if (result.success) {
    return result.data;
  }

  // Em caso de erro, retorna objeto vazio mas válido
  console.warn("StageConfig inválido, retornando config vazia:", result.error);
  return {};
}

/**
 * Valida array de opções de quiz
 * @param options - Array de opções a validar
 * @returns Opções validadas
 */
export function validateQuizOptions(options: unknown): {
  success: boolean;
  data?: z.infer<typeof QuizFlowOptionSchema>[];
  error?: z.ZodError;
} {
  const schema = z.array(QuizFlowOptionSchema);
  const result = schema.safeParse(options);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error,
  };
}
