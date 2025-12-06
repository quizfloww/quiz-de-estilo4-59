#!/bin/bash

echo "Verificando a integridade do build..."

# Verificar arquivos essenciais
if [ ! -f "/workspaces/quiz-sell-genius-66/dist/index.html" ]; then
    echo "❌ ERRO: index.html não encontrado!"
    exit 1
else
    echo "✅ index.html encontrado."
fi

if [ ! -f "/workspaces/quiz-sell-genius-66/dist/.htaccess" ]; then
    echo "❌ ERRO: .htaccess não encontrado!"
    exit 1
else
    echo "✅ .htaccess encontrado."
fi

if [ ! -d "/workspaces/quiz-sell-genius-66/dist/assets" ]; then
    echo "❌ ERRO: diretório assets não encontrado!"
    exit 1
else
    echo "✅ diretório assets encontrado."
fi

if [ ! -f "/workspaces/quiz-sell-genius-66/dist/src/utils/critical-js.js" ]; then
    echo "❌ ERRO: script critical-js.js não encontrado!"
    exit 1
else
    echo "✅ script critical-js.js encontrado."
fi

# Verificar se o preload da imagem LCP está presente
if grep -q "preload.*image.*fetchpriority=\"high\"" "/workspaces/quiz-sell-genius-66/dist/index.html"; then
    echo "✅ Preload da imagem LCP encontrado."
else
    echo "⚠️ AVISO: Preload da imagem LCP não encontrado!"
fi

# Verificar se o script para prevenção de CSS está presente
if grep -q "content-placeholder" "/workspaces/quiz-sell-genius-66/dist/index.html"; then
    echo "✅ CSS para prevenção de layout shifts encontrado."
else
    echo "⚠️ AVISO: CSS para prevenção de layout shifts não encontrado!"
fi

# Verificar se existem compressões GZIP/Brotli
GZIP_COUNT=$(find /workspaces/quiz-sell-genius-66/dist -name "*.gz" | wc -l)
BROTLI_COUNT=$(find /workspaces/quiz-sell-genius-66/dist -name "*.br" | wc -l)

echo "📦 $GZIP_COUNT arquivos com compressão GZIP"
echo "📦 $BROTLI_COUNT arquivos com compressão Brotli"

# Resumo do build
echo -e "\n📊 RESUMO DO BUILD"
echo "Total de arquivos: $(find /workspaces/quiz-sell-genius-66/dist -type f | wc -l)"
echo "Tamanho total: $(du -sh /workspaces/quiz-sell-genius-66/dist | cut -f1)"

echo -e "\n✨ BUILD VALIDADO! Pronto para deploy."
echo "Para fazer upload para a Hostinger, use um dos métodos abaixo:"
echo "1. Upload via Painel da Hostinger (File Manager)"
echo "2. Upload via FTP/SFTP (FileZilla ou similar)"
echo "3. Upload via linha de comando (se tiver acesso SSH)"

echo -e "\nLembre-se de verificar as seguintes páginas após o deploy:"
echo "- Página Inicial: https://giselegalvao.com.br/"
echo "- Página de Resultados: https://giselegalvao.com.br/resultado"
echo "- Página de Venda: https://giselegalvao.com.br/quiz-descubra-seu-estilo"
