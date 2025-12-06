/**
 * BlockPalette - Paleta de blocos drag-and-drop
 *
 * Componente reutilizável para seleção e adição de blocos ao editor.
 * Suporta categorias, busca e drag para adicionar.
 */

import React, { useState, useMemo, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, GripVertical } from "lucide-react";
import * as Icons from "lucide-react";

import {
  CanvasBlockType,
  BLOCK_TYPE_LABELS,
  BLOCK_TYPE_ICONS,
} from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";

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

export interface BlockPaletteProps {
  /** Categorias de blocos a exibir */
  categories?: BlockCategory[];
  /** Callback quando um bloco é clicado */
  onAddBlock: (type: CanvasBlockType) => void;
  /** Modo de exibição */
  layout?: "grid" | "list";
  /** Mostrar descrições */
  showDescriptions?: boolean;
  /** Categorias expandidas por padrão */
  defaultExpandedCategories?: string[];
  /** Classe CSS adicional */
  className?: string;
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

const BLOCK_DESCRIPTIONS: Partial<Record<CanvasBlockType, string>> = {
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

// ============================================
// Componente de Item de Bloco (Draggable)
// ============================================

interface DraggableBlockItemProps {
  type: CanvasBlockType;
  onClick: () => void;
  layout: "grid" | "list";
  showDescription?: boolean;
}

const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({
  type,
  onClick,
  layout,
  showDescription = false,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: "block",
      blockType: type,
    },
  });

  const iconName = BLOCK_TYPE_ICONS[type];
  const IconComponent = (Icons as any)[iconName] || Icons.Square;
  const label = BLOCK_TYPE_LABELS[type];
  const description = BLOCK_DESCRIPTIONS[type];

  if (layout === "list") {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
          "border bg-background hover:bg-muted/50 transition-all",
          "hover:border-primary/50 hover:shadow-sm",
          isDragging && "opacity-50 shadow-lg"
        )}
      >
        {/* Drag Handle */}
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Icon */}
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{label}</p>
          {showDescription && description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-3",
              "border rounded-lg bg-background cursor-pointer",
              "hover:bg-muted/50 hover:border-primary/50 transition-all",
              "hover:shadow-sm aspect-square",
              isDragging && "opacity-50 shadow-lg"
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight">
              {label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// Componente Principal
// ============================================

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  categories = DEFAULT_BLOCK_CATEGORIES,
  onAddBlock,
  layout = "grid",
  showDescriptions = true,
  defaultExpandedCategories,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar blocos por busca
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();

    return categories
      .map((category) => ({
        ...category,
        blocks: category.blocks.filter((type) => {
          const label = BLOCK_TYPE_LABELS[type].toLowerCase();
          const desc = (BLOCK_DESCRIPTIONS[type] || "").toLowerCase();
          return label.includes(query) || desc.includes(query);
        }),
      }))
      .filter((category) => category.blocks.length > 0);
  }, [categories, searchQuery]);

  // Total de blocos encontrados
  const totalBlocks = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.blocks.length, 0),
    [filteredCategories]
  );

  const handleAddBlock = useCallback(
    (type: CanvasBlockType) => {
      onAddBlock(type);
    },
    [onAddBlock]
  );

  // Categorias expandidas
  const expandedCategories = useMemo(() => {
    if (searchQuery) {
      // Expandir todas quando buscando
      return filteredCategories.map((c) => c.id);
    }
    return defaultExpandedCategories || [categories[0]?.id];
  }, [searchQuery, filteredCategories, defaultExpandedCategories, categories]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header com Busca */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar blocos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{totalBlocks} bloco(s) encontrado(s)</span>
            <button
              onClick={() => setSearchQuery("")}
              className="hover:text-foreground underline"
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Lista de Categorias */}
      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          defaultValue={expandedCategories}
          className="px-3 py-2"
        >
          {filteredCategories.map((category) => {
            const CategoryIcon = category.icon
              ? (Icons as any)[category.icon]
              : Icons.Folder;

            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border-none"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {category.label}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {category.blocks.length}
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-1 pb-3">
                  {category.description && !searchQuery && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {category.description}
                    </p>
                  )}

                  {layout === "grid" ? (
                    <div className="grid grid-cols-3 gap-2">
                      {category.blocks.map((type) => (
                        <DraggableBlockItem
                          key={type}
                          type={type}
                          onClick={() => handleAddBlock(type)}
                          layout={layout}
                          showDescription={showDescriptions}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {category.blocks.map((type) => (
                        <DraggableBlockItem
                          key={type}
                          type={type}
                          onClick={() => handleAddBlock(type)}
                          layout={layout}
                          showDescription={showDescriptions}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhum bloco encontrado</p>
            <p className="text-xs mt-1">Tente uma busca diferente</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BlockPalette;
