import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  GripVertical,
  Trash2,
  Play,
  Globe,
  GlobeLock,
  Undo2,
  Redo2,
  Download,
  Upload,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFunnel, useUpdateFunnel } from "@/hooks/useFunnels";
import {
  useFunnelStagesWithOptions,
  useCreateStage,
  useUpdateStage,
  useDeleteStage,
  useReorderStages,
  FunnelStage,
} from "@/hooks/useFunnelStages";
import { toast } from "sonner";
import { FunnelSettingsPanel } from "@/components/funnel-editor/FunnelSettingsPanel";
import { PublishDialog } from "@/components/funnel-editor/PublishDialog";
import { StatusBadge } from "@/components/funnel-editor/StatusBadge";
import { JsonEditorDialog } from "@/components/funnel-editor/JsonEditorDialog";
import { usePublishFunnel, PublishValidation } from "@/hooks/usePublishFunnel";
import { useStageBlocksHistory } from "@/hooks/useStageBlocksHistory";
import {
  StageCanvasEditor,
  BlocksSidebar,
  PropertiesColumn,
  TestModeOverlay,
} from "@/components/canvas-editor";
import {
  CanvasBlock,
  CanvasBlockType,
  BLOCK_TYPE_LABELS,
} from "@/types/canvasBlocks";
import {
  convertStageToBlocks,
  createEmptyBlock,
  blocksToStageConfig,
} from "@/utils/stageToBlocks";
import { saveStageBocks } from "@/utils/syncBlocksToDatabase";
import {
  sanitizeStageConfig,
  validateFunnelImport,
  formatZodErrors,
} from "@/utils/stageConfigSchema";
import {
  saveStageDraft,
  getStageDraft,
  markStageSynced,
  isIndexedDBAvailable,
} from "@/services/draftService";
import type { Database } from "@/integrations/supabase/types";
import { FunnelConfig } from "@/types/funnelConfig";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Stage types agora são strings livres para máxima flexibilidade
type StageType = string;

// Tipos padrão sugeridos (mas qualquer string é válida)
const DEFAULT_STAGE_TYPES = {
  intro: "intro",
  question: "question",
  strategic: "strategic",
  transition: "transition",
  result: "result",
  offer: "offer",
  upsell: "upsell",
  thankyou: "thankyou",
} as const;

const stageTypeLabels: Record<string, string> = {
  intro: "Introdução",
  question: "Questão",
  strategic: "Estratégica",
  transition: "Transição",
  result: "Resultado",
  offer: "Oferta",
  upsell: "Upsell",
  thankyou: "Obrigado",
  page: "Página",
  custom: "Personalizada",
};

