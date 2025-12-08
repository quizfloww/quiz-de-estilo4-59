import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateDynamicResults,
  mapToLegacyResult,
  QuizResult,
  StyleResult,
} from "@/utils/dynamicQuizCalculator";
import { defaultQuizFlowConfig } from "@/data/quizFlowConfig";

/**
 * Testes para o Fluxo Completo do Quiz de Estilo Pessoal
 *
 * Este arquivo testa:
 * 1. Estrutura do quizFlowConfig (21 etapas)
 * 2. Lógica de cálculo de resultados
 * 3. Mapeamento para formato legacy
 * 4. Cenários de empate
 * 5. Distribuição de percentuais
 */

// ==================== TIPOS E INTERFACES ====================

interface MockOption {
  id: string;
  style_category: string;
  points?: number;
}

interface MockStyleCategory {
  id: string;
  name: string;
  description?: string;
}

// ==================== DADOS DE TESTE ====================

const STYLE_CATEGORIES: MockStyleCategory[] = [
  { id: "Natural", name: "Natural", description: "Informal, espontânea" },
  { id: "Clássico", name: "Clássico", description: "Conservadora, séria" },
  {
    id: "Contemporâneo",
    name: "Contemporâneo",
    description: "Informada, ativa",
  },
  { id: "Elegante", name: "Elegante", description: "Exigente, sofisticada" },
  { id: "Romântico", name: "Romântico", description: "Feminina, meiga" },
  { id: "Sexy", name: "Sexy", description: "Glamorosa, vaidosa" },
  { id: "Dramático", name: "Dramático", description: "Cosmopolita, moderna" },
  { id: "Criativo", name: "Criativo", description: "Exótica, aventureira" },
];

// Opções extraídas do quizFlowConfig para Q1
const Q1_OPTIONS: MockOption[] = [
  { id: "q1-natural", style_category: "Natural", points: 1 },
  { id: "q1-classico", style_category: "Clássico", points: 1 },
  { id: "q1-contemporaneo", style_category: "Contemporâneo", points: 1 },
  { id: "q1-elegante", style_category: "Elegante", points: 1 },
  { id: "q1-romantico", style_category: "Romântico", points: 1 },
  { id: "q1-sexy", style_category: "Sexy", points: 1 },
  { id: "q1-dramatico", style_category: "Dramático", points: 1 },
  { id: "q1-criativo", style_category: "Criativo", points: 1 },
];

// Todas as opções de todas as questões (Q1-Q10)
function generateAllOptions(): MockOption[] {
  const options: MockOption[] = [];
  const categories = [
    "natural",
    "classico",
    "contemporaneo",
    "elegante",
    "romantico",
    "sexy",
    "dramatico",
    "criativo",
  ];
  const categoryNames = [
    "Natural",
    "Clássico",
    "Contemporâneo",
    "Elegante",
    "Romântico",
    "Sexy",
    "Dramático",
    "Criativo",
  ];

  for (let q = 1; q <= 10; q++) {
    categories.forEach((cat, idx) => {
      options.push({
        id: `q${q}-${cat}`,
        style_category: categoryNames[idx],
        points: 1,
      });
    });
  }

  return options;
}

const ALL_OPTIONS = generateAllOptions();

// ==================== TESTES DA ESTRUTURA DO CONFIG ====================

