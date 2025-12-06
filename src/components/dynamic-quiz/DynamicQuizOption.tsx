import React from "react";
import { StageOption } from "@/hooks/usePublicFunnel";
import { QuizOption, QuizOptionItem } from "@/components/shared/QuizOption";

interface DynamicQuizOptionProps {
  option: StageOption;
  isSelected: boolean;
  displayType: "text" | "image" | "both";
  imageSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  textSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showCheckIcon?: boolean;
  onClick: () => void;
}

/**
 * Wrapper para DynamicQuizOption que adapta StageOption para QuizOptionItem
 * Usa o componente unificado QuizOption
 */
export const DynamicQuizOption: React.FC<DynamicQuizOptionProps> = ({
  option,
  isSelected,
  displayType,
  imageSize = "md",
  textSize = "base",
  showCheckIcon = true,
  onClick,
}) => {
  // Converter StageOption para QuizOptionItem
  const quizOption: QuizOptionItem = {
    id: option.id,
    text: option.text,
    imageUrl: option.image_url || undefined,
    styleCategory: option.style_category || undefined,
    points: option.points,
  };

  return (
    <QuizOption
      option={quizOption}
      isSelected={isSelected}
      displayType={displayType}
      imageSize={imageSize}
      textSize={textSize}
      showCheckIcon={showCheckIcon}
      onClick={() => onClick()}
      variant="brand"
    />
  );
};
