import { test, expect } from "@playwright/test";

/**
 * Testes Unitários para Lógica de Cálculo de Resultados do Quiz
 * Testa o algoritmo de pontuação e determinação de estilo predominante
 * Usando Playwright Test Runner
 */

// Mock da estrutura de resposta
interface UserAnswer {
  optionId: string;
  value?: string;
  points?: number;
  stylePoints?: Record<string, number>;
}

// Mock da estrutura de resultado
interface StyleResult {
  category: string;
  score: number;
  percentage: number;
}

interface QuizResult {
  primaryStyle: StyleResult | null;
  secondaryStyles: StyleResult[];
  totalSelections: number;
  userName: string;
}

// Implementação da lógica de cálculo (extraída do useQuizLogic)
function calculateResults(
  answers: Record<string, { optionId: string; styleCategory: string }[]>,
  clickOrder: string[] = []
): QuizResult {
  const styleCounter: Record<string, number> = {
    Natural: 0,
    Clássico: 0,
    Contemporâneo: 0,
    Elegante: 0,
    Romântico: 0,
    Sexy: 0,
    Dramático: 0,
    Criativo: 0,
  };

  let totalSelections = 0;

  Object.entries(answers).forEach(([questionId, options]) => {
    options.forEach((option) => {
      if (
        option.styleCategory &&
        Object.prototype.hasOwnProperty.call(styleCounter, option.styleCategory)
      ) {
        styleCounter[option.styleCategory]++;
        totalSelections++;
      }
    });
  });

  const styleResults: StyleResult[] = Object.entries(styleCounter)
    .map(([category, score]) => ({
      category: category as string,
      score,
      percentage:
        totalSelections > 0 ? Math.round((score / totalSelections) * 100) : 0,
    }))
    .sort((a, b) => {
      // Desempate pelo clickOrder
      if (a.score === b.score && clickOrder.length > 0) {
        const indexA = clickOrder.indexOf(a.category);
        const indexB = clickOrder.indexOf(b.category);
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
      }
      return b.score - a.score;
    });

  const primaryStyle = styleResults[0] || null;
  const secondaryStyles = styleResults.slice(1);

  return {
    primaryStyle,
    secondaryStyles,
    totalSelections,
    userName: "Test User",
  };
}