describe("QuizFlowConfig - Estrutura", () => {
  it("deve ter 21 etapas no total", () => {
    expect(defaultQuizFlowConfig.stages).toHaveLength(21);
  });

  it("deve ter 1 etapa de introdução", () => {
    const introStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "intro"
    );
    expect(introStages).toHaveLength(1);
    expect(introStages[0].id).toBe("intro");
    expect(introStages[0].order).toBe(0);
  });

  it("deve ter 10 etapas de questões", () => {
    const questionStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "question"
    );
    expect(questionStages).toHaveLength(10);

    // Verificar ordem das questões
    questionStages.forEach((stage, idx) => {
      expect(stage.id).toBe(`q${idx + 1}`);
      expect(stage.order).toBe(idx + 1);
    });
  });

  it("deve ter 2 etapas de transição", () => {
    const transitionStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "transition"
    );
    expect(transitionStages).toHaveLength(2);
  });

  it("deve ter 7 etapas estratégicas", () => {
    const strategicStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "strategic"
    );
    expect(strategicStages).toHaveLength(7);

    // Verificar IDs das estratégicas
    strategicStages.forEach((stage, idx) => {
      expect(stage.id).toBe(`strategic-${idx + 1}`);
    });
  });

  it("deve ter 1 etapa de resultado", () => {
    const resultStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "result"
    );
    expect(resultStages).toHaveLength(1);
    expect(resultStages[0].id).toBe("result");
    expect(resultStages[0].order).toBe(20);
  });

  it("deve ter 8 categorias de estilo definidas", () => {
    expect(defaultQuizFlowConfig.styleCategories).toHaveLength(8);

    const expectedCategories = [
      "Natural",
      "Clássico",
      "Contemporâneo",
      "Elegante",
      "Romântico",
      "Sexy",
      "Dramático",
      "Criativo",
    ];

    defaultQuizFlowConfig.styleCategories.forEach((cat, idx) => {
      expect(cat.id).toBe(expectedCategories[idx]);
      expect(cat.name).toBe(expectedCategories[idx]);
    });
  });

  it("cada questão deve ter 8 opções (uma para cada estilo)", () => {
    const questionStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "question"
    );

    questionStages.forEach((stage) => {
      const options = stage.config.options;
      expect(options).toHaveLength(8);

      // Verificar que cada estilo está representado
      const categories = options.map((o: any) => o.styleCategory);
      expect(categories).toContain("Natural");
      expect(categories).toContain("Clássico");
      expect(categories).toContain("Contemporâneo");
      expect(categories).toContain("Elegante");
      expect(categories).toContain("Romântico");
      expect(categories).toContain("Sexy");
      expect(categories).toContain("Dramático");
      expect(categories).toContain("Criativo");
    });
  });

  it("cada questão deve permitir multiSelect de 3 opções", () => {
    const questionStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "question"
    );

    questionStages.forEach((stage) => {
      expect(stage.config.multiSelect).toBe(3);
    });
  });

  it("etapa de resultado deve ter blocos modulares", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );
    expect(resultStage?.config.blocks).toBeDefined();
    expect(Array.isArray(resultStage?.config.blocks)).toBe(true);
    expect(resultStage?.config.blocks.length).toBeGreaterThan(0);
  });
});

// ==================== TESTES DE CÁLCULO DE RESULTADOS ====================

