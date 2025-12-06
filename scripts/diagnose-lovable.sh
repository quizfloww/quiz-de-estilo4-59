#!/bin/bash

echo "🔍 Diagnóstico da Integração Lovable"
echo "===================================="

# Verificar arquivo .lovable
echo -e "\n1. Verificando arquivo de configuração .lovable..."
if [ -f ".lovable" ]; then
    echo "✅ Arquivo .lovable encontrado"
    echo "📄 Conteúdo:"
    cat .lovable | jq . 2>/dev/null || cat .lovable
else
    echo "❌ Arquivo .lovable não encontrado"
fi

# Verificar workflow GitHub Actions  
echo -e "\n2. Verificando workflow do GitHub Actions..."
if [ -f ".github/workflows/lovable-deploy.yml" ]; then
    echo "✅ Workflow lovable-deploy.yml encontrado"
else
    echo "❌ Workflow lovable-deploy.yml não encontrado"
fi

# Verificar configuração lovable.config.js
echo -e "\n3. Verificando lovable.config.js..."
if [ -f "lovable.config.js" ]; then
    echo "✅ Arquivo lovable.config.js encontrado"
    echo "📄 Conteúdo:"
    cat lovable.config.js
else
    echo "❌ Arquivo lovable.config.js não encontrado"
fi

# Verificar conexão com GitHub
echo -e "\n4. Verificando conexão com GitHub..."
echo "📍 Repositório remoto:"
git remote -v

echo -e "\n5. Verificando último commit..."
git log --oneline -1

# Verificar se há alterações não commitadas
echo -e "\n6. Verificando status do repositório..."
git status --porcelain

# Resumo dos problemas identificados
echo -e "\n📋 RESUMO DO DIAGNÓSTICO"
echo "========================"

PROBLEMS=0

if [ ! -f ".lovable" ]; then
    echo "❌ Problema 1: Arquivo .lovable não configurado"
    PROBLEMS=$((PROBLEMS + 1))
fi

if [ ! -f ".github/workflows/lovable-deploy.yml" ]; then
    echo "❌ Problema 2: Workflow GitHub Actions não configurado"  
    PROBLEMS=$((PROBLEMS + 1))
fi

if [ ! -f "lovable.config.js" ]; then
    echo "❌ Problema 3: Configuração Lovable não encontrada"
    PROBLEMS=$((PROBLEMS + 1))
fi

if [ $PROBLEMS -eq 0 ]; then
    echo "✅ Todas as configurações básicas estão presentes"
    echo -e "\n🔧 PRÓXIMOS PASSOS PARA RESOLVER SINCRONIZAÇÃO:"
    echo "1. Verificar se o token LOVABLE_TOKEN está configurado no GitHub:"
    echo "   - Acesse: https://github.com/vdp2025/quiz-sell-genius-66/settings/secrets/actions"
    echo "   - Confirme se existe o secret LOVABLE_TOKEN"
    echo ""
    echo "2. Verificar configuração no Lovable Studio:"
    echo "   - Acesse https://lovable.dev"
    echo "   - Abra o projeto Quiz Sell Genius"
    echo "   - Vá para Project Settings → GitHub"
    echo "   - Verifique se auto-sync está ativado"
    echo ""
    echo "3. Testar sincronização:"
    echo "   - Faça uma pequena alteração no Lovable Studio"
    echo "   - Verifique se aparece um novo commit no GitHub"
else
    echo "⚠️ Encontrados $PROBLEMS problemas de configuração"
fi
