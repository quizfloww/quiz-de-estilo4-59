/**
 * Serviço de persistência local com IndexedDB
 * Gerencia rascunhos offline de funis e etapas para edição sem conexão
 * Limite: ~50MB (muito superior aos 5MB do localStorage)
 */

import { openDB, DBSchema, IDBPDatabase } from "idb";

// ============================================
// Schema do Banco IndexedDB
// ============================================

interface DraftDB extends DBSchema {
  funnelDrafts: {
    key: string; // funnel_id
    value: {
      id: string;
      name: string;
      data: any; // Dados do funil completo
      lastModified: number; // timestamp
      synced: boolean; // Se foi sincronizado com Supabase
      version: number; // Versão do draft para controle
    };
    indexes: { "by-modified": number };
  };
  stageDrafts: {
    key: string; // stage_id
    value: {
      id: string;
      funnelId: string;
      title: string;
      data: any; // Dados da etapa completa
      blocks: any[]; // Blocos da etapa
      lastModified: number;
      synced: boolean;
      version: number;
    };
    indexes: {
      "by-funnel": string;
      "by-modified": number;
    };
  };
  blockDrafts: {
    key: string; // block_id
    value: {
      id: string;
      stageId: string;
      funnelId: string;
      data: any; // Dados do bloco
      lastModified: number;
      synced: boolean;
    };
    indexes: {
      "by-stage": string;
      "by-funnel": string;
      "by-modified": number;
    };
  };
}

// ============================================
// Configuração e Inicialização
// ============================================

const DB_NAME = "quiz-estilo-drafts";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<DraftDB> | null = null;

/**
 * Inicializa o banco de dados IndexedDB
 * Cria stores e índices se não existirem
 */
async function initDB(): Promise<IDBPDatabase<DraftDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<DraftDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store de funis
      if (!db.objectStoreNames.contains("funnelDrafts")) {
        const funnelStore = db.createObjectStore("funnelDrafts", {
          keyPath: "id",
        });
        funnelStore.createIndex("by-modified", "lastModified");
        funnelStore.createIndex("by-synced", "synced");
      }

      // Store de etapas
      if (!db.objectStoreNames.contains("stageDrafts")) {
        const stageStore = db.createObjectStore("stageDrafts", {
          keyPath: "id",
        });
        stageStore.createIndex("by-funnel", "funnelId");
        stageStore.createIndex("by-modified", "lastModified");
        stageStore.createIndex("by-synced", "synced");
      }

      // Store de blocos
      if (!db.objectStoreNames.contains("blockDrafts")) {
        const blockStore = db.createObjectStore("blockDrafts", {
          keyPath: "id",
        });
        blockStore.createIndex("by-stage", "stageId");
        blockStore.createIndex("by-funnel", "funnelId");
        blockStore.createIndex("by-modified", "lastModified");
      }
    },
  });

  return dbInstance;
}

// ============================================
// Operações de Funil
// ============================================

/**
 * Salva rascunho de funil completo
 */
export async function saveFunnelDraft(
  funnelId: string,
  name: string,
  data: any
): Promise<void> {
  const db = await initDB();

  const existing = await db.get("funnelDrafts", funnelId);
  const version = existing ? existing.version + 1 : 1;

  await db.put("funnelDrafts", {
    id: funnelId,
    name,
    data,
    lastModified: Date.now(),
    synced: false,
    version,
  });
}

/**
 * Recupera rascunho de funil
 */
export async function getFunnelDraft(funnelId: string): Promise<any | null> {
  const db = await initDB();
  const draft = await db.get("funnelDrafts", funnelId);
  return draft ? draft.data : null;
}

/**
 * Remove rascunho de funil
 */
export async function deleteFunnelDraft(funnelId: string): Promise<void> {
  const db = await initDB();
  await db.delete("funnelDrafts", funnelId);
}

/**
 * Lista todos os rascunhos de funil não sincronizados
 */
export async function getUnsyncedFunnelDrafts() {
  const db = await initDB();
  const allDrafts = await db.getAll("funnelDrafts");
  return allDrafts.filter((draft) => !draft.synced);
}

/**
 * Marca funil como sincronizado
 */
export async function markFunnelSynced(funnelId: string): Promise<void> {
  const db = await initDB();
  const draft = await db.get("funnelDrafts", funnelId);

  if (draft) {
    draft.synced = true;
    await db.put("funnelDrafts", draft);
  }
}

// ============================================
// Operações de Etapa
// ============================================

/**
 * Salva rascunho de etapa
 */
export async function saveStageDraft(
  stageId: string,
  funnelId: string,
  title: string,
  data: any,
  blocks: any[]
): Promise<void> {
  const db = await initDB();

  const existing = await db.get("stageDrafts", stageId);
  const version = existing ? existing.version + 1 : 1;

  await db.put("stageDrafts", {
    id: stageId,
    funnelId,
    title,
    data,
    blocks,
    lastModified: Date.now(),
    synced: false,
    version,
  });
}

/**
 * Recupera rascunho de etapa
 */
export async function getStageDraft(stageId: string): Promise<any | null> {
  const db = await initDB();
  const draft = await db.get("stageDrafts", stageId);
  return draft || null;
}

