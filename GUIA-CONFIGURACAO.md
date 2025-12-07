# 🚀 Guia Completo de Configuração

## ✅ Status das Configurações

### 1. **Vercel (Hospedagem)** ✅ CONFIGURADO

- **URL Principal**: https://quiz-de-estilo4-58.vercel.app
- **Status**: Deploy automático funcionando
- **Build**: Automático no push para `main`

### 2. **Variáveis de Ambiente** ✅ CONFIGURADO

Todas as variáveis foram adicionadas na Vercel:

| Variável                 | Status             | Descrição                        |
| ------------------------ | ------------------ | -------------------------------- |
| `VITE_SUPABASE_URL`      | ✅ Configurado     | URL do banco Supabase            |
| `VITE_SUPABASE_ANON_KEY` | ✅ Configurado     | Chave pública do Supabase        |
| `VITE_APP_ENV`           | ✅ Configurado     | Ambiente da aplicação            |
| `VITE_FACEBOOK_PIXEL_ID` | ⚠️ Precisa ID real | Placeholder configurado          |
| `VITE_GA_ID`             | ⚠️ Precisa ID real | Placeholder configurado          |
| `VITE_SENTRY_DSN`        | ⚙️ Opcional        | Vazio (adicionar se usar Sentry) |

---

## 📋 Próximos Passos para Completar a Configuração

### 1. 🔵 **Configurar Facebook Pixel** (RECOMENDADO)

#### Por que usar?

- Rastreia conversões de anúncios do Facebook/Instagram
- Cria audiências personalizadas
- Otimiza campanhas automaticamente

#### Como configurar:

**Passo 1: Criar o Pixel**

