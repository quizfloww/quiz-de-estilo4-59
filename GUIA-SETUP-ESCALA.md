# 🚀 Guia de Configuração para Escala

Este guia detalha como configurar o projeto para suportar escalabilidade real com monitoramento completo.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Vercel (deploy)
- Conta Supabase (banco de dados)
- Conta Google Analytics (GA4)
- Conta Sentry (opcional, mas recomendado)
- Facebook Business Manager (Facebook Pixel)

---

## 🔧 Configuração Inicial

### 1. Clone e Instale Dependências

```bash
git clone <seu-repositorio>
cd quiz-de-estilo4-58
npm install
```

### 2. Configure Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# App
VITE_APP_ENV=production

# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Google Analytics 4 (ESSENCIAL PARA ESCALA)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry (RECOMENDADO)
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.2
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# A/B Testing
VITE_AB_TEST_ACTIVE=true
VITE_AB_TEST_VARIANT_A_WEIGHT=50
VITE_AB_TEST_VARIANT_B_WEIGHT=50

# Facebook Pixel (MARKETING)
VITE_FACEBOOK_PIXEL_ID=123456789

# Performance Monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

---

## 🔐 Configuração de Serviços

### Google Analytics 4 (GA4)

#### Passo 1: Criar Propriedade GA4

