/**
 * useBlockManager - Hook centralizado para gerenciamento de blocos
 *
 * Fornece uma API unificada para:
 * - CRUD de blocos
 * - Reordenação via drag-and-drop
 * - Duplicação de blocos
 * - Undo/Redo com histórico
 * - Validação automática
 * - Persistência
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  CanvasBlock,
  CanvasBlockContent,
  CanvasBlockType,
} from "@/types/canvasBlocks";
import {
  safeValidateBlocks,
  sanitizeBlocks,
  ValidatedCanvasBlock,
} from "@/utils/blockSchemas";
import { generateId } from "@/utils/idGenerator";
import { toast } from "sonner";

// ============================================
// Tipos
// ============================================

export interface BlockManagerOptions {
  /** Blocos iniciais */
  initialBlocks?: CanvasBlock[];
  /** Função de salvamento externa */
  onSave?: (blocks: CanvasBlock[]) => Promise<void>;
  /** Chave para localStorage */
  storageKey?: string;
  /** Ativar auto-save */
  autoSave?: boolean;
  /** Intervalo de auto-save em ms */
  autoSaveInterval?: number;
  /** Tamanho máximo do histórico */
  maxHistorySize?: number;
  /** Validar blocos ao carregar */
  validateOnLoad?: boolean;
}

export interface BlockManagerState {
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
  historyIndex: number;
}

export interface BlockManagerActions {
  // CRUD
  addBlock: (
    type: CanvasBlockType,
    content?: Partial<CanvasBlockContent>,
    afterId?: string
  ) => string;
  updateBlock: (id: string, updates: Partial<CanvasBlock>) => void;
  updateBlockContent: (
    id: string,
    content: Partial<CanvasBlockContent>
  ) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => string | null;

  // Reordenação
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;

  // Seleção
  selectBlock: (id: string | null) => void;

  // Visibilidade
  toggleBlockVisibility: (id: string) => void;

  // Histórico
  undo: () => void;
  redo: () => void;

  // Persistência
  save: () => Promise<boolean>;
  loadFromJson: (json: unknown) => boolean;
  exportToJson: () => string;
  reset: () => void;

  // Batch operations
  deleteMultipleBlocks: (ids: string[]) => void;
  updateMultipleBlocks: (
    updates: Array<{ id: string; updates: Partial<CanvasBlock> }>
  ) => void;
}

export interface UseBlockManagerReturn
  extends BlockManagerState,
    BlockManagerActions {
  // Computed
  selectedBlock: CanvasBlock | null;
  canUndo: boolean;
  canRedo: boolean;
  blockCount: number;
  sortedBlocks: CanvasBlock[];
}

// ============================================
// Defaults
// ============================================

const DEFAULT_OPTIONS: Required<BlockManagerOptions> = {
  initialBlocks: [],
  onSave: async () => {},
  storageKey: "",
  autoSave: false,
  autoSaveInterval: 30000,
  maxHistorySize: 50,
  validateOnLoad: true,
};

// ============================================
// Default Content por Tipo
// ============================================

const getDefaultBlockContent = (type: CanvasBlockType): CanvasBlockContent => {
  const defaults: Partial<Record<CanvasBlockType, CanvasBlockContent>> = {
    heading: {
      text: "Novo Título",
      fontSize: "2xl",
      fontWeight: "bold",
      textAlign: "center",
    },
    text: {
      text: "Adicione seu texto aqui...",
      fontSize: "base",
      textAlign: "left",
    },
    image: {
      imageUrl: "",
      imageAlt: "Imagem",
      imageAlignment: "center",
      imageSize: "md",
    },
    button: {
      buttonText: "Clique Aqui",
      buttonVariant: "primary",
      fullWidth: false,
      buttonUrl: "#",
    },
    spacer: {
      height: "32px",
    },
    divider: {
      dividerStyle: "solid",
      dividerColor: "#e5e7eb",
      dividerThickness: 1,
    },
    header: {
      showLogo: true,
      showProgress: true,
      progress: 0,
    },
    options: {
      displayType: "both",
      columns: 2,
      autoAdvance: true,
      options: [],
    },
    input: {
      label: "Seu nome",
      placeholder: "Digite aqui...",
      inputType: "text",
      required: true,
    },
    styleResult: {
      showPercentage: true,
      showDescription: true,
      layout: "side-by-side",
    },
    secondaryStyles: {
      maxSecondaryStyles: 3,
      showSecondaryPercentage: true,
    },
    styleProgress: {
      showLabels: true,
      maxStylesShown: 7,
    },
    personalizedHook: {
      hookTitle: "Parabéns!",
      hookSubtitle: "Seu estilo foi identificado",
      hookStyle: "elegant",
    },
    styleGuide: {
      showSecondaryGuides: true,
      guideImageSize: "lg",
      showExclusiveBadge: true,
    },
    beforeAfter: {
      beforeAfterItems: [],
      beforeAfterLayout: "side-by-side",
      beforeAfterTitle: "Transformações",
    },
    priceAnchor: {
      priceItems: [],
      finalPrice: 0,
      currency: "BRL",
    },
    countdown: {
      hours: 0,
      minutes: 15,
      seconds: 0,
      countdownVariant: "dramatic",
    },
    testimonial: {
      testimonialVariant: "card",
    },
    testimonials: {
      testimonials: [],
      testimonialsLayout: "carousel",
      testimonialsTitle: "O que dizem nossas clientes",
    },
    benefitsList: {
      benefits: [],
      benefitsLayout: "list",
      showBenefitIcons: true,
    },
    guarantee: {
      guaranteeDays: 7,
      guaranteeTitle: "Garantia Incondicional",
      guaranteeDescription:
        "Se você não ficar satisfeita, devolvemos seu dinheiro.",
    },
    ctaOffer: {
      ctaText: "QUERO MEU GUIA AGORA",
      ctaVariant: "green",
      showCtaIcon: true,
    },
    faq: {
      faqItems: [],
      faqStyle: "accordion",
    },
    socialProof: {
      socialProofText: "+5.000 mulheres transformadas",
      socialProofIcon: "users",
      socialProofVariant: "badge",
    },
    motivation: {
      motivationTitle: "Por que isso funciona?",
      motivationPoints: [],
    },
    bonus: {
      bonusItems: [],
      bonusTitle: "Bônus Exclusivos",
    },
    mentor: {
      mentorName: "Gisele Galvão",
      mentorTitle: "Consultora de Estilo",
    },
    securePurchase: {
      securityBadges: ["SSL", "Compra Segura"],
      paymentMethods: ["Pix", "Cartão", "Boleto"],
    },
  };

  return defaults[type] || {};
};