1. Acesse [Meta Business Suite](https://business.facebook.com)
2. Menu → **Events Manager**
3. Clique em **Connect Data Sources** → **Web** → **Facebook Pixel**
4. Dê um nome (ex: "Quiz Estilo Gisele")
5. Copie o **Pixel ID** (formato: 123456789012345)

**Passo 2: Adicionar na Vercel**

```bash
# Via terminal (substitua YOUR_PIXEL_ID pelo ID real)
vercel env rm VITE_FACEBOOK_PIXEL_ID production
echo "123456789012345" | vercel env add VITE_FACEBOOK_PIXEL_ID production

vercel env rm VITE_FACEBOOK_PIXEL_ID preview
echo "123456789012345" | vercel env add VITE_FACEBOOK_PIXEL_ID preview

vercel env rm VITE_FACEBOOK_PIXEL_ID development
echo "123456789012345" | vercel env add VITE_FACEBOOK_PIXEL_ID development
```

**Passo 3: Verificar**

1. Faça um novo deploy: `vercel --prod`
2. Acesse seu site
3. No Events Manager → **Test Events** → veja se os eventos aparecem

#### Eventos Rastreados Automaticamente:

- ✅ `PageView` - Visualização de páginas
- ✅ `ViewContent` - Visualização do quiz
- ✅ `Lead` - Conclusão do quiz
- ✅ `Purchase` - Compra via Hotmart (webhook)

---

### 2. 📊 **Configurar Google Analytics** (OPCIONAL)

#### Como configurar:

**Passo 1: Criar Propriedade GA4**

1. Acesse [Google Analytics](https://analytics.google.com)
2. Admin → **Create Property**
3. Nome: "Quiz Gisele Galvão"
4. Configure Web Stream
5. Copie o **Measurement ID** (formato: G-XXXXXXXXXX)

**Passo 2: Adicionar na Vercel**

```bash
vercel env rm VITE_GA_ID production
echo "G-ABC123XYZ" | vercel env add VITE_GA_ID production

vercel env rm VITE_GA_ID preview
echo "G-ABC123XYZ" | vercel env add VITE_GA_ID preview

vercel env rm VITE_GA_ID development
echo "G-ABC123XYZ" | vercel env add VITE_GA_ID development
```

---

### 3. 🛒 **Configurar Hotmart Webhook** (QUANDO VENDER)

#### Quando configurar?

- Quando tiver produtos na Hotmart
- Quando quiser rastrear vendas automaticamente

#### Endpoint do Webhook:

```
https://quiz-de-estilo4-58.vercel.app/api/webhook/hotmart
```

#### Como configurar na Hotmart:

**Passo 1: Acessar Produto**

1. Entre na [Hotmart](https://app.hotmart.com)
2. Produtos → Selecione seu produto
3. Configurações → **Integrações** → **Webhooks**

**Passo 2: Adicionar Webhook**

1. Clique em **Novo Webhook**
2. URL: `https://quiz-de-estilo4-58.vercel.app/api/webhook/hotmart`
3. Eventos selecionados:
   - ✅ `PURCHASE_COMPLETE` (Compra Aprovada)
   - ✅ `PURCHASE_REFUNDED` (Reembolso)
   - ✅ `PURCHASE_CANCELED` (Cancelamento)
4. Versão: **2.0**
5. Salvar

**Passo 3: Testar**

1. Use o **Simulador de Webhooks** da Hotmart
2. Verifique os logs na Vercel: `vercel logs --token YOUR_TOKEN`

#### O que o webhook faz automaticamente:

- 💾 Salva dados da compra no Supabase
- 📊 Envia evento `Purchase` para Facebook Pixel
- 📈 Registra conversão no Google Analytics
- 👤 Associa compra ao usuário do quiz (se tiver UTM)

---

### 4. 🗄️ **Verificar Supabase** (IMPORTANTE)

#### Testar Conexão:

**Via Browser:**

1. Acesse: https://quiz-de-estilo4-58.vercel.app/admin
2. Tente criar um funil
3. Se funcionar → ✅ Supabase OK

**Via Terminal:**

```bash
# Baixar variáveis da Vercel
vercel env pull .env.local

# Ver valores
cat .env.local
```

#### Se não funcionar:

**Verificar na Vercel:**

1. Acesse [vercel.com](https://vercel.com/quiz-flow/quiz-de-estilo4-58)
2. Settings → Environment Variables
3. Confirme que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` existem

**Verificar no Supabase:**

1. Acesse [supabase.com](https://supabase.com)
2. Seu projeto → Settings → API
3. Copie novamente a URL e Anon Key
4. Atualize na Vercel se necessário

---

### 5. 🔐 **Segurança - Content Security Policy** ✅ CONFIGURADO

Já configurado no `vercel.json`:

- ✅ Permite Google Fonts
- ✅ Permite Cloudinary (imagens)
- ✅ Permite Supabase
- ✅ Permite Facebook Pixel
- ✅ Headers de segurança (HSTS, CSP, etc)

---

## 🧪 Testar Tudo Funcionando

### Checklist Completo:

1. **Deploy**

   ```bash
   vercel --prod --token NOK9RUX2jC2SWX5hbqkzPMpv
   ```

2. **Acesse o site**

   - URL: https://quiz-de-estilo4-58.vercel.app
   - Deve carregar sem erros de console

3. **Teste o Quiz**

   - Responda algumas perguntas
   - Veja se salva no Supabase (verifique no painel admin)

4. **Teste Facebook Pixel** (se configurado)

   - Abra DevTools (F12)
   - Console: `fbq('track', 'PageView')`
   - Deve aparecer no Events Manager

5. **Teste Google Analytics** (se configurado)
   - Google Analytics Real-Time
   - Deve aparecer sua visita

---

## 📞 Suporte

### Problemas Comuns:

**Erro: "Cannot read properties of undefined (reading 'useLayoutEffect')"**

- ✅ **Resolvido**: Build otimizado corrige automaticamente

**Erro: "CSP violation" para fontes**

- ✅ **Resolvido**: `vercel.json` já configurado

**Erro 401 no site.webmanifest**

- ✅ **Resolvido**: Headers adicionados para `/favicons/`

**Supabase não conecta**

- Verifique variáveis de ambiente na Vercel
- Confirme que o projeto Supabase está ativo
- Verifique RLS (Row Level Security) no Supabase

---

## 🎯 Comandos Úteis

```bash
# Ver variáveis de ambiente
vercel env ls --token NOK9RUX2jC2SWX5hbqkzPMpv

# Baixar variáveis localmente
vercel env pull .env.local --token NOK9RUX2jC2SWX5hbqkzPMpv

# Deploy para produção
vercel --prod --token NOK9RUX2jC2SWX5hbqkzPMpv

# Ver logs em tempo real
vercel logs --token NOK9RUX2jC2SWX5hbqkzPMpv

# Remover variável
vercel env rm NOME_VARIAVEL production --token NOK9RUX2jC2SWX5hbqkzPMpv

# Adicionar variável
echo "VALOR" | vercel env add NOME_VARIAVEL production --token NOK9RUX2jC2SWX5hbqkzPMpv
```

---

## 📊 Dashboard de Monitoramento

### URLs Importantes:

- **Site**: https://quiz-de-estilo4-58.vercel.app
- **Admin**: https://quiz-de-estilo4-58.vercel.app/admin
- **Vercel Dashboard**: https://vercel.com/quiz-flow/quiz-de-estilo4-58
- **Supabase Dashboard**: https://supabase.com/dashboard/project/mrymyxayqqtlxearvqkz
- **Facebook Events Manager**: https://business.facebook.com/events_manager2
- **Google Analytics**: https://analytics.google.com

---

## ✅ Status Final

| Componente            | Status         | Ação Necessária              |
| --------------------- | -------------- | ---------------------------- |
| Vercel Deploy         | ✅ OK          | Nenhuma                      |
| Supabase              | ✅ Configurado | Testar conexão               |
| Facebook Pixel        | ⚠️ Placeholder | Adicionar ID real            |
| Google Analytics      | ⚠️ Placeholder | Adicionar ID real (opcional) |
| Hotmart Webhook       | ⚙️ Pronto      | Configurar quando vender     |
| CSP Headers           | ✅ OK          | Nenhuma                      |
| Variáveis de Ambiente | ✅ OK          | Substituir placeholders      |

---

**Última atualização:** 7 de dezembro de 2025
