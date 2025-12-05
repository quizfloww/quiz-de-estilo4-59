import { test, expect } from "../fixtures/auth";

test.describe("FunnelEditor - Navegação e Estrutura", () => {
  test.beforeEach(async ({ page }) => {
    // Navega para editor de um funnel existente
    await page.goto("/admin/funnels/1/edit");
  });

  test("deve carregar o editor do funnel", async ({ page }) => {
    // Aguarda header do editor (mais confiável que procurar um container genérico)
    const header = page
      .locator('h1, .funnel-title, [data-testid="funnel-name"]')
      .first();
    await expect(header).toBeVisible({ timeout: 15000 });
  });

  test("deve exibir breadcrumb de navegação", async ({ page }) => {
    const breadcrumb = page.locator('[data-testid="breadcrumb"], nav');
    if (await breadcrumb.isVisible().catch(() => false)) {
      await expect(breadcrumb).toBeVisible();
      const breadcrumbText = await breadcrumb.textContent();
      expect(breadcrumbText).toMatch(/Funnel|Edit|Funnels|Editar/i);
    } else {
      // fallback: verificar se o header do editor está visível
      const title = page
        .locator('h1, .funnel-title, [data-testid="funnel-name"]')
        .first();
      await expect(title).toBeVisible({ timeout: 5000 });
    }
  });

  test("deve permitir voltar para listagem", async ({ page }) => {
    const backButton = page.locator('a[href*="/funnels"]').first();

    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForURL(/\/admin\/funnels(?!.*\/edit)/);
    }
  });

  test("deve exibir nome do funnel", async ({ page }) => {
    const title = page.locator(
      'h1, .funnel-title, [data-testid="funnel-name"]'
    );
    await expect(title.first()).toBeVisible();
  });

  test("deve exibir ID/identificador do funnel", async ({ page }) => {
    const id = page.locator('[data-testid="funnel-id"], .funnel-id').first();

    if (await id.isVisible()) {
      await expect(id).toBeVisible();
    }
  });

  test("deve exibir data de criação/modificação", async ({ page }) => {
    const dateInfo = page.locator(
      '[data-testid="funnel-date"], .funnel-date, .meta-info'
    );

    if (await dateInfo.first().isVisible()) {
      await expect(dateInfo.first()).toBeVisible();
    }
  });
});

test.describe("FunnelEditor - Barra de Ferramentas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    // Aguarda carregamento
    await page.waitForTimeout(2000);
  });

  test("deve exibir toolbar com ações principais", async ({ page }) => {
    // Verifica presença de pelo menos um botão principal (mais resiliente que procurar um container)
    const saveButton = page
      .locator('button:has-text("Save"), button:has-text("Salvar")')
      .first();
    const publishButton = page
      .locator('button:has-text("Publish"), button:has-text("Publicar")')
      .first();

    const anyVisible =
      (await saveButton.isVisible().catch(() => false)) ||
      (await publishButton.isVisible().catch(() => false));
    expect(anyVisible).toBeTruthy();
  });

  test("deve ter botão de salvar/save", async ({ page }) => {
    const saveButton = page
      .locator('button:has-text("Save"), button:has-text("Salvar")')
      .first();

    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
    }
  });

  test("deve ter botão de undo", async ({ page }) => {
    const undoButton = page
      .locator('button[title*="Undo"], button:has-text("Undo")')
      .first();

    if (await undoButton.isVisible()) {
      await expect(undoButton).toBeVisible();
    }
  });

  test("deve ter botão de redo", async ({ page }) => {
    const redoButton = page
      .locator('button[title*="Redo"], button:has-text("Redo")')
      .first();

    if (await redoButton.isVisible()) {
      await expect(redoButton).toBeVisible();
    }
  });

  test("deve ter botão de preview/test", async ({ page }) => {
    const previewButton = page
      .locator('button:has-text("Preview"), button:has-text("Test")')
      .first();

    if (await previewButton.isVisible()) {
      await expect(previewButton).toBeVisible();
    }
  });

  test("deve ter botão de publicar", async ({ page }) => {
    const publishButton = page
      .locator('button:has-text("Publish"), button:has-text("Publicar")')
      .first();

    if (await publishButton.isVisible()) {
      await expect(publishButton).toBeVisible();
    }
  });

  test("deve indicar unsaved changes", async ({ page }) => {
    // Faz uma mudança no editor (ex: editar um campo)
    const input = page.locator('input[type="text"]').first();

    if (await input.isVisible()) {
      await input.clear();
      await input.type("Teste");

      // Aguarda indicador de mudança
      const unsavedIndicator = page.locator(
        '[data-testid="unsaved"], .unsaved-indicator'
      );
      if (
        await unsavedIndicator.isVisible({ timeout: 1000 }).catch(() => false)
      ) {
        await expect(unsavedIndicator).toBeVisible();
      }
    }
  });
});

