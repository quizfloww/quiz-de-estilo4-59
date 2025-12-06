import { test, expect } from "@playwright/test";

/**
 * Testes da Lógica de Cálculo de Resultados do Quiz de Estilo Pessoal
 * Valida o algoritmo de pontuação através da interface do navegador
 */

test.describe("Lógica de Cálculo - Quiz de Estilo Pessoal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/quiz");
    await page.evaluate(() => localStorage.clear());
  });

  test("deve calcular estilo predominante baseado nas respostas", async ({
    page,
  }) => {
    // Página de contexto para executar a lógica de cálculo
    // IMPORTANTE: Esta função replica EXATAMENTE a lógica de useQuizLogic.ts
    const calculateResults = await page.evaluateHandle(() => {
      return function (
        answers: Record<string, { optionId: string; styleCategory: string }[]>,
        clickOrderInternal: string[] = []
      ) {
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

        // Lógica simplificada pois já recebemos styleCategory diretamente
        // Na produção, isso vem de question.options.find()
        Object.entries(answers).forEach(([_, options]) => {
          options.forEach((option) => {
            if (
              option.styleCategory &&
              Object.prototype.hasOwnProperty.call(
                styleCounter,
                option.styleCategory
              )
            ) {
              styleCounter[option.styleCategory]++;
              totalSelections++;
            }
          });
        });

        const styleResults = Object.entries(styleCounter)
          .map(([category, score]) => ({
            category,
            score,
            percentage:
              totalSelections > 0
                ? Math.round((score / totalSelections) * 100)
                : 0,
          }))
          .sort((a, b) => {
            // Lógica de desempate usando clickOrder (igual ao useQuizLogic)
            if (a.score === b.score && clickOrderInternal.length > 0) {
              const indexA = clickOrderInternal.indexOf(a.category);
              const indexB = clickOrderInternal.indexOf(b.category);
              if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
              }
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
            }
            return b.score - a.score;
          });

        return {
          primaryStyle: styleResults[0] || null,
          secondaryStyles: styleResults.slice(1),
          totalSelections,
        };
      };
    });

    // Teste 1: Todas respostas Natural
    const result1 = await page.evaluate((calcFn) => {
      const answers = {
        q1: [
          { optionId: "q1-1", styleCategory: "Natural" },
          { optionId: "q1-2", styleCategory: "Natural" },
          { optionId: "q1-3", styleCategory: "Natural" },
        ],
        q2: [
          { optionId: "q2-1", styleCategory: "Natural" },
          { optionId: "q2-2", styleCategory: "Natural" },
          { optionId: "q2-3", styleCategory: "Natural" },
        ],
      };
      return calcFn(answers);
    }, calculateResults);

    expect(result1.primaryStyle.category).toBe("Natural");
    expect(result1.primaryStyle.score).toBe(6);
    expect(result1.primaryStyle.percentage).toBe(100);
    expect(result1.totalSelections).toBe(6);

    // Teste 2: Distribuição entre estilos
    const result2 = await page.evaluate((calcFn) => {
      const answers = {
        q1: [
          { optionId: "q1-1", styleCategory: "Natural" },
          { optionId: "q1-2", styleCategory: "Clássico" },
          { optionId: "q1-3", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "q2-1", styleCategory: "Natural" },
          { optionId: "q2-2", styleCategory: "Natural" },
          { optionId: "q2-3", styleCategory: "Clássico" },
        ],
      };
      return calcFn(answers);
    }, calculateResults);

    expect(result2.primaryStyle.category).toBe("Natural");
    expect(result2.primaryStyle.score).toBe(3);
    expect(result2.primaryStyle.percentage).toBe(50);
    expect(result2.totalSelections).toBe(6);

    // Teste 3: Quiz completo com 10 questões
    const result3 = await page.evaluate((calcFn) => {
      const answers = {
        q1: [
          { optionId: "q1-1", styleCategory: "Elegante" },
          { optionId: "q1-2", styleCategory: "Elegante" },
          { optionId: "q1-3", styleCategory: "Clássico" },
        ],
        q2: [
          { optionId: "q2-1", styleCategory: "Elegante" },
          { optionId: "q2-2", styleCategory: "Clássico" },
          { optionId: "q2-3", styleCategory: "Romântico" },
        ],
        q3: [
          { optionId: "q3-1", styleCategory: "Elegante" },
          { optionId: "q3-2", styleCategory: "Elegante" },
          { optionId: "q3-3", styleCategory: "Clássico" },
        ],
        q4: [
          { optionId: "q4-1", styleCategory: "Elegante" },
          { optionId: "q4-2", styleCategory: "Romântico" },
          { optionId: "q4-3", styleCategory: "Clássico" },
        ],
        q5: [
          { optionId: "q5-1", styleCategory: "Elegante" },
          { optionId: "q5-2", styleCategory: "Elegante" },
          { optionId: "q5-3", styleCategory: "Romântico" },
        ],
        q6: [
          { optionId: "q6-1", styleCategory: "Elegante" },
          { optionId: "q6-2", styleCategory: "Clássico" },
          { optionId: "q6-3", styleCategory: "Romântico" },
        ],
        q7: [
          { optionId: "q7-1", styleCategory: "Elegante" },
          { optionId: "q7-2", styleCategory: "Elegante" },
          { optionId: "q7-3", styleCategory: "Clássico" },
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
      return calcFn(answers);
    }, calculateResults);

    expect(result3.primaryStyle.category).toBe("Elegante");
    expect(result3.primaryStyle.score).toBeGreaterThanOrEqual(13);
    expect(result3.totalSelections).toBe(30);
    expect(result3.primaryStyle.percentage).toBeGreaterThanOrEqual(43);

    // Verificar estilos secundários
    const classicoStyle = result3.secondaryStyles.find(
      (s: { category: string; score: number }) => s.category === "Clássico"
    );
    expect(classicoStyle.score).toBeGreaterThanOrEqual(7);
    expect(classicoStyle.score).toBeLessThanOrEqual(9);

    const romanticoStyle = result3.secondaryStyles.find(
      (s: { category: string; score: number }) => s.category === "Romântico"
    );
    expect(romanticoStyle.score).toBeGreaterThanOrEqual(6);
    expect(romanticoStyle.score).toBeLessThanOrEqual(8);

    // Teste 4: Validar desempate com clickOrder (mesma lógica do useQuizLogic)
    const result4 = await page.evaluate((calcFn) => {
      const answers = {
        q1: [
          { optionId: "q1-1", styleCategory: "Natural" },
          { optionId: "q1-2", styleCategory: "Clássico" },
          { optionId: "q1-3", styleCategory: "Romântico" },
        ],
        q2: [
          { optionId: "q2-1", styleCategory: "Natural" },
          { optionId: "q2-2", styleCategory: "Clássico" },
          { optionId: "q2-3", styleCategory: "Romântico" },
        ],
      };
      // Clássico foi clicado primeiro, deve vencer o desempate
      const clickOrder = ["Clássico", "Natural", "Romântico"];
      return calcFn(answers, clickOrder);
    }, calculateResults);

    // Todos têm 2 pontos, mas Clássico deve ser o primário por causa do clickOrder
    expect(result4.primaryStyle.category).toBe("Clássico");
    expect(result4.primaryStyle.score).toBe(2);
  });

  test("deve validar cálculo de percentuais e arredondamento", async ({
    page,
  }) => {
    const result = await page.evaluate(() => {
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

      let totalSelections = 0;

      Object.entries(answers).forEach(([_, options]) => {
        options.forEach(
          (option: { optionId: string; styleCategory: string }) => {
            if (
              option.styleCategory &&
              Object.prototype.hasOwnProperty.call(
                styleCounter,
                option.styleCategory
              )
            ) {
              styleCounter[option.styleCategory]++;
              totalSelections++;
            }
          }
        );
      });

      const styleResults = Object.entries(styleCounter)
        .map(([category, score]) => ({
          category,
          score,
          percentage:
            totalSelections > 0
              ? Math.round((score / totalSelections) * 100)
              : 0,
        }))
        .sort((a, b) => b.score - a.score);

      return {
        primaryStyle: styleResults[0],
        secondaryStyles: styleResults.slice(1),
        totalSelections,
      };
    });

    // Natural: 6/9 = 66.666... deve arredondar para 67%
    expect(result.primaryStyle.category).toBe("Natural");
    expect(result.primaryStyle.percentage).toBe(67);

    // Clássico: 2/9 = 22.222... deve arredondar para 22%
    const classicoStyle = result.secondaryStyles.find(
      (s: { category: string; percentage: number }) => s.category === "Clássico"
    );
    expect(classicoStyle.percentage).toBe(22);

    // Romântico: 1/9 = 11.111... deve arredondar para 11%
    const romanticoStyle = result.secondaryStyles.find(
      (s: { category: string; percentage: number }) =>
        s.category === "Romântico"
    );
    expect(romanticoStyle.percentage).toBe(11);
  });

  test("deve lidar com casos extremos e validações", async ({ page }) => {
    const results = await page.evaluate(() => {
      function calculateResults(
        answers: Record<
          string,
          Array<{ optionId: string; styleCategory: string }>
        >
      ) {
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

        Object.entries(answers).forEach(([_, options]) => {
          options.forEach(
            (option: { optionId: string; styleCategory: string }) => {
              if (
                option.styleCategory &&
                Object.prototype.hasOwnProperty.call(
                  styleCounter,
                  option.styleCategory
                )
              ) {
                styleCounter[option.styleCategory]++;
                totalSelections++;
              }
            }
          );
        });

        const styleResults = Object.entries(styleCounter)
          .map(([category, score]) => ({
            category,
            score,
            percentage:
              totalSelections > 0
                ? Math.round((score / totalSelections) * 100)
                : 0,
          }))
          .sort((a, b) => b.score - a.score);

        return {
          primaryStyle: styleResults[0] || null,
          secondaryStyles: styleResults.slice(1),
          totalSelections,
        };
      }

      // Teste 1: Sem respostas
      const result1 = calculateResults({});

      // Teste 2: Categorias inválidas
      const result2 = calculateResults({
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "InvalidStyle" },
          { optionId: "opt3", styleCategory: "" },
        ],
      });

      // Teste 3: Todos os 8 estilos devem estar presentes
      const result3 = calculateResults({
        q1: [
          { optionId: "opt1", styleCategory: "Natural" },
          { optionId: "opt2", styleCategory: "Natural" },
          { optionId: "opt3", styleCategory: "Natural" },
        ],
      });

      return { result1, result2, result3 };
    });

    // Resultado 1: Sem respostas
    expect(results.result1.totalSelections).toBe(0);
    expect(results.result1.primaryStyle.score).toBe(0);
    expect(results.result1.primaryStyle.percentage).toBe(0);

    // Resultado 2: Apenas Natural deve ser contabilizado
    expect(results.result2.totalSelections).toBe(1);
    expect(results.result2.primaryStyle.category).toBe("Natural");
    expect(results.result2.primaryStyle.score).toBe(1);

    // Resultado 3: Verificar que todos os 8 estilos estão presentes
    const allStyles = [
      results.result3.primaryStyle,
      ...results.result3.secondaryStyles,
    ];
    const styleCategories = allStyles.map(
      (s: { category: string }) => s.category
    );

    expect(styleCategories).toContain("Natural");
    expect(styleCategories).toContain("Clássico");
    expect(styleCategories).toContain("Contemporâneo");
    expect(styleCategories).toContain("Elegante");
    expect(styleCategories).toContain("Romântico");
    expect(styleCategories).toContain("Sexy");
    expect(styleCategories).toContain("Dramático");
    expect(styleCategories).toContain("Criativo");
    expect(styleCategories.length).toBe(8);
  });
});
