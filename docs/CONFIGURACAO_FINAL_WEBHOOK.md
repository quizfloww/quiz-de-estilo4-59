# 🎯 CONFIGURAÇÃO FINAL DO WEBHOOK HOTMART

## ✅ STATUS ATUAL

- **Sistema de webhook**: ✅ Implementado
- **Integração frontend**: ✅ Completa
- **Simulador de testes**: ✅ Criado
- **URL do webhook**: ⚠️ **Precisa configuração backend**

## 🔗 URL PARA CONFIGURAR NA HOTMART

### ⚠️ IMPORTANTE: Configuração Backend Necessária

Como o Lovable é uma plataforma SPA pura, você precisará de um backend separado para receber os webhooks da Hotmart. Aqui estão as opções:

### OPÇÃO 1: Usar Vercel (RECOMENDADO)

1. **Fazer deploy do projeto no Vercel**:

   ```bash
   # No seu computador local
   git clone https://github.com/seu-usuario/quiz-sell-genius-66
   cd quiz-sell-genius-66
   npx vercel --prod
   ```

2. **URL do webhook**:
   ```
   https://seu-projeto.vercel.app/api/webhook/hotmart
   ```

### OPÇÃO 2: Usar Netlify

1. **Conectar repositório no Netlify**
2. **URL do webhook**:
   ```
   https://seu-projeto.netlify.app/.netlify/functions/hotmart-webhook
   ```

### OPÇÃO 3: Servidor Express.js (Para uso próprio)

```bash
# Instalar dependências
npm install express cors

# Executar servidor
node webhook-server.js
```

## 🧪 COMO TESTAR AGORA (Simulação Frontend)

### No Console do Navegador:

```javascript
// 1. Abra o console (F12)
// 2. Execute um dos comandos:

// Simular compra completa
simulateHotmartPurchase("teste@exemplo.com");

// Testar fluxo completo
testWebhookFlow("teste@exemplo.com");

// Verificar dados armazenados
console.log(localStorage.getItem("hotmart_user_data"));
```

### Testar Correlação de UTMs:

```javascript
// 1. Acesse o quiz com UTMs:
// https://giselegalvao.com.br/quiz/?utm_source=facebook&utm_campaign=teste

// 2. Complete o quiz e clique em "Comprar"

// 3. No console, simule a compra:
simulateHotmartPurchase("seu@email.com");

// 4. Verifique os eventos enviados para Facebook Pixel
```

## 📋 CONFIGURAÇÃO NA HOTMART

### Quando tiver o backend configurado:

1. **Acesse**: Área do Produtor → Configurações → Webhook
2. **URL**: `https://seu-dominio.com/api/webhook/hotmart`
3. **Eventos**:
   - ✅ `PURCHASE_COMPLETE`
   - ✅ `PURCHASE_APPROVED`
   - ✅ `PURCHASE_CANCELED`
   - ✅ `PURCHASE_REFUNDED`
4. **Método**: `POST`
5. **Content-Type**: `application/json`

## 🎯 PRÓXIMOS PASSOS

### 1. Configurar Backend (Escolha uma opção):

**Vercel (Mais fácil)**:

- Conecte seu GitHub no Vercel
- Deploy automático
- Webhook funcionará em: `https://seu-projeto.vercel.app/api/webhook/hotmart`

**Netlify**:

- Conecte seu GitHub no Netlify
- Webhook funcionará em: `https://seu-projeto.netlify.app/.netlify/functions/hotmart-webhook`

### 2. Configurar na Hotmart:

- Use a URL do passo 1

### 3. Testar:

```bash
./test-webhook.sh
```

## 🔍 COMO SABER SE ESTÁ FUNCIONANDO

### Logs para Monitorar:

1. **Console do navegador**: Eventos do Facebook Pixel
2. **Painel do Vercel/Netlify**: Logs das funções
3. **Facebook Business Manager**: Eventos de Purchase
4. **Google Analytics**: Eventos de conversão

### Sinais de Sucesso:

- ✅ Webhook retorna status 200
- ✅ Logs mostram correlação de UTMs
- ✅ Facebook Pixel recebe evento Purchase
- ✅ Google Analytics registra conversão

## 💡 DICA FINAL

**Para testar rapidamente**, use o simulador no console do navegador. Ele simula perfeitamente o que aconteceria quando a Hotmart enviar o webhook real!

---

**🚀 O sistema está 100% pronto no frontend. Agora só precisa do backend configurado!**
