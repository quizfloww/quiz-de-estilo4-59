# 🚀 Guia Rápido: Configuração Pós-Deploy

## ✅ Status Atual

**Build:** ✅ Sucesso (15.99s)  
**Manifest:** ✅ Copiado para `/dist/site.webmanifest`  
**Sentry:** ⏸️ Desabilitado (aguardando configuração)  
**GA4:** ⏸️ Aguardando Measurement ID

---

## 📋 PASSO A PASSO - Configure Agora

### 🎯 PASSO 1: Google Analytics 4 (15 minutos)

#### 1.1 - Criar Propriedade GA4

1. **Acesse:** https://analytics.google.com
2. **Admin** (canto inferior esquerdo) → **Criar Propriedade**
3. **Preencha:**
   - Nome da propriedade: `Quiz Sell Genius`
   - Fuso horário: `(GMT-03:00) Brasília`
   - Moeda: `Real brasileiro (BRL)`
4. **Avançar**

#### 1.2 - Configurar Stream de Dados

1. **Detalhes da empresa:**
   - Setor: `Moda e beleza` ou `Serviços profissionais`
   - Tamanho: `Pequeno` (1-10 funcionários)
   - Marque: `Melhorar produtos e serviços do Google`
2. **Criar**
3. **Fluxos de dados** → **Adicionar stream** → **Web**
4. **Preencha:**
   - URL do site: `https://quiz-de-estilo4-58-jw0oyy07d-quiz-flow.vercel.app`
   - Nome do stream: `Quiz Website Produção`
5. **Criar stream**
6. **📋 COPIE O MEASUREMENT ID** (formato: `G-XXXXXXXXXX`)

#### 1.3 - Configurar no Projeto

```bash
# No seu terminal local:
cd /workspaces/quiz-de-estilo4-58

# Criar arquivo .env.local se não existir
cat > .env.local << EOF
VITE_APP_ENV=production
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_AB_TEST_ACTIVE=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
EOF

# Substitua G-XXXXXXXXXX pelo seu ID real
```

#### 1.4 - Deploy com GA4

```bash
# Build
npm run build

# Deploy
vercel --prod
```

#### 1.5 - Validar GA4

1. Acesse seu site após deploy
2. Abra **DevTools** → **Console**
3. Procure: `[GA4] Inicializado com sucesso: G-XXXXXXXXXX`
4. **DevTools** → **Network** → filtre por `google-analytics.com`
5. Deve haver requisições para `/g/collect`

**No GA4:**

- Aguarde 5-10 minutos
- **Relatórios** → **Tempo real**
- Deve mostrar sua visita atual

---

### 🐛 PASSO 2: Sentry (10 minutos) - OPCIONAL

#### 2.1 - Criar Conta

1. **Acesse:** https://sentry.io/signup/
2. **Crie conta** (pode usar Google/GitHub)
3. **Create Project**:
   - Platform: `React`
   - Project name: `quiz-sell-genius`
4. **Create Project**

#### 2.2 - Obter DSN

Na página de boas-vindas:

1. Procure por: `dsn: "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"`
2. **📋 COPIE TODO O DSN**

Ou navegue:

- **Settings** → **Projects** → `quiz-sell-genius`
- **Client Keys (DSN)**
- Copie o DSN

#### 2.3 - Configurar no Projeto

```bash
# Adicione ao .env.local:
echo 'VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx' >> .env.local
echo 'VITE_SENTRY_ENVIRONMENT=production' >> .env.local
```

#### 2.4 - Habilitar Sentry no Código

**Arquivo:** `src/main.tsx`

```typescript
// REMOVA o comentário:
import "./utils/sentry";
```

**Arquivo:** `src/App.tsx`

```typescript
// REMOVA os comentários:
import { addBreadcrumb } from "./utils/sentry";

// E também na função NavigationTracker:
addBreadcrumb(`Navigation: ${location.pathname}`, "navigation", "info", {
  search: location.search,
});
```

#### 2.5 - Deploy com Sentry

```bash
npm run build
vercel --prod
```

#### 2.6 - Testar Sentry

1. Acesse seu site
2. **Console do browser:**

```javascript
// Force um erro de teste:
throw new Error("Teste Sentry Produção");
```

3. Aguarde 10 segundos
4. Verifique em **sentry.io** → **Issues**
5. O erro deve aparecer!

---

### 🧪 PASSO 3: Ativar Teste A/B (5 minutos)

#### 3.1 - Já Está Configurado!

O teste A/B já está ativo se você adicionou no `.env.local`:

```bash
VITE_AB_TEST_ACTIVE=true
```

#### 3.2 - Como Funciona

- **Variante A (50%):** Landing page original (`/`)
- **Variante B (50%):** Quiz direto (`/quiz-descubra-seu-estilo`)
- Usuário é atribuído aleatoriamente
- Variante salva em `localStorage`

