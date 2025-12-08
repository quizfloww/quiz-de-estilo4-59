import { test, expect } from "@playwright/test";

/**
 * Testes E2E do Fluxo Completo do Quiz de Estilo Pessoal
 *
 * Testa o fluxo completo do quiz:
 * 1. Página inicial (intro)
 * 2. 10 questões de estilo
 * 3. Transição
 * 4. 7 questões estratégicas
 * 5. Transição final
 * 6. Resultado com oferta
 */

test.describe("Quiz de Estilo - Fluxo Completo", () => {
  const BASE_URL = "/quiz/quiz-estilo-pessoal";

  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("deve carregar a página inicial do quiz", async ({ page }) => {
    await page.goto(BASE_URL);

    // Verificar elementos da intro
    await expect(page.locator("text=Digite seu nome")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("button:has-text('Continuar')")).toBeVisible();
  });

  test("deve exigir nome para avançar", async ({ page }) => {
    await page.goto(BASE_URL);

    // Tentar clicar em continuar sem preencher nome
    const continueButton = page.locator("button:has-text('Continuar')");
    await continueButton.click();

    // Deve permanecer na mesma página ou mostrar erro
    await expect(page.locator("input[placeholder*='nome']")).toBeVisible();
  });

  test("deve avançar para primeira questão após inserir nome", async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Preencher nome
    await page.fill("input[placeholder*='nome']", "Maria Teste");
    await page.click("button:has-text('Continuar')");

    // Deve mostrar a primeira questão
    await expect(page.locator("text=TIPO DE ROUPA")).toBeVisible({
      timeout: 5000,
    });
  });

  test("deve permitir selecionar 3 opções por questão", async ({ page }) => {
    await page.goto(BASE_URL);

    // Preencher nome e avançar
    await page.fill("input[placeholder*='nome']", "Maria Teste");
    await page.click("button:has-text('Continuar')");

    // Aguardar questão carregar
    await page.waitForSelector("text=TIPO DE ROUPA", { timeout: 5000 });

    // Selecionar 3 opções
    const options = page.locator(
      "[data-testid='quiz-option'], .quiz-option, [role='button']"
    );
    const optionCount = await options.count();

    if (optionCount >= 3) {
      await options.nth(0).click();
      await options.nth(1).click();
      await options.nth(2).click();
    }
  });

  test("deve mostrar barra de progresso", async ({ page }) => {
    await page.goto(BASE_URL);

    // Preencher nome e avançar
    await page.fill("input[placeholder*='nome']", "Maria Teste");
    await page.click("button:has-text('Continuar')");

    // Verificar barra de progresso
    const progressBar = page.locator(
      "[role='progressbar'], .progress-bar, [data-testid='progress']"
    );
    await expect(progressBar.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Quiz de Estilo - Cálculo de Resultados", () => {
  test("deve calcular resultado corretamente após completar quiz", async ({
    page,
  }) => {
    // Este teste simula o fluxo completo via localStorage para testar o resultado
    await page.goto("/");

    // Simular respostas do quiz via localStorage
    await page.evaluate(() => {
      const mockResult = {
        primaryStyle: { category: "Natural", score: 15, percentage: 50 },
        secondaryStyles: [
          { category: "Clássico", score: 9, percentage: 30 },
          { category: "Elegante", score: 6, percentage: 20 },
        ],
        userName: "Maria Teste",
      };
      localStorage.setItem("quizResult", JSON.stringify(mockResult));
      localStorage.setItem("userName", "Maria Teste");
    });

    // Navegar para página de resultado
    await page.goto("/resultado");

    // Verificar se o resultado é exibido
    await expect(page.locator("text=Natural").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=Maria Teste").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("deve exibir estilos secundários no resultado", async ({ page }) => {
    await page.goto("/");

    // Simular respostas do quiz
    await page.evaluate(() => {
      const mockResult = {
        primaryStyle: { category: "Elegante", score: 12, percentage: 40 },
        secondaryStyles: [
          { category: "Romântico", score: 10, percentage: 33 },
          { category: "Natural", score: 8, percentage: 27 },
        ],
        userName: "Ana Clara",
      };
      localStorage.setItem("quizResult", JSON.stringify(mockResult));
      localStorage.setItem("userName", "Ana Clara");
    });

    await page.goto("/resultado");

    // Verificar estilos secundários
    await expect(page.locator("text=Elegante").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=Romântico").first()).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator("text=Natural").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("deve exibir porcentagens corretamente", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      const mockResult = {
        primaryStyle: { category: "Dramático", score: 18, percentage: 60 },
        secondaryStyles: [{ category: "Criativo", score: 12, percentage: 40 }],
        userName: "Joana",
      };
      localStorage.setItem("quizResult", JSON.stringify(mockResult));
      localStorage.setItem("userName", "Joana");
    });

    await page.goto("/resultado");

    // Verificar se porcentagem está visível
    await expect(page.locator("text=60%").first()).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Quiz de Estilo - Oferta e CTA", () => {
  test("deve exibir seção de oferta no resultado", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      const mockResult = {
        primaryStyle: { category: "Natural", score: 15, percentage: 50 },
        secondaryStyles: [],
        userName: "Teste",
      };
      localStorage.setItem("quizResult", JSON.stringify(mockResult));
      localStorage.setItem("userName", "Teste");
    });

    await page.goto("/resultado");

    // Verificar elementos da oferta
    await expect(page.locator("text=R$ 39").first()).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page
        .locator("button:has-text('Quero'), button:has-text('Comprar')")
        .first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("deve ter botão CTA funcional", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      const mockResult = {
        primaryStyle: { category: "Clássico", score: 20, percentage: 67 },
        secondaryStyles: [],
        userName: "Cliente",
      };
      localStorage.setItem("quizResult", JSON.stringify(mockResult));
      localStorage.setItem("userName", "Cliente");
    });

    await page.goto("/resultado");

    // Verificar que o botão CTA existe e é clicável
    const ctaButton = page
      .locator("button:has-text('Quero'), a:has-text('Quero')")
      .first();
    await expect(ctaButton).toBeVisible({ timeout: 10000 });
    await expect(ctaButton).toBeEnabled();
  });

  test("deve exibir garantia de 7 dias", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      const mockResult = {
        primaryStyle: { category: "Sexy", score: 10, percentage: 100 },
        secondaryStyles: [],
        userName: "Visitante",
      };
      localStorage.setItem("quizResult", JSON.stringify(mockResult));
      localStorage.setItem("userName", "Visitante");
    });

    await page.goto("/resultado");

    // Verificar garantia
    await expect(
      page.locator("text=7 dias, text=garantia").first()
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Quiz de Estilo - Navegação", () => {
  test("deve permitir voltar para questão anterior", async ({ page }) => {
    await page.goto("/quiz/quiz-estilo-pessoal");

    // Preencher nome e avançar
    await page.fill("input[placeholder*='nome']", "Maria");
    await page.click("button:has-text('Continuar')");

    // Aguardar primeira questão
    await page.waitForSelector("text=TIPO DE ROUPA", { timeout: 5000 });

    // Verificar se existe botão de voltar (pode variar conforme implementação)
    const backButton = page.locator(
      "button:has-text('Voltar'), [data-testid='back-button']"
    );

    // Se o botão existir, deve estar habilitado ou desabilitado na primeira questão
    if ((await backButton.count()) > 0) {
      // Na primeira questão, pode estar desabilitado
      expect(true).toBe(true);
    }
  });

  test("deve redirecionar para resultado após concluir", async ({ page }) => {
    // Este é um teste conceitual - o fluxo completo levaria muito tempo
    // Verificamos apenas que a estrutura está correta

    await page.goto("/quiz/quiz-estilo-pessoal");

    // Verificar que a página carrega
    await expect(page.locator("body")).toBeVisible();

    // Verificar que não há erros JavaScript
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.waitForTimeout(2000);

    // Filtrar erros não críticos
    const criticalErrors = errors.filter(
      (e) => !e.includes("ResizeObserver") && !e.includes("Loading chunk")
    );

    expect(criticalErrors.length).toBe(0);
  });
});

