#!/bin/bash

# Script para testar o webhook Hotmart
# Este script simula um webhook da Hotmart para testar a integração

echo "🔗 Testando Webhook Hotmart..."

# URL do webhook - SEU DOMÍNIO
WEBHOOK_URL="https://giselegalvao.com.br/api/webhook/hotmart"

# Para testar localmente, descomente a linha abaixo:
# WEBHOOK_URL="http://localhost:5173/api/webhook/hotmart"

# Dados de teste do webhook
WEBHOOK_DATA='{
  "event": "PURCHASE_COMPLETE",
  "webhook_id": "agQzTLUehWUfhPzjhdwntVQz0JNT5E0216ae0d-00a9-48ae-85d1-f0d14bd8e0df",
  "timestamp": "'$(date -Iseconds)'",
  "data": {
    "purchase": {
      "transaction": "T123456789",
      "status": "APPROVED",
      "checkout_country": "BR",
      "approved_date": "'$(date -Iseconds)'"
    },
    "buyer": {
      "email": "teste@exemplo.com",
      "name": "João Silva"
    },
    "transaction": {
      "id": "T123456789",
      "status": "APPROVED"
    }
  }
}'

echo "📡 Enviando requisição para: $WEBHOOK_URL"
echo "📦 Dados: $WEBHOOK_DATA"

# Enviar requisição POST
response=$(curl -X POST \
  "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$WEBHOOK_DATA" \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

# Extrair status HTTP
http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')

echo ""
echo "📋 Resposta:"
echo "Status HTTP: $http_status"
echo "Body: $response_body"

if [ "$http_status" = "200" ]; then
    echo "✅ Teste bem-sucedido! Webhook funcionando corretamente."
else
    echo "❌ Teste falhou. Status HTTP: $http_status"
    echo "Verifique se o endpoint está funcionando e se a URL está correta."
fi

echo ""
echo "🔍 Para testar em produção, substitua WEBHOOK_URL pelo seu domínio real."
echo "🔍 Para testar localmente, rode 'npm run dev' e use http://localhost:3000"