#### 3.3 - Testar Localmente

```javascript
// Console do browser:
console.log(localStorage.getItem("ab_test_variant_landing_page"));
// Retorna: 'A' ou 'B'

// Para testar a outra variante:
localStorage.clear();
location.reload();
```

#### 3.4 - Ver Resultados no GA4

Após 24-48h com tráfego:

1. **GA4** → **Explorar** → **Criar exploração**
2. **Dimensões:**
   - `event_name`
   - `ab_test_variant` (parâmetro personalizado)
3. **Métricas:**
   - `event_count`
   - `conversions`
4. **Filtro:** `event_name = ab_test_conversion`

---

### 📊 PASSO 4: Monitorar Métricas (Contínuo)

#### 4.1 - Métricas Diárias

**Google Analytics:**

- **Tempo real:** Visitantes agora
- **Aquisição:** De onde vêm os usuários
- **Engajamento:** Quais páginas mais vistas
- **Conversões:** Eventos de lead/compra

**Sentry (se configurado):**

- **Issues:** Erros em produção
- **Performance:** Transações lentas
- **Releases:** Compare versões

#### 4.2 - KPIs Semanais

- Taxa de conversão do quiz
- Taxa de conclusão do quiz
- Tempo médio no site
- Taxa de rejeição
- Performance (LCP, FID, CLS)

#### 4.3 - Dashboard Recomendado

Crie um dashboard no GA4 com:

- Visitantes únicos (hoje/7d/30d)
- Taxa de conversão
- Páginas mais visitadas
- Dispositivos (mobile/desktop)
- Origem do tráfego

---

## 🔍 Checklist de Validação

Após configurar tudo, valide:

### Google Analytics

- [ ] Measurement ID configurado no `.env.local`
- [ ] Build e deploy realizados
- [ ] Console mostra: `[GA4] Inicializado com sucesso`
- [ ] Network mostra requisições para `google-analytics.com`
- [ ] Tempo real no GA4 mostra sua visita

### Sentry (Opcional)

- [ ] DSN configurado no `.env.local`
- [ ] Código descomentado
- [ ] Build e deploy realizados
- [ ] Console mostra: `[Sentry] Inicializado com sucesso`
- [ ] Erro de teste aparece no sentry.io

### Teste A/B

- [ ] `VITE_AB_TEST_ACTIVE=true` no `.env.local`
- [ ] localStorage tem `ab_test_variant_landing_page`
- [ ] Console mostra: `[A/B Test] Sistema inicializado`
- [ ] Variantes alternando entre sessões

### Performance

- [ ] Console mostra Web Vitals:
  - `[Performance] LCP: XXX (good/needs-improvement/poor)`
  - `[Performance] FID: XXX (good)`
  - `[Performance] CLS: XXX (good)`
- [ ] Lighthouse score > 90

---

## 🆘 Troubleshooting Rápido

### GA4 não aparece no Tempo Real

```bash
# Verifique se o ID está correto:
cat .env.local | grep GA4

# Force rebuild:
rm -rf dist
npm run build
vercel --prod

# Limpe cache do browser:
Ctrl+Shift+Delete (ou Cmd+Shift+Delete no Mac)
```

### Erro "useLayoutEffect" ainda aparece

```bash
# Verifique se Sentry está comentado:
grep -n "import.*sentry" src/main.tsx
# Deve estar comentado se DSN não configurado

# Limpe node_modules:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Manifest 401

O arquivo já está corrigido. Se persistir:

```bash
# Verifique se existe:
ls -la public/site.webmanifest
ls -la dist/site.webmanifest

# Force redeploy:
vercel --force --prod
```

---

## 📞 Comandos Úteis

```bash
# Ver logs do Vercel
vercel logs

# Forçar redeploy
vercel --force --prod

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável no Vercel
vercel env add VITE_GA4_MEASUREMENT_ID production

# Build local
npm run build

# Preview local
npm run preview
```

---

## 🎯 Próximos 7 Dias

### Dia 1-2: Configuração

- [ ] Configurar GA4
- [ ] Configurar Sentry (opcional)
- [ ] Validar tudo funcionando

### Dia 3-4: Monitoramento

- [ ] Checar GA4 diariamente
- [ ] Identificar erros no Sentry
- [ ] Analisar performance

### Dia 5-7: Otimização

- [ ] Analisar páginas mais visitadas
- [ ] Identificar pontos de saída
- [ ] Ajustar teste A/B se necessário

---

**Última atualização:** 7 de Dezembro de 2024  
**Versão:** 1.0.2 (correção de erros + guia rápido)

---

## 🎉 Começe Agora!

1. **Abra em nova aba:** https://analytics.google.com
2. Siga o **PASSO 1** acima
3. Configure em **15 minutos**
4. Deploy e monitore!

**Boa sorte! 🚀**
