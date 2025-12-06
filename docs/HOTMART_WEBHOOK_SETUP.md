# Configuração para Hotmart Webhook no Lovable/Vercel

## 📋 Status da Configuração

✅ **Frontend Integrado**: Sistema de webhook completamente implementado
✅ **API Endpoint Criado**: `/api/webhook/hotmart.ts` configurado
✅ **Vercel Config**: `vercel.json` criado para suporte a serverless functions
✅ **Script de Teste**: `test-webhook.sh` para validação

## 🔗 URL do Webhook

**Produção**: `https://seudominio.com/api/webhook/hotmart`
**Local**: `http://localhost:3000/api/webhook/hotmart`

## ⚙️ Configuração na Hotmart

1. Acesse a área do produtor na Hotmart
2. Vá em **Configurações** → **Webhook**
3. Configure:
   - **URL**: `https://seudominio.com/api/webhook/hotmart`
   - **Eventos**:
     - `PURCHASE_COMPLETE`
     - `PURCHASE_APPROVED`
     - `PURCHASE_CANCELED`
     - `PURCHASE_REFUNDED`
   - **ID do Webhook**: `agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df`

## 🧪 Como Testar

### Teste Local:

```bash
# 1. Iniciar servidor de desenvolvimento
npm run dev

# 2. Em outro terminal, executar teste
./test-webhook.sh
```

### Teste em Produção:

```bash
# Editar test-webhook.sh e alterar WEBHOOK_URL para seu domínio
# Depois executar:
./test-webhook.sh
```

## 🚀 Deploy

O Lovable faz deploy automático. Após o commit, o webhook estará disponível em:
`https://seudominio.com/api/webhook/hotmart`

## 📊 Monitoramento

Os logs do webhook aparecerão:

- **Localmente**: No terminal onde roda `npm run dev`
- **Produção**: No painel do Lovable/Vercel (seção Functions/Logs)

## 🔧 Funcionalidades Implementadas

1. **Captura de Dados do Usuário**: Armazenamento de UTMs antes do checkout
2. **Processamento de Webhook**: Correlação automática com dados armazenados
3. **Envio para Facebook Pixel**: Eventos de Purchase com dados UTM originais
4. **Envio para Google Analytics**: Eventos de conversão
5. **Persistência de Dados**: Sistema de limpeza automática após 7 dias
6. **Validação de Segurança**: Verificação do webhook ID específico

## 📁 Arquivos Importantes

- `/src/utils/hotmartWebhook.ts` - Sistema principal
- `/api/webhook/hotmart.ts` - Endpoint da API
- `/src/pages/quiz-descubra-seu-estilo.tsx` - Integração no quiz v1
- `/src/pages/ResultPage.tsx` - Integração no resultado
- `vercel.json` - Configuração do Vercel
- `test-webhook.sh` - Script de teste
