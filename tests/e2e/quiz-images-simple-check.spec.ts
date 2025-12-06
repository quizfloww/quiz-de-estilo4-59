/**
 * TESTE SIMPLES E DIRETO: Verificar imagens nas questões do Quiz
 *
 * Este teste navega pelo quiz e reporta quais questões têm/não têm imagens visíveis.
 */

import { test, expect } from "@playwright/test";

test.describe("Quiz - Verificação de Imagens por Questão", () => {
  test("navegar pelo quiz e verificar imagens em cada questão", async ({
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

    // Preencher nome na intro
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nameInput.fill("Teste Imagens");
      await page.waitForTimeout(500);

      const startBtn = page
        .locator("button")
        .filter({ hasText: /Descubra|Começar|Iniciar/i })
        .first();
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    console.log("\n" + "═".repeat(60));
    console.log("📊 RESULTADO DO TESTE DE IMAGENS");
    console.log("═".repeat(60) + "\n");

    const results: Array<{
      pos: number;
      title: string;
      hasImages: boolean;
      imageCount: number;
      optionCount: number;
    }> = [];

    for (let pos = 1; pos <= 10; pos++) {
      await page.waitForTimeout(1000);

      // Capturar título
      const titleEl = page.locator("h1, h2").first();
      const title =
        (await titleEl.textContent().catch(() => "Sem título")) || "Sem título";

      // Contar opções e imagens
      const options = page.locator("button[aria-pressed], button[aria-label]");
      const optionCount = await options.count();

      // Contar imagens dentro das opções
      let imageCount = 0;
      for (let i = 0; i < optionCount; i++) {
        const opt = options.nth(i);
        const imgs = await opt.locator("img").count();
        imageCount += imgs;
      }

      const hasImages = imageCount > 0;

      results.push({
        pos,
        title: title.substring(0, 45),
        hasImages,
        imageCount,
        optionCount,
      });

      // Log imediato
      const icon = hasImages ? "✅" : "❌";
      console.log(
        `Q${pos} ${icon} ${imageCount}/${optionCount} imgs | "${title.substring(
          0,
          40
        )}..."`
      );

      // Clicar nas opções para avançar (3 para multiSelect)
      if (optionCount > 0) {
        for (let i = 0; i < Math.min(3, optionCount); i++) {
          await options.nth(i).click();
          await page.waitForTimeout(150);
        }

        // Clicar continuar se visível
        const continueBtn = page
          .locator("button")
          .filter({ hasText: /Continuar|Próximo/i });
        if (await continueBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await continueBtn.click();
        }
      }

      await page.waitForTimeout(800);

      // Verificar se ainda estamos em questão ou transição
      const isTransition =
        (await page
          .locator("text=Falta pouco")
          .isVisible()
          .catch(() => false)) ||
        (await page
          .locator("text=transição")
          .isVisible()
          .catch(() => false));

      if (isTransition) {
        console.log("   [Transição detectada - clicando para continuar]");
        const nextBtn = page
          .locator("button")
          .filter({ hasText: /Continuar|Próximo|Ver/i });
        if (await nextBtn.isVisible().catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Resumo final
    console.log("\n" + "═".repeat(60));
    console.log("📈 RESUMO");
    console.log("═".repeat(60));

    const withImages = results.filter((r) => r.hasImages);
    const withoutImages = results.filter((r) => !r.hasImages);

    console.log(`\n✅ Questões COM imagens: ${withImages.length}`);
    withImages.forEach((r) =>
      console.log(`   Q${r.pos}: ${r.imageCount} imagens`)
    );

    console.log(`\n❌ Questões SEM imagens: ${withoutImages.length}`);
    withoutImages.forEach((r) => console.log(`   Q${r.pos}: "${r.title}..."`));

    if (withoutImages.length > 0) {
      console.log("\n💡 DIAGNÓSTICO:");
      console.log(
        "   Questões sem imagens provavelmente têm type='text' no código."
      );
      console.log(
        "   Para adicionar imagens, altere para type='both' e adicione imageUrl."
      );
      console.log("\n   Arquivos relevantes:");
      console.log("   - src/data/questions/personalityQuestions.ts");
      console.log("   - src/data/questions/stylePreferencesQuestions.ts");
    }

    // Teste passa independente do resultado - é diagnóstico
    expect(results.length).toBeGreaterThan(0);
  });
});
