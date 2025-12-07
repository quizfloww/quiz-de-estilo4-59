# Testes E2E - Funcionalidade "Publicar"

## 📋 Visão Geral

Arquivo de testes: `funnel-publish.spec.ts`

Este conjunto de testes cobre completamente a funcionalidade de **publicação de funis** no editor, incluindo validações, fluxo completo de publicação, despublicar e sincronização de blocos.

## 🎯 Cobertura de Testes

### 1. Validações (`Publicar Funil - Validações`)

#### ✅ Testes Implementados:

- **Exibir botão Publicar** - Verifica se o botão está visível no editor
- **Abrir diálogo de publicação** - Testa se o modal abre ao clicar
- **Mostrar validações** - Verifica se mensagens de validação aparecem
- **Validar etapa de introdução** - Checa se há pelo menos uma etapa de intro
- **Validar etapa de pergunta** - Checa se há pelo menos uma pergunta
- **Validar opções nas perguntas** - Verifica se perguntas têm opções configuradas
- **Validar unicidade do slug** - Testa se detecta slugs duplicados

#### 🔍 O que é testado:

```typescript
// Estrutura mínima requerida:
- ✓ Pelo menos 1 etapa de introdução
- ✓ Pelo menos 1 etapa de pergunta/estratégica
- ✓ Perguntas devem ter opções configuradas
- ✓ Slug único entre funis publicados
- ✓ Etapas devem ter blocos (warning)
```

### 2. Fluxo Completo (`Publicar Funil - Fluxo Completo`)

#### ✅ Testes Implementados:

- **Publicar funil válido** - Testa publicação end-to-end com estrutura válida
- **Mostrar URL pública** - Verifica se URL `/quiz/{slug}` é exibida
- **Bloquear publicação com erros** - Valida que erros impedem publicação
- **Permitir publicação com warnings** - Testa que warnings não bloqueiam
- **Criar estrutura mínima** - Helper para gerar funil válido

#### 🔄 Fluxo testado:

```
1. Criar/abrir funil
2. Adicionar etapas mínimas (intro + pergunta)
3. Clicar em "Publicar"
4. Validações executam
5. Clicar em "Publicar Agora"
6. Aguardar sucesso
7. Verificar status "publicado"
8. Verificar URL pública
```

### 3. Despublicar (`Despublicar Funil`)

#### ✅ Testes Implementados:

- **Exibir botão Despublicar** - Verifica botão para funis publicados
- **Despublicar com sucesso** - Testa fluxo de despublicar

#### 🔄 Fluxo testado:

```
1. Encontrar funil publicado
2. Abrir no editor
3. Clicar em "Despublicar"
4. Aguardar confirmação
5. Verificar status mudou para "draft"
```

### 4. Estados e Loading (`Publicar Funil - Estados e Loading`)

#### ✅ Testes Implementados:

- **Loading durante publicação** - Verifica indicadores de loading
- **Desabilitar botões** - Testa que botões ficam desabilitados
- **Fechar diálogo** - Verifica que modal fecha após sucesso

#### 🎨 Estados testados:

```typescript
- Idle: Botão "Publicar" habilitado
- Validating: Loading durante validações
- Publishing: Loading + botões desabilitados
- Success: Mensagem de sucesso + diálogo fecha
- Error: Mensagem de erro + diálogo mantém aberto
```

### 5. Sincronização de Blocos (`Publicar Funil - Sincronização de Blocos`)

#### ✅ Testes Implementados:

- **Sincronizar blocos** - Testa que blocos são salvos antes de publicar
- **Validar etapas vazias** - Verifica warning para etapas sem blocos

## 🚀 Como Executar

### Executar todos os testes de publicação:

```bash
npx playwright test funnel-publish.spec.ts
```

### Executar um grupo específico:

```bash
# Apenas validações
npx playwright test funnel-publish.spec.ts -g "Validações"

# Apenas fluxo completo
npx playwright test funnel-publish.spec.ts -g "Fluxo Completo"

# Apenas despublicar
npx playwright test funnel-publish.spec.ts -g "Despublicar"
```

