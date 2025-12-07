# Configuração do Domínio giselegalvao.com

## ✅ Alterações Realizadas no Código

### 1. **pixelManager.ts** - Mapeamento de Domínios

```typescript
const DOMAIN_TO_FUNNEL: Record<string, string> = {
  "giselegalvao.com": "default",
  "www.giselegalvao.com": "default",
  "quiz-de-estilo4-58.vercel.app": "default", // Fallback
};
```

### 2. **UtmSettingsTab.tsx** - URLs de Exemplo

```typescript
{
  facebook: 'https://giselegalvao.com/',
  instagram: 'https://giselegalvao.com/',
  email: 'https://giselegalvao.com/',
  resultado: 'https://giselegalvao.com/resultado'
}
```

### 3. **index.html** - Meta Tags OpenGraph

```html
<meta property="og:image" content="https://giselegalvao.com/og-image.jpg" />
```

## 📋 Próximos Passos - Configuração DNS

### **Opção A: Nameservers da Vercel (Recomendado)**

1. **Acesse o painel do seu registrador de domínio** (Registro.br, GoDaddy, Hostinger, etc)
2. **Altere os nameservers para:**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. **Aguarde propagação** (5 min a 48h, geralmente < 1h)

### **Opção B: Registros DNS Manuais**

Configure no painel DNS do seu provedor:

**Para domínio raiz (giselegalvao.com):**

```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600
```

**Para www:**

```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

## 🔧 Configuração na Vercel

### **1. Adicionar Domínio no Dashboard**

Acesse: https://vercel.com/quiz-flow/quiz-de-estilo4-58/settings/domains

Clique em **"Add Domain"** e adicione:

- `giselegalvao.com`
- `www.giselegalvao.com`

### **2. Configurar Redirecionamentos**

A Vercel permite configurar:

- `www.giselegalvao.com` → `giselegalvao.com` (ou vice-versa)
- HTTPS automático (certificado SSL gratuito)

## 🎯 URLs do Projeto

### **Produção Atual (Vercel)**

- 🔍 **Inspeção**: https://vercel.com/quiz-flow/quiz-de-estilo4-58/FpCTCcUyzc2dQBNjPeNdDXh5iN7B
- ✅ **Preview**: https://quiz-de-estilo4-58-ofqixk5qo-quiz-flow.vercel.app

### **URLs Finais (Após configuração DNS)**

- 🌐 **Site Principal**: https://giselegalvao.com
- 📊 **Página de Resultados**: https://giselegalvao.com/resultado
- 🎯 **Quiz Embutido**: https://giselegalvao.com/quiz-descubra-seu-estilo
- 🔧 **Admin**: https://giselegalvao.com/admin

## 🔐 Recursos Automáticos da Vercel

Após adicionar o domínio, a Vercel automaticamente:

✅ **SSL/HTTPS** - Certificado Let's Encrypt gratuito  
✅ **CDN Global** - Edge network em 100+ localizações  
✅ **Compressão** - Gzip e Brotli automáticos  
✅ **Preview URLs** - URL única para cada branch/PR  
✅ **Redirecionamentos** - HTTP → HTTPS automático

## 📱 Verificação Pós-Deploy

### **1. Teste de DNS**

```bash
# Verificar se o DNS está apontando corretamente
nslookup giselegalvao.com

# Deve retornar o IP da Vercel: 76.76.21.21
```

### **2. Teste de SSL**

```bash
# Verificar certificado SSL
curl -I https://giselegalvao.com

# Deve retornar: HTTP/2 200
```

### **3. Testes Funcionais**

Após propagação DNS, verifique:

- [ ] Homepage carrega: https://giselegalvao.com
- [ ] Quiz funciona corretamente
- [ ] Página de resultados: https://giselegalvao.com/resultado
- [ ] Facebook Pixel disparando corretamente
- [ ] UTM tracking funcionando
- [ ] Admin acessível (com autenticação)

## 🚨 Troubleshooting

### **Domínio não carrega**

- Aguarde até 48h para propagação DNS completa
- Verifique nameservers com `whois giselegalvao.com`
- Limpe cache DNS local: `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (Mac)

### **SSL não funciona**

- A Vercel gera certificado automaticamente após DNS configurado
- Aguarde até 24h após propagação DNS
- Verifique status em: https://vercel.com/quiz-flow/quiz-de-estilo4-58/settings/domains

### **Redirecionamento não funciona**

- Configure na Vercel: Settings → Domains → Redirecionamento
- Adicione regra no `vercel.json` se necessário

## 📝 Arquivos Afetados

- ✅ `/src/services/pixelManager.ts`
- ✅ `/src/components/settings/UtmSettingsTab.tsx`
- ✅ `/index.html`
- ✅ Build realizado
- ✅ Deploy em produção

## 🔄 Comandos Úteis

```bash
# Rebuild local
npm run build

# Preview local
npm run preview

# Deploy produção
vercel --prod --token NOK9RUX2jC2SWX5hbqkzPMpv

# Verificar domínios configurados
vercel domains ls

# Adicionar domínio via CLI
vercel domains add giselegalvao.com
```

---

**Status**: ✅ Código atualizado e deploy realizado  
**Próximo passo**: Configurar DNS no registrador de domínio
