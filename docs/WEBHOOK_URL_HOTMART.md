# 🎯 URL DO WEBHOOK HOTMART - GUIA DEFINITIVO

## 📍 URLs Disponíveis para Configurar na Hotmart

### ✅ OPÇÃO 1: Domínio Lovable (Funciona Imediatamente)

```
https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/api/webhook/hotmart
```

### ✅ OPÇÃO 2: Seu Domínio Customizado (RECOMENDADO)

```
https://giselegalvao.com.br/api/webhook/hotmart
```

## 🛠️ Como Descobrir Qual URL Usar

### Se você já tem domínio configurado:

1. Acesse seu site no domínio customizado
2. Se carrega normalmente, use: `https://giselegalvao.com.br/api/webhook/hotmart`

### Se ainda não configurou domínio customizado:

1. Use a URL do Lovable: `https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/api/webhook/hotmart`

## 🔧 Configuração na Hotmart

1. **Acesse** a área do produtor na Hotmart
2. **Vá em** Configurações → Webhook
3. **Configure:**
   - **URL do Webhook**: (uma das URLs acima)
   - **Eventos a monitorar**:
     - ✅ `PURCHASE_COMPLETE`
     - ✅ `PURCHASE_APPROVED`
     - ✅ `PURCHASE_CANCELED`
     - ✅ `PURCHASE_REFUNDED`
   - **Método**: `POST`
   - **Content-Type**: `application/json`

## 🧪 Como Testar Qual URL Funciona

### Teste 1: Verificar se o endpoint responde

```bash
# Teste com URL do Lovable
curl -X POST https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/api/webhook/hotmart \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Teste com seu domínio (já configurado)
curl -X POST https://giselegalvao.com.br/api/webhook/hotmart \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Teste 2: Usando nosso script

```bash
# Editar o arquivo test-webhook.sh e trocar a URL
# Depois executar:
./test-webhook.sh
```

## 📋 Status Atual

✅ **Sistema de webhook implementado**  
✅ **Endpoint /api/webhook/hotmart criado**  
✅ **Integração frontend completa**  
⏳ **Aguardando configuração na Hotmart**

## 🎯 RECOMENDAÇÃO

**Use esta URL na Hotmart:**

```
https://giselegalvao.com.br/api/webhook/hotmart
```

Esta URL funcionará com seu domínio customizado e capturará todos os webhooks da Hotmart!

## 🔄 Se Mudar de Domínio Depois

Quando configurar seu domínio customizado, basta:

1. Alterar a URL na configuração do webhook na Hotmart
2. Trocar para: `https://seudominio.com/api/webhook/hotmart`

---

**💡 Dica**: Comece com a URL do Lovable para testar. Depois que tudo estiver funcionando, você pode migrar para seu domínio customizado.
