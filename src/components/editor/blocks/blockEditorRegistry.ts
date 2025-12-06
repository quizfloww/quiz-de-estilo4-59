/**
 * Registro dos editores de blocos
 * Separado para suportar Fast Refresh do React
 */

import { BlockEditorProps } from "./BlockEditors";
import React from "react";

// Mapeamento de editores será definido em runtime
// para evitar dependência circular
let blockEditors: Partial<Record<string, React.FC<BlockEditorProps>>> = {};

/**
 * Registra os editores de blocos
 * Chamado pelo BlockEditors.tsx após definir os componentes
 */
export const registerBlockEditors = (
  editors: Partial<Record<string, React.FC<BlockEditorProps>>>
) => {
  blockEditors = editors;
};

/**
 * Retorna o editor apropriado para um tipo de bloco
 */
export const getBlockEditor = (
  blockType: string
): React.FC<BlockEditorProps> | null => {
  return blockEditors[blockType] || null;
};

/**
 * Retorna todos os editores registrados
 */
export const getRegisteredEditors = () => blockEditors;
