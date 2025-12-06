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
  DEFAULT_BLOCK_CATEGORIES,
  type BlockCategory,
  type BlockPaletteProps,
} from "@/components/editor/BlockPalette";
export { ImprovedDragDropEditor } from "@/components/result-editor/ImprovedDragDropEditor";

// Editores de blocos
export {
  BLOCK_EDITORS,
  getBlockEditor,
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
