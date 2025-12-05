# 🎭 Testes E2E com Playwright - FunnelEditor

## 📊 Resumo Executivo

Suite completa de **90+ testes automatizados** usando **Playwright** para validar:

- Página de listagem `/admin/funnels`
- Editor de funnels `/admin/funnels/:id/edit`

### Por que Playwright?

| Critério    | Cypress ❌     | Playwright ✅               |
| ----------- | -------------- | --------------------------- |
| Performance | Normal         | 3x mais rápido              |
| Memória     | Alta (crashes) | Baixa                       |
| Browsers    | 1 (Chrome)     | 3 (Chrome, Firefox, Safari) |
| Canvas/DnD  | Bom            | Excelente                   |
| Container   | Problemático   | Perfeito                    |

---

## 📁 Estrutura de Arquivos

```
tests/
├── e2e/
│   ├── funnels-page.spec.ts      ← Testes da listagem
│   └── funnel-editor.spec.ts     ← Testes do editor
└── fixtures/                      ← Dados de teste (preparar)

playwright.config.ts              ← Configuração Playwright
package.json                       ← Scripts npm
```

---

## 🎯 O Que é Testado

### 1. **Funnels Page** (`/admin/funnels`)

#### Listagem

- ✅ Carregamento da página
- ✅ Exibição de tabela/lista de funnels
- ✅ Botão de criar novo funnel
- ✅ Busca de funnels
- ✅ Ordenação de colunas

#### Navegação

- ✅ Links de edição funcionam
- ✅ Clique em funnel abre detalhes
- ✅ Breadcrumb está visível
- ✅ Botão voltar funciona

#### Ações em Massa

- ✅ Seleção de checkboxes
- ✅ Menu de ações em massa
- ✅ Deletar múltiplos funnels

#### Filtros e Ordenação

- ✅ Filtro por status
- ✅ Filtro por data
- ✅ Limpar filtros
- ✅ Ordenar por coluna

#### Feedback Visual

- ✅ Loading indicators
- ✅ Empty state quando vazio
- ✅ Error messages
- ✅ Success notifications
- ✅ Tooltips

#### Responsividade

- ✅ Desktop (1920x1080, 1280x720)
- ✅ Tablet (1024x768)
- ✅ Mobile (375x667)

#### Acessibilidade

- ✅ Navegação por teclado
- ✅ Labels descritivos
- ✅ Contraste de cores
- ✅ Alt text em imagens

---

### 2. **Funnel Editor** (`/admin/funnels/:id/edit`)

#### Navegação e Estrutura

- ✅ Carrega editor com container visível
- ✅ Breadcrumb mostra "Funnels > Edit"
- ✅ Botão voltar retorna para listagem
- ✅ Exibe nome do funnel
- ✅ Mostra ID/identificador
- ✅ Mostra data de criação/modificação

#### Toolbar

- ✅ Botão Save/Salvar
- ✅ Botão Undo
- ✅ Botão Redo
- ✅ Botão Preview/Test
- ✅ Botão Publish/Publicar
- ✅ Indicador de unsaved changes

#### Canvas/Editor

- ✅ Área de edição visível
- ✅ Suporta scroll
- ✅ Controle de zoom (se aplicável)
- ✅ Elementos renderizados
- ✅ Seleção de elementos funciona
- ✅ Arrastar e soltar elementos
- ✅ Drag and drop no canvas

#### Painel de Propriedades

- ✅ Painel visível ao lado
- ✅ Mostra propriedades ao selecionar elemento
- ✅ Permite editar texto/conteúdo
- ✅ Permite editar estilos
- ✅ Permite editar links/URLs
- ✅ Abas/seções de propriedades

#### Árvore de Elementos

- ✅ Árvore/layers panel visível
- ✅ Lista elementos
- ✅ Permite expandir/recolher
- ✅ Permite renomear elementos
- ✅ Permite reordenar via árvore

#### Undo/Redo

- ✅ Undo desabilitado no início
- ✅ Undo habilitado após mudança
- ✅ Desfaz última ação
- ✅ Redo funciona após undo

#### Salvamento e Publicação

- ✅ Salva mudanças
- ✅ Exibe notificação de sucesso
- ✅ Permite publicar
- ✅ Exibe URL publicada
- ✅ Modal de publicação

#### Responsividade

- ✅ Desktop (1920x1080)
- ✅ Laptop (1280x720)
- ✅ Tablet grande (1024x768)

---

## 🚀 Como Executar

### Pré-requisitos

```bash
# Servidor rodando em localhost:8081
npm run dev
```

### Rodar Testes

```bash
# Todos os testes
npm test

# Interface gráfica (recomendado para desenvolvimento)
npm run test:ui

# Debug interativo
npm run test:debug

# Com navegador visível
npm run test:headed

# Apenas listagem
npm run test:funnels

# Apenas editor
npm run test:editor

# Ver relatório HTML
npm run test:report
```

