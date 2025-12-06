import { test, expect } from "@playwright/test";

/**
 * Testes de diagnóstico para imagens das opções do quiz
 *
 * OBJETIVO: Descobrir por que as questões 4-9 não exibem imagens
 *
 * Execute com:
 *   npm test -- tests/e2e/quiz-images-diagnostic.spec.ts
 */

test.describe("Quiz Images Diagnostic - Questões 4-9", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para o quiz
    await page.goto("/quiz");
    await page.waitForLoadState("networkidle");
  });

  test("deve verificar se o quiz carrega corretamente", async ({ page }) => {
    // Verifica se há algum conteúdo de quiz na página
    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);

    // Tenta localizar botões de opção ou elementos de quiz
    const hasQuizContent = await page
      .locator('button, [role="button"]')
      .count();
    console.log(`Número de botões na página: ${hasQuizContent}`);
  });

  test("deve capturar dados das opções em cada questão", async ({ page }) => {
    // Este teste navega pelo quiz e captura informações sobre as opções

    let questionCount = 0;
    const maxQuestions = 12; // Limite para evitar loops infinitos

    while (questionCount < maxQuestions) {
      // Aguarda a página carregar
      await page.waitForTimeout(1000);

      // Captura informações da questão atual
      const questionTitle = await page.locator("h1, h2").first().textContent();
      console.log(`\n========== Questão ${questionCount + 1} ==========`);
      console.log(`Título: ${questionTitle}`);

      // Busca todas as opções (botões que parecem ser opções)
      const optionButtons = page.locator(
        "button[aria-pressed], button[aria-label]"
      );
      const optionCount = await optionButtons.count();
      console.log(`Número de opções: ${optionCount}`);

      // Para cada opção, verifica se tem imagem
      for (let i = 0; i < optionCount; i++) {
        const option = optionButtons.nth(i);
        const ariaLabel = await option.getAttribute("aria-label");

        // Verifica se há imagem dentro da opção
        const hasImage = await option.locator("img").count();
        const imgSrc =
          hasImage > 0
            ? await option.locator("img").first().getAttribute("src")
            : null;

        console.log(
          `  Opção ${i + 1}: "${ariaLabel}" - Imagem: ${
            hasImage > 0 ? "✅ " + imgSrc?.substring(0, 50) : "❌ Sem imagem"
          }`
        );
      }

      // Se for questão 4-9, faz verificação mais detalhada
      if (questionCount >= 3 && questionCount <= 8) {
        const images = await optionButtons.first().locator("img").count();
        if (images === 0) {
          console.log(
            `⚠️  Questão ${questionCount + 1} sem imagens nas opções!`
          );

          // Captura o HTML das opções para análise
          const optionHtml = await optionButtons.first().innerHTML();
          console.log(
            `HTML da primeira opção: ${optionHtml.substring(0, 200)}`
          );
        }
      }

      // Tenta clicar na primeira opção e avançar
      if (optionCount > 0) {
        await optionButtons.first().click();
        await page.waitForTimeout(500);

        // Tenta clicar em botão de continuar se existir
        const continueButton = page.locator(
          'button:has-text("Continuar"), button:has-text("Próximo")'
        );
        if (await continueButton.isVisible().catch(() => false)) {
          await continueButton.click();
        }
      } else {
        // Sem opções, pode ser página de resultado ou intro
        const nextButton = page.locator(
          'button:has-text("Começar"), button:has-text("Iniciar"), button:has-text("Continuar")'
        );
        if (await nextButton.isVisible().catch(() => false)) {
          await nextButton.click();
        } else {
          console.log("Sem botões para avançar - fim do quiz?");
          break;
        }
      }

      questionCount++;
    }
  });

  test("deve verificar dados via API do Supabase", async ({ page }) => {
    // Injeta um script para verificar os dados do Supabase
    const diagnosticResult = await page.evaluate(async () => {
      // Tenta acessar o cliente Supabase do app
      const supabaseUrl =
        (window as any).__SUPABASE_URL__ ||
        localStorage.getItem("supabase.url");

      // Alternativa: verificar se há dados no React DevTools ou estado global
      const reactRoot = document.getElementById("root");
      const reactFiber = (reactRoot as any)?._reactRootContainer?._internalRoot
        ?.current;

      return {
        hasReactRoot: !!reactRoot,
        hasFiber: !!reactFiber,
        supabaseConfigured: !!supabaseUrl,
        documentTitle: document.title,
        currentUrl: window.location.href,
      };
    });

    console.log("Diagnóstico do ambiente:", diagnosticResult);
  });

  test("deve identificar displayType de cada questão", async ({ page }) => {
    // Este teste verifica especificamente o displayType
    // Analisando o CSS das opções

    await page.waitForTimeout(2000);

    // Verifica se as opções estão em grid (imagens) ou flex-col (texto)
    const optionsContainer = page.locator(".grid, .flex.flex-col").first();
    const classes = await optionsContainer.getAttribute("class");

    if (classes?.includes("grid")) {
      console.log(
        "✅ Layout: Grid (provavelmente displayType='image' ou 'both')"
      );
    } else if (classes?.includes("flex-col")) {
      console.log("⚠️  Layout: Flex-col (provavelmente displayType='text')");
    }

    // Verifica dimensões das opções
    const firstOption = page
      .locator("button[aria-pressed], button[aria-label]")
      .first();
    const box = await firstOption.boundingBox();

    if (box) {
      console.log(`Dimensões da primeira opção: ${box.width}x${box.height}px`);
      if (box.height > 150) {
        console.log("Layout sugere opções com imagens (altura > 150px)");
      } else {
        console.log("Layout sugere opções só texto (altura <= 150px)");
      }
    }
  });
});

test.describe("Verificação de Dados no Banco", () => {
  test("deve listar stage_options via network intercept", async ({ page }) => {
    // Intercepta chamadas ao Supabase para ver os dados
    const stageOptionsResponses: any[] = [];

    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("stage_options") || url.includes("funnel_stages")) {
        try {
          const json = await response.json();
          stageOptionsResponses.push({
            url: url.substring(0, 100),
            status: response.status(),
            dataCount: Array.isArray(json) ? json.length : "object",
          });

          // Se for stage_options, analisa as imagens
          if (url.includes("stage_options") && Array.isArray(json)) {
            console.log(`\n📦 Resposta stage_options (${json.length} itens):`);
            json.forEach((opt: any, i: number) => {
              console.log(
                `  ${i + 1}. "${opt.text}" - image_url: ${
                  opt.image_url ? "✅" : "❌"
                }`
              );
            });
          }
        } catch (e) {
          // Ignora erros de parsing
        }
      }
    });

    await page.goto("/quiz");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    console.log("\n📡 Chamadas de API interceptadas:");
    stageOptionsResponses.forEach((r, i) => {
      console.log(
        `  ${i + 1}. ${r.url} - Status: ${r.status} - Items: ${r.dataCount}`
      );
    });
  });
});
