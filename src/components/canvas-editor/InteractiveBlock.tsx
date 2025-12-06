import React, { useState } from "react";
import { CanvasBlock } from "@/types/canvasBlocks";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizOption, QuizOptionItem } from "@/components/shared/QuizOption";

interface InteractiveBlockProps {
  block: CanvasBlock;
  stageId: string;
  selectedOptions: string[];
  userName: string;
  progress: number;
  onAnswer: (options: string[]) => void;
  onInputChange: (value: string) => void;
  onButtonClick: () => void;
  canProceed: boolean;
}

export const InteractiveBlock: React.FC<InteractiveBlockProps> = ({
  block,
  stageId,
  selectedOptions,
  userName,
  progress,
  onAnswer,
  onInputChange,
  onButtonClick,
  canProceed,
}) => {
  const { type, content } = block;

  // Header block
  if (type === "header") {
    return (
      <div className="flex flex-col w-full items-center gap-4">
        {content.showLogo && content.logoUrl && (
          <img
            src={content.logoUrl}
            alt="Logo"
            className="max-w-24 object-cover"
          />
        )}
        {content.showProgress && (
          <Progress value={progress} className="w-full h-2" />
        )}
      </div>
    );
  }

  // Heading block
  if (type === "heading") {
    const fontSize = content.fontSize || "3xl";
    const fontWeight = content.fontWeight || "bold";
    return (
      <h1
        className={cn(
          "text-center w-full",
          `text-${fontSize}`,
          `font-${fontWeight}`
        )}
      >
        {content.text || "Título"}
      </h1>
    );
  }

  // Text block
  if (type === "text") {
    return (
      <p
        className={cn(
          "w-full",
          content.textAlign === "center" && "text-center"
        )}
      >
        {content.text || "Texto"}
      </p>
    );
  }

  // Image block
  if (type === "image") {
    const sizeClasses: Record<string, string> = {
      sm: "max-w-[200px]",
      md: "max-w-96",
      lg: "max-w-[512px]",
      xl: "max-w-[640px]",
      full: "w-full",
    };
    return (
      <div
        className={cn(
          "flex w-full",
          content.imageAlignment === "left" && "justify-start",
          content.imageAlignment === "center" && "justify-center",
          content.imageAlignment === "right" && "justify-end"
        )}
      >
        <img
          src={content.imageUrl || "/placeholder.svg"}
          alt={content.imageAlt || "Imagem"}
          className={cn(
            "object-cover rounded-lg",
            sizeClasses[content.imageSize || "md"]
          )}
        />
      </div>
    );
  }

  // Input block
  if (type === "input") {
    return (
      <div className="grid w-full items-center gap-1.5">
        <Label className="text-sm font-medium">
          {content.label || "Campo"}
          {content.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          type={content.inputType || "text"}
          placeholder={content.placeholder || "Digite aqui..."}
          value={userName}
          onChange={(e) => onInputChange(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background p-4 text-base"
        />
      </div>
    );
  }

  // Options block
  if (type === "options") {
    const options = content.options || [];
    const displayType = (content.displayType || "text") as
      | "text"
      | "image"
      | "both";
    const multiSelect = content.multiSelect || 1;
    const selectionMode = multiSelect > 1 ? "multi" : "single";
    const requiredSelections = multiSelect;
    const showCheckIcon = content.showCheckIcon !== false;
    const imageSize = (content.optionImageSize || "md") as
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "full";
    const textSize = (content.optionTextSize || "base") as
      | "xs"
      | "sm"
      | "base"
      | "lg"
      | "xl";

    const handleOptionClick = (optionId: string) => {
      let newSelected: string[];

      if (selectionMode === "single") {
        newSelected = [optionId];
      } else {
        if (selectedOptions.includes(optionId)) {
          newSelected = selectedOptions.filter((id) => id !== optionId);
        } else {
          if (selectedOptions.length < requiredSelections) {
            newSelected = [...selectedOptions, optionId];
          } else {
            // Replace oldest selection
            newSelected = [...selectedOptions.slice(1), optionId];
          }
        }
      }

      onAnswer(newSelected);
    };

    // Converter opções para QuizOptionItem
    const quizOptions: QuizOptionItem[] = options.map((opt: any) => ({
      id: opt.id,
      text: opt.text,
      imageUrl: opt.imageUrl,
      styleCategory: opt.styleCategory,
    }));

    // Grid for image display
    if (displayType === "image" || displayType === "both") {
      return (
        <div className="grid grid-cols-2 gap-3 w-full">
          {quizOptions.map((option) => (
            <QuizOption
              key={option.id}
              option={option}
              isSelected={selectedOptions.includes(option.id)}
              displayType={displayType}
              imageSize={imageSize}
              textSize={textSize}
              showCheckIcon={showCheckIcon}
              onClick={handleOptionClick}
              variant="brand"
            />
          ))}
        </div>
      );
    }

    // List for text only
    return (
      <div className="flex flex-col gap-2 w-full">
        {quizOptions.map((option) => (
          <QuizOption
            key={option.id}
            option={option}
            isSelected={selectedOptions.includes(option.id)}
            displayType="text"
            textSize={textSize}
            showCheckIcon={showCheckIcon}
            onClick={handleOptionClick}
            variant="brand"
          />
        ))}
      </div>
    );
  }

  // Button block
  if (type === "button") {
    return (
      <Button
        onClick={onButtonClick}
        disabled={!canProceed}
        className="w-full h-14 text-base"
      >
        {content.text || "Continuar"}
      </Button>
    );
  }

  // Spacer block
  if (type === "spacer") {
    return <div style={{ height: content.height || 16 }} />;
  }

  return null;
};
