
import { QuizQuestion } from '../../types/quiz';

export const styleExperienceQuestions: QuizQuestion[] = [
  {
    id: 'strategic-3',
    title: 'Você já teve alguma experiência com consultoria de estilo?',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: 'strategic-3-1',
        text: 'Nunca tive, mas tenho muito interesse',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-3-2',
        text: 'Já pesquisei sobre o assunto, mas nunca contratei',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-3-3',
        text: 'Já fiz consultorias presenciais',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-3-4',
        text: 'Já comprei cursos online sobre estilo',
        styleCategory: 'Strategic'
      }
    ]
  },
  {
    id: 'strategic-4',
    title: 'O que mais te motiva a descobrir seu estilo pessoal?',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: 'strategic-4-1',
        text: 'Quero me sentir mais confiante e bonita',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-4-2',
        text: 'Preciso otimizar meu guarda-roupa e economizar',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-4-3',
        text: 'Quero causar uma boa impressão profissionalmente',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-4-4',
        text: 'Busco uma transformação pessoal completa',
        styleCategory: 'Strategic'
      }
    ]
  }
];
