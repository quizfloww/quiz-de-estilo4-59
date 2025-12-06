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
    // Best-effort: add init script but don't block tests if it hangs
    try {
      await Promise.race([
        page.addInitScript(({ email, userName, role }) => {
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
        id: "stage-1",
        funnel_id: "1",
        type: "intro",
        title: "Introdução 1",
        order_index: 0,
        is_enabled: true,
        config: {},
        created_at: new Date().toISOString(),
      },
    ];

    const mockOptions: any[] = [];

    // Intercept generic supabase REST requests for funnels, funnel_stages, stage_options
    // Sempre retornar lista de funis com nosso mock para evitar dependência do Supabase real
    await page.route("**/rest/v1/funnels*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([mockFunnel]),
      });
    });

    await page.route("**/rest/v1/funnel_stages*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockStages),
      });
    });

    await page.route("**/rest/v1/stage_options*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockOptions),
      });
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

    await tryGoto("/admin");

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
