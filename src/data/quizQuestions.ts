
import { QuizQuestion } from '../types/quiz';
import { clothingQuestions } from './questions/clothingQuestions';
import { personalityQuestions } from './questions/personalityQuestions';
import { accessoriesQuestions } from './questions/accessoriesQuestions';
import { stylePreferencesQuestions } from './questions/stylePreferencesQuestions';
import { outerwearQuestions } from './questions/outerwearQuestions';
import { accessoryStyleQuestions } from './questions/accessoryStyleQuestions';
import { getQuizQuestionsFromConfig, hasEditorConfig } from '@/utils/quizConfigAdapter';

// Default hardcoded questions (fallback)
const defaultQuizQuestions: QuizQuestion[] = [
  ...clothingQuestions,         // Questões 1 e 3
  ...personalityQuestions,      // Questões 2 e 4
  ...stylePreferencesQuestions, // Questões 5 e 10
  ...outerwearQuestions,       // Questões 6 e 7
  ...accessoriesQuestions,     // Questão 8
  ...accessoryStyleQuestions   // Questão 9
];

/**
 * Get quiz questions - uses editor config if available, otherwise falls back to default
 * This allows the editor to update the public quiz in real-time
 */
export const getQuizQuestions = (): QuizQuestion[] => {
  if (hasEditorConfig()) {
    const editorQuestions = getQuizQuestionsFromConfig();
    if (editorQuestions.length > 0) {
      console.log('Using quiz questions from editor config:', editorQuestions.length);
      return editorQuestions;
    }
  }
  console.log('Using default quiz questions:', defaultQuizQuestions.length);
  return defaultQuizQuestions;
};

// Export for backwards compatibility - but now dynamic
export const quizQuestions: QuizQuestion[] = getQuizQuestions();