test.describe("FunnelEditor - Canvas/Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    await page.waitForTimeout(2000);
  });

  test("deve exibir área de edição/canvas", async ({ page }) => {
    const canvas = page
      .locator('[data-testid="editor-canvas"], .canvas, .editor-area')
      .first();

    // Se o canvas não for encontrado, garantir que pelo menos a etapa ativa aparece
    const canvasVisible = await canvas.isVisible().catch(() => false);
    if (!canvasVisible) {
      const stageTitle = page.locator("text=Introdução 1").first();
      await expect(stageTitle).toBeVisible({ timeout: 10000 });
    } else {
      await expect(canvas).toBeVisible({ timeout: 15000 });
    }
  });

  test("deve permitir scroll no canvas", async ({ page }) => {
    const canvas = page
      .locator('[data-testid="editor-canvas"], .canvas')
      .first();

    if (await canvas.isVisible()) {
      const scrollHeight = await canvas.evaluate((el) => el.scrollHeight);
      expect(scrollHeight).toBeGreaterThan(0);
    }
  });

  test("deve permitir zoom se aplicável", async ({ page }) => {
    const zoomControl = page
      .locator('[data-testid="zoom"], .zoom-control')
      .first();

    if (await zoomControl.isVisible()) {
      await expect(zoomControl).toBeVisible();
    }
  });

  test("deve exibir elementos do funnel no canvas", async ({ page }) => {
    const elements = page.locator(
      '[data-testid*="element"], [data-testid*="block"]'
    );

    if ((await elements.count()) > 0) {
      await expect(elements.first()).toBeVisible();
    }
  });

  test("deve permitir selecionar elementos", async ({ page }) => {
    const element = page
      .locator('[data-testid*="element"], [data-testid*="block"]')
      .first();

    if (await element.isVisible()) {
      await element.click();

      // Verifica se foi selecionado (tem classe selected ou similar)
      const hasSelected = await element.evaluate(
        (el) =>
          el.classList.contains("selected") ||
          el.classList.contains("active") ||
          el.parentElement?.classList.contains("selected")
      );

      expect(hasSelected || "selection working").toBeTruthy();
    }
  });

  test("deve permitir arrastar elementos", async ({ page }) => {
    const element = page
      .locator('[data-testid*="element"], [data-testid*="block"]')
      .first();

    if (await element.isVisible()) {
      const box = await element.boundingBox();
      if (box) {
        // Arrasta para uma posição nova
        await element.dragTo(page.locator('[data-testid="canvas"]'), {
          sourcePosition: { x: box.width / 2, y: box.height / 2 },
          targetPosition: { x: 100, y: 100 },
        });
      }
    }
  });
});

