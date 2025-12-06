/**
 * Configuração e mapeamento dos editores de blocos
 * Separado dos componentes para suportar Fast Refresh do React
 */

import React from "react";
import { CanvasBlockContent } from "@/types/canvasBlocks";

// Tipos de conteúdo do bloco
export type FontSize = "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
export type FontWeight = "normal" | "medium" | "semibold" | "bold";
export type TextAlign = "left" | "center" | "right";
export type ImageSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";
export type ImageAlignment = "left" | "center" | "right";
export type BorderRadiusStyle =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";
export type ButtonVariant = "primary" | "secondary" | "outline" | "cta";
export type DividerStyle = "solid" | "dashed" | "dotted" | "elegant";
export type CtaVariant = "green" | "brand" | "gradient";
export type CountdownVariant = "dramatic" | "simple" | "minimal";

// Tipos de blocos que possuem editores
export const EDITABLE_BLOCK_TYPES = [
  "heading",
  "text",
  "image",
  "button",
  "spacer",
  "divider",
  "ctaOffer",
  "countdown",
  "guarantee",
] as const;

export type EditableBlockType = (typeof EDITABLE_BLOCK_TYPES)[number];

export const isEditableBlockType = (
  type: string
): type is EditableBlockType => {
  return EDITABLE_BLOCK_TYPES.includes(type as EditableBlockType);
};