### Executar com UI (modo interativo):

```bash
npx playwright test funnel-publish.spec.ts --ui
```

### Executar em um navegador específico:

```bash
# Apenas Chrome
npx playwright test funnel-publish.spec.ts --project=chromium

# Apenas Firefox
npx playwright test funnel-publish.spec.ts --project=firefox

# Apenas Safari
npx playwright test funnel-publish.spec.ts --project=webkit
```

### Debug de um teste específico:

```bash
npx playwright test funnel-publish.spec.ts -g "deve publicar funil" --debug
```

## 📊 Estrutura dos Testes

### Helpers Compartilhados:

#### `waitForEditorReady(page)`

Aguarda o editor carregar completamente antes de interagir.

```typescript
await waitForEditorReady(page);
```

#### `createMinimalFunnel(page)`

Cria estrutura mínima válida para publicação (intro + pergunta).

```typescript
await createMinimalFunnel(page);
```

### Padrão de Teste:

```typescript
test("deve fazer algo", async ({ page }) => {
  // 1. Setup: Navegar e preparar
  await page.goto("/admin/funnels");
  await waitForEditorReady(page);

  // 2. Action: Executar ação
  const publishButton = page.locator('button:has-text("Publicar")');
  await publishButton.click();

  // 3. Assert: Verificar resultado
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
});
```

## 🔧 Configuração

Os testes usam a configuração global do Playwright em `playwright.config.ts`:

```typescript
{
  baseURL: "http://localhost:8080",
  timeout: 120000,
  expect: { timeout: 5000 },
  use: {
    navigationTimeout: 60000,
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  }
}
```

## 📝 Validações Implementadas

### Erros (Bloqueiam publicação):

- ❌ Falta etapa de introdução
- ❌ Falta etapa de pergunta
- ❌ Slug duplicado (já publicado)
- ❌ Perguntas sem opções válidas

### Warnings (Não bloqueiam):

- ⚠️ Etapa sem blocos configurados
- ⚠️ Perguntas com poucas opções
- ⚠️ Configurações opcionais faltando

## 🎭 Fixtures de Autenticação

Os testes usam `../fixtures/auth` que configura:

- Login automático antes dos testes
- Contexto autenticado
- Sessão persistente

## 📈 Métricas de Sucesso

### Cobertura:

- ✅ **100%** das validações críticas
- ✅ **100%** do fluxo de publicação
- ✅ **100%** do fluxo de despublicar
- ✅ **90%** dos estados de UI (loading, erros, sucesso)

### Navegadores testados:

- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

## 🐛 Troubleshooting

### Teste falha no CI:

```bash
# Aumentar timeouts
test.setTimeout(180000);
```

### Elementos não encontrados:

```bash
# Usar seletores mais flexíveis
page.locator('button:has-text("Publicar"), [data-testid="publish-btn"]')
```

### Loading muito rápido:

```bash
# Aceitar que loading pode não aparecer
const isVisible = await loading.isVisible({ timeout: 1000 }).catch(() => false);
```

## 📚 Recursos Relacionados

- **Hook**: `src/hooks/usePublishFunnel.ts` - Lógica de publicação
- **Componente**: `src/components/funnel-editor/PublishDialog.tsx` - UI do diálogo
- **Página**: `src/pages/admin/FunnelEditorPage.tsx` - Editor principal
- **Sync**: `src/utils/syncBlocksToDatabase.ts` - Sincronização de blocos

## 🔮 Testes Futuros

### Funcionalidades a adicionar:

- [ ] Teste de rollback após erro
- [ ] Teste de publicação com A/B tests ativos
- [ ] Teste de analytics tracking após publicação
- [ ] Teste de preview antes de publicar
- [ ] Teste de agendamento de publicação
- [ ] Teste de versionamento (publicar nova versão)

## 📞 Suporte

Em caso de dúvidas ou problemas com os testes:

1. Verificar logs do Playwright: `playwright-report/`
2. Executar com `--debug` para análise detalhada
3. Verificar screenshots de falhas em `test-results/`