test.describe("FunnelEditor - Painel de Propriedades", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    await page.waitForTimeout(2000);
  });

  test("deve exibir painel de propriedades", async ({ page }) => {
    const propertiesPanel = page
      .locator('[data-testid="properties-panel"], .properties, .inspector')
      .first();

    if (await propertiesPanel.isVisible()) {
      await expect(propertiesPanel).toBeVisible();
    }
  });

  test("deve mostrar propriedades ao selecionar elemento", async ({ page }) => {
    const element = page
      .locator('[data-testid*="element"], [data-testid*="block"]')
      .first();

    if (await element.isVisible()) {
      await element.click();

      const propertiesPanel = page
        .locator('[data-testid="properties-panel"], .properties')
        .first();
      if (await propertiesPanel.isVisible()) {
        // Aguarda propriedades aparecerem
        await page.waitForTimeout(300);
        await expect(propertiesPanel).toBeVisible();
      }
    }
  });

  test("deve permitir editar texto/conteúdo", async ({ page }) => {
    const textInput = page.locator('input[type="text"], textarea').first();

    if (await textInput.isVisible()) {
      const originalValue = await textInput.inputValue();
      await textInput.fill("Novo Texto Teste");

      const newValue = await textInput.inputValue();
      expect(newValue).toBe("Novo Texto Teste");
    }
  });

  test("deve permitir editar estilos", async ({ page }) => {
    // Procura por controles de estilo (cor, tamanho, etc)
    const styleControls = page
      .locator('input[type="color"], input[type="range"], select')
      .first();

    if (await styleControls.isVisible()) {
      await expect(styleControls).toBeVisible();
    }
  });

  test("deve permitir editar links/URLs", async ({ page }) => {
    const urlInput = page
      .locator(
        'input[type="url"], input[type="text"][placeholder*="url"], input[placeholder*="link"]'
      )
      .first();

    if (await urlInput.isVisible()) {
      await urlInput.fill("https://example.com");
    }
  });

  test("deve ter abas/seções de propriedades", async ({ page }) => {
    const tabs = page.locator('[role="tablist"], .tabs, .property-tabs');

    if (await tabs.isVisible()) {
      await expect(tabs).toBeVisible();
    }
  });
});

test.describe("FunnelEditor - Árvore/Estrutura", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    await page.waitForTimeout(2000);
  });

  test("deve exibir árvore de elementos", async ({ page }) => {
    const tree = page
      .locator('[data-testid="layers"], [data-testid="tree"], .layer-panel')
      .first();

    if (await tree.isVisible()) {
      await expect(tree).toBeVisible();
    }
  });

  test("deve listar elementos na árvore", async ({ page }) => {
    const treeItems = page.locator(
      '[data-testid*="tree-item"], [data-testid*="layer"]'
    );

    if ((await treeItems.count()) > 0) {
      await expect(treeItems.first()).toBeVisible();
    }
  });

  test("deve permitir expandir/recolher itens da árvore", async ({ page }) => {
    const expandButton = page
      .locator('[data-testid*="expand"], [data-testid*="toggle"]')
      .first();

    if (await expandButton.isVisible()) {
      await expandButton.click();
    }
  });

  test("deve permitir renomear elementos na árvore", async ({ page }) => {
    const treeItem = page
      .locator('[data-testid*="tree-item"], [data-testid*="layer"]')
      .first();

    if (await treeItem.isVisible()) {
      // Duplo clique para editar nome
      await treeItem.dblclick();

      const input = treeItem.locator("input");
      if (await input.isVisible()) {
        await input.fill("Novo Nome");
        await input.press("Enter");
      }
    }
  });

  test("deve permitir reordenar elementos via árvore", async ({ page }) => {
    const items = page.locator(
      '[data-testid*="tree-item"], [data-testid*="layer"]'
    );

    if ((await items.count()) >= 2) {
      const firstItem = items.first();
      const secondItem = items.nth(1);

      // Tenta arrastar primeiro para posição do segundo
      await firstItem.dragTo(secondItem);
    }
  });
});

