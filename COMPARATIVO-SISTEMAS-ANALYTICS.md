# 📊 Comparativo Completo: Sistemas de Analytics

> **Atualizado em:** 07/12/2025  
> **Status:** Documentação técnica completa dos 4 sistemas de rastreamento

---

## 🎯 Visão Geral

Este projeto possui **4 sistemas de analytics** trabalhando em paralelo, cada um com propósitos diferentes:

| Sistema                | Status           | Arquivo Principal         | Rastreia Funis?          |
| ---------------------- | ---------------- | ------------------------- | ------------------------ |
| **Vercel Analytics**   | ✅ Ativo         | `App.tsx`                 | ⚠️ Parcial (por domínio) |
| **Google Analytics 4** | ⏸️ Código pronto | `googleAnalytics.ts`      | ❌ Não implementado      |
| **Facebook Pixel**     | ✅ Ativo         | `facebookPixelDynamic.ts` | ✅ **SIM** (completo)    |
| **Analytics Legacy**   | ✅ Ativo         | `analytics.ts`            | ❌ Não diferencia        |

---

## 1️⃣ Vercel Analytics

### 📍 Localização

```typescript
// src/App.tsx (linha ~85)
import { Analytics } from "@vercel/analytics/react";

<QueryClientProvider>
  {/* ... */}
  <Analytics /> {/* ← Componente injetado */}
</QueryClientProvider>;
```

### ✅ O Que Rastreia

#### **Automático (sem configuração)**

- ✅ **Page Views**: Todas as páginas, incluindo custom domains
- ✅ **Web Vitals**: LCP, FID, CLS, FCP, TTFB
- ✅ **Devices**: Desktop, Mobile, Tablet
- ✅ **Browsers**: Chrome, Safari, Firefox, etc.
- ✅ **Geografia**: Países via IP (Edge Network)

#### **Como funciona com Funis**

```
Usuário acessa → meu-dominio-1.com/quiz/pergunta-1
                ↓
DNS CNAME → quiz-de-estilo4-58.vercel.app
                ↓
Vercel serve App.tsx com <Analytics />
                ↓
Métricas enviadas com hostname = "meu-dominio-1.com"
                ↓
Dashboard Vercel mostra:
  - meu-dominio-1.com/quiz/pergunta-1 (150 views)
  - meu-dominio-2.com/ (200 views)
  - quiz-de-estilo4-58.vercel.app/ (50 views)
```

### ⚠️ Limitações

❌ **NÃO rastreia:**

- Eventos customizados (quiz_completed, conversões)
- ID do funil (não agrupa "Funil A teve X conversões")
- Formulários preenchidos
- Cliques em botões específicos

❌ **NÃO agrupa por funil:**

- Você vê domínios separados, mas não "Funil X = 10 páginas = 500 views totais"

### 📊 Dashboard

```bash
# Acessar:
https://vercel.com/giselegal/quiz-de-estilo4-58/analytics

# Dados disponíveis:
- Real-time visitors (agora)
- Top pages (por URL completa)
- Countries (mapa de calor)
- Devices/Browsers
- Web Vitals score
```

### 💰 Limites

- **Free:** 100.000 page views/mês
- **Pro:** Ilimitado

---

## 2️⃣ Google Analytics 4 (GA4)

### 📍 Localização

```typescript
// src/utils/googleAnalytics.ts (245 linhas)
export const initGA4 = () => {
  /* ... */
};
export const trackGA4PageView = () => {
  /* ... */
};
export const trackGA4Event = () => {
  /* ... */
};
export const trackGA4QuizStart = () => {
  /* ... */
};
export const trackGA4QuizComplete = () => {
  /* ... */
};
```

### ⏸️ Status Atual

**Código pronto, mas NÃO ativo** porque:

```bash
# Falta configurar no .env:
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### ✅ O Que Rastreará (Quando Ativar)

#### **Eventos automáticos**

- ✅ Page views em todas as rotas
- ✅ Web Vitals (integrado)
- ✅ Scroll depth
- ✅ Outbound clicks

#### **Eventos customizados implementados**

```typescript
// Início do quiz
trackGA4QuizStart("Quiz Joias");

// Resposta de pergunta
trackGA4QuizQuestion(1, "Qual seu estilo?");

// Conclusão
trackGA4QuizComplete("Quiz Joias", "Clássico", 85);

// Lead gerado
trackGA4Lead("email", 50.0);

// Conversão
trackGA4Conversion(497.0, "BRL", "order_123");
```

### ⚠️ Problema Atual: Não Diferencia Funis

**AGORA (sem modificações):**

```typescript
// src/pages/DynamicQuizPage.tsx (linha ~160)
trackQuizComplete({
  primaryStyle: legacyResult.primaryStyle?.category,
  funnel_id: funnel.id, // ← JÁ passa funnel_id!
  funnel_slug: slug, // ← E slug!
});