// ============================================
// Hook Principal
// ============================================

export function useBlockManager(
  options: BlockManagerOptions = {}
): UseBlockManagerReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // State
  const [blocks, setBlocks] = useState<CanvasBlock[]>(() => {
    // Tentar carregar do localStorage
    if (opts.storageKey) {
      try {
        const stored = localStorage.getItem(opts.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (opts.validateOnLoad) {
            return sanitizeBlocks(parsed);
          }
          return parsed;
        }
      } catch (e) {
        console.warn("Erro ao carregar blocos do localStorage:", e);
      }
    }
    return opts.initialBlocks;
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History para undo/redo
  const [history, setHistory] = useState<CanvasBlock[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Ref para auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // ============================================
  // Histórico
  // ============================================

  const pushToHistory = useCallback(
    (newBlocks: CanvasBlock[]) => {
      setHistory((prev) => {
        // Remove estados futuros (redo) ao fazer nova alteração
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newBlocks);

        // Limita tamanho do histórico
        if (newHistory.length > opts.maxHistorySize) {
          newHistory.shift();
          return newHistory;
        }

        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, opts.maxHistorySize - 1));
    },
    [historyIndex, opts.maxHistorySize]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  // ============================================
  // CRUD Operations
  // ============================================

  const addBlock = useCallback(
    (
      type: CanvasBlockType,
      content?: Partial<CanvasBlockContent>,
      afterId?: string
    ): string => {
      const newBlock: CanvasBlock = {
        id: generateId(),
        type,
        content: { ...getDefaultBlockContent(type), ...content },
        order: 0, // Será recalculado
      };

      setBlocks((prev) => {
        let newBlocks: CanvasBlock[];

        if (afterId) {
          const index = prev.findIndex((b) => b.id === afterId);
          if (index !== -1) {
            newBlocks = [...prev];
            newBlocks.splice(index + 1, 0, newBlock);
          } else {
            newBlocks = [...prev, newBlock];
          }
        } else {
          newBlocks = [...prev, newBlock];
        }

        // Recalcular order
        const reordered = newBlocks.map((block, idx) => ({
          ...block,
          order: idx,
        }));
        pushToHistory(reordered);
        return reordered;
      });

      setIsDirty(true);
      setSelectedBlockId(newBlock.id);

      return newBlock.id;
    },
    [pushToHistory]
  );

  const updateBlock = useCallback(
    (id: string, updates: Partial<CanvasBlock>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        );
        pushToHistory(newBlocks);
        return newBlocks;
      });
      setIsDirty(true);
    },
    [pushToHistory]
  );

  const updateBlockContent = useCallback(
    (id: string, content: Partial<CanvasBlockContent>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((block) =>
          block.id === id
            ? { ...block, content: { ...block.content, ...content } }
            : block
        );
        pushToHistory(newBlocks);
        return newBlocks;
      });
      setIsDirty(true);
    },
    [pushToHistory]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        const filtered = prev.filter((b) => b.id !== id);
        const reordered = filtered.map((block, idx) => ({
          ...block,
          order: idx,
        }));
        pushToHistory(reordered);
        return reordered;
      });

      if (selectedBlockId === id) {
        setSelectedBlockId(null);
      }
      setIsDirty(true);
    },
    [selectedBlockId, pushToHistory]
  );

  const duplicateBlock = useCallback(
    (id: string): string | null => {
      const block = blocks.find((b) => b.id === id);
      if (!block) return null;

      const newBlock: CanvasBlock = {
        ...block,
        id: generateId(),
        order: block.order + 1,
      };

      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        const result = [...prev];
        result.splice(index + 1, 0, newBlock);
        const reordered = result.map((b, i) => ({ ...b, order: i }));
        pushToHistory(reordered);
        return reordered;
      });

      setIsDirty(true);
      setSelectedBlockId(newBlock.id);

      return newBlock.id;
    },
    [blocks, pushToHistory]
  );

  // ============================================
  // Reordenação
  // ============================================

  const reorderBlocks = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      setBlocks((prev) => {
        const result = [...prev];
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        const reordered = result.map((block, idx) => ({
          ...block,
          order: idx,
        }));
        pushToHistory(reordered);
        return reordered;
      });
      setIsDirty(true);
    },
    [pushToHistory]
  );

  const moveBlockUp = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index > 0) {
        reorderBlocks(index, index - 1);
      }
    },
    [blocks, reorderBlocks]
  );

  const moveBlockDown = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index < blocks.length - 1) {
        reorderBlocks(index, index + 1);
      }
    },
    [blocks, reorderBlocks]
  );

  // ============================================
  // Seleção e Visibilidade
  // ============================================

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const toggleBlockVisibility = useCallback(
    (id: string) => {
      updateBlock(id, {
        // @ts-ignore - adicionando campo hidden dinamicamente
        hidden: !blocks.find((b) => b.id === id)?.hidden,
      });
    },
    [blocks, updateBlock]
  );

  // ============================================
  // Persistência
  // ============================================

  const save = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setError(null);

    try {
      // Salvar no localStorage se configurado
      if (opts.storageKey) {
        localStorage.setItem(opts.storageKey, JSON.stringify(blocks));
      }

      // Chamar callback externo
      await opts.onSave(blocks);

      setIsDirty(false);
      toast.success("Configuração salva com sucesso!");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [blocks, opts]);

  const loadFromJson = useCallback(
    (json: unknown): boolean => {
      try {
        const data = typeof json === "string" ? JSON.parse(json) : json;
        const blocksData = Array.isArray(data) ? data : data.blocks;

        if (!Array.isArray(blocksData)) {
          throw new Error("Formato inválido: esperado array de blocos");
        }

        const validated = opts.validateOnLoad
          ? sanitizeBlocks(blocksData)
          : blocksData;

        setBlocks(validated);
        pushToHistory(validated);
        setError(null);
        setIsDirty(true);

        toast.success(`${validated.length} blocos carregados`);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "JSON inválido";
        setError(message);
        toast.error(message);
        return false;
      }
    },
    [opts.validateOnLoad, pushToHistory]
  );

  const exportToJson = useCallback((): string => {
    return JSON.stringify(
      { blocks, version: "2.0", timestamp: Date.now() },
      null,
      2
    );
  }, [blocks]);

  const reset = useCallback(() => {
    setBlocks(opts.initialBlocks);
    setHistory([opts.initialBlocks]);
    setHistoryIndex(0);
    setSelectedBlockId(null);
    setIsDirty(false);
    setError(null);
  }, [opts.initialBlocks]);

  // ============================================
  // Batch Operations
  // ============================================

  const deleteMultipleBlocks = useCallback(
    (ids: string[]) => {
      setBlocks((prev) => {
        const filtered = prev.filter((b) => !ids.includes(b.id));
        const reordered = filtered.map((block, idx) => ({
          ...block,
          order: idx,
        }));
        pushToHistory(reordered);
        return reordered;
      });

      if (selectedBlockId && ids.includes(selectedBlockId)) {
        setSelectedBlockId(null);
      }
      setIsDirty(true);
    },
    [selectedBlockId, pushToHistory]
  );

  const updateMultipleBlocks = useCallback(
    (updates: Array<{ id: string; updates: Partial<CanvasBlock> }>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((block) => {
          const update = updates.find((u) => u.id === block.id);
          return update ? { ...block, ...update.updates } : block;
        });
        pushToHistory(newBlocks);
        return newBlocks;
      });
      setIsDirty(true);
    },
    [pushToHistory]
  );

  // ============================================
  // Auto-save
  // ============================================

  useEffect(() => {
    if (opts.autoSave && isDirty) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        save();
      }, opts.autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, opts.autoSave, opts.autoSaveInterval, save]);

  // ============================================
  // Computed Values
  // ============================================

  const sortedBlocks = useMemo(
    () => [...blocks].sort((a, b) => a.order - b.order),
    [blocks]
  );

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId) || null,
    [blocks, selectedBlockId]
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    // State
    blocks,
    selectedBlockId,
    isDirty,
    isSaving,
    error,
    historyIndex,

    // Computed
    selectedBlock,
    canUndo,
    canRedo,
    blockCount: blocks.length,
    sortedBlocks,

    // Actions
    addBlock,
    updateBlock,
    updateBlockContent,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    moveBlockUp,
    moveBlockDown,
    selectBlock,
    toggleBlockVisibility,
    undo,
    redo,
    save,
    loadFromJson,
    exportToJson,
    reset,
    deleteMultipleBlocks,
    updateMultipleBlocks,
  };
}

export default useBlockManager;
