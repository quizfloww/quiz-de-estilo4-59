
import { QuizQuestion } from '../types/quiz';
import { selfPerceptionQuestions } from './questions/selfPerceptionQuestions';
import { styleExperienceQuestions } from './questions/styleExperienceQuestions';
import { purchaseIntentQuestions } from './questions/purchaseIntentQuestions';
import { desiredOutcomesQuestions } from './questions/desiredOutcomesQuestions';
import { getStrategicQuestionsFromConfig, hasEditorConfig } from '@/utils/quizConfigAdapter';

// Default hardcoded strategic questions (fallback)
const defaultStrategicQuestions: QuizQuestion[] = [
  ...selfPerceptionQuestions,
  ...styleExperienceQuestions,
  ...purchaseIntentQuestions,
  ...desiredOutcomesQuestions
];

/**
 * Get strategic questions - uses editor config if available, otherwise falls back to default
 * This allows the editor to update the public quiz in real-time
 */
export const getStrategicQuestions = (): QuizQuestion[] => {
  if (hasEditorConfig()) {
    const editorQuestions = getStrategicQuestionsFromConfig();
    if (editorQuestions.length > 0) {
      console.log('Using strategic questions from editor config:', editorQuestions.length);
      return editorQuestions;
    }
  }
  console.log('Using default strategic questions:', defaultStrategicQuestions.length);
  return defaultStrategicQuestions;
};

// Export for backwards compatibility - but now dynamic
export const strategicQuestions: QuizQuestion[] = getStrategicQuestions();

console.log('Strategic questions loaded:', strategicQuestions.length);

