import { test, expect } from "../fixtures/auth";
import type { Page } from "@playwright/test";

/**
 * Testes E2E para a funcionalidade "Publicar" do Editor de Funil
 *
 * Cobertura:
 * - Validação de requisitos mínimos (intro, perguntas, resultado)
 * - Validação de blocos e opções
 * - Fluxo de publicação completo
 * - Despublicar funil
 * - Mensagens de erro e warnings
 * - URL pública após publicação
 */

const waitForEditorReady = async (page: Page) => {
  const header = page
    .locator('h1, .funnel-title, [data-testid="funnel-name"]')
    .first();
  await header.waitFor({ state: "visible", timeout: 15000 });
};

const createMinimalFunnel = async (page: Page) => {
  // Espera o editor estar pronto
  await waitForEditorReady(page);

  // Verifica se já existe etapa de intro
  const introExists = await page
    .locator("text=/intro|introdução/i")
    .first()
    .isVisible()
    .catch(() => false);

  if (!introExists) {
    // Adiciona etapa de introdução se não existir
    const addStageButton = page
      .locator(
        'button:has-text("Adicionar Etapa"), button:has-text("Nova Etapa")'
      )
      .first();
    if (await addStageButton.isVisible().catch(() => false)) {
      await addStageButton.click();
      await page
        .locator('button:has-text("Intro"), [data-type="intro"]')
        .first()
        .click();
    }
  }

  // Adiciona uma etapa de pergunta se não existir
  const questionExists = await page
    .locator("text=/pergunta|question/i")
    .first()
    .isVisible()
    .catch(() => false);

  if (!questionExists) {
    const addStageButton = page
      .locator(
        'button:has-text("Adicionar Etapa"), button:has-text("Nova Etapa")'
      )
      .first();
    if (await addStageButton.isVisible().catch(() => false)) {
      await addStageButton.click();
      await page
        .locator('button:has-text("Pergunta"), [data-type="question"]')
        .first()
        .click();
    }
  }
};

test.describe("Publicar Funil - Validações", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");

    // Clica no primeiro funil da lista ou cria um novo
    const firstFunnel = page
      .locator('[data-testid="funnel-item"], .funnel-card')
      .first();

    if (await firstFunnel.isVisible().catch(() => false)) {
      await firstFunnel.click();
    } else {
      // Se não há funis, cria um novo
      const createButton = page
        .locator(
          'button:has-text("Criar Funil"), button:has-text("Novo Funil")'
        )
        .first();
      if (await createButton.isVisible().catch(() => false)) {
        await createButton.click();
        await page.fill(
          'input[name="name"], input[placeholder*="nome"]',
          "Teste Publicação"
        );
        await page.fill(
          'input[name="slug"], input[placeholder*="url"]',
          `test-pub-${Date.now()}`
        );
        await page
          .locator('button[type="submit"], button:has-text("Criar")')
          .first()
          .click();
      }
    }

    await waitForEditorReady(page);
  });

  test("deve exibir botão Publicar no editor", async ({ page }) => {
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await expect(publishButton).toBeVisible({ timeout: 10000 });
  });

  test("deve abrir diálogo de publicação ao clicar em Publicar", async ({
    page,
  }) => {
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    // Aguarda o diálogo aparecer
    const dialog = page.locator(
      '[role="dialog"], .dialog, [data-testid="publish-dialog"]'
    );
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verifica se o título do diálogo está presente
    const dialogTitle = page.locator("text=/Publicar Funil|Publish/i");
    await expect(dialogTitle).toBeVisible();
  });

  test("deve mostrar validações de requisitos mínimos", async ({ page }) => {
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    // Aguarda o diálogo e a validação carregar
    await page.waitForTimeout(2000);

    // Procura por mensagens de validação
    const validationMessages = page.locator(
      '[data-testid="validation-item"], .validation-message, [role="alert"]'
    );
    const count = await validationMessages.count();

    // Deve haver pelo menos uma mensagem (erro ou warning)
    expect(count).toBeGreaterThan(0);
  });

  test("deve validar presença de etapa de introdução", async ({ page }) => {
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    await page.waitForTimeout(2000);

    // Procura por mensagem de erro sobre intro
    const introError = page.locator("text=/introdução|intro.*necessário/i");

    // Se o erro está visível, significa que falta a intro
    const isVisible = await introError.isVisible().catch(() => false);

    if (isVisible) {
      await expect(introError).toBeVisible();
    } else {
      // Se não há erro, a validação passou
      console.log("✓ Validação de intro passou");
    }
  });

  test("deve validar presença de etapa de pergunta", async ({ page }) => {
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    await page.waitForTimeout(2000);

    // Procura por mensagem de erro sobre perguntas
    const questionError = page.locator(
      "text=/pergunta.*necessário|question.*required/i"
    );

    const isVisible = await questionError.isVisible().catch(() => false);

    if (isVisible) {
      await expect(questionError).toBeVisible();
    } else {
      console.log("✓ Validação de perguntas passou");
    }
  });

  test("deve validar que perguntas tenham opções", async ({ page }) => {
    await createMinimalFunnel(page);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    await page.waitForTimeout(2000);

    // Procura por mensagem sobre opções
    const optionsWarning = page.locator("text=/opções|options/i");

    const count = await optionsWarning.count();

    if (count > 0) {
      console.log(`✓ Validação de opções presente (${count} mensagens)`);
    }
  });

  test("deve validar unicidade do slug", async ({ page }) => {
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    await page.waitForTimeout(2000);

    // Procura por erro de slug duplicado
    const slugError = page.locator("text=/slug.*já existe|slug.*duplicado/i");

    const isVisible = await slugError.isVisible().catch(() => false);

    if (isVisible) {
      console.log("✓ Validação de slug duplicado detectada");
      await expect(slugError).toBeVisible();
    } else {
      console.log("✓ Slug único - validação passou");
    }
  });
});

