#!/bin/bash

echo "🌪️ Configuração Alternativa do Windsurf/Codeium"
echo ""

# Verificar se o Codeium está instalado
if code --list-extensions | grep -q "codeium.codeium"; then
    echo "✅ Codeium está instalado"
else
    echo "❌ Codeium não está instalado - instalando..."
    code --install-extension codeium.codeium
fi

echo ""
echo "🔧 MÉTODOS DE CONFIGURAÇÃO:"
echo ""

echo "MÉTODO 1 - Token direto:"
echo "1. Ctrl+Shift+P"
echo "2. Digite: Codeium: Provide Auth Token"
echo "3. Cole: zX3snOCGDE8FxO5aIwMBdgKjsWcE8zEfyY6tB6lIZ9U"
echo ""

echo "MÉTODO 2 - Login via browser:"
echo "1. Ctrl+Shift+P"
echo "2. Digite: Codeium: Sign In"
echo "3. Abra o browser e faça login"
echo ""

echo "MÉTODO 3 - Configuração manual:"
echo "1. Vá para: https://codeium.com/profile?tab=tokens"
echo "2. Gere um novo token"
echo "3. Use o token no VS Code"
echo ""

echo "🔍 VERIFICAR SE ESTÁ FUNCIONANDO:"
echo "- Procure o ícone 'Codeium' na barra de status"
echo "- Status deve mostrar 'Active' ou um checkmark verde"
echo "- Digite código em um arquivo .js/.ts para ver sugestões"
echo ""

echo "❗ PROBLEMAS COMUNS:"
echo "- Se o token expirou, gere um novo em codeium.com"
echo "- Se não aparecem sugestões, verifique se está habilitado para o tipo de arquivo"
echo "- Reinicie o VS Code após configurar"
echo ""

echo "📋 TOKEN FORNECIDO:"
echo "zX3snOCGDE8FxO5aIwMBdgKjsWcE8zEfyY6tB6lIZ9U"
echo ""

echo "🚀 Tente primeiro o MÉTODO 1, depois o MÉTODO 2 se não funcionar!"
