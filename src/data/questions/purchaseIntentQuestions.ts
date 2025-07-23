
import { QuizQuestion } from '../../types/quiz';

export const purchaseIntentQuestions: QuizQuestion[] = [
  {
    id: 'strategic-5',
    title: 'Quanto você costuma gastar com roupas por mês?',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: 'strategic-5-1',
        text: 'Até R$ 200',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-5-2',
        text: 'De R$ 200 a R$ 500',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-5-3',
        text: 'De R$ 500 a R$ 1.000',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-5-4',
        text: 'Mais de R$ 1.000',
        styleCategory: 'Strategic'
      }
    ]
  },
  {
    id: 'strategic-6',
    title: 'Quanto você investiria em um guia completo de estilo?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430326/MOCKUPS_DE_TODOS_OS_PRODUTOS_-_GUIAS_DE_ESILOS_E_B?NUS_legwsb.png',
    options: [
      {
        id: 'strategic-6-1',
        text: 'Até R$ 50',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-6-2',
        text: 'De R$ 50 a R$ 150',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-6-3',
        text: 'De R$ 150 a R$ 300',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-6-4',
        text: 'Mais de R$ 300',
        styleCategory: 'Strategic'
      }
    ]
  }
];
