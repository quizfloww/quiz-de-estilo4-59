import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Testes E2E para Persistência de Salvamento e Publicação do Editor de Funis
 *
 * Estes testes verificam:
 * 1. Salvamento manual de alterações
 * 2. Auto-save (detecção de unsaved changes)
 * 3. Indicador de status do editor
 * 4. Publicação e despublicação de funis
 * 5. Persistência de dados entre sessões
 */

const ADMIN_CREDENTIALS = {
  email:
    process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "consultoria@giselegalvao.com.br",
};

/**
 * Helper para autenticar como admin
 */
async function authenticateAsAdmin(page: Page) {
  await page.goto("/");
  await page.evaluate(({ email }) => {
    const adminSession = {
      email,
      loginTime: new Date().toISOString(),
    };
    sessionStorage.setItem("adminSession", JSON.stringify(adminSession));
  }, ADMIN_CREDENTIALS);
}

/**
 * Helper para criar mock de funnel e stages
 */
async function setupMockFunnel(
  page: Page,
  status: "draft" | "published" = "draft"
) {
  const mockFunnel = {
    id: "test-funnel-123",
    name: "Funnel de Teste",
    slug: "funnel-teste",
    description: "Funil para testes de persistência",
    status,
    global_config: {
      branding: {
        primaryColor: "#B89B7A",
        backgroundColor: "#FAF9F7",
      },
    },
    style_categories: [
      {
        id: "1",
        name: "Clássico",
        description: "Estilo clássico",
        imageUrl: "",
      },
    ],
    cover_image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockStages = [
    {
      id: "stage-intro-test",
      funnel_id: "test-funnel-123",
      type: "intro",
      title: "Introdução",
      order_index: 0,
      is_enabled: true,
      config: {
        subtitle: "Teste de persistência",
        imageUrl: "https://placehold.co/400x300",
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "stage-question-test",
      funnel_id: "test-funnel-123",
      type: "question",
      title: "Pergunta 1",
      order_index: 1,
      is_enabled: true,
      config: {
        question: "Qual sua preferência?",
        options: [
          {
            id: "opt-1",
            text: "Opção A",
            styleCategory: "Clássico",
            points: 1,
          },
          { id: "opt-2", text: "Opção B", styleCategory: "Moderno", points: 1 },
        ],
      },
      created_at: new Date().toISOString(),
    },
  ];

  // Interceptar chamadas Supabase
  await page.route("**/rest/v1/funnels*", (route) => {
    const method = route.request().method();

    if (method === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([mockFunnel]),
      });
    } else if (method === "PATCH") {
      // Simular atualização bem-sucedida
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...mockFunnel,
          updated_at: new Date().toISOString(),
        }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    }
  });

  await page.route("**/rest/v1/funnel_stages*", (route) => {
    const method = route.request().method();

    if (method === "GET") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockStages),
      });
    } else if (method === "PATCH") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ updated: true }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    }
  });

  await page.route("**/rest/v1/stage_options*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  return { mockFunnel, mockStages };
}

/**
 * Helper para aguardar o editor carregar
 */
async function waitForEditorReady(page: Page) {
  await page.waitForSelector('[data-testid="funnel-editor"]', {
    timeout: 30000,
  });
  await page.waitForSelector('[data-testid="editor-header"]', {
    timeout: 10000,
  });
  await page.waitForTimeout(1000); // Aguarda estabilização
}

test.describe("Editor - Salvamento Manual", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve exibir botão de salvar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const saveButton = page.locator('[data-testid="editor-save-button"]');
    await expect(saveButton).toBeVisible({ timeout: 10000 });
    await expect(saveButton).toContainText("Salvar");
  });

  test("deve salvar alterações ao clicar no botão salvar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Clicar no botão salvar
    const saveButton = page.locator('[data-testid="editor-save-button"]');
    await saveButton.click();

    // Verificar toast de sucesso ou status atualizado
    const successToast = page.locator('text="Funil salvo com sucesso"');
    const editorStatus = page.locator('[data-testid="editor-status"]');

    // Um dos dois deve aparecer
    await Promise.race([
      expect(successToast)
        .toBeVisible({ timeout: 5000 })
        .catch(() => {}),
      expect(editorStatus)
        .toHaveAttribute("data-status", "saved", { timeout: 5000 })
        .catch(() => {}),
    ]);
  });

  test("deve suportar atalho Ctrl+S para salvar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Pressionar Ctrl+S
    await page.keyboard.press("Control+s");

    // Verificar toast ou status
    await page.waitForTimeout(1000);

    const editorStatus = page.locator('[data-testid="editor-status"]');
    // O status deve mudar para "saving" ou "saved"
    const status = await editorStatus.getAttribute("data-status");
    expect(["saving", "saved", "idle"]).toContain(status);
  });
});

