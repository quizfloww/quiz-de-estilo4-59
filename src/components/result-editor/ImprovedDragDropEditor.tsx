/**
 * ImprovedDragDropEditor - Editor visual aprimorado com boas práticas
 *
 * Features:
 * - Drag-and-drop com @dnd-kit
 * - Validação Zod de dados JSON
 * - Undo/Redo com histórico
 * - Auto-save configurável
 * - Export/Import JSON
 * - Preview responsivo
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Save,
  Eye,
  EyeOff,
  Undo2,
  Redo2,
  Download,
  Upload,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Layers,
  Plus,
  Search,
  FileJson,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useBlockManager } from "@/hooks/useBlockManager";
import { BaseBlock } from "@/components/editor/blocks/BaseBlock";
import { BlockRenderer } from "@/components/canvas-editor/BlockRenderer";
import {
  CanvasBlock,
  CanvasBlockType,
  BLOCK_TYPE_LABELS,
  BLOCK_TYPE_ICONS,
} from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

// ============================================
// Tipos
// ============================================

interface ImprovedDragDropEditorProps {
  /** Callback de salvamento */
  onSave: (config: {
    blocks: CanvasBlock[];
    version: string;
    timestamp: number;
  }) => void;
  /** Blocos iniciais */
  initialBlocks?: CanvasBlock[];
  /** Modo do editor */
  mode?: "quiz" | "result" | "offer";
  /** ID do quiz (para contexto) */
  quizId?: string;
  /** Chave para localStorage */
  storageKey?: string;
}

type PreviewDevice = "desktop" | "tablet" | "mobile";

interface BlockCategory {
  id: string;
  label: string;
  blocks: CanvasBlockType[];
}

// ============================================
// Categorias de Blocos
// ============================================

const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: "basic",
    label: "Básicos",
    blocks: ["heading", "text", "image", "button", "spacer", "divider"],
  },
  {
    id: "quiz",
    label: "Quiz",
    blocks: ["header", "input", "options"],
  },
  {
    id: "result",
    label: "Resultado",
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
    label: "Vendas",
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
    blocks: ["motivation", "bonus", "mentor", "securePurchase"],
  },
];

// ============================================
// Componentes Auxiliares
// ============================================

interface BlockPaletteItemProps {
  type: CanvasBlockType;
  onClick: () => void;
}