/**
 * Lista rascunhos de etapas de um funil
 */
export async function getStageDraftsByFunnel(funnelId: string): Promise<any[]> {
  const db = await initDB();
  const index = db.transaction("stageDrafts").store.index("by-funnel");
  return await index.getAll(funnelId);
}

/**
 * Remove rascunho de etapa
 */
export async function deleteStageDraft(stageId: string): Promise<void> {
  const db = await initDB();
  await db.delete("stageDrafts", stageId);
}

/**
 * Marca etapa como sincronizada
 */
export async function markStageSynced(stageId: string): Promise<void> {
  const db = await initDB();
  const draft = await db.get("stageDrafts", stageId);

  if (draft) {
    draft.synced = true;
    await db.put("stageDrafts", draft);
  }
}

// ============================================
// Operações de Bloco
// ============================================

/**
 * Salva rascunho de bloco individual
 */
export async function saveBlockDraft(
  blockId: string,
  stageId: string,
  funnelId: string,
  data: any
): Promise<void> {
  const db = await initDB();

  await db.put("blockDrafts", {
    id: blockId,
    stageId,
    funnelId,
    data,
    lastModified: Date.now(),
    synced: false,
  });
}

/**
 * Recupera rascunho de bloco
 */
export async function getBlockDraft(blockId: string): Promise<any | null> {
  const db = await initDB();
  const draft = await db.get("blockDrafts", blockId);
  return draft ? draft.data : null;
}

/**
 * Lista blocos de uma etapa
 */
export async function getBlockDraftsByStage(stageId: string): Promise<any[]> {
  const db = await initDB();
  const index = db.transaction("blockDrafts").store.index("by-stage");
  return await index.getAll(stageId);
}

/**
 * Remove rascunho de bloco
 */
export async function deleteBlockDraft(blockId: string): Promise<void> {
  const db = await initDB();
  await db.delete("blockDrafts", blockId);
}

// ============================================
// Operações de Sincronização
// ============================================

/**
 * Retorna todas as alterações não sincronizadas
 */
export async function getAllUnsyncedDrafts() {
  const db = await initDB();

  const [allFunnels, allStages, allBlocks] = await Promise.all([
    db.getAll("funnelDrafts"),
    db.getAll("stageDrafts"),
    db.getAll("blockDrafts"),
  ]);

  const funnels = allFunnels.filter((d) => !d.synced);
  const stages = allStages.filter((d) => !d.synced);
  const blocks = allBlocks.filter((d) => !d.synced);

  return { funnels, stages, blocks };
}

/**
 * Limpa todos os rascunhos sincronizados (manutenção)
 */
export async function clearSyncedDrafts(): Promise<void> {
  const db = await initDB();

  const db = await initDB();

  // Buscar todos os drafts e filtrar os sincronizados
  const [allFunnels, allStages, allBlocks] = await Promise.all([
    db.getAll("funnelDrafts"),
    db.getAll("stageDrafts"),
    db.getAll("blockDrafts"),
  ]);

  const syncedFunnelIds = allFunnels.filter((d) => d.synced).map((d) => d.id);
  const syncedStageIds = allStages.filter((d) => d.synced).map((d) => d.id);
  const syncedBlockIds = allBlocks.filter((d) => d.synced).map((d) => d.id);

  // Deletar em transação
  const tx = db.transaction(
    ["funnelDrafts", "stageDrafts", "blockDrafts"],
    "readwrite"
  );

  await Promise.all([
    ...syncedFunnelIds.map((id) => tx.objectStore("funnelDrafts").delete(id)),
    ...syncedStageIds.map((id) => tx.objectStore("stageDrafts").delete(id)),
    ...syncedBlockIds.map((id) => tx.objectStore("blockDrafts").delete(id)),
  ]);

  await tx.done;
}

/**
 * Estatísticas de uso do IndexedDB
 */
export async function getDraftStats(): Promise<{
  funnels: number;
  stages: number;
  blocks: number;
  unsynced: number;
}> {
  const db = await initDB();

  const [funnelCount, stageCount, blockCount, unsyncedData] = await Promise.all(
    [
      db.count("funnelDrafts"),
      db.count("stageDrafts"),
      db.count("blockDrafts"),
      getAllUnsyncedDrafts(),
    ]
  );

  const unsynced =
    unsyncedData.funnels.length +
    unsyncedData.stages.length +
    unsyncedData.blocks.length;

  return {
    funnels: funnelCount,
    stages: stageCount,
    blocks: blockCount,
    unsynced,
  };
}

// ============================================
// Utilitários
// ============================================

/**
 * Verifica se IndexedDB está disponível
 */
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

/**
 * Limpa todo o banco de dados (cuidado!)
 */
export async function clearAllDrafts(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(
    ["funnelDrafts", "stageDrafts", "blockDrafts"],
    "readwrite"
  );

  await Promise.all([
    tx.objectStore("funnelDrafts").clear(),
    tx.objectStore("stageDrafts").clear(),
    tx.objectStore("blockDrafts").clear(),
  ]);

  await tx.done;
}
