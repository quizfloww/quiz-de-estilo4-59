import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Loader2,
  Globe,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { PublishValidation, ValidationItem } from "@/hooks/usePublishFunnel";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funnelSlug: string;
  validation: PublishValidation | null;
  isValidating: boolean;
  isPublishing: boolean;
  onPublish: () => Promise<void>;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({
  open,
  onOpenChange,
  funnelSlug,
  validation,
  isValidating,
  isPublishing,
  onPublish,
}) => {
  // 🔍 LOG DE DIAGNÓSTICO - Rastreia quando validation muda
  React.useEffect(() => {
    if (validation && open) {
      console.log(
        "%c📋 PublishDialog RECEBEU validation:",
        "background: #4a90e2; color: white; font-size: 16px; padding: 4px;"
      );
      console.log("  ✅ isValid:", validation.isValid);
      console.log("  ❌ errors.length:", validation.errors.length);
      console.log("  ⚠️  warnings.length:", validation.warnings.length);
      console.log("  📄 validation completo:", validation);

      // Verificar se há mensagens sobre "opções configuradas" nos ERRORS
      const optionsErrors = validation.errors.filter((e) =>
        e.message.includes("opções configuradas")
      );
      if (optionsErrors.length > 0) {
        console.error(
          "%c🚨 ERRO ENCONTRADO: Mensagens sobre 'opções configuradas' em ERRORS!",
          "background: #ff0000; color: white; font-size: 18px; padding: 8px;"
        );
        console.error("Total de erros sobre opções:", optionsErrors.length);
        console.error("Detalhes:", optionsErrors);
      }
    }
  }, [validation, open]);

  const publicUrl = `${window.location.origin}/quiz/${funnelSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("URL copiada!");
  };

  const handlePublish = async () => {
    await onPublish();
    onOpenChange(false);
  };

  const renderValidationItem = (item: ValidationItem) => {
    const isError = item.type === "error";
    return (
      <div
        key={item.id}
        className={`flex items-start gap-3 p-3 rounded-lg ${
          isError ? "bg-destructive/10" : "bg-yellow-500/10"
        }`}
      >
        {isError ? (
          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        )}
        <span
          className={`text-sm ${
            isError
              ? "text-destructive"
              : "text-yellow-700 dark:text-yellow-400"
          }`}
        >
          {item.message}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Publicar Funil
          </DialogTitle>
          <DialogDescription>
            Revise as validações antes de publicar seu funil.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Validation Status */}
          {isValidating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Validando...
              </span>
            </div>
          ) : validation ? (
            <ScrollArea className="max-h-[250px]">
              <div className="space-y-3">
                {/* Errors */}
                {validation.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-destructive flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Erros ({validation.errors.length})
                    </h4>
                    {validation.errors.map(renderValidationItem)}
                  </div>
                )}

                {/* Warnings */}
                {validation.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Avisos ({validation.warnings.length})
                    </h4>
                    {validation.warnings.map(renderValidationItem)}
                  </div>
                )}

                {/* All Good */}
                {validation.isValid && validation.warnings.length === 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Todas as validações passaram! Seu funil está pronto para
                      ser publicado.
                    </span>
                  </div>
                )}

                {validation.isValid && validation.warnings.length > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 mt-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Pronto para publicar (com avisos opcionais)
                    </span>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : null}

          {/* Public URL Preview */}
          <div className="space-y-2 pt-2 border-t">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              URL Pública
            </label>
            <div className="flex gap-2">
              <Input
                value={publicUrl}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Warning Message */}
          {validation?.isValid && (
            <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              ⚠️ Ao publicar, o funil estará disponível publicamente para
              qualquer pessoa acessar através da URL acima.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!validation?.isValid || isPublishing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Publicar Agora
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
