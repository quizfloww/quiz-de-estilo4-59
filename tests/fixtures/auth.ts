import { test as base } from "@playwright/test";

const ADMIN_CREDENTIALS = {
  email:
    process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "consultoria@giselegalvao.com.br",
  password: process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "Gi$ele0809",
  userName: process.env.PLAYWRIGHT_ADMIN_NAME ?? "Playwright Admin",
  role: "admin",
};

export const test = base.extend({
  page: async ({ page }, use) => {
    const context = page.context();

    // Best-effort: share init script across the entire context so new pages inherit it
    const addInitScript = async () => {
      try {
        await Promise.race([
          context.addInitScript(({ email, userName, role }) => {
            const loginTime = new Date().toISOString();
            sessionStorage.setItem(
              "adminSession",
              JSON.stringify({ email, loginTime })
            );

            // Mantém compatibilidade com AuthContext/user data usada no app
            localStorage.setItem("userName", userName);
            localStorage.setItem("userRole", role);
          }, ADMIN_CREDENTIALS),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("addInitScript timeout")), 5000)
          ),
        ]);
      } catch (err) {
        console.warn("auth fixture: addInitScript failed or timed out", err);
      }
    };

    await addInitScript();

    // Interceptar chamadas Supabase REST para fornecer fixtures locais
    const mockFunnel = {
      id: "1",
      name: "Funnel Teste (mock)",
      slug: "funnel-teste-mock",
      description: "Funil mock para testes",
      status: "draft",
      global_config: {},
      style_categories: [],
      cover_image: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockStages = [
      {
        id: "stage-intro",
        funnel_id: "1",
        type: "intro",
        title: "Boas-vindas",
        order_index: 0,
        is_enabled: true,
        config: {
          subtitle: "Receba o guia definitivo de estilo em apenas 3 minutos",
          imageUrl:
            "https://images.unsplash.com/photo-1554132447-0b0db7bde42e?auto=format&fit=crop&w=600&q=60",
          inputLabel: "Seu nome",
          inputPlaceholder: "Digite como prefere ser chamado",
        },
        created_at: new Date().toISOString(),
      },
      {
        id: "stage-question",
        funnel_id: "1",
        type: "question",
        title: "Qual é o seu estilo?",
        order_index: 1,
        is_enabled: true,
        config: {
          question: "Escolha a opção que mais combina com a sua rotina",
          displayType: "both",
          multiSelect: 1,
          autoAdvance: false,
          options: [
            {
              id: "option-1",
              text: "Minimalismo sofisticado",
              imageUrl:
                "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=60",
              styleCategory: "Minimalista",
              points: 2,
            },
            {
              id: "option-2",
              text: "Arte vibrante",
              imageUrl:
                "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=400&q=60",
              styleCategory: "Artsy",
              points: 1,
            },
            {
              id: "option-3",
              text: "Elegância clássica",
              imageUrl:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60",
              styleCategory: "Clássica",
              points: 3,
            },
          ],
        },
        created_at: new Date().toISOString(),
      },
      {
        id: "stage-transition",
        funnel_id: "1",
        type: "transition",
        title: "Estamos quase lá",
        order_index: 2,
        is_enabled: true,
        config: {
          transitionTitle: "Preparando seu resultado",
          transitionSubtitle:
            "Acerte as respostas para ter um resultado ainda mais certeiro",
          transitionMessage:
            "Estamos cruzando seus gostos com dados exclusivos para gerar o melhor resultado para você",
        },
        created_at: new Date().toISOString(),
      },
      {
        id: "stage-result",
        funnel_id: "1",
        type: "result",
        title: "Descubra seu estilo",
        order_index: 3,
        is_enabled: true,
        config: {
          finalPrice: 47,
          totalOriginal: 197,
          currency: "R$",
          ctaText: "Quero garantir meu guia",
          ctaUrl: "https://lovable.com/checkout",
          ctaVariant: "brand",
          urgencyText: "Vagas limitadas",
          showCtaIcon: true,
        },
        created_at: new Date().toISOString(),
      },
    ];

    const mockOptions: any[] = mockStages
      .flatMap((stage) => stage.config?.options ?? [])
      .map((option) => ({
        ...option,
        id: option.id,
        stage_id: "stage-question",
      }));

    // Intercept generic supabase REST requests for funnels, funnel_stages, stage_options
    // Sempre retornar lista de funis com nosso mock para evitar dependência do Supabase real
    const fulfillJson = (route: any, payload: unknown) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(payload),
      });

    await context.route("**/rest/v1/funnels*", (route) => {
      fulfillJson(route, [mockFunnel]);
    });

    await context.route("**/rest/v1/funnel_stages*", (route) => {
      fulfillJson(route, mockStages);
    });

    await context.route("**/rest/v1/stage_options*", (route) => {
      fulfillJson(route, mockOptions);
    });

    // Navigate to admin root to initialize app state. The routes above will provide funnel data.
    const tryGoto = async (path: string, attempts = 2) => {
      for (let i = 0; i < attempts; i++) {
        try {
          await page.goto(path, { waitUntil: "load", timeout: 60000 });
          await page.waitForSelector("body", { timeout: 5000 });
          return true;
        } catch (e) {
          console.warn(`auth fixture: goto failed (attempt ${i + 1}):`, e);
          if (i < attempts - 1) {
            try {
              if (!page.isClosed()) await page.close();
            } catch {}
            const newPage = await page.context().newPage();
            // @ts-ignore
            page = newPage;
          }
        }
      }
      return false;
    };

    await tryGoto("/admin/funnels/1/edit");

    // If login form is present, perform login using provided credentials (best-effort)
    try {
      const emailInput = page
        .locator(
          'input[type="email"], input[name="email"], input[placeholder*="email"]'
        )
        .first();

      if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailInput.fill(ADMIN_CREDENTIALS.email);

        const passwordInput = page
          .locator('input[type="password"], input[name="password"]')
          .first();
        await passwordInput.fill(ADMIN_CREDENTIALS.password);

        const loginButton = page
          .locator(
            'button[type="submit"], button:has-text("Login"), button:has-text("Entrar")'
          )
          .first();
        await loginButton.click();

        await page.waitForTimeout(1500);
      }
    } catch (err) {
      console.warn("auth fixture: login attempt failed:", err);
    }

    await use(page);
  },
});

export { expect } from "@playwright/test";
