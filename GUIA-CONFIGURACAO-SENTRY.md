# 🛡️ Guia Completo de Configuração do Sentry

## ✅ Status Atual da Instalação

### Pacotes Instalados

- ✅ **@sentry/react v10.29.0** - SDK instalado e pronto
- ✅ **Código configurado** - `src/utils/sentry.ts` implementado
- ✅ **Import habilitado** - `src/main.tsx` importando o Sentry
- ✅ **TypeScript** - Tipos configurados corretamente
- ⏳ **DSN pendente** - Aguardando configuração da conta Sentry

---

## 📋 Passo a Passo para Configuração

### **PASSO 1: Criar Conta no Sentry (3 min)**

1. Acesse: https://sentry.io/signup/
2. Escolha uma opção:
   - ✅ **Recomendado**: Sign up com GitHub
   - Ou: Sign up com email (necessita confirmação)
3. Complete o cadastro

---

### **PASSO 2: Criar Projeto (2 min)**

1. No dashboard do Sentry, clique em **"Create Project"**
2. Selecione a plataforma: **"React"**
3. Configure o projeto:
   ```
   Platform: React
   Alert frequency: On every new issue
   Project name: quiz-de-estilo4-58
   Team: [deixe o padrão ou crie um]
   ```
4. Clique em **"Create Project"**

---

### **PASSO 3: Copiar o DSN (1 min)**

Após criar o projeto, você verá uma página com código. Localize e copie o **DSN**.

**Formato do DSN:**

```
https://[PUBLIC_KEY]@[ORGANIZATION_ID].ingest.us.sentry.io/[PROJECT_ID]
```

**Exemplo real do seu projeto:**

```
https://9e94f859c4908698f2060e76deb2b3c8@o4510496536199168.ingest.us.sentry.io/4510496538034176
```

**Onde encontrar depois:**

- Settings → Projects → [seu projeto] → Client Keys (DSN)
- Ou: https://sentry.io/settings/[organization]/projects/[project]/keys/

---

### **PASSO 4: Configurar Variáveis de Ambiente (1 min)**

Abra o arquivo `.env.local` e atualize a variável do Sentry DSN:

```bash
# Antes (vazio)
VITE_SENTRY_DSN=

# Depois (cole SEU DSN real)
VITE_SENTRY_DSN=https://9e94f859c4908698f2060e76deb2b3c8@o4510496536199168.ingest.us.sentry.io/4510496538034176
```

**Variáveis completas do Sentry no .env.local:**

```bash
# Sentry - Error Tracking & Performance Monitoring
VITE_SENTRY_DSN=https://SEU_DSN_AQUI
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.2
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
```

---

### **PASSO 5: Testar Localmente (2 min)**

1. **Iniciar o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

2. **Abrir o console do navegador** (F12)

3. **Verificar inicialização:**

   - Se DSN estiver vazio: verá `[Sentry] DSN não configurado`
   - Se DSN estiver OK: não verá erros (Sentry inicializa silenciosamente)

4. **Testar erro proposital** - Adicione este botão temporário em qualquer página:

   ```tsx
   import * as Sentry from "@sentry/react";

   function TestSentryButton() {
     return (
       <button
         onClick={() => {
           Sentry.captureMessage("Teste manual do Sentry", "info");
           throw new Error("Erro de teste do Sentry!");
         }}
         className="bg-red-500 text-white px-4 py-2 rounded"
       >
         Testar Sentry
       </button>
     );
   }
   ```

5. **Clicar no botão** e verificar em 30 segundos no dashboard do Sentry

---

### **PASSO 6: Verificar no Dashboard do Sentry (1 min)**

1. Acesse: https://sentry.io/organizations/[sua-org]/issues/
2. Você deve ver:
   - ✅ Mensagem: "Teste manual do Sentry"
   - ✅ Error: "Erro de teste do Sentry!"
   - ✅ Stack trace completo
   - ✅ Breadcrumbs (ações do usuário)
   - ✅ Device info, browser, OS

---

### **PASSO 7: Deploy em Produção (3 min)**

1. **Configurar variáveis no Vercel:**

   ```bash
   vercel env add VITE_SENTRY_DSN
   # Cole o DSN quando solicitado
   # Escolha: Production, Preview, Development (todos)
   ```

   Ou via dashboard Vercel:

   - Project Settings → Environment Variables
   - Add: `VITE_SENTRY_DSN` = `seu-dsn-aqui`
   - Environments: Production ✓, Preview ✓, Development ✓