1. Acesse [Google Analytics](https://analytics.google.com)
2. Clique em **Admin** → **Criar Propriedade**
3. Nome: "Quiz Sell Genius"
4. Fuso horário: América/São Paulo
5. Moeda: Real brasileiro (BRL)

#### Passo 2: Criar Stream de Dados

1. Na propriedade criada, vá em **Fluxos de dados**
2. Clique em **Adicionar stream** → **Web**
3. URL do site: `https://seu-dominio.com`
4. Nome do stream: "Quiz Website"
5. **Copie o MEASUREMENT ID** (formato: `G-XXXXXXXXXX`)

#### Passo 3: Configurar no Projeto

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Verificação

```bash
# Execute localmente
npm run dev

# Abra o navegador em http://localhost:5173
# Abra DevTools → Console
# Deve aparecer: "[GA4] Inicializado com sucesso: G-XXXXXXXXXX"
```

---

### Sentry (Error Tracking)

#### Passo 1: Criar Projeto no Sentry

1. Acesse [sentry.io](https://sentry.io) e crie uma conta
2. Clique em **Create Project**
3. Plataforma: **React**
4. Nome: "quiz-sell-genius"
5. **Copie o DSN** fornecido

#### Passo 2: Configurar no Projeto

```env
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_SENTRY_ENVIRONMENT=production
```

#### Passo 3: Ajustar Source Maps (Opcional)

Para debugging avançado, configure source maps no `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // Habilita source maps
  },
});
```

#### Verificação

```bash
npm run dev

# No console deve aparecer:
# "[Sentry] Inicializado com sucesso"

# Teste captura de erro:
# Abra o console e execute:
window.testSentryError = () => { throw new Error('Teste Sentry'); };
window.testSentryError();

# Verifique em sentry.io se o erro apareceu
```

---

### Facebook Pixel

#### Passo 1: Obter Pixel ID

1. Acesse [Facebook Business Manager](https://business.facebook.com)
2. Menu → **Eventos** → **Pixels**
3. Copie o **Pixel ID** (apenas números)

#### Passo 2: Configurar

```env
VITE_FACEBOOK_PIXEL_ID=123456789
```

#### Verificação

1. Instale a extensão [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)
2. Acesse seu site
3. Clique no ícone da extensão
4. Deve mostrar seu Pixel ID ativo

---

### Testes A/B

#### Configuração Padrão

```env
VITE_AB_TEST_ACTIVE=true
VITE_AB_TEST_VARIANT_A_WEIGHT=50  # 50% dos usuários
VITE_AB_TEST_VARIANT_B_WEIGHT=50  # 50% dos usuários
```

#### Como Funciona

- **Variante A**: Landing page original (`/`)
- **Variante B**: Quiz como primeira página (`/quiz-descubra-seu-estilo`)
- O sistema atribui automaticamente uma variante ao usuário
- A variante é salva no `localStorage`
- Todas as conversões são trackeadas no GA4

#### Analisar Resultados

1. Acesse Google Analytics
2. Menu → **Explorar** → **Criar exploração**
3. Dimensões: `event_name`, `variant`
4. Métricas: `event_count`, `conversions`
5. Filtro: `event_name = ab_test_conversion`

#### Desativar Teste A/B

```env
VITE_AB_TEST_ACTIVE=false
```

---

## 📊 Monitoramento de Performance

### Web Vitals Configurados

O sistema monitora automaticamente:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 800ms

### Visualizar Métricas

#### No Google Analytics:

1. Menu → **Eventos**
2. Procure por: `web_vitals`
3. Veja métricas por `metric_name` e `metric_rating`

#### No Console (Dev):

```javascript
// Todas as métricas aparecem automaticamente:
// [Performance] LCP: 1234.56 (good)
// [Performance] FID: 45.23 (good)
// [Performance] CLS: 0.05 (good)
```

---

## 🚀 Deploy para Produção

### Vercel (Recomendado)

#### Método 1: CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variáveis de ambiente na Vercel:
vercel env add VITE_GA4_MEASUREMENT_ID production
vercel env add VITE_SENTRY_DSN production
# ... adicione todas as variáveis
```

#### Método 2: GitHub Integration

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Import Project**
3. Conecte seu repositório GitHub
4. Configure variáveis de ambiente:
   - Settings → Environment Variables
   - Adicione todas as variáveis do `.env.local`
5. Deploy automático a cada push!

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Configurar variáveis:
netlify env:set VITE_GA4_MEASUREMENT_ID "G-XXXXXXXXXX"
```

---

## ✅ Checklist de Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] GA4 Measurement ID válido
- [ ] Sentry DSN configurado (opcional)
- [ ] Facebook Pixel ID configurado
- [ ] Testes A/B ativados (se desejado)
- [ ] Performance monitoring habilitado
- [ ] Build local funciona: `npm run build`
- [ ] Preview funciona: `npm run preview`
- [ ] Testes E2E passam: `npm run test`

---

## 🧪 Validação Pós-Deploy

### 1. Verificar GA4

```bash
# Acesse seu site em produção
# Abra DevTools → Network
# Filtre por "google-analytics.com"
# Deve haver requisições para /g/collect
```

### 2. Verificar Sentry

```bash
# Force um erro de teste:
# No console do browser:
throw new Error('Teste produção');

# Verifique em sentry.io → Issues
# O erro deve aparecer em alguns segundos
```

### 3. Verificar Performance

```bash
# Execute Lighthouse
# DevTools → Lighthouse → Generate Report

# Metas:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

### 4. Verificar A/B Test

```bash
# Abra em modo anônimo
# Recarregue várias vezes
# Deve alternar entre variantes A e B

# Verifique localStorage:
console.log(localStorage.getItem('ab_test_variant_landing_page'));
# Deve retornar 'A' ou 'B'
```

---

## 📈 Métricas de Sucesso

### Curto Prazo (1-2 semanas)

- [ ] GA4 coletando dados corretamente
- [ ] Web Vitals todos "good" (>80%)
- [ ] Zero erros críticos no Sentry
- [ ] Taxa de conversão base estabelecida

### Médio Prazo (1 mês)

- [ ] Teste A/B com resultado estatisticamente significativo
- [ ] LCP < 2.0s consistentemente
- [ ] Taxa de erro < 1%
- [ ] 1000+ sessões/mês

### Longo Prazo (3 meses)

- [ ] Taxa de conversão > 5%
- [ ] Uptime > 99.5%
- [ ] 10,000+ sessões/mês
- [ ] Core Web Vitals 100% "good"

---

## 🔍 Troubleshooting

### GA4 não está trackeando

```bash
# Verifique se o Measurement ID está correto
echo $VITE_GA4_MEASUREMENT_ID

# Verifique no console do browser:
# Deve aparecer: window.gtag
console.log(typeof window.gtag); // deve ser 'function'

# Verifique bloqueadores de anúncios
# Desative temporariamente e teste
```

### Sentry não captura erros

```bash
# Verifique DSN:
echo $VITE_SENTRY_DSN

# Teste manualmente:
import { captureException } from '@/utils/sentry';
captureException(new Error('Teste manual'));
```

### Performance ruim

```bash
# Analise bundle size:
npm run build
# Veja output de tamanho dos chunks

# Otimize imagens:
# Use Cloudinary ou similar
# Formato WebP
# Lazy loading

# Verifique cache:
# Headers configurados em vercel.json
```

### A/B Test não funciona

```bash
# Limpe localStorage:
localStorage.clear();

# Recarregue a página
# Verifique console:
# [A/B Test] Assignment: landing_page = A (Original)

# Verifique variáveis:
echo $VITE_AB_TEST_ACTIVE # deve ser 'true'
```

---

## 📚 Recursos Adicionais

- [Google Analytics 4 Docs](https://support.google.com/analytics/answer/10089681)
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Deploy Docs](https://vercel.com/docs)

---

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique este guia primeiro
2. Consulte os logs no Sentry
3. Analise métricas no GA4
4. Revise documentação oficial dos serviços

---

**Última atualização:** Dezembro 2024  
**Versão:** 1.0.0
