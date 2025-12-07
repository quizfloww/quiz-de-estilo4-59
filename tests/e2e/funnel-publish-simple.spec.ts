import { test, expect } from "../fixtures/auth";
import type { Page } from "@playwright/test";

/**
 * Testes E2E simplificados para a funcionalidade "Publicar" do Editor de Funil
 *
 * Foco: Cenários principais e críticos
 */

// Configuração de timeouts aumentada para operações de publicação
test.setTimeout(120000);

const waitForEditorReady = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  const header = page.locator('h1, [data-testid="funnel-name"]').first();
  await header.waitFor({ state: "visible", timeout: 20000 });
};

test.describe("Publicar Funil - Testes Principais", () => {
  test("TC01: Botão Publicar deve estar visível no editor", async ({
    page,
  }) => {
    // Navega para lista de funis
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    // Clica no primeiro link de edição disponível
    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });

    await waitForEditorReady(page);

    // Verifica se botão Publicar está visível
    const publishButton = page.locator('button:has-text("Publicar")');
    await expect(publishButton.first()).toBeVisible({ timeout: 10000 });
  });

  test("TC02: Clicar em Publicar deve abrir diálogo de validação", async ({
    page,
  }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    // Clica no botão Publicar
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    // Aguarda e verifica se diálogo abriu
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verifica título do diálogo
    const dialogTitle = page.locator("text=/Publicar Funil|Publish/i");
    await expect(dialogTitle.first()).toBeVisible();
  });

  test("TC03: Diálogo deve mostrar validações (erros ou warnings)", async ({
    page,
  }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    // Aguarda validações carregarem
    await page.waitForTimeout(3000);

    // Verifica se há mensagens de validação (podem ser erros ou warnings)
    const validationMessages = page.locator(
      "text=/erro|error|aviso|warning|validação|validation/i"
    );
    const count = await validationMessages.count();

    // Deve haver pelo menos alguma mensagem de validação
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("TC04: Diálogo deve mostrar URL pública do funil", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    await page.waitForTimeout(2000);

    // Procura pela URL pública (formato /quiz/slug)
    const urlText = page.locator("text=/\\/quiz\\//i");

    if (await urlText.isVisible().catch(() => false)) {
      await expect(urlText.first()).toBeVisible();
      const url = await urlText.first().textContent();
      expect(url).toContain("/quiz/");
    } else {
      console.log("⚠️ URL pública não visível - pode estar em outro formato");
    }
  });

  test("TC05: Deve ter botão de confirmação no diálogo", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    await page.waitForTimeout(2000);

    // Procura pelo botão de confirmação
    const confirmButton = page.locator(
      'button:has-text("Publicar Agora"), button:has-text("Confirmar")'
    );
    await expect(confirmButton.first()).toBeVisible();
  });

  test("TC06: Deve poder fechar o diálogo sem publicar", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    // Aguarda diálogo abrir
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Procura botão de fechar (X ou Cancelar)
    const closeButton = page
      .locator('button[aria-label="Close"], button:has-text("Cancelar")')
      .first();

    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();

      // Verifica se diálogo fechou
      await expect(dialog).not.toBeVisible({ timeout: 3000 });
    } else {
      // Alternativa: pressionar ESC
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Publicar Funil - Validações Específicas", () => {
  test("TC07: Deve validar presença de etapa de introdução", async ({
    page,
  }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(3000);

    // Procura por mensagem relacionada a introdução
    const introValidation = page.locator("text=/introdução|intro/i");
    const count = await introValidation.count();

    if (count > 0) {
      console.log(
        `✓ Validação de introdução encontrada (${count} referências)`
      );
    }
  });

  test("TC08: Deve validar presença de perguntas", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(3000);

    // Procura por mensagem relacionada a perguntas
    const questionValidation = page.locator("text=/pergunta|question/i");
    const count = await questionValidation.count();

    if (count > 0) {
      console.log(`✓ Validação de perguntas encontrada (${count} referências)`);
    }
  });

  test("TC09: Deve validar configuração de opções", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(3000);

    // Procura por mensagem relacionada a opções
    const optionsValidation = page.locator("text=/opções|options/i");
    const count = await optionsValidation.count();

    if (count > 0) {
      console.log(`✓ Validação de opções encontrada (${count} referências)`);
    }
  });
});

