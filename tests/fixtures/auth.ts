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
    await page.addInitScript(({ email, userName, role }) => {
      const loginTime = new Date().toISOString();
      sessionStorage.setItem(
        "adminSession",
        JSON.stringify({ email, loginTime })
      );

      // Mantém compatibilidade com AuthContext/user data usada no app
      localStorage.setItem("userName", userName);
      localStorage.setItem("userRole", role);
    }, ADMIN_CREDENTIALS);

    await page.goto("/admin");

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

      await page.waitForTimeout(2000);
    }

    await use(page);
  },
});

export { expect } from "@playwright/test";