describe("calculateDynamicResults - Cálculos", () => {
  it("deve retornar estilo predominante quando todas respostas são do mesmo estilo", () => {
    // Usuário seleciona apenas opções "Natural" em todas as questões
    const answers: Record<string, string[]> = {
      q1: ["q1-natural"],
      q2: ["q2-natural"],
      q3: ["q3-natural"],
      q4: ["q4-natural"],
      q5: ["q5-natural"],
      q6: ["q6-natural"],
      q7: ["q7-natural"],
      q8: ["q8-natural"],
      q9: ["q9-natural"],
      q10: ["q10-natural"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.primaryStyle.categoryId).toBe("Natural");
    expect(result.primaryStyle.points).toBe(10);
    expect(result.primaryStyle.percentage).toBe(100);
    expect(result.totalPoints).toBe(10);
  });

  it("deve calcular corretamente com distribuição uniforme (3 seleções por questão)", () => {
    // Usuário seleciona 3 opções por questão: Natural, Clássico, Elegante
    const answers: Record<string, string[]> = {};
    for (let q = 1; q <= 10; q++) {
      answers[`q${q}`] = [`q${q}-natural`, `q${q}-classico`, `q${q}-elegante`];
    }

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(30); // 3 opções x 10 questões
    expect(result.primaryStyle.points).toBe(10); // Cada estilo tem 10 pontos

    // Todos os 3 estilos têm a mesma pontuação
    const topThree = result.allStyles.slice(0, 3);
    topThree.forEach((style) => {
      expect(style.points).toBe(10);
      expect(style.percentage).toBe(33); // 10/30 ≈ 33%
    });
  });

  it("deve ordenar resultados por pontuação decrescente", () => {
    // Distribuição desigual: Natural(5), Clássico(3), Elegante(2)
    const answers: Record<string, string[]> = {
      q1: ["q1-natural", "q1-classico", "q1-elegante"],
      q2: ["q2-natural", "q2-classico", "q2-elegante"],
      q3: ["q3-natural", "q3-classico", "q3-natural"], // 2x Natural
      q4: ["q4-natural", "q4-natural", "q4-natural"], // 3x Natural (só conta 1 por id único)
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    // Verificar ordenação
    for (let i = 0; i < result.allStyles.length - 1; i++) {
      expect(result.allStyles[i].points).toBeGreaterThanOrEqual(
        result.allStyles[i + 1].points
      );
    }
  });

  it("deve calcular percentuais corretamente", () => {
    // 2 Natural, 1 Clássico = 3 total
    const answers: Record<string, string[]> = {
      q1: ["q1-natural", "q1-natural", "q1-classico"], // Natural conta só 1 vez
    };

    // Corrigir: cada id é único, então precisa usar ids diferentes
    const customAnswers: Record<string, string[]> = {
      q1: ["q1-natural"],
      q2: ["q2-natural"],
      q3: ["q3-classico"],
    };

    const result = calculateDynamicResults(
      customAnswers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(3);
    expect(result.primaryStyle.categoryId).toBe("Natural");
    expect(result.primaryStyle.points).toBe(2);
    expect(result.primaryStyle.percentage).toBe(67); // 2/3 ≈ 67%

    const classico = result.allStyles.find((s) => s.categoryId === "Clássico");
    expect(classico?.points).toBe(1);
    expect(classico?.percentage).toBe(33); // 1/3 ≈ 33%
  });

  it("deve retornar estilos secundários corretamente", () => {
    const answers: Record<string, string[]> = {
      q1: ["q1-natural"],
      q2: ["q2-natural"],
      q3: ["q3-natural"],
      q4: ["q4-classico"],
      q5: ["q5-classico"],
      q6: ["q6-elegante"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.primaryStyle.categoryId).toBe("Natural");
    expect(result.primaryStyle.points).toBe(3);

    expect(result.secondaryStyles).toHaveLength(2);
    expect(result.secondaryStyles[0].categoryId).toBe("Clássico");
    expect(result.secondaryStyles[0].points).toBe(2);
    expect(result.secondaryStyles[1].categoryId).toBe("Elegante");
    expect(result.secondaryStyles[1].points).toBe(1);
  });

  it("deve lidar com respostas vazias", () => {
    const answers: Record<string, string[]> = {};

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(0);
    expect(result.primaryStyle.points).toBe(0);
    expect(result.primaryStyle.percentage).toBe(0);
  });

  it("deve ignorar opções não encontradas", () => {
    const answers: Record<string, string[]> = {
      q1: ["q1-natural", "opcao-inexistente"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(1);
    expect(result.primaryStyle.categoryId).toBe("Natural");
  });
});

// ==================== TESTES DE MAPEAMENTO LEGACY ====================

describe("mapToLegacyResult - Formato Legacy", () => {
  it("deve mapear resultado para formato esperado pelo ResultPage", () => {
    const quizResult: QuizResult = {
      primaryStyle: {
        categoryId: "Natural",
        categoryName: "Natural",
        points: 10,
        percentage: 50,
      },
      secondaryStyles: [
        {
          categoryId: "Clássico",
          categoryName: "Clássico",
          points: 6,
          percentage: 30,
        },
        {
          categoryId: "Elegante",
          categoryName: "Elegante",
          points: 4,
          percentage: 20,
        },
      ],
      allStyles: [],
      totalPoints: 20,
    };

    const legacy = mapToLegacyResult(quizResult, STYLE_CATEGORIES);

    expect(legacy.primaryStyle).toEqual({
      category: "Natural",
      score: 10,
      percentage: 50,
    });

    expect(legacy.secondaryStyles).toHaveLength(2);
    expect(legacy.secondaryStyles[0]).toEqual({
      category: "Clássico",
      score: 6,
      percentage: 30,
    });
  });

  it("deve mapear IDs lowercase para nomes com acento", () => {
    const quizResult: QuizResult = {
      primaryStyle: {
        categoryId: "romantico",
        categoryName: "romantico",
        points: 5,
        percentage: 100,
      },
      secondaryStyles: [],
      allStyles: [],
      totalPoints: 5,
    };

    const legacy = mapToLegacyResult(quizResult, STYLE_CATEGORIES);

    expect(legacy.primaryStyle.category).toBe("Romântico");
  });

  it("deve manter compatibilidade com secondaryStyle singular", () => {
    const quizResult: QuizResult = {
      primaryStyle: {
        categoryId: "Natural",
        categoryName: "Natural",
        points: 10,
        percentage: 60,
      },
      secondaryStyles: [
        {
          categoryId: "Clássico",
          categoryName: "Clássico",
          points: 5,
          percentage: 30,
        },
      ],
      allStyles: [],
      totalPoints: 15,
    };

    const legacy = mapToLegacyResult(quizResult, STYLE_CATEGORIES);

    expect(legacy.secondaryStyle).toEqual({
      category: "Clássico",
      score: 5,
      percentage: 30,
    });
  });

  it("deve gerar scores e percentages para todos os estilos", () => {
    const quizResult: QuizResult = {
      primaryStyle: {
        categoryId: "Natural",
        categoryName: "Natural",
        points: 5,
        percentage: 50,
      },
      secondaryStyles: [],
      allStyles: [
        {
          categoryId: "Natural",
          categoryName: "Natural",
          points: 5,
          percentage: 50,
        },
        {
          categoryId: "Clássico",
          categoryName: "Clássico",
          points: 3,
          percentage: 30,
        },
        {
          categoryId: "Elegante",
          categoryName: "Elegante",
          points: 2,
          percentage: 20,
        },
      ],
      totalPoints: 10,
    };

    const legacy = mapToLegacyResult(quizResult, STYLE_CATEGORIES);

    expect(legacy.scores).toEqual({
      Natural: 5,
      Clássico: 3,
      Elegante: 2,
    });

    expect(legacy.percentages).toEqual({
      Natural: 50,
      Clássico: 30,
      Elegante: 20,
    });
  });
});

// ==================== TESTES DE CENÁRIOS REAIS ====================

describe("Cenários Reais de Uso", () => {
  it("deve calcular resultado típico: usuário seleciona 3 opções por questão", () => {
    // Simula usuário com tendência Natural/Clássico
    const answers: Record<string, string[]> = {
      q1: ["q1-natural", "q1-classico", "q1-elegante"],
      q2: ["q2-natural", "q2-classico", "q2-contemporaneo"],
      q3: ["q3-natural", "q3-classico", "q3-romantico"],
      q4: ["q4-natural", "q4-classico", "q4-elegante"],
      q5: ["q5-natural", "q5-elegante", "q5-classico"],
      q6: ["q6-classico", "q6-natural", "q6-elegante"],
      q7: ["q7-natural", "q7-classico", "q7-contemporaneo"],
      q8: ["q8-classico", "q8-natural", "q8-elegante"],
      q9: ["q9-natural", "q9-classico", "q9-romantico"],
      q10: ["q10-classico", "q10-natural", "q10-elegante"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(30);

    // Natural e Clássico devem ser os mais altos
    expect(["Natural", "Clássico"]).toContain(result.primaryStyle.categoryId);
    expect(result.primaryStyle.points).toBe(10);

    // Elegante deve estar nos secundários
    const elegante = result.allStyles.find((s) => s.categoryId === "Elegante");
    expect(elegante?.points).toBeGreaterThan(0);
  });

  it("deve lidar com perfil Dramático/Criativo dominante", () => {
    const answers: Record<string, string[]> = {
      q1: ["q1-dramatico", "q1-criativo", "q1-sexy"],
      q2: ["q2-dramatico", "q2-criativo", "q2-contemporaneo"],
      q3: ["q3-dramatico", "q3-criativo", "q3-sexy"],
      q4: ["q4-criativo", "q4-dramatico", "q4-contemporaneo"],
      q5: ["q5-dramatico", "q5-criativo", "q5-sexy"],
      q6: ["q6-criativo", "q6-dramatico", "q6-sexy"],
      q7: ["q7-dramatico", "q7-criativo", "q7-contemporaneo"],
      q8: ["q8-criativo", "q8-dramatico", "q8-sexy"],
      q9: ["q9-dramatico", "q9-criativo", "q9-contemporaneo"],
      q10: ["q10-criativo", "q10-dramatico", "q10-sexy"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(["Dramático", "Criativo"]).toContain(result.primaryStyle.categoryId);
    expect(result.primaryStyle.points).toBe(10);

    // Sexy e Contemporâneo devem estar presentes
    const sexy = result.allStyles.find((s) => s.categoryId === "Sexy");
    expect(sexy?.points).toBeGreaterThan(0);
  });

  it("deve calcular corretamente perfil misto equilibrado", () => {
    // Usuário com 4 estilos equilibrados
    const answers: Record<string, string[]> = {
      q1: ["q1-natural", "q1-romantico", "q1-elegante"],
      q2: ["q2-classico", "q2-natural", "q2-romantico"],
      q3: ["q3-elegante", "q3-classico", "q3-natural"],
      q4: ["q4-romantico", "q4-elegante", "q4-classico"],
      q5: ["q5-natural", "q5-romantico", "q5-elegante"],
      q6: ["q6-classico", "q6-natural", "q6-romantico"],
      q7: ["q7-elegante", "q7-classico", "q7-natural"],
      q8: ["q8-romantico", "q8-elegante", "q8-classico"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    // Verificar que os 4 estilos principais têm pontuação similar
    const topFour = result.allStyles.slice(0, 4);
    const minPoints = Math.min(...topFour.map((s) => s.points));
    const maxPoints = Math.max(...topFour.map((s) => s.points));

    // Diferença máxima de 2 pontos entre os 4 principais
    expect(maxPoints - minPoints).toBeLessThanOrEqual(2);
  });
});

// ==================== TESTES DE EDGE CASES ====================

describe("Edge Cases", () => {
  it("deve lidar com apenas 1 resposta", () => {
    const answers: Record<string, string[]> = {
      q1: ["q1-sexy"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(1);
    expect(result.primaryStyle.categoryId).toBe("Sexy");
    expect(result.primaryStyle.percentage).toBe(100);
  });

  it("deve lidar com todas as opções selecionadas (máximo)", () => {
    const answers: Record<string, string[]> = {};
    for (let q = 1; q <= 10; q++) {
      answers[`q${q}`] = [
        `q${q}-natural`,
        `q${q}-classico`,
        `q${q}-contemporaneo`,
        `q${q}-elegante`,
        `q${q}-romantico`,
        `q${q}-sexy`,
        `q${q}-dramatico`,
        `q${q}-criativo`,
      ];
    }

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(80); // 8 estilos x 10 questões

    // Todos os estilos devem ter 10 pontos
    result.allStyles.forEach((style) => {
      expect(style.points).toBe(10);
      expect(style.percentage).toBe(13); // 10/80 ≈ 12.5% → 13%
    });
  });

  it("deve manter categoryName mesmo com categoryId diferente", () => {
    const customCategories: MockStyleCategory[] = [
      { id: "nat", name: "Natural" },
    ];

    const customOptions: MockOption[] = [
      { id: "q1-nat", style_category: "nat", points: 1 },
    ];

    const answers: Record<string, string[]> = {
      q1: ["q1-nat"],
    };

    const result = calculateDynamicResults(
      answers,
      customOptions,
      customCategories
    );

    expect(result.primaryStyle.categoryId).toBe("nat");
    expect(result.primaryStyle.categoryName).toBe("Natural");
  });

  it("deve usar pontuação customizada quando definida", () => {
    const customOptions: MockOption[] = [
      { id: "q1-natural", style_category: "Natural", points: 5 },
      { id: "q2-classico", style_category: "Clássico", points: 3 },
    ];

    const answers: Record<string, string[]> = {
      q1: ["q1-natural"],
      q2: ["q2-classico"],
    };

    const result = calculateDynamicResults(
      answers,
      customOptions,
      STYLE_CATEGORIES
    );

    expect(result.totalPoints).toBe(8);
    expect(result.primaryStyle.categoryId).toBe("Natural");
    expect(result.primaryStyle.points).toBe(5);

    const classico = result.allStyles.find((s) => s.categoryId === "Clássico");
    expect(classico?.points).toBe(3);
  });
});

// ==================== TESTES DE INTEGRAÇÃO COM CONFIG ====================

describe("Integração com quizFlowConfig", () => {
  it("deve ter configuração de resultado válida", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );

    expect(resultStage).toBeDefined();
    expect(resultStage?.config.ctaUrl).toBeDefined();
    expect(resultStage?.config.finalPrice).toBe(39);
    expect(resultStage?.config.guaranteeDays).toBe(7);
  });

  it("deve ter configurações globais definidas", () => {
    expect(defaultQuizFlowConfig.globalConfig.primaryColor).toBe("#B89B7A");
    expect(defaultQuizFlowConfig.globalConfig.secondaryColor).toBe("#432818");
    expect(defaultQuizFlowConfig.globalConfig.fontFamily).toBe(
      "Playfair Display"
    );
  });

  it("questões estratégicas devem ter multiSelect 1", () => {
    const strategicStages = defaultQuizFlowConfig.stages.filter(
      (s) => s.type === "strategic"
    );

    strategicStages.forEach((stage) => {
      expect(stage.config.multiSelect).toBe(1);
    });
  });

  it("todas as etapas devem estar habilitadas", () => {
    defaultQuizFlowConfig.stages.forEach((stage) => {
      expect(stage.isEnabled).toBe(true);
    });
  });

  it("ordem das etapas deve ser sequencial (0-20)", () => {
    const orders = defaultQuizFlowConfig.stages
      .map((s) => s.order)
      .sort((a, b) => a - b);

    for (let i = 0; i <= 20; i++) {
      expect(orders[i]).toBe(i);
    }
  });
});

// ==================== TESTES DE PERFORMANCE ====================

describe("Performance", () => {
  it("deve calcular resultado em menos de 50ms para quiz completo", () => {
    const answers: Record<string, string[]> = {};
    for (let q = 1; q <= 10; q++) {
      answers[`q${q}`] = [`q${q}-natural`, `q${q}-classico`, `q${q}-elegante`];
    }

    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      calculateDynamicResults(answers, ALL_OPTIONS, STYLE_CATEGORIES);
    }

    const end = performance.now();
    const avgTime = (end - start) / 100;

    expect(avgTime).toBeLessThan(50);
  });
});

// ============================================================================
// TESTES DE CONEXÃO EMOCIONAL E PERSONALIZAÇÃO
// ============================================================================

describe("Descrições de Estilo - Conexão Emocional", () => {
  it("cada categoria deve ter descrição que começa com 'Você'", () => {
    defaultQuizFlowConfig.styleCategories.forEach((cat) => {
      expect(cat.description).toBeDefined();
      expect(cat.description.startsWith("Você")).toBe(true);
    });
  });

  it("cada categoria deve ter descrição com mais de 50 caracteres", () => {
    defaultQuizFlowConfig.styleCategories.forEach((cat) => {
      expect(cat.description.length).toBeGreaterThan(50);
    });
  });

  it("cada categoria deve ter guideImage definido", () => {
    defaultQuizFlowConfig.styleCategories.forEach((cat) => {
      expect(cat.guideImage).toBeDefined();
      expect(cat.guideImage).toContain("cloudinary");
      expect(cat.guideImage).toContain("GUIA");
    });
  });
});

describe("Blocos de Resultado - Personalização", () => {
  it("etapa de resultado deve ter blocos definidos", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );
    expect(resultStage?.config.blocks).toBeDefined();
    expect(Array.isArray(resultStage?.config.blocks)).toBe(true);
    expect(resultStage?.config.blocks.length).toBeGreaterThan(0);
  });

  it("blocos devem incluir placeholder {{userName}}", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );
    const blocks = resultStage?.config.blocks || [];

    // Procurar bloco de heading com userName
    const headingBlocks = blocks.filter(
      (b: any) => b.type === "heading" || b.type === "personalizedHook"
    );

    const hasUserNamePlaceholder = blocks.some((b: any) => {
      const text = b.content?.text || "";
      const title = b.content?.title || "";
      return text.includes("{{userName}}") || title.includes("{{userName}}");
    });

    expect(hasUserNamePlaceholder).toBe(true);
  });

  it("blocos devem incluir bloco styleResult", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );
    const blocks = resultStage?.config.blocks || [];

    const styleResultBlock = blocks.find((b: any) => b.type === "styleResult");
    expect(styleResultBlock).toBeDefined();
    expect(styleResultBlock.content.showDescription).toBe(true);
    expect(styleResultBlock.content.showPercentage).toBe(true);
  });

  it("blocos devem incluir bloco secondaryStyles", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );
    const blocks = resultStage?.config.blocks || [];

    const secondaryStylesBlock = blocks.find(
      (b: any) => b.type === "secondaryStyles"
    );
    expect(secondaryStylesBlock).toBeDefined();
    expect(secondaryStylesBlock.content.showPercentages).toBe(true);
    expect(secondaryStylesBlock.content.maxStyles).toBe(3);
  });

  it("blocos devem incluir bloco styleGuide", () => {
    const resultStage = defaultQuizFlowConfig.stages.find(
      (s) => s.type === "result"
    );
    const blocks = resultStage?.config.blocks || [];

    const styleGuideBlock = blocks.find((b: any) => b.type === "styleGuide");
    expect(styleGuideBlock).toBeDefined();
  });
});

describe("Cálculo de Estilos Secundários", () => {
  it("deve retornar estilos secundários ordenados por porcentagem", () => {
    // Simular respostas com distribuição variada
    const answers: Record<string, string[]> = {
      "1": ["1a", "1b", "1c"], // Natural, Clássico, Contemporâneo
      "3": ["3a", "3d", "3e"], // Natural, Elegante, Romântico
      "2": ["2a", "2b", "2d"], // Natural, Clássico, Elegante
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    // Verificar que temos estilos secundários
    expect(result.secondaryStyles.length).toBeGreaterThan(0);

    // Verificar que estão ordenados (maior porcentagem primeiro)
    for (let i = 0; i < result.secondaryStyles.length - 1; i++) {
      expect(result.secondaryStyles[i].percentage).toBeGreaterThanOrEqual(
        result.secondaryStyles[i + 1].percentage
      );
    }
  });

  it("estilos secundários devem ter nome e porcentagem", () => {
    const answers: Record<string, string[]> = {
      "1": ["1a", "1b", "1c"],
      "3": ["3a", "3d", "3e"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    result.secondaryStyles.forEach((style) => {
      expect(style.category).toBeDefined();
      expect(typeof style.category).toBe("string");
      expect(style.category.length).toBeGreaterThan(0);

      expect(style.percentage).toBeDefined();
      expect(typeof style.percentage).toBe("number");
      expect(style.percentage).toBeGreaterThanOrEqual(0);
      expect(style.percentage).toBeLessThanOrEqual(100);
    });
  });

  it("estilo primário não deve aparecer nos estilos secundários", () => {
    const answers: Record<string, string[]> = {
      "1": ["1a", "1a", "1a"], // Muitos votos para Natural
      "3": ["3a", "3b", "3c"],
    };

    const result = calculateDynamicResults(
      answers,
      ALL_OPTIONS,
      STYLE_CATEGORIES
    );

    const primaryCategory = result.primaryStyle?.category;
    const secondaryCategories = result.secondaryStyles.map((s) => s.category);

    expect(secondaryCategories).not.toContain(primaryCategory);
  });
});