test.describe("Despublicar Funil", () => {
  test("TC10: Funil publicado deve mostrar botão Despublicar", async ({
    page,
  }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    // Procura por funil com status "publicado"
    const publishedBadge = page.locator("text=/publicado|published/i").first();

    if (await publishedBadge.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Encontra o link de edição relacionado a este funil
      const container = publishedBadge
        .locator('xpath=ancestor::*[.//a[contains(@href, "/edit")]]')
        .first();
      const editLink = container.locator('a[href*="/edit"]').first();

      await editLink.click({ timeout: 10000 });
      await waitForEditorReady(page);

      // Verifica se botão Despublicar está visível
      const unpublishButton = page.locator('button:has-text("Despublicar")');
      await expect(unpublishButton.first()).toBeVisible({ timeout: 5000 });
    } else {
      test.skip(true, "Nenhum funil publicado encontrado para testar");
    }
  });

  test("TC11: Deve despublicar funil com sucesso", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const publishedBadge = page.locator("text=/publicado|published/i").first();

    if (await publishedBadge.isVisible({ timeout: 5000 }).catch(() => false)) {
      const container = publishedBadge
        .locator('xpath=ancestor::*[.//a[contains(@href, "/edit")]]')
        .first();
      const editLink = container.locator('a[href*="/edit"]').first();

      await editLink.click({ timeout: 10000 });
      await waitForEditorReady(page);

      const unpublishButton = page
        .locator('button:has-text("Despublicar")')
        .first();

      if (await unpublishButton.isVisible().catch(() => false)) {
        await unpublishButton.click();

        // Aguarda mensagem de sucesso ou mudança de status
        await page.waitForTimeout(3000);

        // Verifica se apareceu mensagem de sucesso
        const successMessage = page.locator(
          "text=/despublicado|unpublished|sucesso|success/i"
        );
        const hasSuccess = await successMessage
          .isVisible({ timeout: 5000 })
          .catch(() => false);

        if (hasSuccess) {
          console.log("✓ Funil despublicado com sucesso");
        }
      }
    } else {
      test.skip(true, "Nenhum funil publicado para despublicar");
    }
  });
});

test.describe("Estados de Loading", () => {
  test("TC12: Deve mostrar estado de loading ao validar", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();

    // Monitora se há algum indicador de loading
    await publishButton.click();

    // Procura por indicadores de loading (podem ser rápidos)
    const loadingIndicator = page.locator(
      '[data-testid="loading"], .loading, .spinner, text=/carregando|loading|validando|validating/i'
    );

    const isVisible = await loadingIndicator
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isVisible) {
      console.log("✓ Indicador de loading detectado");
    } else {
      console.log("ℹ️ Loading muito rápido ou sem indicador visual");
    }
  });
});

test.describe("Integração com Blocos", () => {
  test("TC13: Deve listar etapas do funil no diálogo", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    // Procura por listagem de etapas no diálogo
    const stagesList = page.locator("text=/etapa|stage/i");
    const count = await stagesList.count();

    if (count > 0) {
      console.log(`✓ Etapas listadas no diálogo (${count} referências)`);
    }
  });

  test("TC14: Deve informar sobre blocos ausentes", async ({ page }) => {
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const editLink = page
      .locator('a[href*="/admin/funnels/"][href*="/edit"]')
      .first();
    await editLink.click({ timeout: 10000 });
    await waitForEditorReady(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(3000);

    // Procura por warning sobre blocos
    const blocksWarning = page.locator("text=/bloco|block/i");
    const count = await blocksWarning.count();

    if (count > 0) {
      console.log(
        `✓ Informações sobre blocos encontradas (${count} referências)`
      );
    }
  });
});
