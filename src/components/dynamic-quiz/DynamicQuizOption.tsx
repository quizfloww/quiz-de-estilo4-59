import React from 'react';
import { cn } from '@/lib/utils';
import { StageOption } from '@/hooks/usePublicFunnel';

interface DynamicQuizOptionProps {
  option: StageOption;
  isSelected: boolean;
  displayType: 'text' | 'image' | 'both';
  onClick: () => void;
}

export const DynamicQuizOption: React.FC<DynamicQuizOptionProps> = ({
  option,
  isSelected,
  displayType,
  onClick,
}) => {
  const hasImage = option.image_url && (displayType === 'image' || displayType === 'both');
  const hasText = displayType === 'text' || displayType === 'both';

  if (hasImage && !hasText) {
    // Image only
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative rounded-lg overflow-hidden border-2 transition-all duration-200",
          "hover:shadow-lg hover:scale-[1.02]",
          isSelected
            ? "border-primary ring-2 ring-primary/50"
            : "border-border hover:border-primary/50"
        )}
      >
        <img
          src={option.image_url!}
          alt={option.text}
          className="w-full h-32 object-cover"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </button>
    );
  }

  if (hasImage && hasText) {
    // Image + text
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex flex-col rounded-lg overflow-hidden border-2 transition-all duration-200",
          "hover:shadow-lg hover:scale-[1.02]",
          isSelected
            ? "border-primary ring-2 ring-primary/50 bg-primary/5"
            : "border-border hover:border-primary/50 bg-background"
        )}
      >
        <img
          src={option.image_url!}
          alt={option.text}
          className="w-full h-28 object-cover"
        />
        <div className="p-3 text-sm text-center font-medium">
          {option.text}
        </div>
      </button>
    );
  }

  // Text only
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md text-sm font-medium transition-colors",
        "border bg-background hover:bg-primary hover:text-primary-foreground",
        "min-h-[4rem] px-4 py-3 text-left",
        "hover:shadow-xl overflow-hidden",
        isSelected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border"
      )}
    >
      <div className="w-full flex flex-row items-center justify-between">
        <span className="break-words">{option.text}</span>
      </div>
    </button>
  );
};
