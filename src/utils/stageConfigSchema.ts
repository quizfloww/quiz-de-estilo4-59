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

// ============================================
// Schema de Bloco de Canvas
// ============================================

export const CanvasBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number(),
  content: z.record(z.unknown()).optional(),
});

// ============================================
// Schema de Etapa Importada
// ============================================

export const ImportedStageSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  order_index: z.number(),
  is_enabled: z.boolean().optional().default(true),
  config: StageConfigSchema.optional().default({}),
  blocks: z.array(CanvasBlockSchema).optional(),
});

// ============================================
// Schema de Funil Completo para Import/Export
// ============================================

export const FunnelImportSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  globalConfig: z.record(z.unknown()).optional(),
  stages: z
    .array(ImportedStageSchema)
    .min(1, "O funil deve ter pelo menos 1 etapa"),
  exportDate: z.string().optional(),
  version: z.string().optional(),
});

export type FunnelImport = z.infer<typeof FunnelImportSchema>;
export type ImportedStage = z.infer<typeof ImportedStageSchema>;

// ============================================
// Funções de Validação de Funil
// ============================================

/**
 * Resultado detalhado de validação
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

/**
 * Erro de validação com detalhes
 */
export interface ValidationError {
  path: string;
  message: string;
  code: string;
  received?: unknown;
  expected?: string;
}

/**
 * Converte erros Zod para formato amigável
 */
export function zodErrorsToValidationErrors(
  zodError: z.ZodError
): ValidationError[] {
  return zodError.errors.map((err) => ({
    path: err.path.join(".") || "root",
    message: err.message,
    code: err.code,
    received: "received" in err ? err.received : undefined,
    expected: "expected" in err ? String(err.expected) : undefined,
  }));
}

/**
 * Formata erros de validação em mensagem legível
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return "Validação bem-sucedida";

  const messages = errors.slice(0, 5).map((err, i) => {
    const location = err.path ? `em "${err.path}"` : "";
    return `${i + 1}. ${err.message} ${location}`;
  });

  if (errors.length > 5) {
    messages.push(`... e mais ${errors.length - 5} erro(s)`);
  }

  return messages.join("\n");
}

/**
 * Valida JSON de funil para importação
 * @param data - Dados JSON do funil
 * @returns Resultado de validação com erros detalhados
 */
export function validateFunnelImport(
  data: unknown
): ValidationResult<FunnelImport> {
  const result = FunnelImportSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: [],
    };
  }

  return {
    success: false,
    errors: zodErrorsToValidationErrors(result.error),
  };
}

/**
 * Valida uma única etapa para importação
 */
export function validateImportedStage(
  stage: unknown,
  index: number
): ValidationResult<ImportedStage> {
  const result = ImportedStageSchema.safeParse(stage);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: [],
    };
  }

  // Adiciona contexto do índice da etapa aos erros
  const errors = zodErrorsToValidationErrors(result.error).map((err) => ({
    ...err,
    path: `stages[${index}].${err.path}`,
  }));

  return {
    success: false,
    errors,
  };
}

/**
 * Verifica estrutura básica do JSON antes de validação completa
 */
export function quickValidateJsonStructure(data: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof data !== "object" || data === null) {
    return {
      valid: false,
      error: "O arquivo deve conter um objeto JSON válido",
    };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.stages) {
    return { valid: false, error: "O arquivo deve conter um array 'stages'" };
  }

  if (!Array.isArray(obj.stages)) {
    return { valid: false, error: "'stages' deve ser um array" };
  }

  if (obj.stages.length === 0) {
    return { valid: false, error: "O funil deve ter pelo menos 1 etapa" };
  }

  return { valid: true };
}
