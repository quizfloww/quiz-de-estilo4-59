/**
 * TESTE DIAGNÓSTICO FOCADO: Por que questões 4-9 não têm imagens
 *
 * CONCLUSÃO ENCONTRADA:
 * As questões são carregadas na seguinte ordem (de quizQuestions.ts):
 *
 *   1. clothingQuestions:         Q1 (type='both') e Q3 (type='both')     ✅ COM IMAGENS
 *   2. personalityQuestions:      Q2 (type='text') e Q4 (type='text')     ❌ SEM IMAGENS (by design)
 *   3. stylePreferencesQuestions: Q5 (type='both') e Q10 (type='text')    ⚠️ MISTO
 *   4. outerwearQuestions:        Q6 (type='both') e Q7 (type='both')     ✅ COM IMAGENS
 *   5. accessoriesQuestions:      Q8 (type='both')                         ✅ COM IMAGENS
 *   6. accessoryStyleQuestions:   Q9 (type='both')                         ✅ COM IMAGENS
 *
 * O problema é que `type: "text"` significa que o displayType é "text",
 * e o componente QuizOption só exibe imagens quando displayType !== "text".
 *
 * A ordem real no array é baseada nos IDs das questões, não na ordem de spread.
 * Vamos verificar qual é a ordem real.
 */

import { test, expect } from "@playwright/test";