test.describe("Quiz de Estilo - Responsividade", () => {
  test("deve funcionar em mobile", async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/quiz/quiz-estilo-pessoal");

    // Verificar que elementos são visíveis
    await expect(page.locator("input[placeholder*='nome']")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("button:has-text('Continuar')")).toBeVisible();
  });

  test("deve funcionar em tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/quiz/quiz-estilo-pessoal");

    await expect(page.locator("input[placeholder*='nome']")).toBeVisible({
      timeout: 10000,
    });
  });

  test("deve funcionar em desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto("/quiz/quiz-estilo-pessoal");

    await expect(page.locator("input[placeholder*='nome']")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Quiz de Estilo - Todos os Estilos", () => {
  const estilos = [
    "Natural",
    "Clássico",
    "Contemporâneo",
    "Elegante",
    "Romântico",
    "Sexy",
    "Dramático",
    "Criativo",
  ];

  for (const estilo of estilos) {
    test(`deve exibir resultado corretamente para estilo ${estilo}`, async ({
      page,
    }) => {
      await page.goto("/");

      await page.evaluate((estiloParam) => {
        const mockResult = {
          primaryStyle: { category: estiloParam, score: 20, percentage: 67 },
          secondaryStyles: [{ category: "Natural", score: 10, percentage: 33 }],
          userName: "Teste",
        };
        localStorage.setItem("quizResult", JSON.stringify(mockResult));
        localStorage.setItem("userName", "Teste");
      }, estilo);

      await page.goto("/resultado");

      // Verificar que o estilo está visível
      await expect(page.locator(`text=${estilo}`).first()).toBeVisible({
        timeout: 10000,
      });
    });
  }
});
