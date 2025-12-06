#!/bin/bash

echo "🚀 FORÇANDO ATUALIZAÇÃO DO LOVABLE"
echo "=================================="
echo ""

# 1. Limpar cache e arquivos temporários
echo "1. Limpando cache..."
rm -rf node_modules/.cache
rm -rf .vite
rm -rf dist
echo "✅ Cache limpo"

# 2. Recriar configuração .lovable com timestamp
echo ""
echo "2. Atualizando configuração .lovable..."

# Backup
cp .lovable .lovable.backup.$(date +%s)

# Nova configuração com timestamp para forçar update
cat > .lovable << EOF
{
  "github": {
    "autoSyncFromGithub": true,
    "autoPushToGithub": true,
    "branch": "main"
  },
  "projectName": "Quiz Sell Genius",
  "projectId": "quiz-sell-genius-66", 
  "version": "2.1.$(date +%s)",
  "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "features": {
    "componentTagger": true,
    "liveEditing": true,
    "enhancedSync": true,
    "visualEditor": true,
    "forceSync": true
  },
  "editor": {
    "enableLiveMode": true,
    "autoSave": true,
    "componentHighlighting": true
  },
  "sync": {
    "forced": true,
    "timestamp": $(date +%s)
  }
}
EOF

echo "✅ Configuração atualizada com timestamp"

# 3. Criar arquivo de trigger
echo ""
echo "3. Criando trigger de sincronização..."
echo "LOVABLE_FORCE_SYNC=$(date +%s)" > .lovable-trigger
echo "✅ Trigger criado"

# 4. Atualizar package.json para forçar rebuild
echo ""
echo "4. Forçando rebuild..."
npm install --force
echo "✅ Dependências reinstaladas"

# 5. Build limpo
echo ""
echo "5. Build limpo..."
npm run build
echo "✅ Build concluído"

# 6. Commit das mudanças se necessário
echo ""
echo "6. Verificando se há mudanças para commit..."
if [[ $(git status --porcelain | wc -l) -gt 0 ]]; then
    echo "📝 Fazendo commit das mudanças..."
    git add .
    git commit -m "Force Lovable sync - $(date)"
    git push origin main
    echo "✅ Mudanças commitadas e enviadas"
else
    echo "ℹ️  Nenhuma mudança para commit"
fi

echo ""
echo "🎉 ATUALIZAÇÃO FORÇADA CONCLUÍDA!"
echo "================================="
echo ""
echo "📋 O que foi feito:"
echo "   ✅ Cache limpo"
echo "   ✅ Configuração .lovable atualizada com timestamp"
echo "   ✅ Trigger de sincronização criado"
echo "   ✅ Dependências reinstaladas"
echo "   ✅ Build limpo executado"
echo "   ✅ Mudanças commitadas (se necessário)"
echo ""
echo "🔍 Próximos passos:"
echo "1. Acesse o Lovable Studio"
echo "2. Verifique se o projeto está sincronizado"
echo "3. Tente fazer uma edição de teste"
echo ""
echo "🌐 URL: https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com"