const BlockPaletteItem: React.FC<BlockPaletteItemProps> = ({
  type,
  onClick,
}) => {
  const iconName = BLOCK_TYPE_ICONS[type];
  const IconComponent = (Icons as any)[iconName] || Icons.Square;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-3",
              "border rounded-lg bg-background hover:bg-muted transition-colors",
              "text-muted-foreground hover:text-foreground",
              "w-full aspect-square"
            )}
          >
            <IconComponent className="h-5 w-5" />
            <span className="text-[10px] text-center leading-tight">
              {BLOCK_TYPE_LABELS[type]}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Adicionar {BLOCK_TYPE_LABELS[type]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ============================================
// Componente Principal
// ============================================

export const ImprovedDragDropEditor: React.FC<ImprovedDragDropEditorProps> = ({
  onSave,
  initialBlocks = [],
  mode = "quiz",
  quizId,
  storageKey,
}) => {
  // Block Manager Hook
  const {
    blocks,
    sortedBlocks,
    selectedBlockId,
    selectedBlock,
    isDirty,
    isSaving,
    error,
    canUndo,
    canRedo,
    blockCount,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    moveBlockUp,
    moveBlockDown,
    selectBlock,
    undo,
    redo,
    save,
    loadFromJson,
    exportToJson,
    reset,
  } = useBlockManager({
    initialBlocks,
    storageKey: storageKey || `editor_${mode}_${quizId || "default"}`,
    autoSave: true,
    autoSaveInterval: 30000,
    onSave: async (blocks) => {
      onSave({
        blocks,
        version: "2.0",
        timestamp: Date.now(),
      });
    },
  });

  // Local State
  const [previewMode, setPreviewMode] = useState<PreviewDevice>("desktop");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("basic");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ============================================
  // Handlers
  // ============================================

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);

      if (over && active.id !== over.id) {
        const oldIndex = sortedBlocks.findIndex((b) => b.id === active.id);
        const newIndex = sortedBlocks.findIndex((b) => b.id === over.id);
        reorderBlocks(oldIndex, newIndex);
      }
    },
    [sortedBlocks, reorderBlocks]
  );

  const handleAddBlock = useCallback(
    (type: CanvasBlockType) => {
      addBlock(type);
      toast.success(`Bloco "${BLOCK_TYPE_LABELS[type]}" adicionado`);
    },
    [addBlock]
  );

  const handleSave = useCallback(async () => {
    const success = await save();
    if (success) {
      toast.success("Configuração salva com sucesso!");
    }
  }, [save]);

  const handleExport = useCallback(() => {
    const json = exportToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `editor-${mode}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuração exportada!");
  }, [exportToJson, mode]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          loadFromJson(json);
        } catch (err) {
          toast.error("Erro ao importar arquivo");
        }
      };
      reader.readAsText(file);

      // Reset input
      event.target.value = "";
    },
    [loadFromJson]
  );

  // ============================================
  // Filtered Blocks for Palette
  // ============================================

  const filteredBlocks = useMemo(() => {
    const category = BLOCK_CATEGORIES.find((c) => c.id === activeCategory);
    if (!category) return [];

    if (!searchQuery) return category.blocks;

    const query = searchQuery.toLowerCase();
    return category.blocks.filter((type) =>
      BLOCK_TYPE_LABELS[type].toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  // ============================================
  // Preview Width
  // ============================================

  const previewWidth = useMemo(() => {
    switch (previewMode) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "max-w-full";
    }
  }, [previewMode]);

  // ============================================
  // Mode Title
  // ============================================

  const modeTitle = useMemo(() => {
    switch (mode) {
      case "quiz":
        return "Editor de Quiz";
      case "result":
        return "Editor de Resultado";
      case "offer":
        return "Editor de Oferta";
      default:
        return "Editor Visual";
    }
  }, [mode]);

  const activeDragBlock = activeDragId
    ? sortedBlocks.find((b) => b.id === activeDragId)
    : null;

  // ============================================
  // Render
  // ============================================

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* ============================================ */}
      {/* SIDEBAR - Paleta de Blocos */}
      {/* ============================================ */}
      <aside className="w-72 bg-background border-r flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Componentes</h2>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar blocos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs de Categorias */}
        <div className="flex gap-1 p-2 overflow-x-auto border-b">
          {BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Blocos */}
        <ScrollArea className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2">
            {filteredBlocks.map((type) => (
              <BlockPaletteItem
                key={type}
                type={type}
                onClick={() => handleAddBlock(type)}
              />
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Nenhum bloco encontrado</p>
            </div>
          )}
        </ScrollArea>

        {/* Footer da Sidebar */}
        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{blockCount} blocos</span>
            {isDirty && (
              <Badge
                variant="outline"
                className="text-yellow-600 border-yellow-600"
              >
                Não salvo
              </Badge>
            )}
            {!isDirty && blockCount > 0 && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Salvo
              </Badge>
            )}
          </div>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN - Área de Edição */}
      {/* ============================================ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <header className="bg-background border-b px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Esquerda - Título e Status */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">{modeTitle}</h1>
              <Badge variant="secondary">{mode.toUpperCase()}</Badge>
              {quizId && (
                <span className="text-xs text-muted-foreground">
                  ID: {quizId}
                </span>
              )}
            </div>

            {/* Centro - Device Preview */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <TooltipProvider>
                {[
                  {
                    device: "desktop" as PreviewDevice,
                    icon: Monitor,
                    label: "Desktop",
                  },
                  {
                    device: "tablet" as PreviewDevice,
                    icon: Tablet,
                    label: "Tablet",
                  },
                  {
                    device: "mobile" as PreviewDevice,
                    icon: Smartphone,
                    label: "Mobile",
                  },
                ].map(({ device, icon: Icon, label }) => (
                  <Tooltip key={device}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant={previewMode === device ? "default" : "ghost"}
                        onClick={() => setPreviewMode(device)}
                        className="h-8 w-8"
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            {/* Direita - Ações */}
            <div className="flex items-center gap-2">
              {/* Undo/Redo */}
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={undo}
                        disabled={!canUndo}
                        className="h-8 w-8"
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Desfazer (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={redo}
                        disabled={!canRedo}
                        className="h-8 w-8"
                      >
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refazer (Ctrl+Y)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Export/Import */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleExport}
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar JSON</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 cursor-pointer"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4" />
                        </span>
                      </Button>
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>Importar JSON</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Separator orientation="vertical" className="h-6" />

              {/* Preview */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>

              {/* Salvar */}
              <Button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                size="sm"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <ScrollArea className="flex-1">
          <div className={cn("mx-auto p-6 transition-all", previewWidth)}>
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Blocks Canvas */}
            {blockCount === 0 ? (
              <Card className="p-12 border-dashed">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Comece a criar</h3>
                  <p className="text-muted-foreground mb-4">
                    Arraste componentes da barra lateral ou clique para
                    adicionar
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleAddBlock("heading")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar primeiro bloco
                  </Button>
                </div>
              </Card>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={sortedBlocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sortedBlocks.map((block, index) => (
                      <BaseBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={selectBlock}
                        onUpdate={(id, updates) => updateBlock(id, updates)}
                        onDelete={deleteBlock}
                        onDuplicate={duplicateBlock}
                        onMoveUp={moveBlockUp}
                        onMoveDown={moveBlockDown}
                        canMoveUp={index > 0}
                        canMoveDown={index < sortedBlocks.length - 1}
                        renderView={(b) => (
                          <BlockRenderer block={b} isPreview={false} />
                        )}
                      />
                    ))}
                  </div>
                </SortableContext>

                {/* Drag Overlay */}
                <DragOverlay>
                  {activeDragBlock && (
                    <div className="opacity-80 shadow-xl rounded-lg">
                      <BlockRenderer block={activeDragBlock} isPreview />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* ============================================ */}
      {/* PREVIEW SHEET */}
      {/* ============================================ */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Preview</SheetTitle>
            <SheetDescription>
              Visualização em tempo real do seu conteúdo
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {/* Device Selector */}
            <div className="flex justify-center gap-2 mb-4">
              {[
                {
                  device: "desktop" as PreviewDevice,
                  icon: Monitor,
                  label: "Desktop",
                },
                {
                  device: "tablet" as PreviewDevice,
                  icon: Tablet,
                  label: "Tablet",
                },
                {
                  device: "mobile" as PreviewDevice,
                  icon: Smartphone,
                  label: "Mobile",
                },
              ].map(({ device, icon: Icon, label }) => (
                <Button
                  key={device}
                  size="sm"
                  variant={previewMode === device ? "default" : "outline"}
                  onClick={() => setPreviewMode(device)}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Preview Container */}
            <div
              className={cn(
                "mx-auto border rounded-lg overflow-hidden bg-white transition-all",
                previewMode === "mobile" && "max-w-[375px]",
                previewMode === "tablet" && "max-w-[768px]"
              )}
            >
              <ScrollArea className="h-[60vh]">
                <div className="p-4">
                  {sortedBlocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} isPreview />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ImprovedDragDropEditor;
