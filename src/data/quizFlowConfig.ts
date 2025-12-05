import { QuizFlowConfig } from '@/types/quizFlow';

export const defaultQuizFlowConfig: QuizFlowConfig = {
  id: 'quiz-estilo-pessoal',
  name: 'Teste de Estilo Pessoal',
  version: '1.0.0',
  stages: [
    {
      id: 'intro',
      type: 'intro',
      order: 0,
      title: 'Introdução',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: false,
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2',
        subtitle: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up',
        inputLabel: 'NOME',
        inputPlaceholder: 'Digite seu nome aqui...',
        buttonText: 'Continuar'
      }
    },
    {
      id: 'q1',
      type: 'question',
      order: 1,
      title: 'Questão 1 - Tipo de Roupa',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q1-natural', text: 'Conforto, leveza e praticidade no vestir', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q1-classico', text: 'Discrição, caimento clássico e sobriedade', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q1-contemporaneo', text: 'Praticidade com um toque de estilo atual', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q1-elegante', text: 'Elegância refinada, moderna e sem exageros', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q1-romantico', text: 'Delicadeza em tecidos suaves e fluidos', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q1-sexy', text: 'Sensualidade com destaque para o corpo', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q1-dramatico', text: 'Impacto visual com peças estruturadas e assimétricas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q1-criativo', text: 'Mix criativo com formas ousadas e originais', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },
    {
      id: 'q2',
      type: 'question',
      order: 2,
      title: 'Questão 2 - Personalidade',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'RESUMA A SUA PERSONALIDADE:',
        displayType: 'text',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q2-natural', text: 'Informal, espontânea, alegre, essencialista', styleCategory: 'Natural', points: 1 },
          { id: 'q2-classico', text: 'Conservadora, séria, organizada', styleCategory: 'Clássico', points: 1 },
          { id: 'q2-contemporaneo', text: 'Informada, ativa, prática', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q2-elegante', text: 'Exigente, sofisticada, seletiva', styleCategory: 'Elegante', points: 1 },
          { id: 'q2-romantico', text: 'Feminina, meiga, delicada, sensível', styleCategory: 'Romântico', points: 1 },
          { id: 'q2-sexy', text: 'Glamorosa, vaidosa, sensual', styleCategory: 'Sexy', points: 1 },
          { id: 'q2-dramatico', text: 'Cosmopolita, moderna e audaciosa', styleCategory: 'Dramático', points: 1 },
          { id: 'q2-criativo', text: 'Exótica, aventureira, livre', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },
    {
      id: 'q3',
      type: 'question',
      order: 3,
      title: 'Questão 3 - Visual',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q3-natural', text: 'Visual leve, despojado e natural', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q3-classico', text: 'Visual clássico e tradicional', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q3-contemporaneo', text: 'Visual casual com toque atual', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q3-elegante', text: 'Visual refinado e imponente', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q3-romantico', text: 'Visual romântico, feminino e delicado', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q3-sexy', text: 'Visual sensual, com saia justa e decote', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q3-dramatico', text: 'Visual marcante e urbano (jeans + jaqueta)', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q3-criativo', text: 'Visual criativo, colorido e ousado', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },
    {
      id: 'transition',
      type: 'transition',
      order: 11,
      title: 'Transição',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: false,
        allowBack: false,
        transitionTitle: 'Enquanto calculamos o seu resultado...',
        transitionSubtitle: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
        transitionMessage: 'Responda com sinceridade. Isso é só entre você e a sua nova versão.'
      }
    },
    {
      id: 'strategic-1',
      type: 'strategic',
      order: 12,
      title: 'Estratégica 1 - Autopercepção',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'Como você se sente em relação ao seu estilo pessoal hoje?',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's1-1', text: 'Totalmente perdida, não sei por onde começar' },
          { id: 's1-2', text: 'Tenho algumas noções, mas falta clareza' },
          { id: 's1-3', text: 'Conheço meu estilo, mas quero me aprofundar' },
          { id: 's1-4', text: 'Me sinto confiante e apenas quero confirmar' }
        ]
      }
    },
    {
      id: 'strategic-2',
      type: 'strategic',
      order: 13,
      title: 'Estratégica 2 - Desafios',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'Qual é o seu maior desafio ao se vestir?',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's2-1', text: 'Não sei o que combina comigo' },
          { id: 's2-2', text: 'Tenho muitas roupas mas nada parece certo' },
          { id: 's2-3', text: 'Não sei me vestir para diferentes ocasiões' },
          { id: 's2-4', text: 'Quero renovar meu guarda-roupa de forma inteligente' }
        ]
      }
    },
    {
      id: 'result',
      type: 'result',
      order: 20,
      title: 'Resultado',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: false,
        allowBack: false,
        resultLayout: 'modern',
        showPercentages: true,
        ctaText: 'Quero Descobrir Meu Estilo Completo',
        ctaUrl: '/oferta'
      }
    }
  ],
  globalConfig: {
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2',
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    backgroundColor: '#FFFAF5',
    fontFamily: 'Playfair Display'
  },
  styleCategories: [
    { id: 'Natural', name: 'Natural', description: 'Informal, espontânea, alegre, essencialista', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp' },
    { id: 'Clássico', name: 'Clássico', description: 'Conservadora, séria, organizada', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp' },
    { id: 'Contemporâneo', name: 'Contemporâneo', description: 'Informada, ativa, prática', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp' },
    { id: 'Elegante', name: 'Elegante', description: 'Exigente, sofisticada, seletiva', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp' },
    { id: 'Romântico', name: 'Romântico', description: 'Feminina, meiga, delicada, sensível', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp' },
    { id: 'Sexy', name: 'Sexy', description: 'Glamorosa, vaidosa, sensual', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp' },
    { id: 'Dramático', name: 'Dramático', description: 'Cosmopolita, moderna e audaciosa', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp' },
    { id: 'Criativo', name: 'Criativo', description: 'Exótica, aventureira, livre', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp' }
  ]
};

export const QUIZ_FLOW_STORAGE_KEY = 'quiz-flow-config';

export const loadQuizFlowConfig = (): QuizFlowConfig => {
  try {
    const stored = localStorage.getItem(QUIZ_FLOW_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading quiz flow config:', error);
  }
  return defaultQuizFlowConfig;
};

export const saveQuizFlowConfig = (config: QuizFlowConfig): void => {
  try {
    localStorage.setItem(QUIZ_FLOW_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving quiz flow config:', error);
  }
};
