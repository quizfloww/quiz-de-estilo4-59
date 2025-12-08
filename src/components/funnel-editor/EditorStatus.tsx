import React from "react";
import { Cloud, CloudOff, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type EditorStatusType =
  | "idle"
  | "saving"
  | "saved"
  | "error"
  | "offline"
  | "unsaved";

interface EditorStatusProps {
  status: EditorStatusType;
  lastSaved?: Date | null;
  className?: string;
}

const statusConfig: Record<
  EditorStatusType,
  {
    icon: React.ReactNode;
    label: string;
    color: string;
  }
> = {
  idle: {
    icon: <Cloud className="h-4 w-4" />,
    label: "Sincronizado",
    color: "text-muted-foreground",
  },
  saving: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: "Salvando...",
    color: "text-blue-500",
  },
  saved: {
    icon: <Check className="h-4 w-4" />,
    label: "Salvo",
    color: "text-green-500",
  },
  error: {
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Erro ao salvar",
    color: "text-destructive",
  },
  offline: {
    icon: <CloudOff className="h-4 w-4" />,
    label: "Offline - salvando localmente",
    color: "text-amber-500",
  },
  unsaved: {
    icon: <Cloud className="h-4 w-4" />,
    label: "Alterações não salvas",
    color: "text-amber-500",
  },
};

export function EditorStatus({
  status,
  lastSaved,
  className,
}: EditorStatusProps) {
  const config = statusConfig[status];

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "agora mesmo";
    if (minutes < 60) return `há ${minutes} min`;
    if (hours < 24) return `há ${hours}h`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs",
            config.color,
            className
          )}
          data-testid="editor-status"
          data-status={status}
        >
          {config.icon}
          <span className="hidden sm:inline">{config.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.label}</p>
        {lastSaved && status !== "saving" && (
          <p className="text-xs text-muted-foreground">
            Último salvamento: {formatLastSaved(lastSaved)}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export default EditorStatus;
