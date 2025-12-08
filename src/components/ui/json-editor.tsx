import React, { useCallback, useState, useRef } from "react";
import Editor, { OnMount, OnValidate } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Upload,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

export interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onValidChange?: (value: unknown, isValid: boolean) => void;
  readOnly?: boolean;
  height?: string | number;
  className?: string;
  showToolbar?: boolean;
  fileName?: string;
  /** JSON Schema for validation and autocomplete */
  jsonSchema?: object;
  /** Validation function to run on the parsed value */
  customValidator?: (value: unknown) => { valid: boolean; errors: string[] };
}

interface ValidationMarker {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  severity: number;
}

/**
 * Monaco-based JSON Editor with syntax highlighting, validation, and formatting
 */
export function JsonEditor({
  value,
  onChange,
  onValidChange,
  readOnly = false,
  height = "400px",
  className,
  showToolbar = true,
  fileName = "config.json",
  jsonSchema,
  customValidator,
}: JsonEditorProps) {
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [customErrors, setCustomErrors] = useState<string[]>([]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);

  // Define formatDocument BEFORE handleEditorMount to avoid circular dependency
  const formatDocument = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
      toast.success("JSON formatado!");
    }
  }, []);

  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Configure JSON language features
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: jsonSchema
          ? [
              {
                uri: "http://myserver/schema.json",
                fileMatch: ["*"],
                schema: jsonSchema,
              },
            ]
          : [],
        enableSchemaRequest: false,
      });

      // Editor keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        formatDocument();
      });

      editor.addCommand(
        monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
        () => {
          formatDocument();
        }
      );
    },
    [jsonSchema, formatDocument]
  );

  const handleValidation: OnValidate = useCallback(
    (markers: ValidationMarker[]) => {
      const errors = markers
        .filter((m) => m.severity >= 8) // Only errors (8 = Error in Monaco)
        .map((m) => `Linha ${m.startLineNumber}: ${m.message}`);

      setValidationErrors(errors);

      const syntaxValid = errors.length === 0;
      let customValid = true;
      let customErrs: string[] = [];

      // Run custom validator if provided and syntax is valid
      if (syntaxValid && customValidator) {
        try {
          const parsed = JSON.parse(value);
          const result = customValidator(parsed);
          customValid = result.valid;
          customErrs = result.errors;
          setCustomErrors(customErrs);
        } catch {
          customValid = false;
        }
      } else {
        setCustomErrors([]);
      }

      const isValidNow = syntaxValid && customValid;
      setIsValid(isValidNow);

      // Notify parent of validation state
      if (onValidChange) {
        try {
          const parsed = JSON.parse(value);
          onValidChange(parsed, isValidNow);
        } catch {
          onValidChange(null, false);
        }
      }
    },
    [value, customValidator, onValidChange]
  );

  const handleEditorChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue !== undefined && onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("JSON copiado para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar");
    }
  }, [value]);

  const downloadJson = useCallback(() => {
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Arquivo baixado!");
  }, [value, fileName]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !onChange) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          // Validate it's valid JSON before setting
          JSON.parse(content);
          onChange(content);
          toast.success("Arquivo carregado!");
        } catch (error) {
          toast.error("Arquivo JSON inválido");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [onChange]
  );

  const allErrors = [...validationErrors, ...customErrors];

  return (
    <div
      className={cn(
        "flex flex-col border rounded-lg overflow-hidden",
        className
      )}
    >
      {showToolbar && (
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{fileName}</span>
            {isValid ? (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <Check className="h-3 w-3" />
                Válido
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {allErrors.length} erro(s)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={formatDocument}
              title="Formatar (Ctrl+S ou Alt+Shift+F)"
            >
              Formatar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyToClipboard}
              title="Copiar"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={downloadJson}
              title="Baixar"
            >
              <Download className="h-4 w-4" />
            </Button>
            {!readOnly && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                  title="Carregar arquivo"
                >
                  <span>
                    <Upload className="h-4 w-4" />
                  </span>
                </Button>
              </label>
            )}
          </div>
        </div>
      )}

      <Editor
        height={height}
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        onValidate={handleValidation}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          folding: true,
          foldingStrategy: "indentation",
          formatOnPaste: true,
          formatOnType: true,
          renderLineHighlight: "line",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          // Error decoration
          glyphMargin: true,
          lightbulb: { enabled: "on" },
        }}
        theme="vs-light"
      />

      {/* Error panel */}
      {allErrors.length > 0 && (
        <div className="px-3 py-2 bg-destructive/10 border-t max-h-24 overflow-auto">
          <div className="text-xs text-destructive space-y-1">
            {allErrors.slice(0, 5).map((error, i) => (
              <div key={i} className="flex items-start gap-1">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
            {allErrors.length > 5 && (
              <div className="text-muted-foreground">
                ...e mais {allErrors.length - 5} erro(s)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JsonEditor;
