#!/bin/bash

echo "🔍 Verificando status do deploy na Vercel..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base
BASE_URL="https://quiz-de-estilo4-58.vercel.app"

echo "📡 Testando se o site está respondendo..."
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Site está online!${NC}"
else
    echo -e "${RED}❌ Site não está respondendo${NC}"
    exit 1
fi

echo ""
echo "🔍 Verificando versão do Service Worker..."
SW_CONTENT=$(curl -s "$BASE_URL/sw.js")

if echo "$SW_CONTENT" | grep -q "v8-VERCEL-FIX"; then
    echo -e "${GREEN}✅ Service Worker atualizado! (v8-VERCEL-FIX)${NC}"
else
    echo -e "${YELLOW}⚠️  Service Worker ainda não atualizado${NC}"
    echo "   Aguarde mais alguns minutos para o deploy completar"
fi

echo ""
echo "🧪 Verificando arquivos de teste..."

# Testar página de limpeza de cache
if curl -s "$BASE_URL/clear-cache.html" | grep -q "LIMPEZA DE CACHE COMPLETA"; then
    echo -e "${GREEN}✅ clear-cache.html disponível${NC}"
else
    echo -e "${RED}❌ clear-cache.html não encontrado${NC}"
fi

# Testar página de validação
if curl -s "$BASE_URL/test-validation.html" | grep -q "DIAGNÓSTICO DE VALIDAÇÃO"; then
    echo -e "${GREEN}✅ test-validation.html disponível${NC}"
else
    echo -e "${RED}❌ test-validation.html não encontrado${NC}"
fi

echo ""
echo "📋 Commits mais recentes:"
git log --oneline -3

echo ""
echo "🎯 Próximos passos:"
echo "1. Acesse: $BASE_URL/clear-cache.html"
echo "2. Aguarde a limpeza concluir"
echo "3. Teste a publicação do funil"
echo ""
echo "Se ainda houver erros, verifique o console (F12) para logs detalhados"