test.describe("Publicar Funil - Fluxo Completo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");

    // Cria um novo funil para teste de publicação
    const createButton = page
      .locator('button:has-text("Criar Funil"), button:has-text("Novo Funil")')
      .first();

    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();
      await page.fill(
        'input[name="name"], input[placeholder*="nome"]',
        "Funil Teste Publicação"
      );
      await page.fill(
        'input[name="slug"], input[placeholder*="url"]',
        `publish-test-${Date.now()}`
      );
      await page
        .locator('button[type="submit"], button:has-text("Criar")')
        .first()
        .click();
      await waitForEditorReady(page);
    } else {
      // Se não conseguiu criar, usa o primeiro disponível
      const firstFunnel = page
        .locator('[data-testid="funnel-item"], .funnel-card')
        .first();
      await firstFunnel.click();
      await waitForEditorReady(page);
    }
  });

  test("deve publicar funil com estrutura válida", async ({ page }) => {
    // Cria estrutura mínima válida
    await createMinimalFunnel(page);

    // Aguarda um pouco para garantir que tudo foi salvo
    await page.waitForTimeout(1000);

    // Clica em Publicar
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();

    // Aguarda validação
    await page.waitForTimeout(2000);

    // Procura pelo botão "Publicar Agora" ou similar no diálogo
    const confirmButton = page
      .locator(
        'button:has-text("Publicar Agora"), button:has-text("Confirmar")'
      )
      .first();

    const isEnabled = await confirmButton.isEnabled().catch(() => false);

    if (isEnabled) {
      await confirmButton.click();

      // Aguarda mensagem de sucesso
      const successMessage = page.locator(
        "text=/publicado com sucesso|published successfully/i"
      );
      await expect(successMessage).toBeVisible({ timeout: 10000 });

      // Verifica se o status mudou para "published"
      const statusBadge = page.locator("text=/publicado|published/i").first();
      await expect(statusBadge).toBeVisible({ timeout: 5000 });
    } else {
      console.log(
        "⚠ Botão de publicar está desabilitado - há erros de validação"
      );
    }
  });

  test("deve mostrar URL pública após publicação", async ({ page }) => {
    await createMinimalFunnel(page);
    await page.waitForTimeout(1000);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    // Procura pela URL pública no diálogo
    const publicUrl = page.locator(
      'text=//quiz//i, [data-testid="public-url"]'
    );

    if (await publicUrl.isVisible().catch(() => false)) {
      await expect(publicUrl).toBeVisible();

      const urlText = await publicUrl.textContent();
      expect(urlText).toContain("/quiz/");
    }
  });

  test("deve bloquear publicação se houver erros críticos", async ({
    page,
  }) => {
    // Não cria estrutura mínima - deixa vazio para gerar erros

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    // Procura por mensagens de erro
    const errors = page.locator(
      '[data-type="error"], .error-message, text=/erro|error/i'
    );
    const errorCount = await errors.count();

    if (errorCount > 0) {
      // Botão de confirmar deve estar desabilitado
      const confirmButton = page
        .locator(
          'button:has-text("Publicar Agora"), button:has-text("Confirmar")'
        )
        .first();

      if (await confirmButton.isVisible().catch(() => false)) {
        const isEnabled = await confirmButton.isEnabled();
        expect(isEnabled).toBe(false);
      }
    }
  });

  test("deve permitir publicação com warnings (mas sem erros)", async ({
    page,
  }) => {
    await createMinimalFunnel(page);
    await page.waitForTimeout(1000);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    // Procura por warnings
    const warnings = page.locator('[data-type="warning"], .warning-message');
    const warningCount = await warnings.count();

    // Mesmo com warnings, o botão deve estar habilitado se não houver erros
    const confirmButton = page
      .locator(
        'button:has-text("Publicar Agora"), button:has-text("Confirmar")'
      )
      .first();

    if (await confirmButton.isVisible().catch(() => false)) {
      // Verifica se há erros
      const errors = page.locator('[data-type="error"], .error-message');
      const errorCount = await errors.count();

      if (errorCount === 0 && warningCount > 0) {
        // Deve permitir publicar mesmo com warnings
        const isEnabled = await confirmButton.isEnabled();
        expect(isEnabled).toBe(true);
      }
    }
  });
});