2. **Fazer deploy:**

   ```bash
   npm run build
   vercel --prod
   ```

3. **Testar em produção:**
   - Abra o site em produção
     -Force um erro qualquer
   - Verifique no Sentry em 30-60 segundos

---

## 🎯 Funcionalidades Implementadas

### 1. **Error Tracking Automático**

Todos os erros não tratados são enviados automaticamente:

```typescript
// Erros são capturados automaticamente
throw new Error("Algo deu errado!");
// ↑ Aparece no Sentry com stack trace completo
```

### 2. **Captura Manual de Erros**

```typescript
import { captureException } from "@/utils/sentry";

try {
  await fazerAlgo();
} catch (error) {
  captureException(error as Error, {
    contexto: "checkout",
    usuario_id: user.id,
  });
}
```

### 3. **Mensagens e Logs**

```typescript
import { captureMessage } from "@/utils/sentry";

captureMessage("Pagamento processado com sucesso", "info", {
  valor: 99.9,
  metodo: "pix",
});
```

### 4. **Rastreamento de Usuário**

```typescript
import { setSentryUser, clearSentryUser } from "@/utils/sentry";

// Ao fazer login
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// Ao fazer logout
clearSentryUser();
```

### 5. **Breadcrumbs (Rastro de Ações)**

```typescript
import { addBreadcrumb } from "@/utils/sentry";

addBreadcrumb("Usuário iniciou quiz", "navigation", "info", {
  quiz_id: "quiz-123",
});
```

### 6. **Performance Monitoring**

```typescript
import { PerformanceTimer } from "@/utils/sentry";

const timer = new PerformanceTimer("load_quiz_data", "http");
await carregarQuiz();
const duration = timer.finish(); // Registra no Sentry
```

### 7. **Session Replay** (Gravação de Sessão)

Quando um erro ocorre, o Sentry grava:

- ✅ Cliques do usuário
- ✅ Movimentos do mouse
- ✅ Inputs (texto mascarado)
- ✅ Navegação entre páginas
- ✅ Console logs

---

## ⚙️ Configuração Atual

### **Arquivo: `src/utils/sentry.ts`**

```typescript
✅ Import habilitado: import * as Sentry from "@sentry/react"
✅ Inicialização automática no browser
✅ Filtros de erros irrelevantes (extensões, network)
✅ Performance tracking (20% das transações)
✅ Session replay (10% normal, 100% em erros)
✅ Breadcrumbs automáticos
✅ TypeScript com tipos corretos
```

### **Arquivo: `src/main.tsx`**

```typescript
✅ Import ativo: import "./utils/sentry"
✅ Inicializa ANTES do React render
✅ Ordem correta: Sentry → GA4 → Performance
```

### **Sampling Rates (Reduzir Custos)**

```typescript
TRACES_SAMPLE_RATE = 0.2; // 20% das transações
REPLAYS_SESSION_SAMPLE_RATE = 0.1; // 10% das sessões normais
REPLAYS_ON_ERROR_SAMPLE_RATE = 1.0; // 100% quando há erro
```

**Por que não 100% em tudo?**

- Sentry cobra por evento e replay
- 20% de traces já identifica 99% dos problemas de performance
- 10% de replays normais economiza, mas 100% em erros garante debug

---

## 🔍 Monitoramento e Alertas

### **Dashboard Principal**

- https://sentry.io/organizations/[sua-org]/issues/

### **Métricas Importantes**

1. **Issues** - Erros únicos agrupados
2. **Crash Free Rate** - % de sessões sem crash
3. **APDEX Score** - Satisfação de performance
4. **Error Rate** - Taxa de erros por minuto
5. **P95 Response Time** - 95% das respostas abaixo de X ms

### **Configurar Alertas (Recomendado)**

1. Settings → Alerts → Create Alert Rule
2. Sugestões de alertas:
   - ✅ **Novo erro**: Alerta imediato em erros nunca vistos
   - ✅ **Taxa alta**: >10 erros/minuto
   - ✅ **Erro recorrente**: Mesmo erro >100x em 1h
   - ✅ **Performance degradada**: P95 >3s

---

## 📊 Integrações Úteis

### **Slack** (Recomendado)

- Notificações instantâneas de erros críticos
- Settings → Integrations → Slack

