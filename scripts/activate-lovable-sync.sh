#!/bin/bash

echo "🚀 ATIVANDO CONFIGURAÇÕES LOVABLE SYNC"
echo "======================================="
echo ""

# Verificar se o arquivo .lovable existe
if [ ! -f ".lovable" ]; then
    echo "❌ Arquivo .lovable não encontrado!"
    exit 1
fi

echo "✅ Arquivo .lovable encontrado"
echo ""

# Backup do arquivo original
cp .lovable .lovable.backup
echo "📦 Backup criado: .lovable.backup"

# Criar nova configuração com sync ativado
cat > .lovable << 'EOF'
{
  "github": {
    "autoSyncFromGithub": true,
    "autoPushToGithub": true,
    "branch": "main"
  },
  "projectName": "Quiz Sell Genius",
  "projectId": "quiz-sell-genius-66",
  "version": "2.0.0",
  "features": {
    "componentTagger": true,
    "liveEditing": true,
    "enhancedSync": true,
    "visualEditor": true
  },
  "editor": {
    "enableLiveMode": true,
    "autoSave": true,
    "componentHighlighting": true
  }
}
EOF

echo "✅ Configurações atualizadas!"
echo ""

# Verificar se as configurações foram aplicadas
echo "🔍 VERIFICANDO CONFIGURAÇÕES:"
echo "=============================="

if grep -q '"autoSyncFromGithub": true' .lovable; then
    echo "✅ Auto-sync from GitHub: ATIVADO"
else
    echo "❌ Auto-sync from GitHub: DESATIVADO"
fi

if grep -q '"autoPushToGithub": true' .lovable; then
    echo "✅ Auto-push to GitHub: ATIVADO"
else
    echo "❌ Auto-push to GitHub: DESATIVADO"
fi

echo ""
echo "📄 Configuração atual:"
cat .lovable

echo ""
echo "🎉 CONFIGURAÇÃO LOVABLE ATIVADA COM SUCESSO!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Configure LOVABLE_TOKEN no GitHub"
echo "2. Conecte o repositório no Lovable Studio"
echo "3. Execute: npm run lovable:prepare"
