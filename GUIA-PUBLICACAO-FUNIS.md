# Guia de Publicação de Funis com giselegalvao.com

## 🎯 Como Funcionam os Funis

### **Sistema Atual**

Os funis são **automaticamente detectados** pelo path da URL:

```
https://giselegalvao.com/                          → Funil 1 (default)
https://giselegalvao.com/quiz-descubra-seu-estilo  → Funil 2
https://giselegalvao.com/meu-novo-funil            → Funil 3 (quando criar)
```

## 📝 **Publicar um Novo Funil**

### **Passo 1: Criar o Funil no Admin**

1. Acesse: `https://giselegalvao.com/admin/funnels`
2. Clique em **"Criar Novo Funil"**
3. Preencha:

   - **Nome**: Ex: "Black Friday 2025"
   - **Slug/URL**: Ex: `black-friday-2025`
   - **Pixel do Facebook**: `SEU_PIXEL_ID`
   - **Link de Checkout**: URL do Hotmart/Monetizze

4. Clique em **"Publicar"**

### **Passo 2: O Funil Estará Disponível Em:**

```
https://giselegalvao.com/black-friday-2025
```

## 🔧 **Configuração de Pixels por Funil**

### **Opção A: Usar Pixel Existente (Recomendado)**

Se você quer usar um dos pixels já configurados:

**Não precisa alterar código!** O sistema já gerencia:

- Pixel 1311550759901086 → Funil padrão
- Pixel 1038647624890676 → Quiz embutido

### **Opção B: Adicionar Novo Pixel**

Se você tem um **novo Pixel do Facebook** para um funil específico:

**1. Edite o arquivo:** `src/services/pixelManager.ts`

```typescript
export const FUNNEL_CONFIGS: Record<string, FunnelConfig> = {
  // Funis existentes
  default: {
    pixelId: "1311550759901086",
    token: "EAAEJYWeJHLA...",
    utmCampaign: "Teste Lovable - Por Fora",
    funnelName: "quiz_isca",
    ctaUrl: "https://pay.hotmart.com/W98977034C",
  },

  "quiz-descubra-seu-estilo": {
    pixelId: "1038647624890676",
    token: "EAAEJYWeJHLA...",
    utmCampaign: "Teste Lovable - Por Dentro",
    funnelName: "quiz_embutido",
    ctaUrl: "https://pay.hotmart.com/W98977034C",
  },

  // ⭐ NOVO FUNIL - Adicione aqui
  "black-friday-2025": {
    pixelId: "SEU_NOVO_PIXEL_ID",
    token: "SEU_TOKEN_DE_CONVERSOES_API",
    utmCampaign: "Black Friday 2025",
    funnelName: "blackfriday",
    ctaUrl: "https://pay.hotmart.com/SEU_LINK",
  },
};
```

**2. Build e Deploy:**

```bash
npm run build
vercel --prod --token NOK9RUX2jC2SWX5hbqkzPMpv
```

## 🌐 **Configuração de Subdomínios (Opcional)**

Se você quiser usar **subdomínios diferentes** para cada funil:

### **Exemplo:**

```
oferta1.giselegalvao.com  → Funil 1
oferta2.giselegalvao.com  → Funil 2
vip.giselegalvao.com      → Funil VIP
```

### **Passo 1: DNS (já está configurado)**

Os registros wildcard já permitem subdomínios:

```
* (wildcard) → ALIAS → cname.vercel-dns-016.com ✅
```

### **Passo 2: Adicionar Subdomínios na Vercel**

1. Acesse: https://vercel.com/quiz-flow/quiz-de-estilo4-58/settings/domains
2. Clique em **"Add Domain"**
3. Adicione cada subdomínio:
   - `oferta1.giselegalvao.com`
   - `oferta2.giselegalvao.com`
   - `vip.giselegalvao.com`

### **Passo 3: Mapear no Código**

Edite `src/services/pixelManager.ts`:

```typescript
const DOMAIN_TO_FUNNEL: Record<string, string> = {
  // Domínio principal
  "giselegalvao.com": "default",
  "www.giselegalvao.com": "default",

  // Subdomínios mapeados para funis específicos
  "oferta1.giselegalvao.com": "default",
  "oferta2.giselegalvao.com": "quiz-descubra-seu-estilo",
  "vip.giselegalvao.com": "black-friday-2025",

  // Fallback
  "quiz-de-estilo4-58.vercel.app": "default",
};
```

## 📊 **Rastreamento e Analytics**

### **Cada funil rastreia automaticamente:**

✅ **Facebook Pixel** - Eventos personalizados por funil  
✅ **UTM Parameters** - Source, Medium, Campaign  
✅ **Google Analytics** - Se configurado (VITE_GA4_MEASUREMENT_ID)  
✅ **Conversions API** - Backup server-side do Pixel

### **Eventos rastreados:**

```javascript
// Automáticos
- PageView
- ViewContent
- InitiateCheckout
- Lead
- Purchase (via webhook Hotmart)

// Por funil
- quiz_start_{funnelName}
- quiz_complete_{funnelName}
- result_view_{funnelName}
```

## 🔗 **Links UTM para Tráfego Pago**

### **Gerar links com UTM:**

Para cada funil, use o formato:

```
https://giselegalvao.com/seu-funil?utm_source=facebook&utm_medium=cpc&utm_campaign=nome_da_campanha&utm_content=anuncio_01
```

### **Exemplos por Funil:**

**Funil 1 (Default):**

```
https://giselegalvao.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=quiz_isca&utm_content=video_01
```

**Funil 2 (Quiz Embutido):**

```
https://giselegalvao.com/quiz-descubra-seu-estilo?utm_source=instagram&utm_medium=story&utm_campaign=quiz_dentro&utm_content=stories_01
```

**Funil 3 (Black Friday):**

```
https://giselegalvao.com/black-friday-2025?utm_source=email&utm_medium=newsletter&utm_campaign=bf2025&utm_content=email_01
```

### **Ferramenta no Admin:**

Acesse `https://giselegalvao.com/admin/settings` → aba **"UTM"** para gerar links automaticamente!

## ✅ **Checklist de Publicação**

Antes de publicar um novo funil, verifique:

- [ ] Funil criado no admin
- [ ] Slug/URL definido
- [ ] Pixel do Facebook configurado (se novo)
- [ ] Link de checkout testado
- [ ] Subdomínio adicionado na Vercel (se usar)
- [ ] Código atualizado e deploy realizado
- [ ] Teste de carregamento da página
- [ ] Teste de disparo do Pixel
- [ ] UTMs configurados para campanhas
- [ ] Webhook Hotmart configurado (se necessário)

## 🚀 **Fluxo Completo de Publicação**

```mermaid
1. Criar Funil no Admin (/admin/funnels)
   ↓
2. Configurar Pixel (se novo) em pixelManager.ts
   ↓
3. Build: npm run build
   ↓
4. Deploy: vercel --prod
   ↓
5. Testar URL: https://giselegalvao.com/seu-funil
   ↓
6. Configurar Campanhas com UTMs
   ↓
7. Monitorar Analytics (/admin/analytics)
```

## 🎯 **URLs Finais dos Funis**

Após configuração completa:

| Funil         | URL                                                 | Pixel            | Status      |
| ------------- | --------------------------------------------------- | ---------------- | ----------- |
| Quiz Isca     | `https://giselegalvao.com/`                         | 1311550759901086 | ✅ Ativo    |
| Quiz Embutido | `https://giselegalvao.com/quiz-descubra-seu-estilo` | 1038647624890676 | ✅ Ativo    |
| Novos Funis   | `https://giselegalvao.com/[slug]`                   | Configurar       | ⏸️ Pendente |

---

**Dúvidas?** Consulte também:

- `CONFIGURACAO-DOMINIO-GISELEGALVAO.md` - Configuração DNS
- `src/services/pixelManager.ts` - Gerenciamento de Pixels
- `/admin/settings` - Configurações UTM