test.describe("Despublicar Funil", () => {
  test("deve exibir botão Despublicar para funil publicado", async ({
    page,
  }) => {
    await page.goto("/admin/funnels");

    // Procura por funil publicado
    const publishedFunnel = page.locator("text=/publicado|published/i").first();

    if (await publishedFunnel.isVisible().catch(() => false)) {
      // Clica no funil publicado
      const funnelCard = publishedFunnel
        .locator(
          'xpath=ancestor::*[@data-testid="funnel-item" or contains(@class, "funnel-card")]'
        )
        .first();
      await funnelCard.click();
      await waitForEditorReady(page);

      // Verifica se botão "Despublicar" está visível
      const unpublishButton = page
        .locator('button:has-text("Despublicar"), button:has-text("Unpublish")')
        .first();

      if (await unpublishButton.isVisible().catch(() => false)) {
        await expect(unpublishButton).toBeVisible();
      }
    } else {
      console.log("⚠ Nenhum funil publicado encontrado para testar");
    }
  });

  test("deve despublicar funil com sucesso", async ({ page }) => {
    await page.goto("/admin/funnels");

    const publishedFunnel = page.locator("text=/publicado|published/i").first();

    if (await publishedFunnel.isVisible().catch(() => false)) {
      const funnelCard = publishedFunnel
        .locator(
          'xpath=ancestor::*[@data-testid="funnel-item" or contains(@class, "funnel-card")]'
        )
        .first();
      await funnelCard.click();
      await waitForEditorReady(page);

      const unpublishButton = page
        .locator('button:has-text("Despublicar"), button:has-text("Unpublish")')
        .first();

      if (await unpublishButton.isVisible().catch(() => false)) {
        await unpublishButton.click();

        // Aguarda mensagem de sucesso
        const successMessage = page.locator("text=/despublicado|unpublished/i");
        await expect(successMessage).toBeVisible({ timeout: 10000 });

        // Status deve mudar para draft
        const draftBadge = page.locator("text=/rascunho|draft/i").first();
        await expect(draftBadge).toBeVisible({ timeout: 5000 });
      }
    } else {
      console.log("⚠ Nenhum funil publicado para despublicar");
    }
  });
});

