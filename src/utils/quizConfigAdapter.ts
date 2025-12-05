/**
 * Adapter to convert QuizFlowConfig (from editor) to QuizQuestion[] (for public quiz)
 * This allows the editor to update the live quiz
 */

import { QuizFlowConfig, QuizFlowStage, QuizFlowOption } from '@/types/quizFlow';
import { QuizQuestion, QuizOption } from '@/types/quiz';
import { loadQuizFlowConfig } from '@/data/quizFlowConfig';

/**
 * Converts a QuizFlowOption to QuizOption format
 */
const convertOption = (flowOption: QuizFlowOption): QuizOption => {
  return {
    id: flowOption.id,
    text: flowOption.text,
    imageUrl: flowOption.imageUrl,
    styleCategory: flowOption.styleCategory || '',
    points: flowOption.points || 1
  };
};

/**
 * Maps displayType from editor to quiz type
 */
const mapDisplayType = (displayType?: string): 'image' | 'text' | 'both' => {
  if (displayType === 'image') return 'image';
  if (displayType === 'both') return 'both';
  return 'text';
};

/**
 * Converts a question stage from editor format to quiz format
 */
const convertStageToQuestion = (stage: QuizFlowStage): QuizQuestion | null => {
  if (stage.type !== 'question' && stage.type !== 'strategic') {
    return null;
  }

  const options = stage.config.options?.map(opt => convertOption(opt)) || [];

  return {
    id: stage.id,
    title: stage.config.question || stage.title,
    type: mapDisplayType(stage.config.displayType),
    imageUrl: stage.config.imageUrl,
    multiSelect: stage.config.multiSelect || 1,
    options
  };
};

/**
 * Gets all normal quiz questions from the editor config
 */
export const getQuizQuestionsFromConfig = (): QuizQuestion[] => {
  const config = loadQuizFlowConfig();
  return config.stages
    .filter(stage => stage.type === 'question' && stage.isEnabled)
    .sort((a, b) => a.order - b.order)
    .map(stage => convertStageToQuestion(stage))
    .filter((q): q is QuizQuestion => q !== null);
};

/**
 * Gets all strategic questions from the editor config
 */
export const getStrategicQuestionsFromConfig = (): QuizQuestion[] => {
  const config = loadQuizFlowConfig();
  return config.stages
    .filter(stage => stage.type === 'strategic' && stage.isEnabled)
    .sort((a, b) => a.order - b.order)
    .map(stage => convertStageToQuestion(stage))
    .filter((q): q is QuizQuestion => q !== null);
};

/**
 * Gets the intro configuration from the editor
 */
export const getIntroConfigFromEditor = () => {
  const config = loadQuizFlowConfig();
  const introStage = config.stages.find(s => s.type === 'intro');
  if (!introStage) return null;
  
  return {
    logoUrl: introStage.config.logoUrl || config.globalConfig.logoUrl,
    title: introStage.title,
    subtitle: introStage.config.subtitle,
    imageUrl: introStage.config.imageUrl,
    inputLabel: introStage.config.inputLabel,
    inputPlaceholder: introStage.config.inputPlaceholder,
    buttonText: introStage.config.buttonText
  };
};

/**
 * Gets the transition configuration from the editor
 */
export const getTransitionConfigFromEditor = () => {
  const config = loadQuizFlowConfig();
  const transitionStage = config.stages.find(s => s.type === 'transition');
  if (!transitionStage) return null;
  
  return {
    title: transitionStage.config.transitionTitle,
    subtitle: transitionStage.config.transitionSubtitle,
    message: transitionStage.config.transitionMessage
  };
};

/**
 * Gets the result page configuration from the editor
 */
export const getResultConfigFromEditor = () => {
  const config = loadQuizFlowConfig();
  const resultStage = config.stages.find(s => s.type === 'result');
  if (!resultStage) return null;
  
  return {
    layout: resultStage.config.resultLayout,
    showPercentages: resultStage.config.showPercentages,
    ctaText: resultStage.config.ctaText,
    ctaUrl: resultStage.config.ctaUrl
  };
};

/**
 * Gets the full quiz flow config
 */
export const getFullQuizConfig = (): QuizFlowConfig => {
  return loadQuizFlowConfig();
};

/**
 * Gets global styling config
 */
export const getGlobalConfigFromEditor = () => {
  const config = loadQuizFlowConfig();
  return config.globalConfig;
};

/**
 * Gets style categories from editor
 */
export const getStyleCategoriesFromEditor = () => {
  const config = loadQuizFlowConfig();
  return config.styleCategories;
};

/**
 * Check if editor config is available (localStorage has been set)
 */
export const hasEditorConfig = (): boolean => {
  try {
    const stored = localStorage.getItem('quiz-flow-config');
    return stored !== null;
  } catch {
    return false;
  }
};
