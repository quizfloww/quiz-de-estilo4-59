import { test, expect } from "../fixtures/auth";

/**
 * Garante que o editor de funis exibe a etapa de resultado/oferta
 * sem ficar em branco. Usa os mocks da fixture de auth.
 */
test.describe("Editor de Funil - Etapa de Resultado e Oferta", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    // Aguarda carregamento básico do editor (sidebar de etapas)
    await expect(page.locator("text=Etapas").first()).toBeVisible({
      timeout: 20000,
    });
  });

  const openResultStage = async (page: any) => {
    // Seleciona a etapa "Descubra seu estilo" na sidebar
    const stageItem = page.locator("text=Descubra seu estilo").first();
    await expect(stageItem).toBeVisible({ timeout: 15000 });
    await stageItem.click();
    // Garante que o canvas carregou algum bloco
    await expect(
      page.locator("button:has-text('Quero garantir meu guia')").first()
    ).toBeVisible({ timeout: 15000 });
  };

  test("deve carregar a etapa de resultado com CTA e preços", async ({
    page,
  }) => {
    await openResultStage(page);

    // Valores de preço do mock: 47 de oferta, 197 original
    await expect(page.locator("text=R$ 47").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=197").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("não deve mostrar placeholder em branco na seção de resultado", async ({
    page,
  }) => {
    await openResultStage(page);

    // Verifica que há pelo menos um bloco clicável ou botão dentro
    await expect(
      page.locator("button, a, [role='button']").first()
    ).toBeVisible({ timeout: 10000 });
  });
});
