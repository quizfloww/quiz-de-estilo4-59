
import { QuizQuestion } from '../../types/quiz';

export const desiredOutcomesQuestions: QuizQuestion[] = [
  {
    id: 'strategic-7',
    title: 'Qual resultado você mais deseja alcançar?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430331/ANTES_E_DEPOIS_MULHER_-_CEN?RIO_RUA_ratm8d.png',
    options: [
      {
        id: 'strategic-7-1',
        text: 'Descobrir meu estilo predominante',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-7-2',
        text: 'Aprender a combinar peças corretamente',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-7-3',
        text: 'Organizar e otimizar meu guarda-roupa',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-7-4',
        text: 'Ter um guia completo para compras futuras',
        styleCategory: 'Strategic'
      }
    ]
  }
];
