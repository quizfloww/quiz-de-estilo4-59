import { QuizFlowConfig } from '@/types/quizFlow';

export const defaultQuizFlowConfig: QuizFlowConfig = {
  id: 'quiz-estilo-pessoal',
  name: 'Teste de Estilo Pessoal',
  version: '1.0.0',
  stages: [
    // ==================== INTRODUÇÃO ====================
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

    // ==================== Q1 - TIPO DE ROUPA ====================
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

    // ==================== Q2 - PERSONALIDADE ====================
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

    // ==================== Q3 - VISUAL ====================
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

    // ==================== Q4 - ESTAMPAS FAVORITAS ====================
    {
      id: 'q4',
      type: 'question',
      order: 4,
      title: 'Questão 4 - Estampas Favoritas',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUAL DESSAS ESTAMPAS VOCÊ MAIS GOSTA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q4-natural', text: 'Estampas naturais, florais suaves e orgânicas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Q4_-_A_okjfzh.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q4-classico', text: 'Listras, poás discretos e xadrez tradicional', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Q4_-_B_bzms0w.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q4-contemporaneo', text: 'Geométricas modernas e minimalistas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920984/Q4_-_C_fwzi0v.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q4-elegante', text: 'Estampas sofisticadas e refinadas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920985/Q4_-_D_d9fcai.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q4-romantico', text: 'Florais delicados e rendas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920986/Q4_-_E_vs2hfj.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q4-sexy', text: 'Animal print e estampas sensuais', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920987/Q4_-_F_b4kk15.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q4-dramatico', text: 'Estampas marcantes e contrastantes', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920989/Q4_-_G_mwgp1n.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q4-criativo', text: 'Mix de estampas, étnicas e artísticas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920992/Q4_-_H_yihqvz.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== Q5 - ESTAMPAS IDENTIFICAÇÃO ====================
    {
      id: 'q5',
      type: 'question',
      order: 5,
      title: 'Questão 5 - Estampas Identificação',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q5-natural', text: 'Tons terrosos e estampas da natureza', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921043/Q5_-_A_wuxgvy.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q5-classico', text: 'Padrões tradicionais e atemporais', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921043/Q5_-_B_vn7an1.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q5-contemporaneo', text: 'Estampas clean e modernas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921043/Q5_-_C_rjhfea.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q5-elegante', text: 'Estampas discretas de alto padrão', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921044/Q5_-_D_tqa8e1.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q5-romantico', text: 'Florais românticos e delicados', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921044/Q5_-_E_hfkviv.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q5-sexy', text: 'Estampas ousadas e chamativas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921045/Q5_-_F_wudaye.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q5-dramatico', text: 'Estampas de impacto visual', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921047/Q5_-_G_dj2yff.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q5-criativo', text: 'Mix criativo de padrões e cores', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921049/Q5_-_H_jxe4bi.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== Q6 - CASACOS ====================
    {
      id: 'q6',
      type: 'question',
      order: 6,
      title: 'Questão 6 - Casacos',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUAL TIPO DE CASACO VOCÊ MAIS USA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q6-natural', text: 'Cardigã leve, jaqueta jeans básica', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921092/Q6_-_A_g8jatw.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q6-classico', text: 'Blazer estruturado, trench coat', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921093/Q6_-_B_bzplwm.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q6-contemporaneo', text: 'Jaqueta bomber, casaco funcional', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921094/Q6_-_C_btdv0a.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q6-elegante', text: 'Casaco de alfaiataria, sobretudo refinado', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921095/Q6_-_D_zf6wl6.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q6-romantico', text: 'Casaquinho delicado, tricô com detalhes', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921096/Q6_-_E_ehqxqn.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q6-sexy', text: 'Jaqueta de couro, blazer ajustado', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921097/Q6_-_F_p8aqid.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q6-dramatico', text: 'Casaco oversized, peças statement', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921098/Q6_-_G_hbqi8r.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q6-criativo', text: 'Peças customizadas, mix de texturas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921100/Q6_-_H_rfsijv.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== Q7 - CALÇAS ====================
    {
      id: 'q7',
      type: 'question',
      order: 7,
      title: 'Questão 7 - Calças',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUE TIPO DE CALÇA VOCÊ MAIS GOSTA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q7-natural', text: 'Jeans confortável, calça de linho', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921144/Q7_-_A_jprbjx.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q7-classico', text: 'Calça de alfaiataria reta, social', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921145/Q7_-_B_xzfx94.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q7-contemporaneo', text: 'Calça cargo, jogger estilosa', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921145/Q7_-_C_njxllf.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q7-elegante', text: 'Calça de corte impecável, wide leg', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921147/Q7_-_D_qpzjxs.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q7-romantico', text: 'Calça fluida, pantacourt delicada', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921148/Q7_-_E_jrqtfx.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q7-sexy', text: 'Calça skinny, legging modeladora', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921149/Q7_-_F_uzkhfk.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q7-dramatico', text: 'Calça de couro, modelagem diferenciada', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921150/Q7_-_G_zxlfxs.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q7-criativo', text: 'Calça estampada, patchwork criativo', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921151/Q7_-_H_o5mjsp.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== Q8 - SAPATOS ====================
    {
      id: 'q8',
      type: 'question',
      order: 8,
      title: 'Questão 8 - Sapatos',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q8-natural', text: 'Tênis confortável, rasteirinha básica', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921197/Q8_-_A_ufbj9q.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q8-classico', text: 'Scarpin clássico, mocassim tradicional', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921197/Q8_-_B_hqlstv.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q8-contemporaneo', text: 'Tênis branco moderno, mule atual', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921197/Q8_-_C_g6li4c.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q8-elegante', text: 'Salto médio elegante, sandália refinada', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921198/Q8_-_D_rlmksh.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q8-romantico', text: 'Sapatilha delicada, sandália romântica', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921199/Q8_-_E_hddhfc.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q8-sexy', text: 'Salto alto, sandália de tiras', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921200/Q8_-_F_gmdto1.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q8-dramatico', text: 'Bota statement, sapato de design marcante', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921201/Q8_-_G_gzzwlu.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q8-criativo', text: 'Sapato colorido, design artístico', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921202/Q8_-_H_ixypjo.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== Q9 - ACESSÓRIOS ====================
    {
      id: 'q9',
      type: 'question',
      order: 9,
      title: 'Questão 9 - Acessórios',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
        displayType: 'both',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q9-natural', text: 'Acessórios minimalistas, materiais naturais', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921247/Q9_-_A_b0dhaq.webp', styleCategory: 'Natural', points: 1 },
          { id: 'q9-classico', text: 'Joias tradicionais, pérolas discretas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921248/Q9_-_B_znhait.webp', styleCategory: 'Clássico', points: 1 },
          { id: 'q9-contemporaneo', text: 'Relógio moderno, acessórios funcionais', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921249/Q9_-_C_zcj4vh.webp', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q9-elegante', text: 'Joias finas, acessórios de grife', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921250/Q9_-_D_izkmx6.webp', styleCategory: 'Elegante', points: 1 },
          { id: 'q9-romantico', text: 'Bijuterias delicadas, flores, laços', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921251/Q9_-_E_jcqhxn.webp', styleCategory: 'Romântico', points: 1 },
          { id: 'q9-sexy', text: 'Acessórios chamativos, brilho e glamour', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921252/Q9_-_F_mhkqpl.webp', styleCategory: 'Sexy', points: 1 },
          { id: 'q9-dramatico', text: 'Peças statement, acessórios de impacto', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921253/Q9_-_G_jvshbq.webp', styleCategory: 'Dramático', points: 1 },
          { id: 'q9-criativo', text: 'Mix de estilos, peças artesanais únicas', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921255/Q9_-_H_xdtqjd.webp', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== Q10 - TECIDOS ====================
    {
      id: 'q10',
      type: 'question',
      order: 10,
      title: 'Questão 10 - Tecidos',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
        displayType: 'text',
        multiSelect: 3,
        autoAdvance: false,
        options: [
          { id: 'q10-natural', text: 'São confortáveis e naturais (algodão, linho)', styleCategory: 'Natural', points: 1 },
          { id: 'q10-classico', text: 'São duráveis e de qualidade comprovada', styleCategory: 'Clássico', points: 1 },
          { id: 'q10-contemporaneo', text: 'São práticos e fáceis de cuidar', styleCategory: 'Contemporâneo', points: 1 },
          { id: 'q10-elegante', text: 'São refinados e de alto padrão (seda, cashmere)', styleCategory: 'Elegante', points: 1 },
          { id: 'q10-romantico', text: 'São suaves e fluidos (chiffon, renda)', styleCategory: 'Romântico', points: 1 },
          { id: 'q10-sexy', text: 'Valorizam o corpo e têm caimento perfeito', styleCategory: 'Sexy', points: 1 },
          { id: 'q10-dramatico', text: 'Têm textura marcante e visual impactante', styleCategory: 'Dramático', points: 1 },
          { id: 'q10-criativo', text: 'São diferentes e únicos, misturo texturas', styleCategory: 'Criativo', points: 1 }
        ]
      }
    },

    // ==================== TRANSIÇÃO ====================
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

    // ==================== STRATEGIC 1 - AUTOPERCEPÇÃO ====================
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
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp',
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

    // ==================== STRATEGIC 2 - DESAFIOS ====================
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
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp',
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

    // ==================== STRATEGIC 3 - EXPERIÊNCIA ====================
    {
      id: 'strategic-3',
      type: 'strategic',
      order: 14,
      title: 'Estratégica 3 - Experiência',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'Você já teve alguma experiência com consultoria de estilo?',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's3-1', text: 'Nunca, esta é minha primeira vez' },
          { id: 's3-2', text: 'Já pesquisei online, mas nunca fiz algo profissional' },
          { id: 's3-3', text: 'Já fiz análise de coloração ou algo similar' },
          { id: 's3-4', text: 'Sim, já tive consultoria completa' }
        ]
      }
    },

    // ==================== STRATEGIC 4 - MOTIVAÇÃO ====================
    {
      id: 'strategic-4',
      type: 'strategic',
      order: 15,
      title: 'Estratégica 4 - Motivação',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'O que mais te motiva a descobrir seu estilo pessoal?',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's4-1', text: 'Quero me sentir mais confiante no dia a dia' },
          { id: 's4-2', text: 'Preciso melhorar minha imagem profissional' },
          { id: 's4-3', text: 'Quero parar de desperdiçar dinheiro com roupas erradas' },
          { id: 's4-4', text: 'Estou passando por uma fase de transformação pessoal' }
        ]
      }
    },

    // ==================== STRATEGIC 5 - GASTOS ====================
    {
      id: 'strategic-5',
      type: 'strategic',
      order: 16,
      title: 'Estratégica 5 - Gastos',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'Quanto você costuma gastar com roupas por mês?',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's5-1', text: 'Menos de R$ 200' },
          { id: 's5-2', text: 'Entre R$ 200 e R$ 500' },
          { id: 's5-3', text: 'Entre R$ 500 e R$ 1.000' },
          { id: 's5-4', text: 'Mais de R$ 1.000' }
        ]
      }
    },

    // ==================== STRATEGIC 6 - INVESTIMENTO ====================
    {
      id: 'strategic-6',
      type: 'strategic',
      order: 17,
      title: 'Estratégica 6 - Investimento',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'Quanto você investiria em um guia completo de estilo personalizado?',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920677/Espanhol_Portugu%C3%AAs_6_jxqlxx.webp',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's6-1', text: 'Até R$ 100' },
          { id: 's6-2', text: 'Entre R$ 100 e R$ 300' },
          { id: 's6-3', text: 'Entre R$ 300 e R$ 500' },
          { id: 's6-4', text: 'Mais de R$ 500, se trouxer resultados reais' }
        ]
      }
    },

    // ==================== STRATEGIC 7 - RESULTADOS ====================
    {
      id: 'strategic-7',
      type: 'strategic',
      order: 18,
      title: 'Estratégica 7 - Resultados',
      isEnabled: true,
      config: {
        showLogo: true,
        showProgress: true,
        allowBack: true,
        question: 'Qual resultado você mais deseja alcançar?',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/t_Antes%20e%20Depois%20-%20de%20Descobrir%20seu%20Estilo/v1745459978/20250423_1704_Transforma%C3%A7%C3%A3o_no_Closet_Moderno_simple_compose_01jsj3xvy6fpfb6pyd5shg5eak_1_appany.webp',
        displayType: 'text',
        multiSelect: 1,
        autoAdvance: true,
        options: [
          { id: 's7-1', text: 'Montar looks incríveis sem esforço' },
          { id: 's7-2', text: 'Comprar apenas o que realmente combina comigo' },
          { id: 's7-3', text: 'Me sentir confiante em qualquer ocasião' },
          { id: 's7-4', text: 'Ter um guarda-roupa funcional e estiloso' }
        ]
      }
    },

    // ==================== RESULTADO ====================
    {
      id: 'result',
      type: 'result',
      order: 19,
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
