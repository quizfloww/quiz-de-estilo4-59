import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FunnelStage } from '@/hooks/usePublicFunnel';
import { DynamicQuizOption } from './DynamicQuizOption';

interface DynamicQuestionProps {
  stage: FunnelStage;
  currentAnswers: string[];
  onAnswer: (selectedOptions: string[]) => void;
  onContinue: () => void;
}

export const DynamicQuestion: React.FC<DynamicQuestionProps> = ({
  stage,
  currentAnswers,
  onAnswer,
  onContinue,
}) => {
  const [selected, setSelected] = useState<string[]>(currentAnswers || []);
  const config = stage.config || {};

  const questionText = config.questionText || stage.title;
  const displayType = config.displayType || 'text';
  const multiSelect = config.multiSelect || false;
  const requiredSelections = config.requiredSelections || (multiSelect ? 3 : 1);
  const autoAdvance = config.autoAdvance !== false && !multiSelect;
  const buttonText = config.buttonText || 'Continuar';

  useEffect(() => {
    setSelected(currentAnswers || []);
  }, [stage.id, currentAnswers]);

  const handleOptionClick = (optionId: string) => {
    let newSelected: string[];

    if (multiSelect) {
      if (selected.includes(optionId)) {
        newSelected = selected.filter(id => id !== optionId);
      } else if (selected.length < requiredSelections) {
        newSelected = [...selected, optionId];
      } else {
        return; // Max selections reached
      }
    } else {
      newSelected = [optionId];
    }

    setSelected(newSelected);
    onAnswer(newSelected);

    // Auto advance for single select questions
    if (autoAdvance && !multiSelect && newSelected.length === 1) {
      setTimeout(() => {
        onContinue();
      }, 300);
    }
  };

  const canContinue = multiSelect 
    ? selected.length === requiredSelections 
    : selected.length > 0;

  // Determine grid layout based on display type
  const getGridClasses = () => {
    if (displayType === 'text') {
      return 'flex flex-col gap-2';
    }
    // Image or both - use grid
    return 'grid grid-cols-2 gap-3';
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
        {questionText}
      </h1>

      {multiSelect && (
        <p className="text-center text-muted-foreground text-sm mb-2">
          Selecione {requiredSelections} opções ({selected.length}/{requiredSelections})
        </p>
      )}

      <div className={getGridClasses()}>
        {stage.options.map((option) => (
          <DynamicQuizOption
            key={option.id}
            option={option}
            isSelected={selected.includes(option.id)}
            displayType={displayType}
            onClick={() => handleOptionClick(option.id)}
          />
        ))}
      </div>

      {(multiSelect || !autoAdvance) && (
        <Button
          className="w-full h-14 mt-4"
          disabled={!canContinue}
          onClick={onContinue}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};
