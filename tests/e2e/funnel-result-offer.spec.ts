import { test, expect } from "../fixtures/auth";

/**
 * Garante que o editor de funis exibe a etapa de resultado/oferta
 * sem ficar em branco. Usa os mocks da fixture de auth.
 */
test.describe("Editor de Funil - Etapa de Resultado e Oferta", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
  });

  test("deve carregar a etapa de resultado com CTA e preços", async ({
    page,
  }) => {
    // Aguarda o carregamento geral do editor
    await expect(page.locator("text=Funil").first()).toBeVisible({
      timeout: 15000,
    });

    // A etapa de resultado vem do mock com o título abaixo
    const resultHeading = page.locator("text=Descubra seu estilo").first();
    await expect(resultHeading).toBeVisible({ timeout: 10000 });

    // Valida CTA e campos de oferta (vindos do mock stage result)
    const ctaButton = page
      .locator("button:has-text('Quero garantir meu guia')")
      .first();
    await expect(ctaButton).toBeVisible({ timeout: 10000 });

    // Valores de preço do mock: 47 de oferta, 197 original
    const currentPrice = page.locator("text=R$ 47");
    const originalPrice = page.locator("text=197");
    await expect(currentPrice).toBeVisible({ timeout: 10000 });
    await expect(originalPrice).toBeVisible({ timeout: 10000 });
  });

  test("não deve mostrar placeholder em branco na seção de resultado", async ({
    page,
  }) => {
    // Se a seção carregou, não deve existir um container vazio ocupando viewport
    const resultSection = page
      .locator("section:has-text('Descubra seu estilo')")
      .first();
    await expect(resultSection).toBeVisible({ timeout: 10000 });

    // Verifica que há pelo menos um bloco clicável ou botão dentro
    await expect(
      resultSection.locator("button, a, [role='button']").first()
    ).toBeVisible({ timeout: 10000 });
  });
});
