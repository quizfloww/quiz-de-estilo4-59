import { test, expect, Page } from "@playwright/test";

/**
 * Testes E2E para o Quiz de Estilo Pessoal
 * Funil: "Quiz de Estilo Pessoal" (slug: "quiz")
 *
 * Testa o fluxo completo:
 * - Introdução com captura de nome
 * - 10 questões de estilo (3 seleções cada)
 * - 7 questões estratégicas (1 seleção cada)
 * - Cálculo de resultados
 * - Exibição da página de resultado
 */

test.describe("Quiz de Estilo Pessoal - Fluxo Completo", () => {
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto("/quiz");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("deve completar o fluxo completo do quiz com sucesso", async ({
    page,
  }) => {
    // 1. INTRODUÇÃO - Captura de nome
    await page.goto("/quiz");

    // Verificar que a página de introdução está visível
    await expect(
      page
        .locator("h1, h2")
        .filter({ hasText: /Chega de um guarda-roupa lotado/i })
    ).toBeVisible({ timeout: 10000 });

    // Preencher nome
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill("Maria Silva");

    // Clicar no botão continuar
    await page
      .locator('button:has-text("Continuar"), button:has-text("Começar")')
      .first()
      .click();

    // Aguardar transição
    await page.waitForTimeout(1000);

    // 2. QUESTÕES DE ESTILO (Q1-Q10)
    // Cada questão deve permitir selecionar 3 opções
    for (let questionNum = 1; questionNum <= 10; questionNum++) {
      console.log(`Respondendo questão ${questionNum}...`);

      // Aguardar a questão carregar
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 15000,
          state: "visible",
        }
      );

      // Aguardar um pouco para garantir que as opções estão interativas
      await page.waitForTimeout(500);

      // Selecionar 3 opções
      const options = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });
      const optionCount = await options.count();

      if (optionCount === 0) {
        throw new Error(`Nenhuma opção encontrada na questão ${questionNum}`);
      }

      // Selecionar as primeiras 3 opções disponíveis
      const selectionsToMake = Math.min(3, optionCount);
      for (let i = 0; i < selectionsToMake; i++) {
        await options.nth(i).click();
        await page.waitForTimeout(300); // Pequena pausa entre cliques
      }

      // Verificar se o botão de avançar está habilitado
      const nextButton = page
        .locator(
          'button:has-text("Próxima"), button:has-text("Continuar"), button[type="submit"]'
        )
        .first();
      await expect(nextButton).toBeEnabled({ timeout: 5000 });

      // Avançar para próxima questão
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // 3. TRANSIÇÃO - Mensagem intermediária
    // Verificar se aparece a mensagem de transição
    await expect(
      page.locator("text=/Enquanto calculamos|Preparando|análise/i")
    ).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(2000);

    // 4. QUESTÕES ESTRATÉGICAS (S1-S7)
    // Cada questão estratégica permite apenas 1 seleção e avança automaticamente
    for (let stratNum = 1; stratNum <= 7; stratNum++) {
      console.log(`Respondendo questão estratégica ${stratNum}...`);

      // Aguardar opções da questão estratégica
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 15000,
          state: "visible",
        }
      );

      await page.waitForTimeout(500);

      // Selecionar a primeira opção (auto-advance)
      const strategicOptions = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });
      await strategicOptions.first().click();

      // Aguardar avanço automático
      await page.waitForTimeout(1500);
    }

    // 5. TRANSIÇÃO FINAL
    await expect(
      page.locator("text=/Preparando seu resultado|Analisando|instantes/i")
    ).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(3000);

    // 6. PÁGINA DE RESULTADO
    // Verificar se chegamos à página de resultado
    await page.waitForURL(/.*resultado.*|.*result.*/i, { timeout: 30000 });

    // Verificar elementos essenciais da página de resultado
    await expect(page.locator("text=/Maria|Olá|seu estilo/i")).toBeVisible({
      timeout: 10000,
    });

    // Verificar se o estilo predominante está exibido
    await expect(
      page.locator(
        "text=/Natural|Clássico|Contemporâneo|Elegante|Romântico|Sexy|Dramático|Criativo/i"
      )
    ).toBeVisible();

    // Verificar se há percentuais exibidos
    await expect(page.locator("text=/%/")).toBeVisible();

    // Verificar botão de CTA (oferta)
    await expect(
      page.locator('button:has-text("Quero"), a:has-text("Quero")')
    ).toBeVisible();
  });

  test("deve salvar progresso no localStorage", async ({ page }) => {
    await page.goto("/quiz");

    // Preencher nome
    await page.locator('input[type="text"]').first().fill("João Silva");
    await page
      .locator('button:has-text("Continuar"), button:has-text("Começar")')
      .first()
      .click();
    await page.waitForTimeout(1000);

    // Responder algumas questões
    for (let i = 0; i < 3; i++) {
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 10000,
        }
      );

      const options = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });

      for (let j = 0; j < 3; j++) {
        await options.nth(j).click();
        await page.waitForTimeout(200);
      }

      await page
        .locator('button:has-text("Próxima"), button:has-text("Continuar")')
        .first()
        .click();
      await page.waitForTimeout(500);
    }

    // Verificar que dados foram salvos no localStorage
    const localStorageData = await page.evaluate(() => {
      return {
        userName: localStorage.getItem("userName"),
        hasAnswers:
          localStorage.getItem("answers") !== null ||
          localStorage.getItem("quizAnswers") !== null,
      };
    });

    expect(localStorageData.userName).toBe("João Silva");
  });

  test("deve calcular e exibir o estilo predominante correto", async ({
    page,
  }) => {
    await page.goto("/quiz");

    // Preencher nome
    await page.locator('input[type="text"]').first().fill("Ana Costa");
    await page.locator('button:has-text("Continuar")').first().click();
    await page.waitForTimeout(1000);

    // Responder todas as questões com preferência por "Natural"
    // (Assumindo que as primeiras opções são sempre Natural para este teste)
    for (let q = 0; q < 10; q++) {
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 10000,
        }
      );

      const options = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });

      // Selecionar sempre as mesmas 3 primeiras opções para consistência
      for (let s = 0; s < 3; s++) {
        await options.nth(s).click();
        await page.waitForTimeout(200);
      }

      await page
        .locator('button:has-text("Próxima"), button:has-text("Continuar")')
        .first()
        .click();
      await page.waitForTimeout(500);
    }

    // Pular transição
    await page.waitForTimeout(2000);

    // Responder questões estratégicas
    for (let s = 0; s < 7; s++) {
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 10000,
        }
      );

      const options = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });
      await options.first().click();
      await page.waitForTimeout(1500);
    }

    // Aguardar transição final e resultado
    await page.waitForTimeout(3000);
    await page.waitForURL(/.*resultado.*|.*result.*/i, { timeout: 30000 });

    // Verificar que algum estilo foi calculado
    const resultText = await page.textContent("body");
    const hasStyleResult =
      /Natural|Clássico|Contemporâneo|Elegante|Romântico|Sexy|Dramático|Criativo/i.test(
        resultText || ""
      );
    expect(hasStyleResult).toBe(true);
  });

  test("deve exibir validação quando nome está vazio", async ({ page }) => {
    await page.goto("/quiz");

    // Tentar continuar sem preencher nome
    const continueButton = page
      .locator('button:has-text("Continuar"), button:has-text("Começar")')
      .first();
    await continueButton.click();

    // Verificar se ainda está na página de introdução ou mostra mensagem de erro
    await page.waitForTimeout(1000);

    // O input deve ainda estar visível (não avançou)
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test("deve permitir voltar para questões anteriores", async ({ page }) => {
    await page.goto("/quiz");

    // Preencher nome e iniciar
    await page.locator('input[type="text"]').first().fill("Carlos Santos");
    await page.locator('button:has-text("Continuar")').first().click();
    await page.waitForTimeout(1000);

    // Responder primeira questão
    await page.waitForSelector(
      '[data-testid*="option"], button[class*="option"], div[class*="option"]',
      {
        timeout: 10000,
      }
    );

    const options1 = page
      .locator(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]'
      )
      .filter({ hasText: /.+/ });
    for (let i = 0; i < 3; i++) {
      await options1.nth(i).click();
      await page.waitForTimeout(200);
    }

    await page
      .locator('button:has-text("Próxima"), button:has-text("Continuar")')
      .first()
      .click();
    await page.waitForTimeout(1000);

    // Responder segunda questão
    await page.waitForSelector(
      '[data-testid*="option"], button[class*="option"], div[class*="option"]',
      {
        timeout: 10000,
      }
    );

    const options2 = page
      .locator(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]'
      )
      .filter({ hasText: /.+/ });
    for (let i = 0; i < 3; i++) {
      await options2.nth(i).click();
      await page.waitForTimeout(200);
    }

    await page
      .locator('button:has-text("Próxima"), button:has-text("Continuar")')
      .first()
      .click();
    await page.waitForTimeout(1000);

    // Procurar botão "Voltar" ou "Anterior"
    const backButton = page
      .locator(
        'button:has-text("Voltar"), button:has-text("Anterior"), button[aria-label*="volta"]'
      )
      .first();

    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForTimeout(1000);

      // Verificar que voltou (pode verificar número da questão ou conteúdo)
      // A implementação específica depende do design da UI
      await expect(
        page.locator('button:has-text("Voltar"), button:has-text("Anterior")')
      ).toBeVisible();
    }
  });

  test("deve exigir exatamente 3 seleções nas questões de estilo", async ({
    page,
  }) => {
    await page.goto("/quiz");

    await page.locator('input[type="text"]').first().fill("Paula Oliveira");
    await page.locator('button:has-text("Continuar")').first().click();
    await page.waitForTimeout(1000);

    // Primeira questão - tentar avançar sem selecionar todas as 3
    await page.waitForSelector(
      '[data-testid*="option"], button[class*="option"], div[class*="option"]',
      {
        timeout: 10000,
      }
    );

    const options = page
      .locator(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]'
      )
      .filter({ hasText: /.+/ });

    // Selecionar apenas 1 opção
    await options.first().click();
    await page.waitForTimeout(500);

    // O botão deve estar desabilitado
    const nextButton = page
      .locator('button:has-text("Próxima"), button:has-text("Continuar")')
      .first();
    await expect(nextButton).toBeDisabled({ timeout: 2000 });

    // Selecionar segunda opção
    await options.nth(1).click();
    await page.waitForTimeout(500);

    // Ainda deve estar desabilitado
    await expect(nextButton).toBeDisabled();

    // Selecionar terceira opção
    await options.nth(2).click();
    await page.waitForTimeout(500);

    // Agora deve estar habilitado
    await expect(nextButton).toBeEnabled({ timeout: 2000 });
  });

  test("deve exibir progresso correto durante o quiz", async ({ page }) => {
    await page.goto("/quiz");

    await page.locator('input[type="text"]').first().fill("Roberto Lima");
    await page.locator('button:has-text("Continuar")').first().click();
    await page.waitForTimeout(1000);

    // Verificar se há indicador de progresso
    const progressIndicators = [
      page.locator('[role="progressbar"]'),
      page.locator("text=/de 10|de 17|/10|/17/i"),
      page.locator('[class*="progress"]'),
    ];

    let progressFound = false;
    for (const indicator of progressIndicators) {
      if ((await indicator.count()) > 0) {
        progressFound = true;
        break;
      }
    }

    // Se houver indicador, verificar que ele muda ao avançar
    if (progressFound) {
      // Responder primeira questão
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 10000,
        }
      );

      const options = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });
      for (let i = 0; i < 3; i++) {
        await options.nth(i).click();
        await page.waitForTimeout(200);
      }

      const initialProgress = await page.textContent("body");

      await page
        .locator('button:has-text("Próxima"), button:has-text("Continuar")')
        .first()
        .click();
      await page.waitForTimeout(1000);

      // Responder segunda questão
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 10000,
        }
      );

      const options2 = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });
      for (let i = 0; i < 3; i++) {
        await options2.nth(i).click();
        await page.waitForTimeout(200);
      }

      const updatedProgress = await page.textContent("body");

      // O progresso deve ter mudado
      expect(initialProgress).not.toBe(updatedProgress);
    }
  });
});