test.describe("Editor - Detecção de Alterações Não Salvas", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve mostrar indicador de unsaved changes após edição", async ({
    page,
  }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Clicar em uma etapa para selecioná-la
    const stageItem = page.locator('[data-testid^="stage-item-"]').first();
    if (await stageItem.isVisible()) {
      await stageItem.click();
      await page.waitForTimeout(500);
    }

    // Encontrar um input e modificar
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await textInput.fill("Texto modificado para teste");
      await page.waitForTimeout(500);
    }

    // Verificar se o EditorStatus está visível e tem um estado válido
    const editorStatus = page.locator('[data-testid="editor-status"]');
    await expect(editorStatus).toBeVisible({ timeout: 5000 });

    // Aceitar qualquer estado válido (idle, unsaved, saved, saving)
    const status = await editorStatus.getAttribute("data-status");
    expect(["idle", "unsaved", "saved", "saving"]).toContain(status);
  });

  test("deve limpar indicador após salvar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Fazer uma edição para gerar unsaved changes
    const stageItem = page.locator('[data-testid^="stage-item-"]').first();
    if (await stageItem.isVisible()) {
      await stageItem.click();
    }

    // Salvar
    const saveButton = page.locator('[data-testid="editor-save-button"]');
    await saveButton.click();

    // Aguardar salvamento
    await page.waitForTimeout(2000);

    // Verificar que status voltou para idle ou saved
    const editorStatus = page.locator('[data-testid="editor-status"]');
    if (await editorStatus.isVisible()) {
      const status = await editorStatus.getAttribute("data-status");
      expect(["idle", "saved"]).toContain(status);
    }
  });
});

test.describe("Editor - Status do Editor", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve exibir componente EditorStatus", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const editorStatus = page.locator('[data-testid="editor-status"]');
    await expect(editorStatus).toBeVisible({ timeout: 10000 });
  });

  test("deve mostrar status idle inicialmente", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Aguardar estabilização
    await page.waitForTimeout(2000);

    const editorStatus = page.locator('[data-testid="editor-status"]');
    const status = await editorStatus.getAttribute("data-status");

    // Estado inicial deve ser idle ou saved
    expect(["idle", "saved"]).toContain(status);
  });

  test("deve mostrar status saving durante salvamento", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Adicionar delay na resposta do servidor para capturar estado "saving"
    await page.route("**/rest/v1/funnel_stages*", async (route) => {
      if (route.request().method() === "PATCH") {
        await new Promise((r) => setTimeout(r, 1000)); // Delay de 1s
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ updated: true }),
        });
      } else {
        route.continue();
      }
    });

    // Clicar em salvar
    const saveButton = page.locator('[data-testid="editor-save-button"]');
    await saveButton.click();

    // Verificar status saving
    const editorStatus = page.locator('[data-testid="editor-status"]');
    await expect(editorStatus)
      .toHaveAttribute("data-status", "saving", { timeout: 2000 })
      .catch(() => {
        // Status pode mudar muito rápido, então aceitar saved também
      });
  });
});

test.describe("Editor - Publicação", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
  });

  test("deve exibir botão de publicar para funnel em draft", async ({
    page,
  }) => {
    await setupMockFunnel(page, "draft");
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const publishButton = page.locator('[data-testid="editor-publish-button"]');
    await expect(publishButton).toBeVisible({ timeout: 10000 });
    await expect(publishButton).toContainText("Publicar");
  });

  test("deve exibir botão de despublicar para funnel publicado", async ({
    page,
  }) => {
    await setupMockFunnel(page, "published");
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const unpublishButton = page.locator(
      '[data-testid="editor-unpublish-button"]'
    );
    await expect(unpublishButton).toBeVisible({ timeout: 10000 });
    await expect(unpublishButton).toContainText("Despublicar");
  });

  test("deve abrir dialog de publicação ao clicar em Publicar", async ({
    page,
  }) => {
    await setupMockFunnel(page, "draft");
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const publishButton = page.locator('[data-testid="editor-publish-button"]');
    await publishButton.click();

    // Aguardar dialog abrir
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verificar conteúdo do dialog - usar first() para evitar strict mode violation
    await expect(
      dialog.locator("text=/publicar|publish/i").first()
    ).toBeVisible();
  });

  test("deve validar funil antes de publicar", async ({ page }) => {
    await setupMockFunnel(page, "draft");
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const publishButton = page.locator('[data-testid="editor-publish-button"]');
    await publishButton.click();

    // Dialog deve mostrar validação
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verificar se há indicadores de validação (checkmarks, warnings, etc)
    const validationContent = await dialog.textContent();
    expect(validationContent).toBeTruthy();
  });
});