### **GitHub**

- Link automático de commits que causaram erros
- Criar issues automaticamente
- Settings → Integrations → GitHub

### **Vercel** (Já integrado)

- Erros linkados a deploys
- Source maps automáticos
- Settings → Integrations → Vercel

---

## 🐛 Troubleshooting

### **Sentry não está enviando eventos**

1. **Verificar DSN no .env.local:**

   ```bash
   cat .env.local | grep SENTRY
   ```

   - Deve conter `VITE_SENTRY_DSN=https://...`

2. **Verificar console do navegador:**

   - Abra F12 → Console
   - Procure por `[Sentry]`
   - Se vazio: DSN não configurado
   - Se erro: DSN inválido

3. **Testar manualmente:**

   ```typescript
   import * as Sentry from "@sentry/react";
   Sentry.captureMessage("Teste");
   ```

4. **Verificar build:**
   ```bash
   npm run build
   # Não deve ter erros relacionados a @sentry/react
   ```

### **Source Maps não estão funcionando**

1. **Verificar se build gera source maps:**

   ```bash
   npm run build
   ls dist/assets/*.js.map  # Devem existir
   ```

2. **Configurar upload de source maps (opcional):**

   ```bash
   npm install --save-dev @sentry/vite-plugin
   ```

   Em `vite.config.ts`:

   ```typescript
   import { sentryVitePlugin } from "@sentry/vite-plugin";

   export default defineConfig({
     build: {
       sourcemap: true,
     },
     plugins: [
       sentryVitePlugin({
         org: "sua-org",
         project: "quiz-de-estilo4-58",
         authToken: process.env.SENTRY_AUTH_TOKEN,
       }),
     ],
   });
   ```

### **Performance está degradando**

Se Sentry estiver consumindo muita banda/CPU:

1. **Reduzir sampling rates no .env.local:**

   ```bash
   VITE_SENTRY_TRACES_SAMPLE_RATE=0.1        # 20% → 10%
   VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.05  # 10% → 5%
   ```

2. **Desabilitar replays temporariamente:**
   ```bash
   VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0
   VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=0
   ```

---

## 💰 Planos e Custos

### **Developer (Free)**

- ✅ 5.000 erros/mês
- ✅ 1 usuário
- ✅ 30 dias de retenção
- ✅ Funciona perfeitamente para MVPs

### **Team ($26/mês)**

- ✅ 50.000 erros/mês
- ✅ Usuários ilimitados
- ✅ 90 dias de retenção
- ✅ Integrações avançadas

### **Business ($80/mês)**

- ✅ 500.000 erros/mês
- ✅ Alertas customizados
- ✅ SLA de suporte
- ✅ Retenção customizada

**Recomendação para Quiz de Estilo:**

- Começar com **Free**
- Upgrade para **Team** quando atingir 100+ usuários/dia

---

## ✅ Checklist de Verificação Final

- [ ] Conta Sentry criada
- [ ] Projeto React criado no Sentry
- [ ] DSN copiado
- [ ] `.env.local` atualizado com `VITE_SENTRY_DSN`
- [ ] Teste local realizado (botão de erro)
- [ ] Erro apareceu no dashboard do Sentry
- [ ] Variáveis configuradas no Vercel
- [ ] Deploy em produção realizado
- [ ] Teste em produção realizado
- [ ] Alertas configurados (opcional)
- [ ] Integração Slack configurada (opcional)

---

## 🎯 Próximos Passos

1. **Configure o DSN** seguindo os passos 1-4
2. **Teste localmente** com o botão de erro
3. **Faça deploy** e teste em produção
4. **Configure alertas** para ser notificado
5. **Monitore o dashboard** nos primeiros dias

---

## 📚 Recursos Adicionais

- **Documentação oficial**: https://docs.sentry.io/platforms/javascript/guides/react/
- **Dashboard**: https://sentry.io/organizations/[sua-org]/
- **Status do Sentry**: https://status.sentry.io/
- **Blog**: https://blog.sentry.io/

---

## 🆘 Suporte

Se precisar de ajuda:

1. Verifique o Troubleshooting acima
2. Console do navegador (F12)
3. Documentação do Sentry
4. Discord do Sentry: https://discord.gg/sentry

---

**Última atualização**: 8 de dezembro de 2025
**Status**: ✅ Código pronto, aguardando configuração do DSN
