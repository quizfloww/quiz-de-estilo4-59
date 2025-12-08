/**
 * JSON Schema for funnel export validation and Monaco Editor autocomplete
 *
 * This schema is used for:
 * 1. Monaco Editor JSON validation and autocomplete
 * 2. External JSON editors (VS Code, etc.)
 * 3. API documentation
 *
 * Usage with Monaco Editor:
 * ```tsx
 * import { funnelExportJsonSchema } from '@/utils/funnelJsonSchema';
 *
 * <JsonEditor
 *   value={jsonValue}
 *   onChange={setJsonValue}
 *   jsonSchema={funnelExportJsonSchema}
 * />
 * ```
 */

export const funnelExportJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://quiz-de-estilo.app/schemas/funnel-export.json",
  title: "Funnel Export Schema",
  description:
    "Schema para validação de arquivos de exportação de funis do Quiz de Estilo",
  type: "object",
  required: ["stages"],
  properties: {
    name: {
      type: "string",
      description: "Nome do funil",
      minLength: 1,
      maxLength: 255,
    },
    slug: {
      type: "string",
      description: "Identificador único do funil para URL",
      pattern: "^[a-z0-9-]+$",
    },
    globalConfig: {
      type: "object",
      description: "Configurações globais do funil",
      properties: {
        theme: {
          type: "string",
          enum: ["light", "dark", "system"],
          default: "light",
        },
        primaryColor: {
          type: "string",
          pattern: "^#[0-9A-Fa-f]{6}$",
        },
        fontFamily: {
          type: "string",
        },
        logoUrl: {
          type: "string",
          format: "uri",
        },
      },
    },
    stages: {
      type: "array",
      description: "Lista de etapas do funil",
      minItems: 1,
      items: {
        $ref: "#/definitions/Stage",
      },
    },
    exportDate: {
      type: "string",
      format: "date-time",
      description: "Data/hora da exportação",
    },
    version: {
      type: "string",
      description: "Versão do schema de exportação",
      default: "1.0",
    },
  },
  definitions: {
    Stage: {
      type: "object",
      required: ["type", "title", "order_index"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description:
            "ID único da etapa (gerado automaticamente se não fornecido)",
        },
        type: {
          type: "string",
          description: "Tipo da etapa",
          enum: [
            "intro",
            "question",
            "strategic",
            "transition",
            "result",
            "offer",
            "upsell",
            "thankyou",
            "page",
            "custom",
          ],
          default: "page",
        },
        title: {
          type: "string",
          description: "Título da etapa",
          minLength: 1,
        },
        order_index: {
          type: "integer",
          description: "Posição da etapa no funil (0-based)",
          minimum: 0,
        },
        is_enabled: {
          type: "boolean",
          description: "Se a etapa está ativa",
          default: true,
        },
        config: {
          $ref: "#/definitions/StageConfig",
        },
        blocks: {
          type: "array",
          description: "Blocos de conteúdo da etapa",
          items: {
            $ref: "#/definitions/CanvasBlock",
          },
        },
      },
    },
    StageConfig: {
      type: "object",
      description: "Configuração específica da etapa",
      properties: {
        questionId: {
          type: "string",
          description: "ID da questão (para etapas do tipo question)",
        },
        headline: {
          type: "string",
          description: "Título principal exibido ao usuário",
        },
        subheadline: {
          type: "string",
          description: "Subtítulo ou descrição",
        },
        imageUrl: {
          type: "string",
          format: "uri",
          description: "URL da imagem principal",
        },
        buttonText: {
          type: "string",
          description: "Texto do botão de ação",
        },
        buttonUrl: {
          type: "string",
          format: "uri",
          description: "URL de destino do botão",
        },
        showProgressBar: {
          type: "boolean",
          description: "Exibir barra de progresso",
        },
        progressPercent: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Percentual de progresso (0-100)",
        },
        autoAdvance: {
          type: "boolean",
          description: "Avançar automaticamente após seleção",
        },
        selectionMode: {
          type: "string",
          enum: ["single", "multiple"],
          description: "Modo de seleção de opções",
        },
        requiredSelections: {
          type: "integer",
          minimum: 1,
          description:
            "Número de seleções obrigatórias (para múltipla escolha)",
        },
        options: {
          type: "array",
          description: "Opções de resposta",
          items: {
            $ref: "#/definitions/QuestionOption",
          },
        },
        stylesConfig: {
          $ref: "#/definitions/StylesConfig",
        },
        benefits: {
          type: "array",
          description: "Lista de benefícios (para páginas de oferta)",
          items: {
            type: "object",
            properties: {
              icon: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
            },
          },
        },
        pricing: {
          $ref: "#/definitions/PricingConfig",
        },
        testimonials: {
          type: "array",
          items: {
            $ref: "#/definitions/Testimonial",
          },
        },
        guarantee: {
          type: "object",
          properties: {
            text: { type: "string" },
            days: { type: "integer" },
          },
        },
      },
    },
    QuestionOption: {
      type: "object",
      required: ["id", "label"],
      properties: {
        id: {
          type: "string",
          description: "ID único da opção",
        },
        label: {
          type: "string",
          description: "Texto exibido da opção",
        },
        value: {
          type: "string",
          description: "Valor associado à opção",
        },
        imageUrl: {
          type: "string",
          format: "uri",
          description: "Imagem da opção",
        },
        styleId: {
          type: "string",
          description: "ID do estilo associado (para questões de estilo)",
        },
        weight: {
          type: "number",
          description: "Peso da opção no cálculo de estilo",
        },
      },
    },
    StylesConfig: {
      type: "object",
      description: "Configuração de estilos para resultados",
      additionalProperties: {
        type: "object",
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          imageUrl: { type: "string", format: "uri" },
          characteristics: {
            type: "array",
            items: { type: "string" },
          },
          recommendations: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    PricingConfig: {
      type: "object",
      properties: {
        originalPrice: {
          type: "number",
          description: "Preço original (antes do desconto)",
        },
        currentPrice: {
          type: "number",
          description: "Preço atual/promocional",
        },
        currency: {
          type: "string",
          default: "BRL",
        },
        installments: {
          type: "integer",
          description: "Número de parcelas",
        },
        installmentPrice: {
          type: "number",
          description: "Valor de cada parcela",
        },
        discountPercent: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
      },
    },
    Testimonial: {
      type: "object",
      properties: {
        name: { type: "string" },
        text: { type: "string" },
        avatarUrl: { type: "string", format: "uri" },
        rating: { type: "integer", minimum: 1, maximum: 5 },
      },
    },
    CanvasBlock: {
      type: "object",
      required: ["id", "type"],
      properties: {
        id: {
          type: "string",
          description: "ID único do bloco",
        },
        type: {
          type: "string",
          description: "Tipo do bloco",
          enum: [
            "headline",
            "subheadline",
            "paragraph",
            "image",
            "button",
            "progress",
            "options",
            "timer",
            "video",
            "divider",
            "spacer",
            "logo",
            "pricing",
            "benefits",
            "testimonials",
            "guarantee",
            "result-style",
            "result-secondary-styles",
            "style-distribution",
            "strategic-summary",
            "bonus",
            "custom-html",
          ],
        },
        content: {
          type: "object",
          description: "Conteúdo do bloco (varia por tipo)",
          additionalProperties: true,
        },
        visible: {
          type: "boolean",
          default: true,
        },
        order: {
          type: "integer",
          description: "Ordem de exibição do bloco",
        },
      },
    },
  },
} as const;

export type FunnelExportJsonSchema = typeof funnelExportJsonSchema;

/**
 * Get the public URL for the JSON Schema file
 * Use this URL in external editors (VS Code, IntelliJ, etc.)
 *
 * @example
 * // In VS Code settings.json:
 * {
 *   "json.schemas": [
 *     {
 *       "fileMatch": ["funil-*.json"],
 *       "url": "./public/schemas/funnel-export.schema.json"
 *     }
 *   ]
 * }
 */
export function getFunnelSchemaPublicUrl(): string {
  return "/schemas/funnel-export.schema.json";
}

/**
 * Generate a download link for the JSON Schema
 */
export function downloadFunnelSchema(): void {
  const blob = new Blob([JSON.stringify(funnelExportJsonSchema, null, 2)], {
    type: "application/schema+json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "funnel-export.schema.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
