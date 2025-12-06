#!/bin/bash

echo "🧹 Limpando cache e testando páginas..."

# Limpar cache do npm
echo "📦 Limpando cache do npm..."
npm cache clean --force

# Limpar node_modules e reinstalar dependências
echo "🗂️ Removendo node_modules..."
rm -rf node_modules package-lock.json

echo "📥 Reinstalando dependências..."
npm install

# Limpar dist se existir
echo "🗃️ Limpando build anterior..."
rm -rf dist

# Build da aplicação
echo "🔨 Fazendo build..."
npm run build

# Verificar se os arquivos foram construídos corretamente
echo "✅ Verificando arquivos de build..."
ls -la dist/

echo "🎉 Cache limpo e build concluído!"
echo "📍 Para testar localmente, execute: npm run preview"
