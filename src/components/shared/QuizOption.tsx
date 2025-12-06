import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizOptionItem {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
}

export interface QuizOptionProps {
  option: QuizOptionItem;
  isSelected: boolean;
  displayType: "text" | "image" | "both";
  imageSize?: "sm" | "md" | "lg";
  showCheckIcon?: boolean;
  disabled?: boolean;
  onClick: (optionId: string) => void;
  className?: string;
}

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
  showCheckIcon = true,
  disabled = false,
  onClick,
  className,
}) => {
  const showImage = displayType !== "text" && option.imageUrl;
  const showText = displayType !== "image" || !option.imageUrl;

  const imageSizeClasses = {
    sm: "h-20",
    md: "h-32",
    lg: "h-48",
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick(option.id)}
      disabled={disabled}
      className={cn(
        "relative w-full rounded-lg border-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      aria-pressed={isSelected}
      aria-label={option.text}
    >
      {/* Image */}
      {showImage && (
        <div
          className={cn(
            "w-full overflow-hidden rounded-t-lg",
            imageSizeClasses[imageSize]
          )}
        >
          <img
            src={option.imageUrl}
            alt={option.text}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Text */}
      {showText && (
        <div
          className={cn(
            "p-3 text-sm text-center font-medium text-foreground",
            showImage && "border-t"
          )}
        >
          {option.text}
        </div>
      )}

      {/* Selection Indicator */}
      {showCheckIcon && isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      {/* Category Badge (optional, for debugging) */}
      {option.styleCategory && process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
          {option.styleCategory}
        </div>
      )}
    </button>
  );
};

export default QuizOption;
