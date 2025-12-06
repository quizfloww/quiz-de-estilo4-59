import { useState, useCallback, useRef, useEffect } from "react";
import { CanvasBlock } from "@/types/canvasBlocks";

interface HistoryState {
  stageBlocks: Record<string, CanvasBlock[]>;
  timestamp: number;
}

interface UseStageBlocksHistoryOptions {
  maxHistorySize?: number;
  autoSaveDelay?: number;
  onAutoSave?: () => Promise<void>;
}

export function useStageBlocksHistory(
  initialState: Record<string, CanvasBlock[]>,
  options: UseStageBlocksHistoryOptions = {}
) {
  const {
    maxHistorySize = 50,
    autoSaveDelay = 30000, // 30 seconds default
    onAutoSave,
  } = options;

  const [stageBlocks, setStageBlocksInternal] =
    useState<Record<string, CanvasBlock[]>>(initialState);
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);

  const lastAutoSave = useRef<number>(Date.now());
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingChanges = useRef<boolean>(false);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Limpa timer ao desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!onAutoSave || !pendingChanges.current) return;

    // Limpa timer anterior
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    // Agenda novo auto-save
    autoSaveTimer.current = setTimeout(async () => {
      const now = Date.now();
      if (
        now - lastAutoSave.current >= autoSaveDelay &&
        pendingChanges.current
      ) {
        try {
          await onAutoSave();
          lastAutoSave.current = now;
          pendingChanges.current = false;
        } catch (error) {
          console.error("[AutoSave] Falha:", error);
        }
      }
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [stageBlocks, autoSaveDelay, onAutoSave]);

  const setStageBlocks = useCallback(
    (
      updater:
        | Record<string, CanvasBlock[]>
        | ((
            prev: Record<string, CanvasBlock[]>
          ) => Record<string, CanvasBlock[]>)
    ) => {
      setStageBlocksInternal((current) => {
        // Salva estado atual no histórico
        const historyEntry: HistoryState = {
          stageBlocks: JSON.parse(JSON.stringify(current)),
          timestamp: Date.now(),
        };

        setPast((prev) => {
          const newPast = [...prev, historyEntry];
          // Limita tamanho do histórico
          if (newPast.length > maxHistorySize) {
            return newPast.slice(-maxHistorySize);
          }
          return newPast;
        });

        // Limpa o futuro ao fazer nova alteração
        setFuture([]);

        // Marca que há mudanças pendentes
        pendingChanges.current = true;

        // Calcula novo estado
        const newState =
          typeof updater === "function" ? updater(current) : updater;
        return newState;
      });
    },
    [maxHistorySize]
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];

    // Salva estado atual no futuro
    const currentState: HistoryState = {
      stageBlocks: JSON.parse(JSON.stringify(stageBlocks)),
      timestamp: Date.now(),
    };

    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [currentState, ...prev]);
    setStageBlocksInternal(previous.stageBlocks);
    pendingChanges.current = true;
  }, [past, stageBlocks]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];

    // Salva estado atual no passado
    const currentState: HistoryState = {
      stageBlocks: JSON.parse(JSON.stringify(stageBlocks)),
      timestamp: Date.now(),
    };

    setPast((prev) => [...prev, currentState]);
    setFuture((prev) => prev.slice(1));
    setStageBlocksInternal(next.stageBlocks);
    pendingChanges.current = true;
  }, [future, stageBlocks]);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  const resetState = useCallback(
    (newState: Record<string, CanvasBlock[]>) => {
      setStageBlocksInternal(newState);
      clearHistory();
      pendingChanges.current = false;
    },
    [clearHistory]
  );

  return {
    stageBlocks,
    setStageBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    resetState,
    historyLength: past.length,
    futureLength: future.length,
  };
}