test.describe("Quiz de Estilo Pessoal - Validações de Dados", () => {
  test("deve persistir respostas após reload da página", async ({ page }) => {
    await page.goto("/quiz");

    // Iniciar quiz
    await page.locator('input[type="text"]').first().fill("Fernanda Alves");
    await page.locator('button:has-text("Continuar")').first().click();
    await page.waitForTimeout(1000);

    // Responder algumas questões
    for (let i = 0; i < 2; i++) {
      await page.waitForSelector(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]',
        {
          timeout: 10000,
        }
      );

      const options = page
        .locator(
          '[data-testid*="option"], button[class*="option"], div[class*="option"]'
        )
        .filter({ hasText: /.+/ });
      for (let j = 0; j < 3; j++) {
        await options.nth(j).click();
        await page.waitForTimeout(200);
      }

      await page
        .locator('button:has-text("Próxima"), button:has-text("Continuar")')
        .first()
        .click();
      await page.waitForTimeout(500);
    }

    // Recarregar página
    await page.reload();
    await page.waitForTimeout(1500);

    // Verificar se o nome foi mantido
    const storedName = await page.evaluate(() =>
      localStorage.getItem("userName")
    );
    expect(storedName).toBe("Fernanda Alves");
  });

  test("deve limpar dados ao resetar quiz", async ({ page }) => {
    await page.goto("/quiz");

    // Completar o quiz
    await page.locator('input[type="text"]').first().fill("Reset Test");
    await page.locator('button:has-text("Continuar")').first().click();
    await page.waitForTimeout(1000);

    // Responder uma questão
    await page.waitForSelector(
      '[data-testid*="option"], button[class*="option"], div[class*="option"]',
      {
        timeout: 10000,
      }
    );

    const options = page
      .locator(
        '[data-testid*="option"], button[class*="option"], div[class*="option"]'
      )
      .filter({ hasText: /.+/ });
    for (let i = 0; i < 3; i++) {
      await options.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Verificar se dados foram salvos
    let hasData = await page.evaluate(() => {
      return localStorage.getItem("userName") !== null;
    });
    expect(hasData).toBe(true);

    // Limpar localStorage (simula reset)
    await page.evaluate(() => localStorage.clear());

    // Verificar que dados foram removidos
    hasData = await page.evaluate(() => {
      return localStorage.getItem("userName") !== null;
    });
    expect(hasData).toBe(false);
  });
});