interface SortableStageItemProps {
  stage: FunnelStage;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const SortableStageItem: React.FC<SortableStageItemProps> = ({
  stage,
  isActive,
  onClick,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors group
        ${
          isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
        }
        ${isDragging ? "shadow-lg" : ""}
      `}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{stage.title}</p>
        <p className="text-xs text-muted-foreground">
          {stageTypeLabels[stage.type] || stage.type}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default function FunnelEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: funnel, isLoading: loadingFunnel } = useFunnel(id);
  const { data: stages, isLoading: loadingStages } =
    useFunnelStagesWithOptions(id);
  const updateFunnel = useUpdateFunnel();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  const reorderStages = useReorderStages();
  const {
    validateFunnel,
    publishFunnel,
    unpublishFunnel,
    isValidating,
    isPublishing,
    isUnpublishing,
  } = usePublishFunnel(id);

  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [localStages, setLocalStages] = useState<FunnelStage[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishValidation, setPublishValidation] =
    useState<PublishValidation | null>(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  // Canvas blocks state with undo/redo
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialStageBlocks, setInitialStageBlocks] = useState<
    Record<string, CanvasBlock[]>
  >({});

  const {
    stageBlocks,
    setStageBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    resetState: resetStageBlocks,
  } = useStageBlocksHistory(
    {},
    {
      maxHistorySize: 50,
    }
  );

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

  useEffect(() => {
    if (stages) {
      setLocalStages(stages);
    }
  }, [stages]);

  useEffect(() => {
    if (localStages.length > 0 && !activeStageId) {
      setActiveStageId(localStages[0].id);
    }
  }, [localStages, activeStageId]);

  // Convert active stage to blocks when it changes
  useEffect(() => {
    if (activeStageId && localStages.length > 0) {
      const stageIndex = localStages.findIndex((s) => s.id === activeStageId);
      const stage = localStages[stageIndex];

      if (stage && !stageBlocks[activeStageId]) {
        const blocks = convertStageToBlocks(
          stage,
          localStages.length,
          stageIndex
        );
        setStageBlocks((prev) => ({
          ...prev,
          [activeStageId]: blocks,
        }));
        // Store initial state for comparison
        setInitialStageBlocks((prev) => ({
          ...prev,
          [activeStageId]: JSON.parse(JSON.stringify(blocks)),
        }));
      }

      // Reset selected block when changing stages
      setSelectedBlockId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStageId, localStages]);

  // Generate ALL stage blocks when test mode is activated
  useEffect(() => {
    if (isTestMode && localStages.length > 0) {
      const missingBlocks: Record<string, CanvasBlock[]> = {};

      localStages.forEach((stage, index) => {
        if (!stageBlocks[stage.id]) {
          const blocks = convertStageToBlocks(stage, localStages.length, index);
          missingBlocks[stage.id] = blocks;
        }
      });

      if (Object.keys(missingBlocks).length > 0) {
        setStageBlocks((prev) => ({
          ...prev,
          ...missingBlocks,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTestMode, localStages]);

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges = Object.keys(stageBlocks).some((stageId) => {
      const current = stageBlocks[stageId];
      const initial = initialStageBlocks[stageId];
      if (!initial) return false;
      return JSON.stringify(current) !== JSON.stringify(initial);
    });
    setHasUnsavedChanges(hasChanges);
  }, [stageBlocks, initialStageBlocks]);

  // Mover activeStage para antes do auto-save para evitar uso antes da declaração
  const activeStage = localStages.find((s) => s.id === activeStageId);

  // Auto-save with IndexedDB (offline draft backup)
  useEffect(() => {
    // Only auto-save if IndexedDB is available
    if (!isIndexedDBAvailable()) {
      console.warn("IndexedDB not available, auto-save disabled");
      return;
    }

    const autoSaveTimer = setInterval(async () => {
      // Usar busca direta de localStages para evitar stale closure
      const currentActiveStage = localStages.find(
        (s) => s.id === activeStageId
      );
      if (hasUnsavedChanges && currentActiveStage && activeStageId && id) {
        try {
          const blocks = stageBlocks[activeStageId];
          if (blocks && blocks.length > 0) {
            await saveStageDraft(
              activeStageId,
              id,
              currentActiveStage.title,
              currentActiveStage,
              blocks
            );
            console.log("✅ Auto-save draft:", currentActiveStage.title);
          }
        } catch (error) {
          console.error("❌ Auto-save error:", error);
        }
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveTimer);
  }, [hasUnsavedChanges, localStages, activeStageId, stageBlocks, id]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Você tem alterações não salvas. Deseja realmente sair?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Keyboard shortcuts for Undo/Redo (handleSave é chamado via ref para evitar dependência circular)
  const handleSaveRef = React.useRef<() => Promise<void>>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveRef.current?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // activeStage já declarado acima do useEffect de auto-save
  const activeStageIndex = localStages.findIndex((s) => s.id === activeStageId);
  const currentBlocks = activeStageId ? stageBlocks[activeStageId] || [] : [];
  const selectedBlock =
    currentBlocks.find((b) => b.id === selectedBlockId) || null;

  // Count similar blocks and stages
  const similarBlocksCount = selectedBlock
    ? Object.values(stageBlocks)
        .flat()
        .filter(
          (b) => b.type === selectedBlock.type && b.id !== selectedBlock.id
        ).length
    : 0;

  const similarStagesCount = activeStage
    ? localStages.filter(
        (s) => s.type === activeStage.type && s.id !== activeStage.id
      ).length
    : 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localStages.findIndex((s) => s.id === active.id);
      const newIndex = localStages.findIndex((s) => s.id === over.id);

      const newStages = arrayMove(localStages, oldIndex, newIndex);
      setLocalStages(newStages);

      const updates = newStages.map((stage, index) => ({
        id: stage.id,
        order_index: index,
      }));

      reorderStages.mutate({ funnelId: id!, stages: updates });
    }
  };

  const handleAddStage = async (type: string) => {
    if (!id) return;
    const nextOrder = localStages.length;
    const label = stageTypeLabels[type] || type;
    await createStage.mutateAsync({
      funnel_id: id,
      type,
      title: `${label} ${nextOrder + 1}`,
      order_index: nextOrder,
      is_enabled: true,
      config: {},
    });
  };

  const handleBlocksChange = (newBlocks: CanvasBlock[]) => {
    if (!activeStageId) return;

    setStageBlocks((prev) => ({
      ...prev,
      [activeStageId]: newBlocks,
    }));
  };

  const handleAddBlock = (type: CanvasBlockType) => {
    if (!activeStageId) return;

    const newBlock = createEmptyBlock(type);
    newBlock.order = currentBlocks.length;

    const newBlocks = [...currentBlocks, newBlock];
    handleBlocksChange(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (updatedBlock: CanvasBlock) => {
    if (!activeStageId) return;

    const newBlocks = currentBlocks.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    handleBlocksChange(newBlocks);
  };

  const handleSelectBlock = (blockId: string | null) => {
    setSelectedBlockId(blockId);
  };

  // Find header block for properties column
  const headerBlock = currentBlocks.find((b) => b.type === "header") || null;

  // Internal save logic (used by auto-save and manual save)
  const handleSaveInternal = useCallback(async () => {
    // Save all stages with their blocks converted back to config
    // Also sync options to stage_options table
    for (const [stageId, blocks] of Object.entries(stageBlocks)) {
      const stage = localStages.find((s) => s.id === stageId);
      const stageType = stage?.type || "question";

      // Use saveStageBocks to save config AND sync options to database
      await saveStageBocks(stageId, blocks, stageType);

      // Mark IndexedDB draft as synced after successful save
      if (isIndexedDBAvailable()) {
        try {
          await markStageSynced(stageId);
          console.log("✅ Draft marcado como sincronizado:", stageId);
        } catch (error) {
          console.warn(
            "⚠️ Não foi possível marcar draft como sincronizado:",
            error
          );
        }
      }
    }
    // Reset initial state to current state after successful save
    setInitialStageBlocks(JSON.parse(JSON.stringify(stageBlocks)));
    setHasUnsavedChanges(false);
  }, [stageBlocks, localStages]);

  // Auto-save after 30 seconds of inactivity
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(async () => {
      console.log("[AutoSave] Salvando automaticamente...");
      try {
        await handleSaveInternal();
        toast.info("Auto-save realizado", { duration: 2000 });
      } catch (error) {
        console.error("[AutoSave] Falha:", error);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, handleSaveInternal]);

  const handleSave = useCallback(async () => {
    await handleSaveInternal();
    toast.success("Funil salvo com sucesso!");
  }, [handleSaveInternal]);

  // Atualiza ref para uso no keyboard shortcut
  handleSaveRef.current = handleSave;

  const handleOpenPublishDialog = async () => {
    setShowPublishDialog(true);
    const validation = await validateFunnel(
      localStages,
      stageBlocks,
      funnel?.slug || ""
    );
    setPublishValidation(validation);
  };

  const handlePublish = async () => {
    await publishFunnel({ stages: localStages, stageBlocks });
  };

  const handleUnpublish = async () => {
    await unpublishFunnel();
  };

  // Export complete funnel configuration as JSON
  const handleExportFunnel = () => {
    const funnelExport = {
      name: funnel.name,
      slug: funnel.slug,
      globalConfig: funnel.global_config,
      stages: localStages.map((stage) => ({
        id: stage.id,
        type: stage.type,
        title: stage.title,
        order_index: stage.order_index,
        is_enabled: stage.is_enabled,
        config: stage.config,
        blocks: stageBlocks[stage.id] || [],
      })),
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(funnelExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `funil-${funnel.slug}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Funil exportado com sucesso!");
  };

  // Import complete funnel configuration from JSON
  const handleImportFunnel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;

        // Parse JSON with better error handling
        let importedData: unknown;
        try {
          importedData = JSON.parse(content);
        } catch (parseError) {
          const jsonError = parseError as SyntaxError;
          // Extract line/position info from JSON parse error
          const posMatch = jsonError.message.match(/position (\d+)/);
          if (posMatch) {
            const position = parseInt(posMatch[1], 10);
            const lines = content.substring(0, position).split("\n");
            const lineNumber = lines.length;
            const column = lines[lines.length - 1].length + 1;
            toast.error(
              `Erro de sintaxe JSON na linha ${lineNumber}, coluna ${column}: ${jsonError.message}`
            );
          } else {
            toast.error(`Erro de sintaxe JSON: ${jsonError.message}`);
          }
          return;
        }

        // Validate with Zod schema
        const validationResult = validateFunnelImport(importedData);

        if (!validationResult.success) {
          // Show detailed validation errors
          const errorMessages = formatZodErrors(validationResult.error!);
          console.error("Validation errors:", errorMessages);

          // Show first 3 errors in toast (to avoid overwhelming)
          const displayErrors = errorMessages.slice(0, 3);
          const moreCount = errorMessages.length - 3;

          toast.error(
            <div className="space-y-1">
              <div className="font-semibold">Erro na validação do arquivo:</div>
              {displayErrors.map((err, i) => (
                <div key={i} className="text-sm">
                  • {err}
                </div>
              ))}
              {moreCount > 0 && (
                <div className="text-sm text-muted-foreground">
                  ...e mais {moreCount} erro(s). Verifique o console.
                </div>
              )}
            </div>,
            { duration: 8000 }
          );
          return;
        }

        const validData = validationResult.data!;

        // Update funnel metadata if present
        if (validData.name || validData.globalConfig) {
          await updateFunnel.mutateAsync({
            id: funnel.id,
            ...(validData.name && { name: validData.name }),
            ...(validData.globalConfig && {
              global_config: validData.globalConfig,
            }),
          });
        }

        // Import stages and blocks
        const newStageBlocks: Record<string, CanvasBlock[]> = {};
        const updatedStages: FunnelStage[] = [];
        const processedOrderIndexes = new Set<number>();

        // Process imported stages
        for (const importedStage of validData.stages) {
          const orderIndex =
            importedStage.order_index ??
            validData.stages.indexOf(importedStage);
          processedOrderIndexes.add(orderIndex);

          // Find matching stage by order_index
          const existingStage = localStages.find(
            (s) => s.order_index === orderIndex
          );

          if (existingStage) {
            // UPDATE existing stage
            await updateStage.mutateAsync({
              id: existingStage.id,
              title: importedStage.title || existingStage.title,
              type: importedStage.type || existingStage.type || "page",
              config: importedStage.config || {},
              is_enabled: importedStage.is_enabled ?? true,
            });

            const updatedStageData = {
              ...existingStage,
              title: importedStage.title || existingStage.title,
              type: importedStage.type || existingStage.type || "page",
              config: importedStage.config || {},
              is_enabled: importedStage.is_enabled ?? true,
            };
            updatedStages.push(updatedStageData);

            // Import blocks for this stage
            if (importedStage.blocks && Array.isArray(importedStage.blocks)) {
              // Usar blocos do JSON
              newStageBlocks[existingStage.id] = importedStage.blocks;
              await saveStageBocks(
                existingStage.id,
                importedStage.blocks,
                updatedStageData.type
              );
            } else if (importedStage.config) {
              // Se não tem blocos no JSON, converter do config
              const stageIndex = localStages.findIndex(
                (s) => s.id === existingStage.id
              );
              const convertedBlocks = convertStageToBlocks(
                updatedStageData,
                localStages.length,
                stageIndex
              );
              newStageBlocks[existingStage.id] = convertedBlocks;
              await saveStageBocks(
                existingStage.id,
                convertedBlocks,
                updatedStageData.type
              );
            }
          } else {
            // CREATE new stage (JSON tem mais stages que o funil atual)
            const newStage = await createStage.mutateAsync({
              funnel_id: id!,
              type: importedStage.type || "page",
              title: importedStage.title || `Etapa ${orderIndex + 1}`,
              order_index: orderIndex,
              is_enabled: importedStage.is_enabled ?? true,
              config: importedStage.config || {},
            });

            updatedStages.push(newStage);

            // Import blocks for new stage
            if (importedStage.blocks && Array.isArray(importedStage.blocks)) {
              newStageBlocks[newStage.id] = importedStage.blocks;
              await saveStageBocks(
                newStage.id,
                importedStage.blocks,
                newStage.type
              );
            } else if (importedStage.config) {
              const convertedBlocks = convertStageToBlocks(
                newStage,
                validData.stages.length,
                orderIndex
              );
              newStageBlocks[newStage.id] = convertedBlocks;
              await saveStageBocks(newStage.id, convertedBlocks, newStage.type);
            }
          }
        }

        // OPTIONAL: Delete stages not in imported JSON
        // (Comentado por segurança - descomente se quiser sync completo)
        // for (const existingStage of localStages) {
        //   if (!processedOrderIndexes.has(existingStage.order_index)) {
        //     await deleteStage.mutate({ id: existingStage.id, funnelId: id! });
        //   }
        // }

        // Update local state with imported stages
        setLocalStages((prev) =>
          prev.map((stage) => {
            const updated = updatedStages.find((s) => s.id === stage.id);
            return updated || stage;
          })
        );

        // Force update blocks state - sobrescrever tudo
        setStageBlocks((prev) => ({
          ...prev,
          ...newStageBlocks,
        }));
        setInitialStageBlocks((prev) => ({
          ...prev,
          ...JSON.parse(JSON.stringify(newStageBlocks)),
        }));
        setHasUnsavedChanges(false);

        toast.success(
          `Funil importado com sucesso! ${validData.stages.length} etapas processadas.`
        );
      } catch (error) {
        console.error("Error importing funnel:", error);
        toast.error(
          `Erro ao importar: ${
            error instanceof Error ? error.message : "Arquivo inválido"
          }`
        );
      }
    };
    reader.readAsText(file);

    // Reset input to allow re-importing the same file
    event.target.value = "";
  };

  // Apply block content to all similar blocks (same type) across all stages
  const handleApplyBlockToAll = (
    sourceBlock: CanvasBlock,
    blockType: CanvasBlockType
  ) => {
    const newStageBlocks = { ...stageBlocks };
    let count = 0;

    for (const [stageId, blocks] of Object.entries(newStageBlocks)) {
      const updatedBlocks = blocks.map((block) => {
        if (block.type === blockType && block.id !== sourceBlock.id) {
          count++;
          return {
            ...block,
            content: { ...sourceBlock.content },
            style: sourceBlock.style ? { ...sourceBlock.style } : undefined,
          };
        }
        return block;
      });
      newStageBlocks[stageId] = updatedBlocks;
    }

    setStageBlocks(newStageBlocks);
    toast.success(
      `Configurações aplicadas a ${count} blocos "${BLOCK_TYPE_LABELS[blockType]}"`
    );
  };

  // Apply header config to all stages
  const handleApplyHeaderToAll = (sourceHeader: CanvasBlock) => {
    const newStageBlocks = { ...stageBlocks };
    let count = 0;

    for (const [stageId, blocks] of Object.entries(newStageBlocks)) {
      if (stageId === activeStageId) continue;

      const updatedBlocks = blocks.map((block) => {
        if (block.type === "header") {
          count++;
          return {
            ...block,
            content: { ...sourceHeader.content },
          };
        }
        return block;
      });
      newStageBlocks[stageId] = updatedBlocks;
    }

    setStageBlocks(newStageBlocks);
    toast.success(`Configurações de header aplicadas a ${count} etapas`);
  };

  // Apply all blocks config from current stage to all stages of same type
  const handleApplyStageConfigToAll = (sourceStage: FunnelStage) => {
    if (!activeStageId) return;

    const sourceBlocks = stageBlocks[activeStageId] || [];
    const newStageBlocks = { ...stageBlocks };
    let count = 0;

    for (const stage of localStages) {
      if (stage.type === sourceStage.type && stage.id !== sourceStage.id) {
        // Copy all blocks from source to target, preserving IDs
        const targetBlocks = stageBlocks[stage.id] || [];

        const updatedBlocks = targetBlocks.map((targetBlock, index) => {
          const sourceBlock = sourceBlocks.find(
            (sb) => sb.type === targetBlock.type
          );
          if (sourceBlock) {
            return {
              ...targetBlock,
              content: { ...sourceBlock.content },
              style: sourceBlock.style ? { ...sourceBlock.style } : undefined,
            };
          }
          return targetBlock;
        });

        newStageBlocks[stage.id] = updatedBlocks;
        count++;
      }
    }

    setStageBlocks(newStageBlocks);
    const label = stageTypeLabels[sourceStage.type] || sourceStage.type;
    toast.success(
      `Configurações aplicadas a ${count} etapas do tipo "${label}"`
    );
  };

  const handleStageUpdate = (updates: Partial<FunnelStage>) => {
    if (!activeStage || !activeStageId || activeStageIndex < 0) return;

    const updatedStage = { ...activeStage, ...updates };

    setLocalStages((prev) =>
      prev.map((stage) => (stage.id === activeStageId ? updatedStage : stage))
    );

    const rebuiltBlocks = convertStageToBlocks(
      updatedStage,
      Math.max(localStages.length, 1),
      activeStageIndex
    );
    setStageBlocks((prev) => ({
      ...prev,
      [activeStageId]: rebuiltBlocks,
    }));

    updateStage.mutate({ id: activeStageId, ...updates });
  };

  if (loadingFunnel || loadingStages) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-14 border-b flex items-center px-4 gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 flex">
          <Skeleton className="w-64 h-full" />
          <Skeleton className="flex-1 h-full" />
          <Skeleton className="w-80 h-full" />
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Funil não encontrado</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/funnels">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">{funnel.name}</h1>
              <StatusBadge
                status={
                  (funnel.status as "draft" | "published" | "archived") ||
                  "draft"
                }
              />
            </div>
            <span className="text-xs text-muted-foreground">
              /{funnel.slug}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={previewMode === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
            >
              Desktop
            </Button>
            <Button
              variant={previewMode === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
            >
              Mobile
            </Button>
          </div>

          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Desfazer (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Refazer (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Export/Import JSON */}
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportFunnel}
              title="Exportar funil completo (JSON)"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document.getElementById("import-funnel-json")?.click()
              }
              title="Importar funil completo (JSON)"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowJsonEditor(true)}
              title="Editar JSON com Monaco Editor"
            >
              <FileJson className="h-4 w-4" />
            </Button>
            <input
              id="import-funnel-json"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFunnel}
            />
          </div>

          <FunnelSettingsPanel
            funnelId={funnel.id}
            funnelName={funnel.name}
            funnelSlug={funnel.slug}
            globalConfig={funnel.global_config as FunnelConfig | null}
            onSave={(updates) =>
              updateFunnel.mutate({ id: funnel.id, ...updates })
            }
          />
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsTestMode(true)}
            className="bg-green-600 hover:bg-green-700"
            data-testid="editor-test-button"
          >
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quiz/${funnel.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className={
              hasUnsavedChanges ? "bg-amber-600 hover:bg-amber-700" : ""
            }
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
            {hasUnsavedChanges && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </Button>
          {funnel.status === "published" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnpublish}
              disabled={isUnpublishing}
            >
              <GlobeLock className="h-4 w-4 mr-2" />
              {isUnpublishing ? "Despublicando..." : "Despublicar"}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleOpenPublishDialog}
              className="bg-primary hover:bg-primary/90"
            >
              <Globe className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Stages Sidebar */}
        <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
          <div className="h-full flex flex-col border-r">
            <div className="p-3 border-b flex items-center justify-between">
              <span className="font-medium text-sm">Etapas</span>
              <Select
                onValueChange={(type) => handleAddStage(type as StageType)}
              >
                <SelectTrigger className="w-auto h-8">
                  <Plus className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intro">Introdução</SelectItem>
                  <SelectItem value="question">Questão</SelectItem>
                  <SelectItem value="strategic">Estratégica</SelectItem>
                  <SelectItem value="transition">Transição</SelectItem>
                  <SelectItem value="result">Resultado</SelectItem>
                  <SelectItem value="offer">Oferta</SelectItem>
                  <SelectItem value="upsell">Upsell</SelectItem>
                  <SelectItem value="thankyou">Obrigado</SelectItem>
                  <SelectItem value="page">Página Customizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localStages.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {localStages.map((stage) => (
                      <SortableStageItem
                        key={stage.id}
                        stage={stage}
                        isActive={activeStageId === stage.id}
                        onClick={() => setActiveStageId(stage.id)}
                        onDelete={() =>
                          deleteStage.mutate({ id: stage.id, funnelId: id! })
                        }
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {localStages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Adicione uma etapa para começar
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Blocks Sidebar */}
        <ResizablePanel defaultSize={12} minSize={10} maxSize={18}>
          <BlocksSidebar onAddBlock={handleAddBlock} />
        </ResizablePanel>

        <ResizableHandle />

        {/* Canvas Editor Area */}
        <ResizablePanel defaultSize={51}>
          <div className="h-full flex flex-col">
            {activeStage ? (
              <StageCanvasEditor
                stage={activeStage}
                totalStages={localStages.length}
                currentIndex={activeStageIndex}
                previewMode={previewMode}
                isPreview={false}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onBlocksChange={handleBlocksChange}
                blocks={currentBlocks}
                canvasBackgroundColor={
                  // Prioridade: config da etapa > config global do funil > padrão
                  ((activeStage.config as Record<string, unknown>)
                    ?.canvasBackgroundColor as string) ||
                  (funnel?.global_config as FunnelConfig)?.branding
                    ?.backgroundColor ||
                  "#FAF9F7"
                }
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/30">
                Selecione uma etapa para editar
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Properties Column */}
        <ResizablePanel defaultSize={22} minSize={18} maxSize={30}>
          <div className="h-full border-l">
            <PropertiesColumn
              activeStage={activeStage || null}
              selectedBlock={selectedBlock}
              headerBlock={headerBlock}
              onUpdateStage={(updates) => {
                handleStageUpdate(updates);
              }}
              onUpdateBlock={handleUpdateBlock}
              onApplyBlockToAll={handleApplyBlockToAll}
              onApplyHeaderToAll={handleApplyHeaderToAll}
              onApplyStageConfigToAll={handleApplyStageConfigToAll}
              similarBlocksCount={similarBlocksCount}
              similarStagesCount={similarStagesCount}
              styleCategories={funnel.style_categories || undefined}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Test Mode Overlay */}
      {isTestMode && (
        <TestModeOverlay
          stages={localStages}
          stageBlocks={stageBlocks}
          globalConfig={funnel.global_config as FunnelConfig | null}
          onExit={() => setIsTestMode(false)}
        />
      )}

      {/* Publish Dialog */}
      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        funnelSlug={funnel.slug}
        validation={publishValidation}
        isValidating={isValidating}
        isPublishing={isPublishing}
        onPublish={handlePublish}
      />

      {/* JSON Editor Dialog */}
      <JsonEditorDialog
        open={showJsonEditor}
        onOpenChange={setShowJsonEditor}
        value={{
          name: funnel.name,
          slug: funnel.slug,
          globalConfig: funnel.global_config,
          stages: localStages.map((stage) => ({
            id: stage.id,
            type: stage.type,
            title: stage.title,
            order_index: stage.order_index,
            is_enabled: stage.is_enabled,
            config: stage.config,
            blocks: stageBlocks[stage.id] || [],
          })),
          exportDate: new Date().toISOString(),
          version: "1.0",
        }}
        onApply={async (importedData: unknown) => {
          // Re-use the same logic as handleImportFunnel
          const data = importedData as {
            name?: string;
            globalConfig?: unknown;
            stages: Array<{
              id?: string;
              type: string;
              title: string;
              order_index: number;
              is_enabled?: boolean;
              config?: unknown;
              blocks?: CanvasBlock[];
            }>;
          };

          // Update funnel metadata if present
          if (data.name || data.globalConfig) {
            await updateFunnel.mutateAsync({
              id: funnel.id,
              ...(data.name && { name: data.name }),
              ...(data.globalConfig && { global_config: data.globalConfig }),
            });
          }

          // Import stages and blocks
          const newStageBlocks: Record<string, CanvasBlock[]> = {};
          const updatedStages: FunnelStage[] = [];

          for (const importedStage of data.stages) {
            const existingStage = localStages.find(
              (s) => s.order_index === importedStage.order_index
            );

            if (existingStage) {
              await updateStage.mutateAsync({
                id: existingStage.id,
                title: importedStage.title || existingStage.title,
                type: importedStage.type || existingStage.type || "page",
                config: importedStage.config || {},
                is_enabled: importedStage.is_enabled ?? true,
              });

              const updatedStageData = {
                ...existingStage,
                title: importedStage.title || existingStage.title,
                type: importedStage.type || existingStage.type || "page",
                config: importedStage.config || {},
                is_enabled: importedStage.is_enabled ?? true,
              };
              updatedStages.push(updatedStageData);

              if (importedStage.blocks && Array.isArray(importedStage.blocks)) {
                newStageBlocks[existingStage.id] = importedStage.blocks;
                await saveStageBocks(
                  existingStage.id,
                  importedStage.blocks,
                  updatedStageData.type
                );
              }
            }
          }

          setLocalStages((prev) =>
            prev.map((stage) => {
              const updated = updatedStages.find((s) => s.id === stage.id);
              return updated || stage;
            })
          );

          setStageBlocks((prev) => ({
            ...prev,
            ...newStageBlocks,
          }));
          setInitialStageBlocks((prev) => ({
            ...prev,
            ...JSON.parse(JSON.stringify(newStageBlocks)),
          }));
          setHasUnsavedChanges(false);
        }}
        title="Editor JSON do Funil"
        description="Edite a configuração completa do funil em formato JSON. Use Ctrl+S para formatar."
        contentType="funnel"
        fileName={`funil-${funnel.slug}.json`}
      />
    </div>
  );
}
