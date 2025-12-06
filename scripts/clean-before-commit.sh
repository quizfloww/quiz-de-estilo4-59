#!/bin/bash

# Script para limpar o cache do Next.js antes do commit
# Isso evita que arquivos grandes sejam adicionados ao repositório

echo "🧹 Limpando cache do Next.js antes do commit..."

# Remover pasta de cache do Next.js
rm -rf .next/cache

# Limpar arquivos de build que não são necessários para o commit
find .next -name "*.pack" -delete

echo "✅ Cache limpo com sucesso! Agora você pode fazer o commit sem problemas."
