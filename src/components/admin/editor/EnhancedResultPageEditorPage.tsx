/**
 * EnhancedResultPageEditorPage - Editor visual aprimorado para página de resultado
 *
 * Integra o ImprovedDragDropEditor com validação Zod e gerenciamento de blocos.
 */

import React, { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DragDropEditor as ImprovedDragDropEditor } from "@/components/result-editor/DragDropEditor";
import { CanvasBlock } from "@/types/canvasBlocks";

interface EnhancedResultPageEditorPageProps {
  styleType?: string;
  initialBlocks?: CanvasBlock[];
  onSave?: (config: {
    blocks: CanvasBlock[];
    version: string;
    timestamp: number;
  }) => void;
}

const EnhancedResultPageEditorPage: React.FC<
  EnhancedResultPageEditorPageProps
> = ({ styleType, initialBlocks = [], onSave }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode =
    (searchParams.get("mode") as "quiz" | "result" | "offer") || "result";
  const quizId = searchParams.get("quizId") || "default";

  const handleSave = useCallback(
    (config: { blocks: CanvasBlock[]; version: string; timestamp: number }) => {
      try {
        // Salvar no localStorage como backup
        const storageKey = `result_page_config_${styleType || "default"}`;
        localStorage.setItem(storageKey, JSON.stringify(config));

        // Chamar callback externo se existir
        if (onSave) {
          onSave(config);
        }

        toast.success("Configuração salva com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar:", error);
        toast.error("Erro ao salvar configuração");
      }
    },
    [styleType, onSave]
  );

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header com navegação */}
      <header className="flex items-center gap-4 px-4 py-2 border-b bg-background/95 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            Editor de Página de Resultado
          </h1>
          {styleType && (
            <p className="text-xs text-muted-foreground">Estilo: {styleType}</p>
          )}
        </div>
      </header>

      {/* Editor Principal */}
      <main className="flex-1 overflow-hidden">
        <ImprovedDragDropEditor
          mode={mode}
          quizId={quizId}
          initialBlocks={initialBlocks}
          onSave={handleSave}
          storageKey={`editor_${mode}_${quizId}`}
        />
      </main>
    </div>
  );
};

export default EnhancedResultPageEditorPage;
