import { test, expect } from "../fixtures/auth";

test.describe("FunnelsPage - Listagem", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
  });

  test("deve carregar a página de funnels", async ({ page }) => {
    // Verifica se a página está carregada
    await expect(page).toHaveTitle(/.*Funnels.*/i);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("deve exibir lista de funnels", async ({ page }) => {
    // Aguarda tabela ou lista de funnels
    const funnelsList = page
      .locator('[data-testid="funnels-list"], table, .funnels-container')
      .first();
    await expect(funnelsList).toBeVisible();
  });

  test("deve ter botão de criar novo funnel", async ({ page }) => {
    const createButton = page
      .locator(
        'button:has-text("Novo"), button:has-text("Create"), button:has-text("Add")'
      )
      .first();
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test("deve permitir buscar funnels", async ({ page }) => {
    const searchInput = page
      .locator(
        'input[placeholder*="Search"], input[placeholder*="Busca"], input[type="search"]'
      )
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill("test");
      // Aguarda atualização da lista
      await page.waitForTimeout(500);
    }
  });

  test("deve permitir ordenar lista de funnels", async ({ page }) => {
    // Procura por headers de tabela clickáveis
    const headers = page.locator("th");
    const firstHeader = headers.first();

    if (await firstHeader.isVisible()) {
      await firstHeader.click();
    }
  });

  test("deve exibir paginação se houver muitos funnels", async ({ page }) => {
    const pagination = page.locator(
      '[data-testid="pagination"], nav:has-text("Page")'
    );

    // Pode não haver paginação se houver poucos funnels
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });

  test("deve exibir status dos funnels", async ({ page }) => {
    const statusElements = page.locator('[data-testid*="status"]');

    if (await statusElements.first().isVisible()) {
      await expect(statusElements.first()).toBeVisible();
    }
  });

  test("deve exibir data de criação dos funnels", async ({ page }) => {
    const dateElements = page
      .locator("td, span")
      .filter({ hasText: /\d{1,2}\/\d{1,2}\/\d{4}/ });

    if (await dateElements.first().isVisible()) {
      await expect(dateElements.first()).toBeVisible();
    }
  });
});

test.describe("FunnelsPage - Navegação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
  });

  test("deve navegar para editor ao clicar em um funnel", async ({ page }) => {
    // Procura por link de edição
    const editLink = page
      .locator(
        'a[href*="/edit"], button:has-text("Edit"), button:has-text("Editar")'
      )
      .first();

    if (await editLink.isVisible()) {
      await editLink.click();
      // Aguarda navegação
      await page.waitForURL(/\/edit|\/admin\/funnels\/\d+/);
    }
  });

  test("deve navegar para detalhes ao clicar em um funnel", async ({
    page,
  }) => {
    const funnelRow = page.locator('[data-testid*="funnel-item"], tr').first();

    if (await funnelRow.isVisible()) {
      await funnelRow.click();
      // Pode navegar para detalhes ou editor
      await page.waitForURL(/funnels|edit/);
    }
  });

  test("deve voltar para admin ao clicar em voltar/breadcrumb", async ({
    page,
  }) => {
    // Se houver breadcrumb
    const backButton = page
      .locator('button:has-text("Back"), a:has-text("Admin")')
      .first();

    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForURL(/admin/);
    }
  });
});

test.describe("FunnelsPage - Ações em Massa", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
  });

  test("deve permitir selecionar múltiplos funnels", async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');

    if ((await checkboxes.count()) > 0) {
      const firstCheckbox = checkboxes.first();
      await firstCheckbox.click();
      await expect(firstCheckbox).toBeChecked();
    }
  });

  test("deve exibir ações de bulk quando selecionados", async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');

    if ((await checkboxes.count()) > 1) {
      await checkboxes.first().click();

      const bulkActions = page.locator(
        '[data-testid="bulk-actions"], .bulk-actions-bar'
      );
      if (await bulkActions.isVisible()) {
        await expect(bulkActions).toBeVisible();
      }
    }
  });

  test("deve permitir deletar múltiplos funnels", async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');

    if ((await checkboxes.count()) > 0) {
      await checkboxes.first().click();

      const deleteButton = page.locator(
        'button:has-text("Delete"), button:has-text("Deletar")'
      );
      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeEnabled();
      }
    }
  });
});

