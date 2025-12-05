import { test as base } from "@playwright/test";

const ADMIN_SESSION = {
  email:
    process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "consultoria@giselegalvao.com.br",
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
    }, ADMIN_SESSION);

    await use(page);
  },
});

export { expect } from "@playwright/test";
