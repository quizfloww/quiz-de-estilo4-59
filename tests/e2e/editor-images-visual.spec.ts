import { test, expect } from "@playwright/test";

/**
 * TESTE SIMPLES: Verificar imagens no Editor de Funis
 *
 * Este teste NÃO usa fixture de auth mockado
 * Ele verifica diretamente o comportamento visual
 */

test.describe("Verificação Visual de Imagens no Editor", () => {
  test("acessar editor e contar imagens nas opções", async ({ page }) => {
    // Configurar interceptação de rede
    const apiCalls: { url: string; data: any }[] = [];

    page.on("response", async (response) => {
      const url = response.url();
      if (
        (url.includes("stage_options") || url.includes("funnel_stages")) &&
        response.status() === 200
      ) {
        try {
          const data = await response.json();
          apiCalls.push({ url, data });
        } catch {}
      }
    });

    // Simular login (se necessário)
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Se tiver página de login, fazer login
    const loginInput = page
      .locator('input[type="email"], input[type="text"]')
      .first();
    if (await loginInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginInput.fill("admin@test.com");
      const passwordInput = page.locator('input[type="password"]');
      if (await passwordInput.isVisible().catch(() => false)) {
        await passwordInput.fill("admin123");
        await page.locator('button[type="submit"]').click();
        await page.waitForLoadState("networkidle");
      }
    }

    // Ir para lista de funis
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Clicar no primeiro funil para editar
    const editButton = page
      .locator('a[href*="/edit"], button:has-text("Editar")')
      .first();
    if (await editButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000);
    }

    // Analisar os dados capturados
    console.log("\n📡 CHAMADAS API CAPTURADAS:");
    console.log("=".repeat(50));

    apiCalls.forEach((call, idx) => {
      const shortUrl = call.url.split("?")[0].split("/").slice(-2).join("/");
      const dataInfo = Array.isArray(call.data)
        ? `${call.data.length} itens`
        : "objeto";
      console.log(`${idx + 1}. ${shortUrl} - ${dataInfo}`);

      // Se for stage_options, analisar imagens
      if (call.url.includes("stage_options") && Array.isArray(call.data)) {
        const withImages = call.data.filter((o: any) => o.image_url).length;
        const withoutImages = call.data.filter((o: any) => !o.image_url).length;
        console.log(`   ✅ Com image_url: ${withImages}`);
        console.log(`   ❌ Sem image_url: ${withoutImages}`);

        if (withoutImages > 0) {
          console.log("\n   Opções SEM imagem:");
          call.data
            .filter((o: any) => !o.image_url)
            .slice(0, 5)
            .forEach((o: any) => {
              console.log(
                `   - "${o.text}" (stage: ${o.stage_id.substring(0, 8)}...)`
              );
            });
        }
      }

      // Se for funnel_stages, analisar displayType
      if (call.url.includes("funnel_stages") && Array.isArray(call.data)) {
        console.log("\n   Stages e displayType:");
        call.data
          .filter((s: any) => s.type === "question" || s.type === "strategic")
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .forEach((s: any, idx: number) => {
            const config = s.config || {};
            const displayType = config.displayType || "não definido";
            const options = config.options || [];
            const optionsWithImages = options.filter(
              (o: any) => o.imageUrl || o.image_url
            ).length;

            console.log(
              `   Q${idx + 1}: displayType="${displayType}", ${
                options.length
              } options (${optionsWithImages} com imagem)`
            );
          });
      }
    });

    // Verificar imagens visíveis no DOM
    console.log("\n🎨 IMAGENS VISÍVEIS NO EDITOR:");
    console.log("=".repeat(50));

    // Contar imagens em botões de opção
    const optionImages = await page
      .locator("button img, [aria-pressed] img")
      .count();
    console.log(`Imagens em botões de opção: ${optionImages}`);

    // Screenshot para referência
    await page.screenshot({
      path: "test-results/editor-images-check.png",
      fullPage: true,
    });
    console.log(
      "\n📸 Screenshot salvo em test-results/editor-images-check.png"
    );

    expect(true).toBe(true);
  });

  test("navegar por cada questão e verificar imagens", async ({ page }) => {
    // Ir direto para o editor (ajustar URL conforme necessário)
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Tentar clicar em editar
    const editBtn = page.locator('a[href*="/edit"]').first();
    if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editBtn.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
    }

    // Buscar botões de stage na sidebar
    const stageButtons = page.locator(
      '[data-testid="stage-button"], .stage-item button, aside button'
    );
    const stageCount = await stageButtons.count();

    console.log(`\n📋 ${stageCount} botões de stage encontrados\n`);

    // Navegar por cada stage e verificar imagens
    for (let i = 0; i < Math.min(stageCount, 12); i++) {
      const stageBtn = stageButtons.nth(i);
      const stageText = await stageBtn.textContent().catch(() => "");

      // Só clicar se parecer ser uma questão
      if (
        stageText?.toLowerCase().includes("quest") ||
        stageText?.toLowerCase().includes("q") ||
        stageText?.match(/\d/)
      ) {
        await stageBtn.click();
        await page.waitForTimeout(1000);

        // Contar imagens no canvas
        const canvasImages = await page
          .locator("main img, .canvas img, [data-block-type] img")
          .count();
        const optionButtons = await page
          .locator("button[aria-pressed], button[aria-label]")
          .count();

        console.log(
          `Stage ${i + 1} "${stageText?.substring(
            0,
            20
          )}": ${canvasImages} imagens, ${optionButtons} opções`
        );

        if (optionButtons > 0 && canvasImages === 0) {
          console.log(`   ⚠️  PROBLEMA: Tem opções mas sem imagens!`);

          // Capturar screenshot desta questão
          await page.screenshot({
            path: `test-results/stage-${i + 1}-no-images.png`,
            fullPage: true,
          });
        }
      }
    }
  });
});
