/**
 * BaseBlock - Componente base padronizado para todos os blocos do editor
 *
 * Fornece uma interface consistente para:
 * - Edição inline
 * - Controles de bloco (editar, duplicar, deletar, mover)
 * - Feedback visual de seleção e hover
 * - Suporte a drag-and-drop
 */

import React, { useState, useCallback, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CanvasBlock, BLOCK_TYPE_LABELS } from "@/types/canvasBlocks";

// ============================================
// Tipos
// ============================================

export interface BaseBlockProps {
  /** Dados do bloco */
  block: CanvasBlock;
  /** Se o bloco está selecionado */
  isSelected?: boolean;
  /** Se está em modo de preview (sem controles) */
  isPreview?: boolean;
  /** Callback quando o bloco é selecionado */
  onSelect?: (id: string) => void;
  /** Callback para atualizar o bloco */
  onUpdate?: (id: string, updates: Partial<CanvasBlock>) => void;
  /** Callback para deletar o bloco */
  onDelete?: (id: string) => void;
  /** Callback para duplicar o bloco */
  onDuplicate?: (id: string) => void;
  /** Callback para mover para cima */
  onMoveUp?: (id: string) => void;
  /** Callback para mover para baixo */
  onMoveDown?: (id: string) => void;
  /** Se pode mover para cima */
  canMoveUp?: boolean;
  /** Se pode mover para baixo */
  canMoveDown?: boolean;
  /** Componente de visualização do bloco */
  renderView: (block: CanvasBlock) => ReactNode;
  /** Componente de edição do bloco (opcional) */
  renderEditor?: (
    block: CanvasBlock,
    onChange: (updates: Partial<CanvasBlock>) => void,
    onClose: () => void
  ) => ReactNode;
  /** Classe CSS adicional */
  className?: string;
  /** Se usa drag-and-drop */
  sortable?: boolean;
}

// ============================================
// Componente Principal
// ============================================

export const BaseBlock: React.FC<BaseBlockProps> = ({
  block,
  isSelected = false,
  isPreview = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  renderView,
  renderEditor,
  className,
  sortable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // @ts-ignore - campo dinâmico
  const isHidden = block.hidden === true;

  // Sortable hook do dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: isPreview || !sortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ============================================
  // Handlers
  // ============================================

  const handleSelect = useCallback(() => {
    if (!isPreview && onSelect) {
      onSelect(block.id);
    }
  }, [block.id, isPreview, onSelect]);

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (renderEditor) {
        setIsEditing(true);
      }
    },
    [renderEditor]
  );

  const handleCloseEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleUpdate = useCallback(
    (updates: Partial<CanvasBlock>) => {
      if (onUpdate) {
        onUpdate(block.id, updates);
      }
    },
    [block.id, onUpdate]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(block.id);
      }
    },
    [block.id, onDelete]
  );

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDuplicate) {
        onDuplicate(block.id);
      }
    },
    [block.id, onDuplicate]
  );

  const handleMoveUp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onMoveUp && canMoveUp) {
        onMoveUp(block.id);
      }
    },
    [block.id, onMoveUp, canMoveUp]
  );

  const handleMoveDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onMoveDown && canMoveDown) {
        onMoveDown(block.id);
      }
    },
    [block.id, onMoveDown, canMoveDown]
  );

  const handleToggleVisibility = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onUpdate) {
        onUpdate(block.id, {
          // @ts-ignore
          hidden: !isHidden,
        });
      }
    },
    [block.id, isHidden, onUpdate]
  );

  // ============================================
  // Se estiver em modo preview, renderiza apenas o conteúdo
  // ============================================

  if (isPreview) {
    return (
      <div className={cn(isHidden && "hidden", className)}>
        {renderView(block)}
      </div>
    );
  }

  // ============================================
  // Render
  // ============================================

  const blockLabel = BLOCK_TYPE_LABELS[block.type] || block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg transition-all duration-200",
        "border-2 border-transparent",
        isSelected && "border-primary ring-2 ring-primary/20",
        isHovered && !isSelected && "border-muted-foreground/30",
        isDragging && "z-50",
        isHidden && "opacity-50",
        className
      )}
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Drag Handle - Lateral Esquerda */}
      {sortable && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full",
            "px-1 py-2 cursor-grab active:cursor-grabbing",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "text-muted-foreground hover:text-foreground"
          )}
        >
          <GripVertical className="h-5 w-5" />
        </div>
      )}

      {/* Toolbar Superior */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 z-10",
          "flex items-center gap-1 px-2 py-1",
          "bg-background border rounded-full shadow-sm",
          "opacity-0 group-hover:opacity-100 transition-all",
          isSelected && "opacity-100"
        )}
      >
        {/* Label do bloco */}
        <span className="text-xs font-medium text-muted-foreground px-2">
          {blockLabel}
        </span>

        <div className="h-4 w-px bg-border" />

        {/* Botões de ação */}
        <div className="flex items-center gap-0.5">
          {/* Editar */}
          {renderEditor && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className="h-6 w-6"
              title="Editar bloco"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}

          {/* Duplicar */}
          {onDuplicate && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDuplicate}
              className="h-6 w-6"
              title="Duplicar bloco"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}

          {/* Menu de mais opções */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Mover para cima */}
              <DropdownMenuItem onClick={handleMoveUp} disabled={!canMoveUp}>
                <ChevronUp className="h-4 w-4 mr-2" />
                Mover para cima
              </DropdownMenuItem>

              {/* Mover para baixo */}
              <DropdownMenuItem
                onClick={handleMoveDown}
                disabled={!canMoveDown}
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Mover para baixo
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Visibilidade */}
              <DropdownMenuItem onClick={handleToggleVisibility}>
                {isHidden ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Mostrar bloco
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Ocultar bloco
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Deletar */}
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir bloco
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Conteúdo do Bloco */}
      <div className="relative">
        {isEditing && renderEditor ? (
          <div className="p-4 bg-muted/30 rounded-lg">
            {/* Header do Editor */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <span className="font-medium">Editando: {blockLabel}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={handleCloseEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleCloseEdit}>
                  <Check className="h-4 w-4 mr-1" />
                  Aplicar
                </Button>
              </div>
            </div>

            {/* Conteúdo do Editor */}
            {renderEditor(block, handleUpdate, handleCloseEdit)}
          </div>
        ) : (
          renderView(block)
        )}
      </div>

      {/* Indicador de Hidden */}
      {isHidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg pointer-events-none">
          <div className="flex items-center gap-2 text-muted-foreground">
            <EyeOff className="h-5 w-5" />
            <span className="text-sm font-medium">Bloco oculto</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Wrapper para Blocos Não-Sortable
// ============================================

export const StaticBlock: React.FC<Omit<BaseBlockProps, "sortable">> = (
  props
) => {
  return <BaseBlock {...props} sortable={false} />;
};

export default BaseBlock;
