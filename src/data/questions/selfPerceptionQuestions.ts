
import { QuizQuestion } from '../../types/quiz';

export const selfPerceptionQuestions: QuizQuestion[] = [
  {
    id: 'strategic-1',
    title: 'Como você se sente em relação ao seu estilo pessoal hoje?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430327/MULHER_FRUSTRADA_NA_FRENTE_DO_GUARDA-ROUPA_jnrwcr.png',
    options: [
      {
        id: 'strategic-1-1',
        text: 'Completamente perdida, não sei o que combina comigo',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-1-2',
        text: 'Tenho algumas ideias, mas não sei como aplicá-las',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-1-3',
        text: 'Conheço meu estilo, mas quero refiná-lo',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-1-4',
        text: 'Estou satisfeita, só buscando inspiração',
        styleCategory: 'Strategic'
      }
    ]
  },
  {
    id: 'strategic-2',
    title: 'Qual é o maior desafio que você enfrenta ao se vestir?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430303/COMPRAS_COMPULSIVAS_X_DIRE??O_COM_O_GUIA_DE_ESTILO_xy0hb3.png',
    options: [
      {
        id: 'strategic-2-1',
        text: 'Nunca sei o que combina com o quê',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-2-2',
        text: 'Tenho muitas roupas, mas sempre sinto que não tenho nada para vestir',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-2-3',
        text: 'Não consigo criar looks diferentes com as peças que tenho',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-2-4',
        text: 'Compro peças por impulso que depois não uso',
        styleCategory: 'Strategic'
      }
    ]
  }
];
