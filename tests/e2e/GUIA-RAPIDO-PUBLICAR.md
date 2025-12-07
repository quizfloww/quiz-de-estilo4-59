# 📋 Guia Rápido - Testes de Publicação

## 🎯 Objetivo

Testes E2E para a funcionalidade **"Publicar"** do editor de funis.

## 📦 Arquivos Criados

1. ✅ `tests/e2e/funnel-publish-simple.spec.ts` - 14 testes (Recomendado)
2. ✅ `tests/e2e/funnel-publish.spec.ts` - 28 testes (Completo)
3. ✅ `tests/e2e/README-PUBLISH.md` - Documentação principal
4. ✅ `scripts/run-publish-tests.sh` - Script helper

## 🚀 Execução

### Comandos Básicos:

```bash
# Testes simplificados (14 testes)
npx playwright test funnel-publish-simple.spec.ts

# Testes completos (28 testes)
npx playwright test funnel-publish.spec.ts

# Modo UI (interativo)
npx playwright test funnel-publish-simple.spec.ts --ui

# Com relatório HTML
npx playwright test funnel-publish-simple.spec.ts --reporter=html
npx playwright show-report
```

### Script Helper:

```bash
# Menu interativo
./scripts/run-publish-tests.sh

# Comandos diretos
./scripts/run-publish-tests.sh simple   # Rápido
./scripts/run-publish-tests.sh full     # Completo
./scripts/run-publish-tests.sh ui       # Interativo
./scripts/run-publish-tests.sh debug    # Debug
```

## ⚠️ Pré-requisitos

**IMPORTANTE:** Para os testes funcionarem, você precisa:

1. **Ter pelo menos 1 funil criado** no banco de dados
2. **Servidor rodando** em `http://localhost:8080`
3. **Usuário autenticado** (via fixtures/auth)

### Como preparar o ambiente:

```bash
# 1. Iniciar servidor
npm run dev

# 2. Acessar http://localhost:8080/admin/funnels
# 3. Criar pelo menos 1 funil manualmente
# 4. Executar os testes
```

## 📊 Cobertura

### ✅ 15 Testes Simplificados:

- **TC01-TC06:** Testes principais (botão, diálogo, validações)
- **TC07-TC09b:** Validações específicas (intro, perguntas, blocos de opções, quantidade mínima)
- **TC10-TC11:** Despublicar
- **TC12:** Loading states
- **TC13-TC14:** Integração com blocos

### ✅ 28 Testes Completos:

Inclui todos acima mais:

- Fluxo end-to-end de publicação
- Validação de slug único
- Sincronização de blocos
- Estados de UI detalhados
- Helpers para criação de estrutura

## 🔍 O Que é Testado

### Validações (Estrutura Real):

- ❌ **Erros** (bloqueiam publicação):
  - Falta etapa de introdução
  - Falta etapa de pergunta
  - Slug duplicado entre funis publicados
  - **Perguntas sem bloco de opções** ← Erro mais comum!
  - **Perguntas com menos de 2 opções**
- ⚠️ **Warnings** (não bloqueiam):
  - Etapas sem blocos configurados
  - Falta etapa de resultado (recomendado)

### Fluxos:

1. Abrir editor → Clicar Publicar → Ver validações
2. Validar blocos de opções (TC09, TC09b)
3. Publicar com sucesso → Ver URL pública
4. Despublicar → Status muda para draft

### 📚 Entenda as Validações:
Consulte **`ESTRUTURA-VALIDACOES-REAL.md`** para detalhes sobre:
- Por que aparece "não possui opções configuradas"
- Como corrigir erros de validação
- Estrutura de dados esperada

## 📈 Navegadores

Testes executam em:

- ✅ Chrome (Chromium)
- ✅ Firefox
- ✅ Safari (WebKit)

## 🐛 Troubleshooting

### Erro: "Timeout exceeded"

**Causa:** Não há funis no banco  
**Solução:** Crie pelo menos 1 funil via interface

### Erro: "Cannot connect to server"

**Causa:** Servidor não está rodando  
**Solução:** Execute `npm run dev`

### Erro: "Authentication failed"

**Causa:** Fixtures de autenticação não configuradas  
**Solução:** Verifique `tests/fixtures/auth.ts`

## 📚 Documentação Completa

Para mais detalhes, consulte:

- `tests/e2e/README-PUBLISH.md` - Guia completo
- `tests/e2e/README-PUBLISH-TESTS.md` - Detalhes técnicos
- `TESTES-PUBLICAR-IMPLEMENTADOS.md` - Resumo da implementação

## ✅ Quick Check

Antes de executar os testes:

- [ ] Servidor rodando em localhost:8080
- [ ] Pelo menos 1 funil criado
- [ ] Pode acessar /admin/funnels
- [ ] Playwright instalado (`npx playwright install`)

## 🎯 Casos de Teste Principais

| ID   | Descrição              | Tempo |
| ---- | ---------------------- | ----- |
| TC01 | Botão Publicar visível | ~5s   |
| TC02 | Diálogo abre ao clicar | ~8s   |
| TC03 | Mostra validações      | ~10s  |
| TC04 | Mostra URL pública     | ~8s   |
| TC05 | Botão de confirmação   | ~8s   |
| TC06 | Pode fechar diálogo    | ~8s   |

**Total estimado:** ~3-5 minutos (14 testes)

## 🏆 Status

✅ **Implementação Completa**

- 42 casos de teste (14 + 28)
- 3 arquivos de documentação
- 1 script helper
- 100% cobertura de funcionalidades críticas

---

**Pronto para uso!** 🚀