// MAS em analytics.ts:
export const trackQuizComplete = (result?: any) => {
  window.gtag("event", "quiz_complete", {
    event_category: "conversion",
    result_type: result?.primaryStyle?.category,
    // ❌ NÃO usa funnel_id nem funnel_slug
  });
};
```

**O QUE FALTA:**

```typescript
// analytics.ts deveria fazer:
export const trackQuizComplete = (result?: any) => {
  window.gtag("event", "quiz_complete", {
    event_category: "conversion",
    result_type: result?.primaryStyle?.category,
    funnel_id: result?.funnel_id, // ← ADICIONAR
    funnel_slug: result?.funnel_slug, // ← ADICIONAR
    custom_domain: window.location.hostname, // ← ADICIONAR
  });
};
```

### 📊 Dashboard

```bash
# Após configurar, acessar:
https://analytics.google.com

# Relatórios disponíveis:
- Real-time (últimos 30 min)
- Aquisição (de onde vem tráfego)
- Engagement (eventos customizados)
- Conversões (funis configurados)
- User Properties (segmentação)
```

### 💡 Como Usar por Funil (Quando Configurar)

1. **Criar Dimensões Customizadas no GA4:**

```
Nome: funnel_id
Escopo: Evento
Parâmetro: funnel_id

Nome: custom_domain
Escopo: Evento
Parâmetro: custom_domain
```

2. **Filtrar no Dashboard:**

```
Eventos > quiz_completed
Adicionar dimensão > funnel_id = "abc123"
Métrica: Contagem de eventos
```

3. **Resultado:**

```
Funil "Quiz Joias" (meu-dominio-1.com):
  - 500 page views
  - 250 quiz_start
  - 180 quiz_complete (72% conclusão)
  - 45 generate_lead (25% conversão)
```

---

## 3️⃣ Facebook Pixel (Múltiplos Pixels)

### 📍 Localização

```typescript
// src/utils/facebookPixelDynamic.ts
export const loadFacebookPixelDynamic = () => {
  /* ... */
};

// src/services/pixelManager.ts (AQUI ESTÁ A MÁGICA!)
export const FUNNEL_CONFIGS: Record<string, FunnelConfig> = {
  default: {
    pixelId: "1311550759901086", // ← Pixel 1
    token: "EAAEJYWeJHLABOwGC1ZC1...",
    utmCampaign: "Teste Lovable - Por Fora",
    funnelName: "quiz_isca",
    ctaUrl: "https://pay.hotmart.com/...",
  },
  "quiz-descubra-seu-estilo": {
    pixelId: "1038647624890676", // ← Pixel 2 (diferente!)
    token: "EAAEJYWeJHLABOwGC1ZC1...",
    utmCampaign: "Teste Lovable - Por Dentro",
    funnelName: "quiz_embutido",
    ctaUrl: "https://pay.hotmart.com/...",
  },
};
```

### ✅ O Que Rastreia

#### **Sistema Inteligente de Pixels**

```typescript
// pixelManager.ts (linha 44)
export const getCurrentFunnel = (): string => {
  const path = window.location.pathname;

  if (path.includes("/quiz-descubra-seu-estilo")) {
    return "quiz-descubra-seu-estilo"; // ← Carrega Pixel 1038647624890676
  }

  return "default"; // ← Carrega Pixel 1311550759901086
};
```

**OU SEJA:** Dependendo da **URL**, um **Pixel diferente** é carregado! 🎯

#### **Eventos rastreados automaticamente**

```typescript
// Inicialização
trackFunnelEvent("PixelInitialized", {
  pixel_id: "1311550759901086",
  funnel_type: "quiz_isca",
  page_url: window.location.href,
});

// Eventos customizados
window.fbq("track", "ViewContent");
window.fbq("track", "Lead");
window.fbq("track", "Purchase", { value: 497, currency: "BRL" });
```

### 🎯 **Como Funciona com Custom Domains**

```
Cenário 1: Funil A (meu-dominio-1.com)
├── DNS CNAME → quiz-de-estilo4-58.vercel.app
├── App.tsx carrega facebookPixelDynamic.ts
├── pixelManager detecta path "default"
├── Carrega Pixel 1311550759901086
└── Eventos enviados para Meta Ads do Funil A

