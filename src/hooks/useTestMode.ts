import { useState, useCallback, useMemo } from 'react';
import { FunnelStage } from '@/hooks/useFunnelStages';
import { CanvasBlock } from '@/types/canvasBlocks';

export interface TestResult {
  primaryStyle: {
    id: string;
    name: string;
    points: number;
    percentage: number;
  };
  secondaryStyles: Array<{
    id: string;
    name: string;
    points: number;
    percentage: number;
  }>;
  totalPoints: number;
}

interface UseTestModeProps {
  stages: FunnelStage[];
  stageBlocks: Record<string, CanvasBlock[]>;
}

export function useTestMode({ stages, stageBlocks }: UseTestModeProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [userName, setUserName] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const currentStage = stages[currentStageIndex] || null;
  const currentBlocks = currentStage ? stageBlocks[currentStage.id] || [] : [];

  // Get options block config for current stage
  const optionsBlock = currentBlocks.find(b => b.type === 'options');
  const requiredSelections = optionsBlock?.content?.multiSelect || 1;
  const selectionMode = (optionsBlock?.content?.multiSelect && optionsBlock.content.multiSelect > 1) ? 'multi' : 'single';
  const autoAdvance = optionsBlock?.content?.autoAdvance !== false;

  // Current stage answers
  const currentAnswers = currentStage ? answers[currentStage.id] || [] : [];

  // Check if can proceed
  const canProceed = useMemo(() => {
    if (!currentStage) return false;
    
    // For intro, check if name is filled (if there's an input block)
    if (currentStage.type === 'intro') {
      const inputBlock = currentBlocks.find(b => b.type === 'input');
      if (inputBlock && inputBlock.content?.required) {
        return userName.trim().length > 0;
      }
      return true;
    }
    
    // For question/strategic stages, check selections
    if (currentStage.type === 'question' || currentStage.type === 'strategic') {
      return currentAnswers.length >= requiredSelections;
    }
    
    return true;
  }, [currentStage, currentBlocks, userName, currentAnswers, requiredSelections]);

  // Check if should auto-advance
  const shouldAutoAdvance = useMemo(() => {
    if (!currentStage || !autoAdvance) return false;
    if (currentStage.type !== 'question' && currentStage.type !== 'strategic') return false;
    return currentAnswers.length >= requiredSelections;
  }, [currentStage, autoAdvance, currentAnswers, requiredSelections]);

  const handleAnswer = useCallback((stageId: string, optionIds: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [stageId]: optionIds,
    }));
  }, []);

  const calculateResults = useCallback(() => {
    // Collect all style points from answers
    const stylePoints: Record<string, number> = {};
    
    for (const [stageId, selectedOptions] of Object.entries(answers)) {
      const blocks = stageBlocks[stageId] || [];
      const optionsBlock = blocks.find(b => b.type === 'options');
      
      if (optionsBlock?.content?.options) {
        for (const optionId of selectedOptions) {
          const option = optionsBlock.content.options.find((o: any) => o.id === optionId);
          if (option?.styleCategory) {
            stylePoints[option.styleCategory] = (stylePoints[option.styleCategory] || 0) + (option.points || 1);
          }
        }
      }
    }

    const totalPoints = Object.values(stylePoints).reduce((a, b) => a + b, 0);
    
    // Sort by points
    const sortedStyles = Object.entries(stylePoints)
      .map(([id, points]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        points,
        percentage: totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0,
      }))
      .sort((a, b) => b.points - a.points);

    const primary = sortedStyles[0] || { id: 'unknown', name: 'Desconhecido', points: 0, percentage: 0 };
    const secondary = sortedStyles.slice(1, 3);

    return {
      primaryStyle: primary,
      secondaryStyles: secondary,
      totalPoints,
    };
  }, [answers, stageBlocks]);

  const goToNextStage = useCallback(() => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      // Calculate and show results
      const results = calculateResults();
      setResult(results);
      setIsComplete(true);
    }
  }, [currentStageIndex, stages.length, calculateResults]);

  const goToPreviousStage = useCallback(() => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
    }
  }, [currentStageIndex]);

  const reset = useCallback(() => {
    setCurrentStageIndex(0);
    setAnswers({});
    setUserName('');
    setIsComplete(false);
    setResult(null);
  }, []);

  const progress = stages.length > 0 
    ? Math.round(((currentStageIndex + 1) / stages.length) * 100) 
    : 0;

  return {
    currentStageIndex,
    currentStage,
    currentBlocks,
    answers,
    currentAnswers,
    userName,
    setUserName,
    isComplete,
    result,
    canProceed,
    shouldAutoAdvance,
    progress,
    handleAnswer,
    goToNextStage,
    goToPreviousStage,
    reset,
    totalStages: stages.length,
  };
}
