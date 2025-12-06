#!/bin/bash

echo "🌪️ Configurando Windsurf/Codeium Token..."

# Token do Windsurf/Codeium
WINDSURF_TOKEN="zX3snOCGDE8FxO5aIwMBdgKjsWcE8zEfyY6tB6lIZ9U"

echo "📋 Token para configuração manual:"
echo "$WINDSURF_TOKEN"

echo ""
echo "🔧 Passos para configurar o Codeium:"
echo "1. Pressione Ctrl+Shift+P"
echo "2. Digite: 'Codeium: Provide Auth Token'"
echo "3. Cole o token: $WINDSURF_TOKEN"
echo "4. Pressione Enter"

echo ""
echo "🔍 Alternativa - Configurar via Command Palette:"
echo "1. Pressione Ctrl+Shift+P"
echo "2. Digite: 'Codeium: Sign In'"
echo "3. Siga as instruções na tela"

echo ""
echo "🚀 Se ainda não funcionar, tente:"
echo "1. Desinstalar e reinstalar a extensão Codeium"
echo "2. Reiniciar o VS Code"
echo "3. Configurar novamente o token"

echo ""
echo "📌 Verificar status:"
echo "- Procure pelo ícone do Codeium na barra de status (canto inferior)"
echo "- Deve mostrar 'Codeium: Active' quando configurado corretamente"

# Verificar se a extensão está ativa
if code --list-extensions | grep -q "codeium.codeium"; then
    echo "✅ Extensão Codeium está instalada"
else
    echo "❌ Extensão Codeium NÃO está instalada"
    echo "   Execute: code --install-extension codeium.codeium"
fi
