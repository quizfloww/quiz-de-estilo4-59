
import { QuizQuestion } from '../../types/quiz';

export const personalityQuestions: QuizQuestion[] = [
  {
    id: '2',
    title: 'RESUMA A SUA PERSONALIDADE:',
    type: 'text',
    multiSelect: 3,
    options: [
      {
        id: '2a',
        text: 'Informal, espontânea, alegre, essencialista.',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '2b',
        text: 'Conservadora, séria, organizada.',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '2c',
        text: 'Informada, ativa, prática.',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '2d',
        text: 'Exigente, sofisticada, seletiva.',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '2e',
        text: 'Feminina, meiga, delicada, sensível.',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '2f',
        text: 'Glamorosa, vaidosa, sensual.',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '2g',
        text: 'Cosmopolita, moderna e audaciosa.',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '2h',
        text: 'Exótica, aventureira, livre.',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  },
  {
    id: '4',
    title: 'QUAL DESSAS ESTAMPAS VOCÊ MAIS GOSTA?',
    type: 'both',
    multiSelect: 3,
    options: [
      {
        id: '4a',
        text: 'Prefiro roupas lisas, sem estampas.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430276/Q4_-_A_k6gvtc.png',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '4b',
        text: 'Estampas pequenas e discretas.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430277/Q4_-_B_a1emi6.png',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '4c',
        text: 'Listras ou estampas geométricas.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430277/Q4_-_C_ywcxcx.png',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '4d',
        text: 'Estampas sofisticadas e atemporais.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430277/Q4_-_D_y7u29d.png',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '4e',
        text: 'Florais delicados e femininos.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430277/Q4_-_E_gnuvl3.png',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '4f',
        text: 'Animal print ou estampas sensuais.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430291/Q4_-_F_lzrw2j.png',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '4g',
        text: 'Estampas marcantes e modernas.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430289/Q4_-_G_vr81is.png',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '4h',
        text: 'Estampas étnicas ou diferentes.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430290/Q4_-_H_yjbt0s.png',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  }
];
