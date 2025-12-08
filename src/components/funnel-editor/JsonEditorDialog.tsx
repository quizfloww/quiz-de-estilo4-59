import React, { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JsonEditor } from "@/components/ui/json-editor";
import { funnelExportJsonSchema } from "@/utils/funnelJsonSchema";
import {
  validateFunnelImport,
  formatZodErrors,
} from "@/utils/stageConfigSchema";
import { toast } from "sonner";
import { FileJson, AlertCircle, CheckCircle } from "lucide-react";

export interface JsonEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Initial JSON value to display */
  value: unknown;
  /** Called when user applies valid changes */
  onApply: (value: unknown) => void;
  /** Title of the dialog */
  title?: string;
  /** Description of what's being edited */
  description?: string;
  /** Type of content being edited */
  contentType?: "funnel" | "stage" | "block" | "config";
  /** File name for downloads */
  fileName?: string;
  /** Whether the content is read-only */
  readOnly?: boolean;
}

/**
 * Dialog component with Monaco JSON Editor for editing funnel configurations
 */
export function JsonEditorDialog({
  open,
  onOpenChange,
  value,
  onApply,
  title = "Editar JSON",
  description = "Edite a configuração em formato JSON",
  contentType = "config",
  fileName,
  readOnly = false,
}: JsonEditorDialogProps) {
  const [jsonString, setJsonString] = useState(() =>
    JSON.stringify(value, null, 2)
  );
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [parsedValue, setParsedValue] = useState<unknown>(value);

  // Reset state when dialog opens with new value
  React.useEffect(() => {
    if (open) {
      const formatted = JSON.stringify(value, null, 2);
      setJsonString(formatted);
      setParsedValue(value);
      setIsValid(true);
      setValidationErrors([]);
    }
  }, [open, value]);

  // Get appropriate schema based on content type
  const jsonSchema = useMemo(() => {
    if (contentType === "funnel") {
      return funnelExportJsonSchema;
    }
    // For other types, use partial schema or no schema
    return undefined;
  }, [contentType]);

  // Custom validator for funnel imports
  const customValidator = useCallback(
    (val: unknown) => {
      if (contentType === "funnel") {
        const result = validateFunnelImport(val);
        if (!result.success) {
          return {
            valid: false,
            errors: formatZodErrors(result.error!),
          };
        }
      }
      return { valid: true, errors: [] };
    },
    [contentType]
  );

  const handleValidChange = useCallback(
    (val: unknown, valid: boolean) => {
      setIsValid(valid);
      setParsedValue(val);

      if (!valid && contentType === "funnel" && val) {
        const result = validateFunnelImport(val);
        if (!result.success) {
          setValidationErrors(formatZodErrors(result.error!));
        } else {
          setValidationErrors([]);
        }
      } else {
        setValidationErrors([]);
      }
    },
    [contentType]
  );

  const handleApply = useCallback(() => {
    if (!isValid || parsedValue === null) {
      toast.error("Corrija os erros antes de aplicar");
      return;
    }

    try {
      onApply(parsedValue);
      onOpenChange(false);
      toast.success("Alterações aplicadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao aplicar alterações");
      console.error("Error applying JSON changes:", error);
    }
  }, [isValid, parsedValue, onApply, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const defaultFileName = useMemo(() => {
    if (fileName) return fileName;
    switch (contentType) {
      case "funnel":
        return "funil-config.json";
      case "stage":
        return "etapa-config.json";
      case "block":
        return "bloco-config.json";
      default:
        return "config.json";
    }
  }, [fileName, contentType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <JsonEditor
            value={jsonString}
            onChange={setJsonString}
            onValidChange={handleValidChange}
            readOnly={readOnly}
            height="60vh"
            fileName={defaultFileName}
            jsonSchema={jsonSchema}
            customValidator={
              contentType === "funnel" ? customValidator : undefined
            }
          />
        </div>

        {/* Validation Summary */}
        {validationErrors.length > 0 && (
          <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-destructive mb-1">
                  Erros de validação:
                </div>
                <ul className="text-xs text-destructive/80 list-disc list-inside space-y-0.5">
                  {validationErrors.slice(0, 3).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {validationErrors.length > 3 && (
                    <li className="text-muted-foreground">
                      ...e mais {validationErrors.length - 3} erro(s)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {isValid && !readOnly && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            JSON válido e pronto para aplicar
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          {!readOnly && (
            <Button onClick={handleApply} disabled={!isValid}>
              Aplicar Alterações
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default JsonEditorDialog;
