
import { QuizQuestion } from '../../types/quiz';

export const clothingQuestions: QuizQuestion[] = [
  {
    id: '1',
    title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    type: 'both',
    multiSelect: 3,
    options: [
      {
        id: '1a',
        text: 'Conforto, leveza e praticidade no vestir.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430262/Q1_-_A_xlh5cg.png',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '1b',
        text: 'Discrição, caimento clássico e sobriedade.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430263/Q1_-_B_bm79bg.png',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '1c',
        text: 'Praticidade com um toque de estilo atual.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430262/Q1_-_C_n2at5j.png',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '1d',
        text: 'Elegância refinada, moderna e sem exageros.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430264/Q1_-_D_psbhs9.png',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '1e',
        text: 'Delicadeza em tecidos suaves e fluidos.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430272/Q1_-_E_pwhukq.png',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '1f',
        text: 'Sensualidade com destaque para o corpo.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430272/Q1_-_F_z1nyug.png',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '1g',
        text: 'Impacto visual com peças estruturadas e assimétricas.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430268/Q1_-_G_zgy8mq.png',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '1h',
        text: 'Mix criativo com formas ousadas e originais.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430269/Q1_-_H_dqhkzv.png',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  },
  {
    id: '3',
    title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    type: 'both',
    multiSelect: 3,
    options: [
      {
        id: '3a',
        text: 'Visual leve, despojado e natural.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430272/Q3_-_A_plsfwp.png',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '3b',
        text: 'Visual clássico e tradicional.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430270/Q3_-_B_w75tyg.png',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '3c',
        text: 'Visual casual com toque atual.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430270/Q3_-_C_ep9x9h.png',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '3d',
        text: 'Visual refinado e imponente.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430271/Q3_-_D_xxra9m.png',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '3e',
        text: 'Visual romântico, feminino e delicado.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430278/Q3_-_E_lr9p2d.png',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '3f',
        text: 'Visual sensual, com saia justa e decote.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430280/Q3_-_F_amdr7l.png',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '3g',
        text: 'Visual marcante e urbano (jeans + jaqueta).',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430279/Q3_-_G_zod0w5.png',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '3h',
        text: 'Visual criativo, colorido e ousado.',
        imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430276/Q3_-_H_aghfg8.png',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  }
];
