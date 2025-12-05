import React, { useState } from 'react';
import { CanvasBlock } from '@/types/canvasBlocks';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  if (type === 'header') {
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
  if (type === 'heading') {
    const fontSize = content.fontSize || '3xl';
    const fontWeight = content.fontWeight || 'bold';
    return (
      <h1 className={cn(
        'text-center w-full',
        `text-${fontSize}`,
        `font-${fontWeight}`,
      )}>
        {content.text || 'Título'}
      </h1>
    );
  }

  // Text block
  if (type === 'text') {
    return (
      <p className={cn('w-full', content.textAlign === 'center' && 'text-center')}>
        {content.text || 'Texto'}
      </p>
    );
  }

  // Image block
  if (type === 'image') {
    const sizeClasses: Record<string, string> = {
      sm: 'max-w-[200px]',
      md: 'max-w-96',
      lg: 'max-w-[512px]',
      xl: 'max-w-[640px]',
      full: 'w-full',
    };
    return (
      <div className={cn(
        'flex w-full',
        content.imageAlignment === 'left' && 'justify-start',
        content.imageAlignment === 'center' && 'justify-center',
        content.imageAlignment === 'right' && 'justify-end',
      )}>
        <img
          src={content.imageUrl || '/placeholder.svg'}
          alt={content.imageAlt || 'Imagem'}
          className={cn(
            'object-cover rounded-lg',
            sizeClasses[content.imageSize || 'md'],
          )}
        />
      </div>
    );
  }

  // Input block
  if (type === 'input') {
    return (
      <div className="grid w-full items-center gap-1.5">
        <Label className="text-sm font-medium">
          {content.label || 'Campo'}
          {content.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          type={content.inputType || 'text'}
          placeholder={content.placeholder || 'Digite aqui...'}
          value={userName}
          onChange={(e) => onInputChange(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background p-4 text-base"
        />
      </div>
    );
  }

  // Options block
  if (type === 'options') {
    const options = content.options || [];
    const displayType = content.displayType || 'text';
    const multiSelect = content.multiSelect || 1;
    const selectionMode = multiSelect > 1 ? 'multi' : 'single';
    const requiredSelections = multiSelect;
    const showCheckIcon = content.showCheckIcon !== false;

    const textSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const imageSizeClasses = {
      sm: 'h-16 w-20',
      md: 'h-24 w-28',
      lg: 'h-32 w-36',
      xl: 'h-40 w-44',
    };

    const handleOptionClick = (optionId: string) => {
      let newSelected: string[];
      
      if (selectionMode === 'single') {
        newSelected = [optionId];
      } else {
        if (selectedOptions.includes(optionId)) {
          newSelected = selectedOptions.filter(id => id !== optionId);
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

    // Grid for image display
    if (displayType === 'image' || displayType === 'both') {
      return (
        <div className="grid grid-cols-2 gap-3 w-full">
          {options.map((option: any) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={cn(
                  'relative rounded-lg overflow-hidden border-2 transition-all duration-300',
                  'hover:shadow-lg',
                  isSelected
                    ? 'border-[#b29670] shadow-lg'
                    : 'border-input hover:border-[#B89B7A]'
                )}
                style={{
                  boxShadow: isSelected ? '0 4px 12px rgba(178, 150, 112, 0.3)' : undefined,
                }}
              >
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className={cn(
                      'w-full object-cover',
                      imageSizeClasses[content.optionImageSize || 'md'],
                    )}
                  />
                )}
                {displayType === 'both' && (
                  <div className={cn(
                    'p-2 text-center font-medium bg-background',
                    textSizeClasses[content.optionTextSize || 'sm'],
                  )}>
                    {option.text}
                  </div>
                )}
                {isSelected && showCheckIcon && (
                  <div className="absolute top-1 right-1 bg-[#b29670] rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    // List for text only
    return (
      <div className="flex flex-col gap-2 w-full">
        {options.map((option: any) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={cn(
                'relative w-full rounded-lg border-2 transition-all duration-300',
                'px-4 py-3 text-left',
                'hover:shadow-lg',
                isSelected
                  ? 'border-[#b29670] bg-[#b29670]/5 shadow-lg'
                  : 'border-input bg-background hover:border-[#B89B7A] hover:bg-[#B89B7A]/5',
                textSizeClasses[content.optionTextSize || 'base'],
              )}
              style={{
                boxShadow: isSelected ? '0 4px 12px rgba(178, 150, 112, 0.3)' : undefined,
              }}
            >
              <span className="font-medium">{option.text}</span>
              {isSelected && showCheckIcon && (
                <Check className="absolute top-2 right-2 h-4 w-4 text-[#b29670]" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Button block
  if (type === 'button') {
    return (
      <Button
        onClick={onButtonClick}
        disabled={!canProceed}
        className="w-full h-14 text-base"
      >
        {content.text || 'Continuar'}
      </Button>
    );
  }

  // Spacer block
  if (type === 'spacer') {
    return <div style={{ height: content.height || 16 }} />;
  }

  return null;
};
