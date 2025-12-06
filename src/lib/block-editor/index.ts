/**
 * Exports centralizados para o sistema de editor de blocos
 */

// Schemas de validação
export {
  CanvasBlockSchema,
  CanvasBlockContentSchema,
  CanvasBlockStyleSchema,
  CanvasStateSchema,
  EditorConfigSchema,
  validateBlock,
  safeValidateBlock,
  validateBlocks,
  safeValidateBlocks,
  validateEditorConfig,
  safeValidateEditorConfig,
  sanitizeBlocks,
  isValidBlockType,
  type ValidatedCanvasBlock,
  type ValidatedCanvasState,
  type ValidatedEditorConfig,
} from "@/utils/blockSchemas";

// Hook de gerenciamento
export {
  useBlockManager,
  type BlockManagerOptions,
  type BlockManagerState,
  type BlockManagerActions,
  type UseBlockManagerReturn,
} from "@/hooks/useBlockManager";

// Componentes
export {
  BaseBlock,
  StaticBlock,
  type BaseBlockProps,
} from "@/components/editor/blocks/BaseBlock";
export {
  BlockPalette,
  type BlockPaletteProps,
} from "@/components/editor/BlockPalette";
export { ImprovedDragDropEditor } from "@/components/result-editor/ImprovedDragDropEditor";

// Configurações
export {
  DEFAULT_BLOCK_CATEGORIES,
  BLOCK_DESCRIPTIONS,
  type BlockCategory,
} from "@/components/editor/blockPaletteConfig";

// Editores de blocos
export {
  HeadingEditor,
  TextEditor,
  ImageEditor,
  ButtonEditor,
  SpacerEditor,
  DividerEditor,
  CtaOfferEditor,
  CountdownEditor,
  GuaranteeEditor,
  type BlockEditorProps,
} from "@/components/editor/blocks/BlockEditors";

// Configuração de tipos de editores
export {
  EDITABLE_BLOCK_TYPES,
  isEditableBlockType,
  type FontSize,
  type FontWeight,
  type TextAlign,
  type ImageSize,
  type ImageAlignment,
  type BorderRadiusStyle,
  type ButtonVariant,
  type DividerStyle,
  type CtaVariant,
  type CountdownVariant,
  type EditableBlockType,
} from "@/components/editor/blocks/blockEditorConfig";
