import { test, expect, Page } from "@playwright/test";

/**
 * Testes E2E para o Modo de Teste do Editor de Funis
 *
 * Estes testes verificam o fluxo completo do quiz quando executado
 * dentro do editor em /admin/funnels, usando o botão "Testar".
 *
 * Fluxo testado:
 * 1. Acessa /admin/funnels (com autenticação)
 * 2. Clica em "Usar" no template "Quiz de Estilo Pessoal"
 * 3. Clica em "Testar" no editor
 * 4. Completa intro → questões → resultado dentro do overlay
 */

/**
 * Helper para autenticar como admin antes de cada teste
 * Injeta a sessão admin no sessionStorage
 */
async function authenticateAsAdmin(page: Page) {
  // Navega para qualquer página para poder usar sessionStorage
  await page.goto("/");

  // Injeta sessão de admin válida no sessionStorage
  await page.evaluate(() => {
    const adminSession = {
      email: "consultoria@giselegalvao.com.br",
      loginTime: new Date().toISOString(),
    };
    sessionStorage.setItem("adminSession", JSON.stringify(adminSession));
  });
}

test.describe("Editor - Modo de Teste do Quiz de Estilo Pessoal", () => {
  // Como estamos testando no editor local, precisamos garantir
  // que o Supabase está disponível ou mockado

  test.beforeEach(async ({ page }) => {
    // Timeout estendido para carregamento do editor
    test.setTimeout(120000);

    // Autenticar como admin
    await authenticateAsAdmin(page);
  });

  test("deve abrir o overlay de teste ao clicar em Testar", async ({
    page,
  }) => {
    // Navega para a página de funis
    await page.goto("/admin/funnels");

    // Aguarda a página carregar
    await page.waitForLoadState("networkidle");

    // Clica em "Usar" no template Quiz de Estilo Pessoal
    const useButton = page.locator('[data-testid="template-use-quiz"]');
    await expect(useButton).toBeVisible({ timeout: 10000 });
    await useButton.click();

    // Aguarda o editor carregar (deve redirecionar para /admin/funnels/{id}/edit)
    await page.waitForURL(/\/admin\/funnels\/.*\/edit/, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Clica no botão "Testar"
    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await testButton.click();

    // Verifica se o overlay de teste foi aberto
    const overlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Verifica elementos do overlay
    await expect(page.getByText("Modo de Teste")).toBeVisible();
    await expect(page.getByText("Etapa 1 de")).toBeVisible();
  });

  test("deve completar a etapa de intro no modo teste", async ({ page }) => {
    // Navega direto para criar um funil do template
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    // Usa o template
    const useButton = page.locator('[data-testid="template-use-quiz"]');
    await expect(useButton).toBeVisible({ timeout: 10000 });
    await useButton.click();

    // Aguarda o editor
    await page.waitForURL(/\/admin\/funnels\/.*\/edit/, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Abre modo teste
    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await testButton.click();

    // Aguarda overlay
    const overlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Preenche o nome no input da intro
    const nameInput = page.locator('[data-testid="test-mode-input"]');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill("Maria Teste");

    // Clica em continuar
    const continueButton = page.locator('[data-testid="test-mode-continue"]');
    await expect(continueButton).toBeEnabled({ timeout: 3000 });
    await continueButton.click();

    // Verifica que avançou para a próxima etapa (questões)
    await expect(page.getByText("Etapa 2 de")).toBeVisible({ timeout: 5000 });
  });

  test("deve navegar pelas questões de estilo no modo teste", async ({
    page,
  }) => {
    // Setup: criar funil e abrir modo teste
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const useButton = page.locator('[data-testid="template-use-quiz"]');
    await expect(useButton).toBeVisible({ timeout: 10000 });
    await useButton.click();

    await page.waitForURL(/\/admin\/funnels\/.*\/edit/, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Aguarda um pouco para o editor carregar completamente
    await page.waitForTimeout(1000);

    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await testButton.click();

    const overlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Verifica que o overlay está aberto antes de continuar
    await expect(page.getByText("Modo de Teste")).toBeVisible({
      timeout: 3000,
    });

    // Completa intro
    const nameInput = page.locator('[data-testid="test-mode-input"]');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill("Maria Teste");

    const continueButton = page.locator('[data-testid="test-mode-continue"]');
    await expect(continueButton).toBeEnabled({ timeout: 3000 });
    await continueButton.click();

    // Aguarda primeira questão de estilo (pode demorar um pouco para carregar)
    await page.waitForTimeout(500);
    await expect(page.getByText("Etapa 2 de")).toBeVisible({ timeout: 10000 });

    // Verifica que ainda estamos no overlay
    await expect(overlay).toBeVisible();

    // Seleciona 3 opções (questões de estilo requerem 3 seleções)
    // As opções são renderizadas pelo QuizOption dentro do overlay
    const options = overlay.locator('[data-testid^="quiz-option-"]');
    await expect(options.first()).toBeVisible({ timeout: 10000 });

    const optionCount = await options.count();

    if (optionCount >= 3) {
      // Clica nas 3 primeiras opções
      await options.nth(0).click();
      await page.waitForTimeout(300);

      await options.nth(1).click();
      await page.waitForTimeout(300);

      await options.nth(2).click();
      await page.waitForTimeout(500);

      // Como autoAdvance: false nas questões de estilo (multiSelect: 3),
      // o usuário precisa clicar no botão "Continuar" para avançar
      const continueBtn = overlay.locator('[data-testid="test-mode-continue"]');
      await expect(continueBtn).toBeEnabled({ timeout: 3000 });
      await continueBtn.click();

      // Aguarda a próxima etapa carregar
      await page.waitForTimeout(500);

      // Verifica se avançou para a próxima etapa (Etapa 3)
      await expect(page.getByText("Etapa 3 de")).toBeVisible({ timeout: 5000 });
    }
  });

  test("deve fechar o modo teste ao clicar no X", async ({ page }) => {
    // Setup
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const useButton = page.locator('[data-testid="template-use-quiz"]');
    await expect(useButton).toBeVisible({ timeout: 10000 });
    await useButton.click();

    await page.waitForURL(/\/admin\/funnels\/.*\/edit/, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await testButton.click();

    const overlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Clica no botão de fechar
    const closeButton = page.locator('[data-testid="test-mode-close"]');
    await closeButton.click();

    // Verifica que o overlay foi fechado
    await expect(overlay).not.toBeVisible({ timeout: 3000 });

    // Verifica que voltou ao editor
    await expect(testButton).toBeVisible();
  });

  test("deve usar botão voltar durante o teste", async ({ page }) => {
    // Setup
    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const useButton = page.locator('[data-testid="template-use-quiz"]');
    await expect(useButton).toBeVisible({ timeout: 10000 });
    await useButton.click();

    await page.waitForURL(/\/admin\/funnels\/.*\/edit/, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await testButton.click();

    const overlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Completa intro
    const nameInput = page.locator('[data-testid="test-mode-input"]');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill("Maria Teste");

    const continueButton = page.locator('[data-testid="test-mode-continue"]');
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    // Aguarda questão aparecer
    await expect(page.getByText("Etapa 2 de")).toBeVisible({ timeout: 5000 });

    // Clica em voltar
    const backButton = page.locator('[data-testid="test-mode-back"]');
    await expect(backButton).toBeVisible({ timeout: 3000 });
    await backButton.click();

    // Verifica que voltou para intro
    await expect(page.getByText("Etapa 1 de")).toBeVisible({ timeout: 3000 });
    await expect(nameInput).toBeVisible();
    // O nome deve estar preservado
    await expect(nameInput).toHaveValue("Maria Teste");
  });
});

/**
 * Teste de fluxo completo (smoke test)
 * Este teste é mais longo e tenta completar todo o quiz
 */
test.describe("Editor - Fluxo Completo do Quiz no Modo Teste", () => {
  test.beforeEach(async ({ page }) => {
    // Autenticar como admin
    await authenticateAsAdmin(page);
  });

  test.skip("deve completar todo o fluxo do quiz até o resultado", async ({
    page,
  }) => {
    // Skip por padrão - execute manualmente quando necessário
    // Este teste é muito longo e depende de dados do Supabase

    test.setTimeout(180000);

    await page.goto("/admin/funnels");
    await page.waitForLoadState("networkidle");

    const useButton = page.locator('[data-testid="template-use-quiz"]');
    await expect(useButton).toBeVisible({ timeout: 10000 });
    await useButton.click();

    await page.waitForURL(/\/admin\/funnels\/.*\/edit/, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    const testButton = page.locator('[data-testid="editor-test-button"]');
    await expect(testButton).toBeVisible({ timeout: 10000 });
    await testButton.click();

    const overlay = page.locator('[data-testid="test-mode-overlay"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // 1. Completa intro
    const nameInput = page.locator('[data-testid="test-mode-input"]');
    await nameInput.fill("Maria Teste");
    await page.locator('[data-testid="test-mode-continue"]').click();

    // 2. Responde 10 questões de estilo (cada uma requer 3 seleções)
    for (let q = 0; q < 10; q++) {
      await page.waitForTimeout(500);
      const options = page.locator('[data-testid^="quiz-option-"]');
      await expect(options.first()).toBeVisible({ timeout: 5000 });

      // Seleciona as 3 primeiras opções
      for (let o = 0; o < 3; o++) {
        await options.nth(o).click();
        await page.waitForTimeout(200);
      }

      // Como autoAdvance: false, clica no botão para avançar
      const continueBtn = page.locator('[data-testid="test-mode-continue"]');
      await expect(continueBtn).toBeEnabled({ timeout: 3000 });
      await continueBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. Responde 7 questões estratégicas (cada uma requer 1 seleção)
    // Questões estratégicas têm autoAdvance: true
    for (let q = 0; q < 7; q++) {
      await page.waitForTimeout(500);
      const options = page.locator('[data-testid^="quiz-option-"]');
      await expect(options.first()).toBeVisible({ timeout: 5000 });

      // Seleciona a primeira opção (deve auto-avançar)
      await options.first().click();
      await page.waitForTimeout(800);
    }

    // 4. Verifica página de resultado
    await page.waitForTimeout(2000);

    // Deve mostrar o resultado do estilo
    const resultText = page.locator("text=/Seu estilo|Resultado|Parabéns/i");
    await expect(resultText).toBeVisible({ timeout: 10000 });
  });
});