test.describe("Lógica de Cálculo de Resultados do Quiz", () => {
  test.describe("Cenários Básicos de Pontuação", () => {
    test("deve calcular corretamente quando todas as respostas são do mesmo estilo", () => {
      const answers = {
        q1: [
          { optionId: "q1-natural", styleCategory: "Natural" },
          { optionId: "q1-natural-2", styleCategory: "Natural" },
          { optionId: "q1-natural-3", styleCategory: "Natural" },
        ],
        q2: [
          { optionId: "q2-natural", styleCategory: "Natural" },
          { optionId: "q2-natural-2", styleCategory: "Natural" },
          { optionId: "q2-natural-3", styleCategory: "Natural" },
        ],
      };

      const result = calculateResults(answers);

      expect(result.primaryStyle?.category).toBe("Natural");
      expect(result.primaryStyle?.score).toBe(6);
      expect(result.primaryStyle?.percentage).toBe(100);
      expect(result.totalSelections).toBe(6);
    });

    test("deve calcular corretamente com respostas distribuídas entre múltiplos estilos", () => {
      const answers = {
        q1: [
          { optionId: "q1-natural", styleCategory: "Natural" },
          { optionId: "q1-classico", styleCategory: "Clássico" },
          { optionId: "q1-romantico", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "q2-natural", styleCategory: "Natural" },
          { optionId: "q2-natural-2", styleCategory: "Natural" },
          { optionId: "q2-classico", styleCategory: "Clássico" },
        ],
      };

      const result = calculateResults(answers);

      expect(result.primaryStyle?.category).toBe("Natural");
      expect(result.primaryStyle?.score).toBe(3);
      expect(result.primaryStyle?.percentage).toBe(50); // 3/6 = 50%
      expect(result.totalSelections).toBe(6);

      // Verificar estilos secundários
      const classicoStyle = result.secondaryStyles.find(
        (s) => s.category === "Clássico"
      );
      expect(classicoStyle?.score).toBe(2);
      expect(classicoStyle?.percentage).toBe(33); // 2/6 ≈ 33%
    });

    test("deve calcular percentuais corretos para todas as categorias", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "Clássico" },
          { optionId: "opt3", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "opt4", styleCategory: "Elegante" },
          { optionId: "opt5", styleCategory: "Sexy" },
          { optionId: "opt6", styleCategory: "Dramático" },
        ],
        q3: [
          { optionId: "opt7", styleCategory: "Criativo" },
          { optionId: "opt8", styleCategory: "Contemporâneo" },
          { optionId: "opt9", styleCategory: "Natural" },
        ],
      };

      const result = calculateResults(answers);

      // Natural deve ter maior pontuação (2 pontos)
      expect(result.primaryStyle?.category).toBe("Natural");
      expect(result.primaryStyle?.score).toBe(2);

      // Todos os estilos devem somar 100%
      const totalPercentage = [
        result.primaryStyle,
        ...result.secondaryStyles,
      ].reduce((sum, style) => sum + (style?.percentage || 0), 0);

      // Devido a arredondamentos, pode variar em ±1%
      expect(totalPercentage).toBeGreaterThanOrEqual(99);
      expect(totalPercentage).toBeLessThanOrEqual(101);
    });
  });

  test.describe("Cenários de Desempate", () => {
    test("deve usar clickOrder para desempatar quando pontuações são iguais", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "Clássico" },
          { optionId: "opt3", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "opt4", styleCategory: "Natural" },
          { optionId: "opt5", styleCategory: "Clássico" },
          { optionId: "opt6", styleCategory: "Romântico" },
        ],
      };

      // Clássico foi clicado primeiro
      const clickOrder = ["Clássico", "Natural", "Romântico"];
      const result = calculateResults(answers, clickOrder);

      // Com clickOrder, Clássico deve vencer o desempate
      expect(result.primaryStyle?.category).toBe("Clássico");
      expect(result.primaryStyle?.score).toBe(2);
    });

    test("deve ordenar estilos secundários corretamente em caso de empate", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Elegante" },
          { optionId: "opt2", styleCategory: "Elegante" },
          { optionId: "opt3", styleCategory: "Elegante" },
        ],
        q2: [
          { optionId: "opt4", styleCategory: "Sexy" },
          { optionId: "opt5", styleCategory: "Dramático" },
          { optionId: "opt6", styleCategory: "Criativo" },
        ],
      };

      const clickOrder = ["Dramático", "Sexy", "Criativo"];
      const result = calculateResults(answers, clickOrder);

      // Elegante deve ser o primário (3 pontos)
      expect(result.primaryStyle?.category).toBe("Elegante");

      // Os três estilos empatados (1 ponto cada) devem seguir a ordem de clique
      expect(result.secondaryStyles[0].category).toBe("Dramático");
      expect(result.secondaryStyles[1].category).toBe("Sexy");
      expect(result.secondaryStyles[2].category).toBe("Criativo");
    });
  });

  test.describe("Cenários Realistas - 10 Questões com 3 Seleções", () => {
    test("deve processar um quiz completo com perfil Natural predominante", () => {
      // Simulando 10 questões, 3 seleções cada = 30 total
      const answers = {
        q1: [
          { optionId: "q1-1", styleCategory: "Natural" },
          { optionId: "q1-2", styleCategory: "Natural" },
          { optionId: "q1-3", styleCategory: "Contemporâneo" },
        ],
        q2: [
          { optionId: "q2-1", styleCategory: "Natural" },
          { optionId: "q2-2", styleCategory: "Clássico" },
          { optionId: "q2-3", styleCategory: "Natural" },
        ],
        q3: [
          { optionId: "q3-1", styleCategory: "Natural" },
          { optionId: "q3-2", styleCategory: "Natural" },
          { optionId: "q3-3", styleCategory: "Romântico" },
        ],
        q4: [
          { optionId: "q4-1", styleCategory: "Natural" },
          { optionId: "q4-2", styleCategory: "Contemporâneo" },
          { optionId: "q4-3", styleCategory: "Natural" },
        ],
        q5: [
          { optionId: "q5-1", styleCategory: "Natural" },
          { optionId: "q5-2", styleCategory: "Natural" },
          { optionId: "q5-3", styleCategory: "Elegante" },
        ],
        q6: [
          { optionId: "q6-1", styleCategory: "Natural" },
          { optionId: "q6-2", styleCategory: "Clássico" },
          { optionId: "q6-3", styleCategory: "Natural" },
        ],
        q7: [
          { optionId: "q7-1", styleCategory: "Natural" },
          { optionId: "q7-2", styleCategory: "Natural" },
          { optionId: "q7-3", styleCategory: "Contemporâneo" },
        ],
        q8: [
          { optionId: "q8-1", styleCategory: "Natural" },
          { optionId: "q8-2", styleCategory: "Natural" },
          { optionId: "q8-3", styleCategory: "Clássico" },
        ],
        q9: [
          { optionId: "q9-1", styleCategory: "Natural" },
          { optionId: "q9-2", styleCategory: "Natural" },
          { optionId: "q9-3", styleCategory: "Romântico" },
        ],
        q10: [
          { optionId: "q10-1", styleCategory: "Natural" },
          { optionId: "q10-2", styleCategory: "Contemporâneo" },
          { optionId: "q10-3", styleCategory: "Natural" },
        ],
      };

      const result = calculateResults(answers);

      // Natural deveria ter aproximadamente 20 pontos de 30
      expect(result.primaryStyle?.category).toBe("Natural");
      expect(result.primaryStyle?.score).toBeGreaterThanOrEqual(18);
      expect(result.primaryStyle?.percentage).toBeGreaterThanOrEqual(60);
      expect(result.totalSelections).toBe(30);

      // Verificar que Contemporâneo é um dos secundários
      const contemporaneoStyle = result.secondaryStyles.find(
        (s) => s.category === "Contemporâneo"
      );
      expect(contemporaneoStyle).toBeDefined();
      expect(contemporaneoStyle?.score).toBeGreaterThan(0);
    });

    test("deve processar perfil equilibrado com múltiplos estilos", () => {
      const answers = {
        q1: [
          { optionId: "q1-1", styleCategory: "Elegante" },
          { optionId: "q1-2", styleCategory: "Clássico" },
          { optionId: "q1-3", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "q2-1", styleCategory: "Elegante" },
          { optionId: "q2-2", styleCategory: "Romântico" },
          { optionId: "q2-3", styleCategory: "Clássico" },
        ],
        q3: [
          { optionId: "q3-1", styleCategory: "Elegante" },
          { optionId: "q3-2", styleCategory: "Romântico" },
          { optionId: "q3-3", styleCategory: "Elegante" },
        ],
        q4: [
          { optionId: "q4-1", styleCategory: "Clássico" },
          { optionId: "q4-2", styleCategory: "Elegante" },
          { optionId: "q4-3", styleCategory: "Romântico" },
        ],
        q5: [
          { optionId: "q5-1", styleCategory: "Elegante" },
          { optionId: "q5-2", styleCategory: "Clássico" },
          { optionId: "q5-3", styleCategory: "Romântico" },
        ],
        q6: [
          { optionId: "q6-1", styleCategory: "Elegante" },
          { optionId: "q6-2", styleCategory: "Romântico" },
          { optionId: "q6-3", styleCategory: "Clássico" },
        ],
        q7: [
          { optionId: "q7-1", styleCategory: "Elegante" },
          { optionId: "q7-2", styleCategory: "Clássico" },
          { optionId: "q7-3", styleCategory: "Romântico" },
        ],
        q8: [
          { optionId: "q8-1", styleCategory: "Elegante" },
          { optionId: "q8-2", styleCategory: "Romântico" },
          { optionId: "q8-3", styleCategory: "Elegante" },
        ],
        q9: [
          { optionId: "q9-1", styleCategory: "Clássico" },
          { optionId: "q9-2", styleCategory: "Romântico" },
          { optionId: "q9-3", styleCategory: "Elegante" },
        ],
        q10: [
          { optionId: "q10-1", styleCategory: "Elegante" },
          { optionId: "q10-2", styleCategory: "Clássico" },
          { optionId: "q10-3", styleCategory: "Romântico" },
        ],
      };

      const result = calculateResults(answers);

      // Elegante deve ser predominante
      expect(result.primaryStyle?.category).toBe("Elegante");
      expect(result.primaryStyle?.score).toBe(12);
      expect(result.primaryStyle?.percentage).toBe(40); // 12/30

      // Romântico e Clássico devem estar próximos
      const romanticoStyle = result.secondaryStyles.find(
        (s) => s.category === "Romântico"
      );
      const classicoStyle = result.secondaryStyles.find(
        (s) => s.category === "Clássico"
      );

      expect(romanticoStyle?.score).toBe(9);
      expect(classicoStyle?.score).toBe(9);
      expect(romanticoStyle?.percentage).toBe(30);
      expect(classicoStyle?.percentage).toBe(30);
    });
  });

  test.describe("Validações e Casos Extremos", () => {
    test("deve retornar resultado válido mesmo sem respostas", () => {
      const answers = {};
      const result = calculateResults(answers);

      expect(result.totalSelections).toBe(0);
      expect(result.primaryStyle).toBeDefined();
      expect(result.primaryStyle?.score).toBe(0);
      expect(result.primaryStyle?.percentage).toBe(0);
    });

    test("deve lidar com categorias inválidas ou ausentes", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "InvalidStyle" },
          { optionId: "opt3", styleCategory: "" },
        ],
      };

      const result = calculateResults(answers);

      // Apenas Natural deve ser contabilizado
      expect(result.totalSelections).toBe(1);
      expect(result.primaryStyle?.category).toBe("Natural");
      expect(result.primaryStyle?.score).toBe(1);
    });

    test("deve garantir que todos os 8 estilos estejam presentes no resultado", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "Natural" },
          { optionId: "opt3", styleCategory: "Natural" },
        ],
      };

      const result = calculateResults(answers);

      const allStyles = [result.primaryStyle, ...result.secondaryStyles];
      const styleCategories = allStyles.map((s) => s?.category);

      expect(styleCategories).toContain("Natural");
      expect(styleCategories).toContain("Clássico");
      expect(styleCategories).toContain("Contemporâneo");
      expect(styleCategories).toContain("Elegante");
      expect(styleCategories).toContain("Romântico");
      expect(styleCategories).toContain("Sexy");
      expect(styleCategories).toContain("Dramático");
      expect(styleCategories).toContain("Criativo");
    });

    test("deve calcular corretamente com apenas 1 questão respondida", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Romântico" },
          { optionId: "opt2", styleCategory: "Elegante" },
          { optionId: "opt3", styleCategory: "Sexy" },
        ],
      };

      const result = calculateResults(answers);

      expect(result.totalSelections).toBe(3);
      // Qualquer um dos três pode ser primário (depende da ordenação)
      expect(["Romântico", "Elegante", "Sexy"]).toContain(
        result.primaryStyle?.category
      );
      expect(result.primaryStyle?.score).toBe(1);
      expect(result.primaryStyle?.percentage).toBe(33); // 1/3 ≈ 33%
    });
  });

  test.describe("Arredondamento de Percentuais", () => {
    test("deve arredondar percentuais corretamente", () => {
      const answers = {
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "Clássico" },
          { optionId: "opt3", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "opt4", styleCategory: "Natural" },
          { optionId: "opt5", styleCategory: "Natural" },
          { optionId: "opt6", styleCategory: "Clássico" },
        ],
        q3: [
          { optionId: "opt7", styleCategory: "Natural" },
          { optionId: "opt8", styleCategory: "Natural" },
          { optionId: "opt9", styleCategory: "Natural" },
        ],
      };

      const result = calculateResults(answers);

      // Natural: 6/9 = 66.666... deve arredondar para 67%
      expect(result.primaryStyle?.category).toBe("Natural");
      expect(result.primaryStyle?.percentage).toBe(67);

      // Clássico: 2/9 = 22.222... deve arredondar para 22%
      const classicoStyle = result.secondaryStyles.find(
        (s) => s.category === "Clássico"
      );
      expect(classicoStyle?.percentage).toBe(22);

      // Romântico: 1/9 = 11.111... deve arredondar para 11%
      const romanticoStyle = result.secondaryStyles.find(
        (s) => s.category === "Romântico"
      );
      expect(romanticoStyle?.percentage).toBe(11);
    });
  });
});