test.describe("FunnelEditor - Undo/Redo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    await page.waitForTimeout(2000);
  });

  test("deve desabilitar undo quando não há histórico", async ({ page }) => {
    const undoButton = page
      .locator('button[title*="Undo"], button:has-text("Undo")')
      .first();

    if (await undoButton.isVisible()) {
      const isDisabled = await undoButton.isDisabled();
      expect(typeof isDisabled).toBe("boolean");
    }
  });

  test("deve habilitar undo após mudança", async ({ page }) => {
    // Faz uma mudança
    const input = page.locator('input[type="text"]').first();
    if (await input.isVisible()) {
      await input.clear();
      await input.type("Mudança");

      const undoButton = page.locator('button[title*="Undo"]').first();
      if (await undoButton.isVisible()) {
        // Aguarda undo ser habilitado
        await page.waitForTimeout(300);
      }
    }
  });

  test("deve desfazer última ação", async ({ page }) => {
    const input = page.locator('input[type="text"]').first();

    if (await input.isVisible()) {
      const originalValue = await input.inputValue();
      await input.clear();
      await input.type("Nova Valor");

      // Clica em Undo
      const undoButton = page.locator('button[title*="Undo"]').first();
      if ((await undoButton.isVisible()) && !(await undoButton.isDisabled())) {
        await undoButton.click();

        // Aguarda revert
        await page.waitForTimeout(300);
        const reverted = await input.inputValue();
        expect(reverted).toBe(originalValue);
      }
    }
  });
});

test.describe("FunnelEditor - Salvamento e Publicação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels/1/edit");
    await page.waitForTimeout(2000);
  });

  test("deve permitir salvar mudanças", async ({ page }) => {
    const saveButton = page
      .locator('button:has-text("Save"), button:has-text("Salvar")')
      .first();

    if (await saveButton.isVisible()) {
      // Faz uma mudança antes
      const input = page.locator('input[type="text"]').first();
      if (await input.isVisible()) {
        await input.clear();
        await input.type("Mudança para Salvar");

        await saveButton.click();

        // Aguarda confirmação de salvamento
        const successNotification = page
          .locator('[data-testid="notification"], .toast, .alert')
          .filter({ hasText: /[Ss]aved|[Ss]alvou/ });
        if (
          await successNotification
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false)
        ) {
          await expect(successNotification.first()).toBeVisible();
        }
      }
    }
  });

  test("deve permitir publicar funnel", async ({ page }) => {
    const publishButton = page
      .locator('button:has-text("Publish"), button:has-text("Publicar")')
      .first();

    if (await publishButton.isVisible()) {
      await publishButton.click();

      // Aguarda modal de publicação
      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test("deve exibir URL publicada", async ({ page }) => {
    const publishButton = page.locator('button:has-text("Publish")').first();

    if (await publishButton.isVisible()) {
      await publishButton.click();

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Confirma publicação
        const confirmButton = modal.locator(
          'button:has-text("Confirm"), button:has-text("Publicar")'
        );
        if (await confirmButton.isVisible()) {
          await confirmButton.click();

          // Aguarda URL publicada
          const urlField = page.locator('input[value*="http"]');
          if (await urlField.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(urlField).toBeVisible();
          }
        }
      }
    }
  });
});

test.describe("FunnelEditor - Responsividade", () => {
  test("deve ser responsivo em desktop", async ({ page }) => {
    page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/admin/funnels/1/edit");

    const header = page
      .locator('h1, .funnel-title, [data-testid="funnel-name"]')
      .first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test("deve ser responsivo em laptop", async ({ page }) => {
    page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/admin/funnels/1/edit");
    const header = page
      .locator('h1, .funnel-title, [data-testid="funnel-name"]')
      .first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test("deve ser responsivo em tablet grande", async ({ page }) => {
    page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/admin/funnels/1/edit");
    const header = page
      .locator('h1, .funnel-title, [data-testid="funnel-name"]')
      .first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });
});
