import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Navega para página de login
    await page.goto('/admin');
    
    // Verifica se já está autenticado
    const isAuthenticated = await page.evaluate(() => {
      return !!localStorage.getItem('auth-token') || !!localStorage.getItem('user');
    });

    if (!isAuthenticated) {
      // Procura por campo de email
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
      
      if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await emailInput.fill('consultoria@giselegalvao.com.br');
        
        // Procura por campo de senha
        const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
        await passwordInput.fill('Gi$ele0809');
        
        // Procura por botão de login
        const loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Entrar")').first();
        await loginButton.click();
        
        // Aguarda navegação ou token
        await page.waitForTimeout(2000);
      }
    }

    await use(page);
  },
});

export { expect } from '@playwright/test';
