#!/bin/bash
# Script para iniciar em modo de desenvolvimento, ignorando erros de compilação

echo "🚀 Iniciando servidor de desenvolvimento..."
echo "⚠️ Nota: Este modo é apenas para desenvolvimento local e não gera build de produção"

export NEXT_IGNORE_TYPE_ERROR=1
export NEXT_IGNORE_ESLINT=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Iniciar em modo de desenvolvimento
npx next dev