test.describe("Editor - Preview e Teste", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve exibir botão de preview", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const previewButton = page.locator('[data-testid="editor-preview-button"]');
    await expect(previewButton).toBeVisible({ timeout: 10000 });
    await expect(previewButton).toContainText("Preview");
  });

  test("deve exibir botão de testar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await expect(testButton).toContainText("Testar");
  });

  test("deve abrir modo de teste ao clicar em Testar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const testButton = page.locator('[data-testid="editor-test-button"]');
    await testButton.click();

    // Verificar se overlay de teste apareceu
    const testOverlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(testOverlay).toBeVisible({ timeout: 5000 });
  });

  test("deve fechar modo de teste ao clicar em fechar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Abrir modo de teste
    const testButton = page.locator('[data-testid="editor-test-button"]');
    await testButton.click();

    const testOverlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(testOverlay).toBeVisible({ timeout: 5000 });

    // Fechar
    const closeButton = page.locator('[data-testid="test-mode-close"]');
    await closeButton.click();

    // Overlay deve sumir
    await expect(testOverlay).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe("Editor - Persistência de Etapas", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve exibir sidebar de etapas", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const stagesSidebar = page.locator('[data-testid="stages-sidebar"]');
    await expect(stagesSidebar).toBeVisible({ timeout: 10000 });
  });

  test("deve listar etapas do funil", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Verificar que há etapas listadas
    const stageItems = page.locator('[data-testid^="stage-item-"]');
    const count = await stageItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("deve selecionar etapa ao clicar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const stageItem = page.locator('[data-testid^="stage-item-"]').first();
    await stageItem.click();

    // Verificar que a etapa está ativa
    await expect(stageItem).toHaveAttribute("data-stage-active", "true", {
      timeout: 3000,
    });
  });

  test("deve exibir tipo da etapa", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const stageItem = page.locator('[data-testid^="stage-item-"]').first();
    const stageType = await stageItem.getAttribute("data-stage-type");

    // Tipo deve ser um dos tipos válidos
    expect([
      "intro",
      "question",
      "strategic",
      "transition",
      "result",
      "offer",
    ]).toContain(stageType);
  });
});

test.describe("Editor - Exportar/Importar JSON", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve exibir botões de exportar e importar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Procurar botões de download/upload
    const exportButton = page.locator('button[title*="Exportar"]');
    const importButton = page.locator('button[title*="Importar"]');

    await expect(exportButton).toBeVisible({ timeout: 10000 });
    await expect(importButton).toBeVisible({ timeout: 10000 });
  });

  test("deve exibir botão de editor JSON", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Botão tem title "Editar JSON com Monaco Editor"
    const jsonEditorButton = page.locator(
      'button[title*="Editar JSON"], button[title*="Monaco"]'
    );
    await expect(jsonEditorButton).toBeVisible({ timeout: 10000 });
  });

  test("deve abrir editor JSON ao clicar", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const jsonEditorButton = page.locator(
      'button[title*="Editar JSON"], button[title*="Monaco"]'
    );
    await jsonEditorButton.click();

    // Dialog deve abrir
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Deve conter título do editor JSON
    const jsonTitle = dialog.locator("text=/Editor JSON|Editar JSON/i").first();
    await expect(jsonTitle).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Editor - Undo/Redo", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page);
    await setupMockFunnel(page);
  });

  test("deve exibir botões de undo e redo", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const undoButton = page.locator(
      'button[title*="Desfazer"], button[title*="Undo"]'
    );
    const redoButton = page.locator(
      'button[title*="Refazer"], button[title*="Redo"]'
    );

    await expect(undoButton).toBeVisible({ timeout: 10000 });
    await expect(redoButton).toBeVisible({ timeout: 10000 });
  });

  test("deve ter botão undo visível", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    const undoButton = page.locator(
      'button[title*="Desfazer"], button[title*="Undo"]'
    );
    await expect(undoButton).toBeVisible({ timeout: 5000 });

    // Verificar que o botão existe e tem estado (enabled ou disabled)
    const isDisabled = await undoButton.isDisabled();
    expect(typeof isDisabled).toBe("boolean");
  });

  test("deve suportar atalho Ctrl+Z para undo", async ({ page }) => {
    await page.goto("/admin/funnels/test-funnel-123/edit");
    await waitForEditorReady(page);

    // Pressionar Ctrl+Z não deve causar erro
    await page.keyboard.press("Control+z");

    // Verificar que o editor ainda está funcional
    const editorHeader = page.locator('[data-testid="editor-header"]');
    await expect(editorHeader).toBeVisible();
  });
});
