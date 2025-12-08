import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizOptionItem {
  id: string;
  text: string;
  imageUrl?: string;
  image_url?: string; // Suporte a snake_case do banco
  styleCategory?: string;
  points?: number;
}

export interface QuizOptionProps {
  option: QuizOptionItem;
  isSelected: boolean;
  displayType: "text" | "image" | "both";
  imageSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  imageStyles?: React.CSSProperties; // Estilos customizados para a imagem (escala, borda, etc)
  textSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showCheckIcon?: boolean;
  disabled?: boolean;
  onClick: (optionId: string) => void;
  className?: string;
  variant?: "default" | "brand"; // brand usa cores #b29670
}

// Constantes de tamanho
const IMAGE_SIZE_PX: Record<string, number> = {
  xs: 64,
  sm: 80,
  md: 112,
  lg: 160,
  xl: 208,
  "2xl": 288,
  "3xl": 384,
  full: 480,
};

const TEXT_SIZE_CLASSES: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

/**
 * Unified QuizOption component used across:
 * - OptionsBlock.tsx (editor preview)
 * - InteractiveBlock.tsx (test mode)
 * - DynamicQuizOption.tsx (user-facing quiz)
 */
export const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  isSelected,
  displayType,
  imageSize = "md",
  imageStyles,
  textSize = "base",
  showCheckIcon = true,
  disabled = false,
  onClick,
  className,
  variant = "brand",
}) => {
  const imageUrl = option.imageUrl || option.image_url;
  const showImage = displayType !== "text" && imageUrl;
  const showText = displayType !== "image" || !imageUrl;
  const imageSizePx = IMAGE_SIZE_PX[imageSize] || 112;
  const textSizeClass = TEXT_SIZE_CLASSES[textSize] || "text-base";

  // Estilos baseados na variante
  const brandColor = "#b29670";
  const selectedStyles =
    variant === "brand"
      ? {
          borderColor: brandColor,
          boxShadow: `0 4px 12px rgba(178, 150, 112, 0.3)`,
        }
      : {};
  const hoverClasses =
    variant === "brand"
      ? "hover:border-[#B89B7A]/50 hover:bg-[#B89B7A]/5"
      : "hover:border-primary/50 hover:bg-muted/50";

  // Layout com imagem (grid)
  if (showImage) {
    return (
      <button
        type="button"
        onClick={() => !disabled && onClick(option.id)}
        disabled={disabled}
        className={cn(
          "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 bg-background transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "brand" ? "focus:ring-[#b29670]" : "focus:ring-primary",
          isSelected ? "border-[#b29670]" : `border-input ${hoverClasses}`,
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer",
          className
        )}
        style={isSelected ? selectedStyles : undefined}
        aria-pressed={isSelected}
        aria-label={option.text}
        data-testid={`quiz-option-${option.id}`}
      >
        {/* Check Icon */}
        {isSelected && showCheckIcon && (
          <div className="absolute -top-0.5 -right-0.5 bg-[#b29670] rounded-bl-md p-0.5">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        )}

        {/* Image */}
        <div
          className="overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{
            width: imageStyles?.maxWidth ? "100%" : imageSizePx,
            height: imageStyles?.maxWidth ? "auto" : imageSizePx,
          }}
        >
          <img
            src={imageUrl}
            alt={option.text}
            className="w-full h-full object-cover"
            style={imageStyles}
            loading="lazy"
          />
        </div>

        {/* Text (only for 'both' mode) */}
        {displayType === "both" && (
          <span
            className={cn(
              "text-center font-medium line-clamp-2",
              textSizeClass
            )}
          >
            {option.text}
          </span>
        )}
      </button>
    );
  }

  // Layout texto apenas (lista)
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick(option.id)}
      disabled={disabled}
      className={cn(
        "relative w-full whitespace-normal rounded-md font-medium ring-offset-background transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border-2 bg-background min-w-full gap-2 flex py-4 px-4 flex-row items-center justify-start text-left",
        textSizeClass,
        isSelected ? "border-[#b29670]" : `border-input ${hoverClasses}`,
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      style={isSelected ? selectedStyles : undefined}
      aria-pressed={isSelected}
      aria-label={option.text}
      data-testid={`quiz-option-${option.id}`}
    >
      {/* Check Icon */}
      {isSelected && showCheckIcon && (
        <div className="absolute -top-0.5 -right-0.5 bg-[#b29670] rounded-bl-md p-0.5">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </div>
      )}

      <div className="break-words w-full">
        <p dangerouslySetInnerHTML={{ __html: option.text }} />
      </div>
    </button>
  );
};

export default QuizOption;
