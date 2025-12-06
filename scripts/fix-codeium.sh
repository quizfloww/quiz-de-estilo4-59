#!/bin/bash

echo "🔧 Solucionando problemas do Codeium/Windsurf..."

# Limpar possíveis configurações conflitantes
echo "1. Limpando configurações antigas..."

# Verificar se há arquivos de configuração antigos
if [ -d ~/.codeium ]; then
    echo "   - Encontrado diretório ~/.codeium"
    echo "   - Para limpar completamente: rm -rf ~/.codeium"
fi

# Reinstalar a extensão
echo "2. Reinstalando extensão Codeium..."
code --uninstall-extension codeium.codeium 2>/dev/null
sleep 2
code --install-extension codeium.codeium

echo "3. Aguardando instalação..."
sleep 3

echo "4. Verificando instalação..."
if code --list-extensions | grep -q "codeium.codeium"; then
    echo "   ✅ Codeium instalado com sucesso"
else
    echo "   ❌ Falha na instalação do Codeium"
    exit 1
fi

echo ""
echo "🎯 AGORA CONFIGURE O TOKEN:"
echo "1. Pressione Ctrl+Shift+P"
echo "2. Digite exatamente: Codeium: Provide Auth Token"
echo "3. Cole este token: zX3snOCGDE8FxO5aIwMBdgKjsWcE8zEfyY6tB6lIZ9U"
echo "4. Pressione Enter"

echo ""
echo "🔍 Para verificar se funcionou:"
echo "- Olhe a barra de status (canto inferior)"
echo "- Deve aparecer um ícone do Codeium"
echo "- Tente digitar código em um arquivo .js ou .ts"

echo ""
echo "💡 Se ainda não funcionar:"
echo "1. Feche e reabra o VS Code"
echo "2. Tente o comando: Codeium: Sign In (via Command Palette)"
echo "3. Ou visite: https://codeium.com/profile?tab=tokens"

echo ""
echo "✨ Configuração concluída!"