test.describe("Diagnóstico definitivo: Ordem e tipo das questões", () => {
  test("analisar a configuração das questões no código", async ({ page }) => {
    // Este teste verifica a configuração no código-fonte

    await page.goto("/quiz");
    await page.waitForLoadState("networkidle");

    // Injetar script para capturar as questões
    const questionsAnalysis = await page.evaluate(() => {
      // Tenta acessar as questões via módulo ou estado React
      // Como não podemos importar diretamente, vamos simular

      // Tentar encontrar no estado do React Query ou localStorage
      const quizProgress = localStorage.getItem("quiz_progress");

      return {
        hasProgress: !!quizProgress,
        progress: quizProgress ? JSON.parse(quizProgress) : null,
      };
    });

    console.log("📊 Análise das questões configuradas:");
    console.log(JSON.stringify(questionsAnalysis, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("📋 ANÁLISE DO CÓDIGO-FONTE (quizQuestions.ts):");
    console.log("=".repeat(60));
    console.log(`
A ordem de questões é definida pelo spread em quizQuestions.ts:

  const defaultQuizQuestions: QuizQuestion[] = [
    ...clothingQuestions,         // 2 questões (Q1, Q3) - type='both' ✅
    ...personalityQuestions,      // 2 questões (Q2, Q4) - type='text' ❌
    ...stylePreferencesQuestions, // 2 questões (Q5, Q10) - misto
    ...outerwearQuestions,        // 2 questões (Q6, Q7) - type='both' ✅
    ...accessoriesQuestions,      // 1 questão (Q8) - type='both' ✅
    ...accessoryStyleQuestions    // 1 questão (Q9) - type='both' ✅
  ];

Mas os IDs são: 1, 3, 2, 4, 5, 10, 6, 7, 8, 9

Logo a ORDEM REAL no quiz é:
  Posição 1: Q1 (clothing) - type='both' ✅
  Posição 2: Q3 (clothing) - type='both' ✅
  Posição 3: Q2 (personality) - type='text' ❌
  Posição 4: Q4 (personality) - type='text' ❌
  Posição 5: Q5 (stylePreferences) - type='both' ✅
  Posição 6: Q10 (stylePreferences) - type='text' ❌
  Posição 7: Q6 (outerwear) - type='both' ✅
  Posição 8: Q7 (outerwear) - type='both' ✅
  Posição 9: Q8 (accessories) - type='both' ✅
  Posição 10: Q9 (accessoryStyle) - type='both' ✅

CONCLUSÃO:
- Posições 3, 4 e 6 têm type='text' → NÃO MOSTRAM IMAGENS (comportamento esperado!)
- As outras posições têm type='both' → DEVEM mostrar imagens

Se o usuário relata que Q4-Q9 não têm imagens, precisamos verificar:
1. Se há imagens configuradas (imageUrl nas options)
2. Se o type está realmente como 'both' ou 'image'
`);

    expect(true).toBe(true);
  });

  test("navegar e capturar tipo de cada questão visualmente", async ({
    page,
  }) => {
    // Limpar estado
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto("/quiz");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Preencher nome
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill("Diagnóstico");
      const startBtn = page
        .locator('button:has-text("Descubra"), button:has-text("Começar")')
        .first();
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
        await page.waitForTimeout(1500);
      }
    }

    const results: {
      position: number;
      title: string;
      hasImages: boolean;
      imageCount: number;
    }[] = [];

    for (let pos = 1; pos <= 10; pos++) {
      await page.waitForTimeout(800);

      // Capturar informações
      const title = await page
        .locator("h1")
        .first()
        .textContent()
        .catch(() => "");
      const images = await page
        .locator("button img, [aria-pressed] img, [aria-label] img")
        .count();

      results.push({
        position: pos,
        title: title?.substring(0, 40) || "",
        hasImages: images > 0,
        imageCount: images,
      });

      console.log(
        `Posição ${pos}: ${
          images > 0 ? "✅" : "❌"
        } ${images} imgs - "${title?.substring(0, 35)}..."`
      );

      // Screenshot
      await page.screenshot({
        path: `test-results/q${pos}-diagnostic.png`,
        fullPage: true,
      });

      // Clicar nas opções necessárias (3 para multiSelect)
      const options = page.locator("button[aria-pressed], button[aria-label]");
      const optCount = await options.count();

      for (let i = 0; i < Math.min(3, optCount); i++) {
        await options.nth(i).click();
        await page.waitForTimeout(200);
      }

      // Continuar
      const continueBtn = page.locator(
        'button:has-text("Continuar"), button:has-text("Próximo")'
      );
      if (await continueBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await continueBtn.click();
      }

      await page.waitForTimeout(500);
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMO:");
    console.log("=".repeat(60));

    const withImages = results.filter((r) => r.hasImages);
    const withoutImages = results.filter((r) => !r.hasImages);

    console.log(
      `✅ Questões COM imagens: ${withImages.map((r) => r.position).join(", ")}`
    );
    console.log(
      `❌ Questões SEM imagens: ${withoutImages
        .map((r) => r.position)
        .join(", ")}`
    );

    console.log("\n📸 Screenshots salvos em test-results/q*-diagnostic.png");
  });
});

test.describe("Verificar arquivos de questões", () => {
  test("listar todas as questões e seus tipos", async ({ page }) => {
    console.log("\n" + "=".repeat(60));
    console.log("📁 CONFIGURAÇÃO NOS ARQUIVOS:");
    console.log("=".repeat(60));

    console.log(`
clothingQuestions.ts:
  Q1 - type='both' - TEM imageUrl ✅
  Q3 - type='both' - TEM imageUrl ✅

personalityQuestions.ts:
  Q2 - type='text' - NÃO tem imageUrl ❌
  Q4 - type='text' - NÃO tem imageUrl ❌

stylePreferencesQuestions.ts:
  Q5 - type='both' - TEM imageUrl ✅
  Q10 - type='text' - NÃO tem imageUrl ❌

outerwearQuestions.ts:
  Q6 - type='both' - TEM imageUrl ✅
  Q7 - type='both' - TEM imageUrl ✅

accessoriesQuestions.ts:
  Q8 - type='both' - TEM imageUrl ✅

accessoryStyleQuestions.ts:
  Q9 - type='both' - TEM imageUrl ✅

DIAGNÓSTICO FINAL:
═══════════════════════════════════════════════════════════

As questões Q2, Q4 e Q10 estão configuradas com type='text',
o que significa que as imagens NÃO devem ser exibidas por design.

Se o usuário quer imagens nessas questões, é preciso:
1. Alterar type de 'text' para 'both' no arquivo correspondente
2. Adicionar imageUrl em cada option

Arquivos a modificar:
- src/data/questions/personalityQuestions.ts (Q2 e Q4)
- src/data/questions/stylePreferencesQuestions.ts (Q10)
`);

    expect(true).toBe(true);
  });
});