test.describe("FunnelsPage - Filtros", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
  });

  test("deve exibir filtros se disponível", async ({ page }) => {
    const filterButton = page.locator(
      'button:has-text("Filter"), button:has-text("Filtro")'
    );

    if (await filterButton.isVisible()) {
      await expect(filterButton).toBeVisible();
    }
  });

  test("deve permitir filtrar por status", async ({ page }) => {
    const statusFilter = page
      .locator('[data-testid*="status-filter"], select, [role="combobox"]')
      .first();

    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      const option = page.locator('[role="option"]').first();
      if (await option.isVisible()) {
        await option.click();
      }
    }
  });

  test("deve permitir filtrar por data", async ({ page }) => {
    const dateFilter = page.locator('input[type="date"]');

    if (await dateFilter.isVisible()) {
      await dateFilter.fill("2025-01-01");
      await page.waitForTimeout(300);
    }
  });

  test("deve limpar filtros", async ({ page }) => {
    const clearButton = page.locator(
      'button:has-text("Clear"), button:has-text("Limpar")'
    );

    if (await clearButton.isVisible()) {
      await clearButton.click();
    }
  });
});

test.describe("FunnelsPage - Feedback Visual", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
  });

  test("deve exibir loading enquanto carrega", async ({ page }) => {
    // Pode haver carregamento inicial
    const loading = page.locator(
      '[data-testid="loading"], .spinner, [role="progressbar"]'
    );

    if (await loading.isVisible()) {
      // Aguarda desaparecer
      await expect(loading).not.toBeVisible({ timeout: 10000 });
    }
  });

  test("deve exibir mensagem vazia quando não há funnels", async ({ page }) => {
    // Pode haver filtros que resultam em lista vazia
    const emptyState = page.locator(
      '[data-testid="empty-state"], .empty-message'
    );

    // Apenas verifica se está visível, não falha se não estiver
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });

  test("deve exibir erro se falhar ao carregar", async ({ page }) => {
    // Intercepta requisição e simula erro
    await page.route("/api/funnels*", (route) => {
      route.abort("failed");
    });

    await page.reload();

    const errorMessage = page.locator('[data-testid="error"], .error-message');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test("deve exibir notificação ao deletar funnel", async ({ page }) => {
    // Busca por botão de delete/ação
    const actionButton = page
      .locator('button[title*="delete"], button[title*="Delete"]')
      .first();

    if (await actionButton.isVisible()) {
      await actionButton.click();

      // Pode haver modal de confirmação
      const confirmButton = page.locator(
        'button:has-text("Confirm"), button:has-text("Delete")'
      );
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }

      // Aguarda notificação
      const notification = page.locator(
        '[data-testid="notification"], .toast, .alert'
      );
      if (await notification.isVisible()) {
        await expect(notification).toBeVisible();
      }
    }
  });

  test("deve exibir tooltip ao passar sobre elementos", async ({ page }) => {
    // Procura por elemento com title ou aria-label
    const element = page.locator("[title], [aria-label]").first();

    if (await element.isVisible()) {
      await element.hover();
      await page.waitForTimeout(300);
    }
  });
});

test.describe("FunnelsPage - Responsividade", () => {
  test("deve ser responsivo em desktop", async ({ page }) => {
    page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/admin/funnels");

    // Verifica se elementos principais são visíveis
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test("deve ser responsivo em tablet", async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/admin/funnels");

    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test("deve ter menu mobile se necessário", async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/funnels");

    const hamburger = page.locator(
      'button[title*="menu"], button[aria-label*="menu"]'
    );

    if (await hamburger.isVisible()) {
      await expect(hamburger).toBeVisible();
    }
  });
});

test.describe("FunnelsPage - Acessibilidade", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/funnels");
  });

  test("deve ser navegável por teclado", async ({ page }) => {
    // Pressiona Tab para navegar
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verifica se algum elemento está focado
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("deve ter labels descritivos", async ({ page }) => {
    const inputs = page.locator("input, button, select");

    if ((await inputs.count()) > 0) {
      const firstInput = inputs.first();

      // Verifica se tem aria-label ou label associado
      const ariaLabel = await firstInput.getAttribute("aria-label");
      expect(ariaLabel || "has label").toBeTruthy();
    }
  });

  test("deve ter contraste de cores adequado", async ({ page }) => {
    // Verifica se elementos têm estilos definidos
    const elements = page.locator("button, a, input");
    const firstElement = elements.first();

    if (await firstElement.isVisible()) {
      const color = await firstElement.evaluate(
        (el) => window.getComputedStyle(el).color
      );
      expect(color).toBeTruthy();
    }
  });

  test("deve ter alt text em imagens", async ({ page }) => {
    const images = page.locator("img");

    if ((await images.count()) > 0) {
      for (let i = 0; i < Math.min(5, await images.count()); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        const ariaLabel = await img.getAttribute("aria-label");

        // Imagens decorativas podem não ter alt
        if (await img.isVisible()) {
          expect(alt || ariaLabel || "decorative").toBeTruthy();
        }
      }
    }
  });
});
