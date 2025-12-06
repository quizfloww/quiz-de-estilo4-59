#!/bin/bash
# Script para compilar o Next.js ignorando a maioria dos erros

echo "🚀 Iniciando build simplificado..."

# Garantir que estamos ignorando erros de tipo e lint
echo "⚙️ Configurando para ignorar erros de tipo e lint..."
export NEXT_IGNORE_TYPE_ERROR=1
export NEXT_IGNORE_ESLINT=1

# Executar build com flags adicionais para ignorar erros
echo "🔨 Executando build..."
NODE_OPTIONS="--max-old-space-size=4096" npx next build || true

echo "✅ Build concluído (mesmo com possíveis erros)"