---

## 📊 Estrutura do Teste

### Exemplo Básico

```typescript
test("deve carregar a página de funnels", async ({ page }) => {
  // Navega para URL
  await page.goto("/admin/funnels");

  // Aguarda elemento visível
  await expect(page.locator("h1")).toBeVisible();
});
```

### Exemplo com Interação

```typescript
test("deve permitir criar novo funnel", async ({ page }) => {
  await page.goto("/admin/funnels");

  // Clica em botão
  await page.locator('button:has-text("Novo")').click();

  // Preenche form
  await page.locator('input[name="name"]').fill("Meu Funnel");

  // Verifica modal
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Confirma
  await page.locator('button:has-text("Criar")').click();

  // Verifica resultado
  await expect(page).toHaveURL(/\/admin\/funnels\/\d+\/edit/);
});
```

### Exemplo com Drag-and-Drop

```typescript
test("deve permitir arrastar elementos", async ({ page }) => {
  await page.goto("/admin/funnels/1/edit");

  const element = page.locator('[data-testid="element"]');
  const target = page.locator('[data-testid="canvas"]');

  // Arrasta elemento para novo local
  await element.dragTo(target);
});
```

---

## 🔍 Seletores Usados

Os testes usam preferências de seletores:

1. **`data-testid`** - Mais específico

   ```typescript
   page.locator('[data-testid="button-publish"]');
   ```

2. **`role`** - ARIA roles

   ```typescript
   page.locator('[role="dialog"]');
   page.locator('[role="button"]');
   ```

3. **`:has-text()`** - Por conteúdo

   ```typescript
   page.locator('button:has-text("Publish")');
   ```

4. **Combinações**
   ```typescript
   page.locator('input[type="text"][placeholder*="Search"]');
   ```

---

## 📈 Relatórios

Após rodar testes, gerar relatório:

```bash
npm run test:report
```

Abre automaticamente: `playwright-report/index.html`

**Inclui:**

- ✅ Testes passando/falhando
- ✅ Screenshots de falhas
- ✅ Videos de falhas (se configurado)
- ✅ Traces para debug
- ✅ Tempo de cada teste

---

## 🛠️ Troubleshooting

### Erro: "Browser not found"

```bash
# Instalar browsers
npx playwright install
```

### Erro: "Cannot find element"

1. Verifica se elemento existe no HTML
2. Verifica se `data-testid` está correto
3. Usa `page.pause()` para pausar e inspecionar
4. Roda com `--debug` para step-by-step

### Timeout

```typescript
// Aumentar timeout específico
await page.locator("selector").isVisible({ timeout: 10000 });
```

### Port já em uso

```bash
# Matar processos na porta 8081
lsof -ti:8081 | xargs kill -9
```

---

## 🔧 Configuração (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: "./tests/e2e", // Onde estão os testes
  fullyParallel: true, // Rodar em paralelo
  retries: 2, // Retry em falhas (CI)
  workers: 1, // Workers (1 em CI)
  reporter: "html", // Relatório HTML

  use: {
    baseURL: "http://localhost:8081", // URL base
    trace: "on-first-retry", // Trace em falhas
    screenshot: "only-on-failure", // Screenshot em falhas
    video: "retain-on-failure", // Video em falhas
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:8081",
    reuseExistingServer: true, // Reusar servidor
  },
});
```

---

## 📚 Recursos Úteis

- **Playwright Docs**: https://playwright.dev
- **Locators**: https://playwright.dev/docs/locators
- **Assertions**: https://playwright.dev/docs/test-assertions
- **API**: https://playwright.dev/docs/api/class-page

---

## ✅ Checklist de Antes de Commit

- [ ] Testes passam localmente: `npm test`
- [ ] Sem console errors: `npm run test:debug`
- [ ] Teste novo funciona: `npm run test -- --grep "novo teste"`
- [ ] Relatório gerado: `npm run test:report`
- [ ] Código formatado: `npm run lint`

---

## 🚀 CI/CD Setup (GitHub Actions)

Exemplo `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npx playwright install
      - run: npm run build
      - run: npm test

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📝 Próximas Melhorias

- [ ] Adicionar fixtures (dados de teste)
- [ ] Testes de performance
- [ ] Visual regression testing
- [ ] Acessibilidade com axe-core
- [ ] Custom reporters
- [ ] Testes de segurança
- [ ] Mock de APIs

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte documentação: https://playwright.dev
2. Veja logs: `npm run test:debug`
3. Inspecione: Use `page.pause()` nos testes
4. Trace: `npm run test:report` e veja traces

---

**Versão:** 1.0.0  
**Framework:** Playwright Test  
**Data:** 05/12/2025  
**Status:** ✅ Pronto para Produção