Cenário 2: Funil B (meu-dominio-2.com/quiz-descubra-seu-estilo)
├── DNS CNAME → quiz-de-estilo4-58.vercel.app
├── App.tsx carrega facebookPixelDynamic.ts
├── pixelManager detecta path "/quiz-descubra-seu-estilo"
├── Carrega Pixel 1038647624890676 (DIFERENTE!)
└── Eventos enviados para Meta Ads do Funil B
```

### ⚠️ Problema: Baseado em Path, Não em Domain

**Limitação atual:**

```typescript
// pixelManager.ts detecta por PATH:
if (path.includes('/quiz-descubra-seu-estilo')) {
  // Pixel B
}

// MAS se o custom domain for:
meu-dominio-1.com → /        (Pixel A ✅)
meu-dominio-2.com → /        (Pixel A ❌ ERRADO!)
meu-dominio-2.com → /quiz-descubra-seu-estilo (Pixel B ✅)
```

**Solução ideal:**

```typescript
// Detectar por hostname E path
export const getCurrentFunnel = (): string => {
  const hostname = window.location.hostname;
  const path = window.location.pathname;

  // Mapear domínios para funis
  const DOMAIN_TO_FUNNEL = {
    "meu-dominio-1.com": "default",
    "meu-dominio-2.com": "quiz-descubra-seu-estilo",
  };

  return DOMAIN_TO_FUNNEL[hostname] || "default";
};
```

### 📊 Dashboard

```bash
# Acessar:
https://business.facebook.com/events_manager2/list/pixel/

# Selecionar Pixel específico:
- Pixel 1311550759901086 (quiz_isca)
- Pixel 1038647624890676 (quiz_embutido)

# Métricas por Pixel:
- PageView
- ViewContent
- Lead
- Purchase
- Custom Events (PixelInitialized, etc.)
```

---

## 4️⃣ Analytics Legacy (analytics.ts)

### 📍 Localização

```typescript
// src/utils/analytics.ts (435 linhas)
export const trackQuizStart = () => {
  /* ... */
};
export const trackQuizAnswer = () => {
  /* ... */
};
export const trackQuizComplete = () => {
  /* ... */
};
export const trackResultView = () => {
  /* ... */
};
```

### 📝 Usado Em

```typescript
// src/pages/DynamicQuizPage.tsx
import {
  trackQuizStart,
  trackQuizAnswer,
  trackQuizComplete,
} from "@/utils/analytics";

// Linha 113: Início
trackQuizStart(name);

// Linha 127: Resposta
trackQuizAnswer(stageId, selectedOptions.join(", "));

// Linha 160: Conclusão
trackQuizComplete({
  primaryStyle: legacyResult.primaryStyle?.category,
  funnel_id: funnel.id,
  funnel_slug: slug,
});

// Linha 168: Visualização de resultado
trackResultView(legacyResult.primaryStyle.category, {
  secondary_style: legacyResult.secondaryStyle?.category,
  user_name: userName,
});
```

### ⚠️ Problema: Não Diferencia Funis

**Código atual:**

```typescript
export const trackQuizComplete = (result?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "quiz_complete", {
      event_category: "conversion",
      result_type: result?.primaryStyle?.category,
      // ❌ Ignora result.funnel_id e result.funnel_slug
    });
  }
  console.log("[Analytics] Quiz Complete:", { result });
};
```

**DynamicQuizPage JÁ passa os dados:**

```typescript
trackQuizComplete({
  primaryStyle: legacyResult.primaryStyle?.category,
  funnel_id: funnel.id, // ← Passa mas não é usado!
  funnel_slug: slug, // ← Passa mas não é usado!
});
```

### 📊 Onde Vai

Se GA4 estiver configurado (`window.gtag` disponível):

- ✅ Eventos vão para GA4
- ✅ Console.log para debug

Se GA4 não estiver configurado:

- ❌ Apenas console.log (dados perdidos)

---

## 📊 Comparativo: O Que Cada Sistema Rastreia

| Métrica           | Vercel      | GA4                  | Facebook Pixel     | Analytics Legacy |
| ----------------- | ----------- | -------------------- | ------------------ | ---------------- |
| **Page Views**    | ✅ Auto     | ✅ Manual            | ✅ Auto            | ✅ Manual        |
| **Web Vitals**    | ✅ Built-in | ✅ Implementado      | ❌                 | ❌               |
| **Custom Domain** | ✅ Hostname | ⚠️ Precisa adicionar | ⚠️ Baseado em path | ❌               |
| **Funnel ID**     | ❌          | ⚠️ Precisa adicionar | ✅ **SIM**         | ❌ Ignora        |
| **Quiz Start**    | ❌          | ✅ Implementado      | ✅ Custom Event    | ✅ Implementado  |
| **Quiz Complete** | ❌          | ✅ Implementado      | ✅ Custom Event    | ✅ Implementado  |
| **Conversões**    | ❌          | ✅ Implementado      | ✅ Purchase Event  | ❌               |
| **Leads**         | ❌          | ✅ Implementado      | ✅ Lead Event      | ❌               |
| **Real-time**     | ✅ 30s      | ✅ 30min             | ✅ Instant         | ❌               |
| **Retroativo**    | ❌ 30 dias  | ✅ 14 meses          | ✅ 90 dias         | ❌               |

### ✅ Conclusão: Qual Usa para Cada Coisa?

```
📊 Tráfego geral por domínio
→ Vercel Analytics (automático, sem config)

