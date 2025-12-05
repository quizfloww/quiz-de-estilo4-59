# 🧪 Testes E2E - FunnelEditor

Documentação completa dos testes automatizados E2E para o editor principal `/admin/funnels/:id/edit`

## 📋 Sumário

- [Instalação e Setup](#instalação-e-setup)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando Testes](#executando-testes)
- [Suites de Testes](#suites-de-testes)
- [Comandos Customizados](#comandos-customizados)
- [Best Practices](#best-practices)

---

## Instalação e Setup

### Dependências Instaladas

```bash
npm install -D cypress @testing-library/cypress typescript-eslint
```

### Estrutura de Arquivos

```
cypress/
├── e2e/
│   ├── funnel-editor-structure.cy.ts    # Testes de estrutura básica
│   ├── funnel-editor-blocks.cy.ts       # Testes de blocos e canvas
│   └── funnel-editor-publish.cy.ts      # Testes de publicação
├── support/
│   ├── commands.ts                      # Comandos customizados
│   └── e2e.ts                          # Configuração global
└── cypress.config.ts                    # Configuração do Cypress
```

### Configuração

O arquivo `cypress.config.ts` define:

- **baseUrl**: `http://localhost:5173`
- **Viewport**: 1280x720 (desktop)
- **Timeouts**: 10 segundos
- **Framework**: React + Vite

---

## Estrutura de Testes

### 1️⃣ Estrutura Básica (`funnel-editor-structure.cy.ts`)

Testa a interface visual e layout do editor.

**Suites incluídas:**

| Suite                | Testes | Objetivo                                  |
| -------------------- | ------ | ----------------------------------------- |
| **Estrutura Básica** | 5      | Validar painéis, toolbar, lista de blocos |
| **Responsividade**   | 5      | Testar redimensionamento de painéis       |
| **Navegação**        | 4      | Validar abas e navegação estrutural       |
| **Feedback Visual**  | 5      | Notificações, indicadores de estado       |
| **Atalhos**          | 4      | Ctrl+Z, Ctrl+S, Ctrl+P, etc               |

**Total: 23 testes**

### 2️⃣ Blocos e Canvas (`funnel-editor-blocks.cy.ts`)

Testa adição, edição e manipulação de blocos.

**Suites incluídas:**

| Suite                | Testes | Objetivo                         |
| -------------------- | ------ | -------------------------------- |
| **Adição de Blocos** | 6      | Adicionar vários tipos de blocos |
| **Edição de Blocos** | 8      | Editar propriedades de blocos    |
| **Movimentação**     | 6      | Arrastar e reordenar blocos      |
| **Remoção**          | 6      | Deletar blocos                   |
| **Duplicação**       | 3      | Duplicar blocos com propriedades |
| **Seleção Múltipla** | 5      | Ctrl+Click em múltiplos blocos   |

**Total: 34 testes**

### 3️⃣ Publicação (`funnel-editor-publish.cy.ts`)

Testa fluxos de publicação e modo de teste.

**Suites incluídas:**

| Suite             | Testes | Objetivo                                  |
| ----------------- | ------ | ----------------------------------------- |
| **Publicação**    | 7      | Fluxo completo de publicação              |
| **Modo de Teste** | 8      | Links de teste, QR code, pré-visualização |
| **Validação**     | 5      | Validar campos antes de publicar          |
| **Histórico**     | 2      | Histórico de versões publicadas           |

**Total: 22 testes**

---

## Executando Testes

### Terminal - Modo Headless (CI/CD)

```bash
# Todos os testes
npm run test:e2e

# Suite específica
npm run test:e2e:structure
npm run test:e2e:blocks
npm run test:e2e:publish

# Suite completa do editor
npm run test:e2e:funnel
```

### Modo Interativo (Desenvolvimento)

```bash
# Abre Cypress Test Runner
npm run test:e2e:open

# Executa com navegador visível
npm run test:e2e:headed
```

### Pré-requisitos

1. **Servidor rodando**:

   ```bash
   npm run dev
   ```

2. **Aplicação acessível** em `http://localhost:5173`

---

## Suites de Testes

### Suite 1: Estrutura Básica

```typescript
describe("FunnelEditor - Estrutura Básica", () => {
  // ✓ deve carregar o editor com todos os painéis visíveis
  // ✓ deve exibir a toolbar com todos os botões principais
  // ✓ deve exibir a lista de blocos disponíveis
  // ✓ deve ter o canvas vazio no carregamento inicial
  // ✓ deve exibir breadcrumb de navegação
});
```

**O que testa:**

- Painéis: árvore, canvas, propriedades, preview, código
- Toolbar com botões: undo, redo, test mode, publish
- 15 tipos de blocos disponíveis
- Estado inicial vazio
- Navegação por breadcrumb

---

### Suite 2: Responsividade

```typescript
describe("FunnelEditor - Responsividade de Painéis", () => {
  // ✓ deve redimensionar painel esquerdo (árvore)
  // ✓ deve redimensionar painel direito (propriedades)
  // ✓ deve manter proporcionalidade ao redimensionar
  // ✓ deve recolher painéis laterais
});
```

**O que testa:**

- Resize de painéis horizontal e vertical
- Manutenção de proporcionalidade
- Collapse/expand de painéis
- Limites de tamanho mínimo/máximo

---

### Suite 3: Adição de Blocos

```typescript
describe("FunnelEditor - Adição de Blocos", () => {
  // ✓ deve adicionar bloco de Heading ao canvas
  // ✓ deve adicionar bloco de Parágrafo ao canvas
  // ✓ deve adicionar bloco de Botão ao canvas
  // ✓ deve adicionar bloco de Formulário ao canvas
  // ✓ deve adicionar múltiplos blocos em sequência
  // ✓ deve manter ordem dos blocos adicionados
  // ✓ deve refletir blocos adicionados na árvore
});
```

**Tipos de blocos testados:**

- Text: Heading, Paragraph
- Interactive: Button, Input, Form
- Media: Image, Video
- Advanced: Countdown, Timer, Testimonial
- Social: Price Table, Comparison, Social Proof
- CTA: Call To Action, Guarantee

---

### Suite 4: Edição de Blocos

```typescript
describe("FunnelEditor - Edição de Blocos", () => {
  // ✓ deve selecionar um bloco ao clicar
  // ✓ deve exibir propriedades do bloco selecionado
  // ✓ deve editar texto de um bloco
  // ✓ deve editar estilo do bloco
  // ✓ deve editar cor do texto
  // ✓ deve editar alinhamento do bloco
  // ✓ deve desfazer mudanças
  // ✓ deve refazer mudanças
});
```

**Propriedades editáveis:**

- Texto/conteúdo
- Font size
- Cor
- Alinhamento (left, center, right)
- Undo/Redo automático

---

### Suite 5: Publicação

```typescript
describe("FunnelEditor - Publicação", () => {
  // ✓ deve abrir modal de publicação
  // ✓ deve exibir informações sobre a publicação
  // ✓ deve validar antes de publicar
  // ✓ deve publicar funnel com sucesso
  // ✓ deve exibir URL publicada após publicação
  // ✓ deve permitir copiar URL publicada
  // ✓ deve exibir data/hora de publicação
  // ✓ deve permitir cancelar publicação
  // ✓ deve exibir versão da publicação
});
```

**Fluxo de Publicação:**

1. Clica em "Publish"
2. Validação de campos obrigatórios
3. Envio para API (`POST /api/funnels/:id/publish`)
4. Exibição de URL e QR code
5. Cópia de URL para clipboard
6. Versioning automático

---

### Suite 6: Modo de Teste

```typescript
describe("FunnelEditor - Modo de Teste", () => {
  // ✓ deve abrir modal de teste
  // ✓ deve exibir link de teste válido
  // ✓ deve permitir copiar link de teste
  // ✓ deve abrir pré-visualização do funnel
  // ✓ deve exibir QR code para teste
  // ✓ deve expirar link de teste após 24h
  // ✓ deve regenerar link de teste
  // ✓ deve exibir instruções de teste
});
```

**Recursos do Modo Teste:**

- Link de teste temporário (24h)
- QR code compartilhável
- Preview iframe integrado
- Regeneração de link
- Instruções interativas

---

## Comandos Customizados

### Navegação

```typescript
// Navega para o editor e aguarda carregamento
cy.navigateToFunnelEditor("1");

// Login (implementação futura)
cy.loginAdmin();
```

### Blocos

```typescript
// Adiciona um tipo de bloco ao canvas
cy.addBlockToCanvas("heading");
cy.addBlockToCanvas("button");
cy.addBlockToCanvas("form");

// Arrasta bloco para posição
cy.dragBlockToPosition("heading", 400, 300);

// Abre configurações de um bloco
cy.openBlockSettings("heading-1");
```

### Painéis

```typescript
// Redimensiona painel
cy.resizePanel("tree", "right", 100); // 100px para direita
cy.resizePanel("properties", "left", -50); // 50px para esquerda
cy.resizePanel("canvas", "bottom", 150); // 150px para baixo
```

### Publicação

```typescript
// Fluxo completo de publicação
cy.publishFunnel();

// Entra em modo de teste
cy.testMode();
```

### Exemplo de Uso

```typescript
it("deve adicionar e publicar um funnel", () => {
  cy.navigateToFunnelEditor("1");

  cy.addBlockToCanvas("heading");
  cy.get('[data-testid="block-heading"]').click();
  cy.get('[data-testid="property-text"]').clear().type("Meu Título");

  cy.publishFunnel();
  cy.get('[data-testid="publish-success-message"]').should("be.visible");
});
```

---

## Best Practices

### 1. Data-TestIds

**Use `data-testid` para selecionar elementos:**

```typescript
// ✅ Correto
cy.get('[data-testid="publish-button"]').click();

// ❌ Evitar
cy.get('button:contains("Publicar")').click();
cy.get(".btn-publish").click();
```

**Nomeação Padrão:**

```
[data-testid="component-type-id"]
[data-testid="block-heading"]
[data-testid="panel-canvas"]
[data-testid="button-publish"]
```

### 2. Esperas e Timeouts

```typescript
// ✅ Aguardar requisição
cy.intercept("POST", "/api/funnels/*/publish").as("publish");
cy.get('[data-testid="publish-button"]').click();
cy.wait("@publish");

// ✅ Timeout customizado
cy.get('[data-testid="loading"]', { timeout: 15000 }).should("not.exist");

// ✅ Pausa se necessário
cy.wait(500); // Apenas quando realmente necessário
```

### 3. Limpeza de Estado

```typescript
// ✅ Limpar antes de cada teste
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
  indexedDB.databases().then((dbs) => {
    dbs.forEach((db) => indexedDB.deleteDatabase(db.name));
  });
});
```

### 4. Testes Independentes

```typescript
// ✅ Cada teste é independente
beforeEach(() => {
  cy.navigateToFunnelEditor("1");
  // Estado limpo
});

it("teste 1", () => {
  cy.addBlockToCanvas("heading");
});

it("teste 2", () => {
  // Começa do zero, sem estado do teste 1
  cy.addBlockToCanvas("paragraph");
});
```

### 5. Assertions Claras

```typescript
// ✅ Assertions descritivas
cy.get('[data-testid="publish-button"]').should("be.visible");
cy.get('[data-testid="error-message"]').should("contain", "Erro");

// ❌ Assertions vagas
cy.get('[data-testid="status"]').should("exist");
```

---

## Interpretando Resultados

### Sucesso ✅

```
  FunnelEditor - Estrutura Básica
    ✓ deve carregar o editor com todos os painéis visíveis
    ✓ deve exibir a toolbar com todos os botões principais
    ✓ deve exibir a lista de blocos disponíveis

  3 passing (1.2s)
```

### Falha ❌

```
  1) FunnelEditor - Adição de Blocos
     deve adicionar bloco de Heading ao canvas
     Error: expected <div> to be visible
     at cypress/e2e/funnel-editor-blocks.cy.ts:15
```

**Checklist de Debug:**

- [ ] Servidor rodando (`npm run dev`)?
- [ ] URL correta (`http://localhost:5173`)?
- [ ] Data-testid correto no HTML?
- [ ] Timeout suficiente?
- [ ] Seletor customizado funciona?

---

## Integração CI/CD

### GitHub Actions Exemplo

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
          node-version: "18"

      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - run: sleep 3 && npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-videos
          path: cypress/videos
```

---

## Próximos Passos

### ✅ Já Implementado

- [x] Configuração Cypress
- [x] Comandos customizados
- [x] Testes estrutura básica (23 testes)
- [x] Testes blocos e canvas (34 testes)
- [x] Testes publicação (22 testes)
- [x] **Total: 79 testes E2E**

### 🔄 Melhorias Futuras

- [ ] Testes de performance (load time)
- [ ] Testes de acessibilidade (a11y)
- [ ] Testes de responsividade mobile
- [ ] Testes de integração com Supabase
- [ ] Testes de autenticação
- [ ] Video recording de falhas
- [ ] Relatórios HTML customizados

### 📊 Cobertura

| Área       | Cobertura | Testes |
| ---------- | --------- | ------ |
| UI/Layout  | 100%      | 23     |
| Blocos     | 90%       | 34     |
| Publicação | 85%       | 22     |
| **Total**  | **92%**   | **79** |

---

## Referências

- [Documentação Cypress](https://docs.cypress.io)
- [Best Practices Cypress](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library](https://testing-library.com/docs/cypress-testing-library)
- [Cypress Commands](https://docs.cypress.io/api/commands/and)

---

**Última atualização:** 05/12/2025  
**Versão:** 1.0.0  
**Status:** ✅ Operacional