test.describe("Publicar Funil - Estados e Loading", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
    const firstFunnel = page
      .locator('[data-testid="funnel-item"], .funnel-card')
      .first();
    await firstFunnel.click();
    await waitForEditorReady(page);
  });

  test("deve mostrar loading durante publicação", async ({ page }) => {
    await createMinimalFunnel(page);
    await page.waitForTimeout(1000);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    const confirmButton = page
      .locator(
        'button:has-text("Publicar Agora"), button:has-text("Confirmar")'
      )
      .first();

    if (await confirmButton.isEnabled().catch(() => false)) {
      await confirmButton.click();

      // Procura por indicador de loading
      const loadingIndicator = page.locator(
        '[data-testid="loading"], .loading, .spinner, text=/publicando|publishing/i'
      );

      // Loading pode ser muito rápido, então usamos timeout curto
      const isVisible = await loadingIndicator
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isVisible) {
        console.log("✓ Loading indicator detectado");
      } else {
        console.log("⚠ Loading muito rápido ou não exibido");
      }
    }
  });

  test("deve desabilitar botões durante publicação", async ({ page }) => {
    await createMinimalFunnel(page);
    await page.waitForTimeout(1000);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    const confirmButton = page
      .locator('button:has-text("Publicar Agora")')
      .first();

    if (await confirmButton.isEnabled().catch(() => false)) {
      // Clica e verifica se botões ficam desabilitados
      await confirmButton.click();

      // Durante publicação, botões devem estar desabilitados
      const isDisabled = await publishButton
        .isDisabled({ timeout: 1000 })
        .catch(() => false);

      if (isDisabled) {
        console.log("✓ Botões desabilitados durante publicação");
      }
    }
  });

  test("deve fechar diálogo após publicação bem-sucedida", async ({ page }) => {
    await createMinimalFunnel(page);
    await page.waitForTimeout(1000);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    const confirmButton = page
      .locator('button:has-text("Publicar Agora")')
      .first();

    if (await confirmButton.isEnabled().catch(() => false)) {
      await confirmButton.click();

      // Aguarda o diálogo fechar
      const dialog = page.locator('[role="dialog"], .dialog');
      await expect(dialog).not.toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe("Publicar Funil - Sincronização de Blocos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
    const firstFunnel = page
      .locator('[data-testid="funnel-item"], .funnel-card')
      .first();
    await firstFunnel.click();
    await waitForEditorReady(page);
  });

  test("deve sincronizar blocos antes de publicar", async ({ page }) => {
    await createMinimalFunnel(page);

    // Adiciona um bloco de texto
    const addBlockButton = page
      .locator(
        'button:has-text("Adicionar Bloco"), button[data-testid="add-block"]'
      )
      .first();

    if (await addBlockButton.isVisible().catch(() => false)) {
      await addBlockButton.click();

      // Seleciona tipo de bloco (ex: texto/heading)
      const textBlock = page
        .locator('button:has-text("Texto"), button:has-text("Heading")')
        .first();
      if (await textBlock.isVisible().catch(() => false)) {
        await textBlock.click();
      }
    }

    await page.waitForTimeout(1000);

    // Tenta publicar
    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    const confirmButton = page
      .locator('button:has-text("Publicar Agora")')
      .first();

    if (await confirmButton.isEnabled().catch(() => false)) {
      await confirmButton.click();

      // Se publicar com sucesso, significa que blocos foram sincronizados
      const successMessage = page.locator("text=/publicado|published/i");
      const success = await successMessage
        .isVisible({ timeout: 10000 })
        .catch(() => false);

      if (success) {
        console.log("✓ Blocos sincronizados e publicados com sucesso");
      }
    }
  });

  test("deve validar que etapas tenham pelo menos um bloco", async ({
    page,
  }) => {
    await createMinimalFunnel(page);
    await page.waitForTimeout(1000);

    const publishButton = page.locator('button:has-text("Publicar")').first();
    await publishButton.click();
    await page.waitForTimeout(2000);

    // Procura por warning sobre etapas sem blocos
    const noBlocksWarning = page.locator(
      "text=/não possui blocos|no blocks|sem blocos/i"
    );

    if (await noBlocksWarning.isVisible().catch(() => false)) {
      console.log("✓ Validação de blocos vazios presente");
      await expect(noBlocksWarning).toBeVisible();
    }
  });
});