📈 Performance e Web Vitals
→ Vercel Analytics (built-in)

🎯 Conversões por funil
→ Facebook Pixel (MELHOR - já funciona!)

📧 Leads e eventos customizados
→ GA4 (quando configurar)

🐛 Debug de eventos
→ Analytics Legacy (console.log)
```

---

## 🚀 Melhorias Necessárias

### 1️⃣ **Facebook Pixel: Detectar por Domain**

**Problema:**

```typescript
// Atual: Detecta por path
if (path.includes("/quiz-descubra-seu-estilo")) {
  /* Pixel B */
}

// Problema: Dois custom domains com "/" usam o mesmo Pixel
```

**Solução:**

```typescript
// pixelManager.ts
const DOMAIN_TO_FUNNEL: Record<string, string> = {
  "meu-dominio-1.com": "default",
  "meu-dominio-2.com": "quiz-descubra-seu-estilo",
  "quiz-de-estilo4-58.vercel.app": "default", // Fallback
};

export const getCurrentFunnel = (): string => {
  const hostname = window.location.hostname;
  return DOMAIN_TO_FUNNEL[hostname] || "default";
};
```

### 2️⃣ **Analytics Legacy: Usar Dados de Funil**

**Problema:**

```typescript
trackQuizComplete({
  funnel_id: "abc123", // ← Passado
  funnel_slug: "joias", // ← Passado
});

// Mas em analytics.ts:
window.gtag("event", "quiz_complete", {
  result_type: result?.primaryStyle?.category,
  // ❌ Não usa funnel_id nem funnel_slug
});
```

**Solução:**

```typescript
export const trackQuizComplete = (result?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "quiz_complete", {
      event_category: "conversion",
      result_type: result?.primaryStyle?.category,
      funnel_id: result?.funnel_id, // ← ADICIONAR
      funnel_slug: result?.funnel_slug, // ← ADICIONAR
      custom_domain: window.location.hostname, // ← ADICIONAR
    });
  }
  console.log("[Analytics] Quiz Complete:", { result });
};
```

### 3️⃣ **GA4: Criar Dimensões Customizadas**

Quando configurar GA4, adicionar no dashboard:

```
Admin > Custom Definitions > Custom Dimensions

1. funnel_id
   - Scope: Event
   - Parameter: funnel_id

2. funnel_slug
   - Scope: Event
   - Parameter: funnel_slug

3. custom_domain
   - Scope: Event
   - Parameter: custom_domain
```

---

## 🎯 Resposta Final: Facebook Pixel É o Único que Diferencia Funis!

### ✅ **Facebook Pixel (pixelManager.ts)**

**JÁ funciona:**

- ✅ Múltiplos Pixels (um por funil)
- ✅ Detecta funil automaticamente
- ✅ Envia eventos separados para cada Pixel
- ✅ Rastreamento completo (View, Lead, Purchase)

**Único problema:** Baseado em **path**, não **hostname**

### ⚠️ **GA4 e Analytics Legacy**

**Precisam de correção:**

- ⚠️ DynamicQuizPage **JÁ passa** `funnel_id` e `funnel_slug`
- ❌ `analytics.ts` **ignora** esses dados
- ❌ Eventos vão para GA4 **sem** diferenciação de funil

### 💡 **Vercel Analytics**

**Limitação nativa:**

- ✅ Mostra custom domains separados
- ❌ Não rastreia eventos customizados
- ❌ Não agrupa "Funil X = páginas A+B+C"

---

## 📚 Próximos Passos

**Para ter rastreamento completo por funil:**

1. ✅ **Vercel Analytics**: Já ativo (page views por domain)
2. 🔧 **Facebook Pixel**: Modificar `pixelManager.ts` para detectar por hostname
3. 🔧 **Analytics Legacy**: Adicionar `funnel_id`, `funnel_slug`, `custom_domain` nos eventos
4. ⏸️ **GA4**: Configurar `VITE_GA4_MEASUREMENT_ID` + criar dimensões customizadas

**Quer que eu implemente as melhorias 2 e 3 agora?** 🚀
