#!/bin/bash

# Script de atualização para o Lovable
# Este script contém todos os comandos necessários para atualizar o projeto para o Lovable

echo "🚀 Iniciando atualização para o Lovable..."

# 1. Atualizar dependências
echo "📦 Atualizando dependências..."
npm install lovable-tagger@latest --save-dev

# 2. Verificar se o arquivo de configuração do Lovable existe
if [ ! -f "./lovable.config.js" ]; then
  echo "🔧 Criando arquivo de configuração do Lovable..."
  cat > ./lovable.config.js << EOL
module.exports = {
  componentsPath: 'src/components/lovable',
  assetsPath: 'public/lovable-uploads',
  outputPath: 'dist',
  buildCommand: 'npm run build',
  previewCommand: 'npm run preview',
  development: {
    port: 5173,
    startCommand: 'npm run dev'
  }
};
EOL
  echo "✅ Arquivo de configuração criado com sucesso!"
else
  echo "✅ Arquivo de configuração do Lovable já existe!"
fi

# 3. Adicionar script ao package.json se não existir
if ! grep -q "\"lovable:prepare\":" "./package.json"; then
  echo "🔧 Adicionando script lovable:prepare ao package.json..."
  # Usar sed para adicionar o script antes do fechamento da seção scripts
  sed -i '/\"scripts\": {/,/}/s/}/,\n    \"lovable:prepare\": \"lovable-tagger\"\n  }/' package.json
  echo "✅ Script adicionado com sucesso!"
else
  echo "✅ Script lovable:prepare já existe no package.json!"
fi

# 4. Executar o tagger para marcar os componentes Lovable
echo "🏷️ Marcando componentes Lovable..."
npx lovable-tagger

# 5. Verificar estrutura de diretórios
echo "📂 Verificando estrutura de diretórios..."
mkdir -p src/components/lovable
mkdir -p public/lovable-uploads

# 6. Verificar se o arquivo LOVABLE.md existe
if [ ! -f "./LOVABLE.md" ]; then
  echo "📝 Criando documentação para o Lovable..."
  cat > ./LOVABLE.md << EOL
# Integrações com Lovable

Este documento contém informações sobre como utilizar o Lovable para atualizar o projeto remotamente.

## O que é o Lovable?

O Lovable é uma plataforma visual para desenvolvedores React, que permite editar componentes através de uma interface amigável. Com ele, você pode fazer alterações no site sem precisar mexer diretamente no código.

## Como atualizar o projeto remotamente

### 1. Acessando o Lovable Studio

1. Acesse o [Lovable Studio](https://www.lovable.dev)
2. Faça login com sua conta
3. Selecione o projeto "Quiz Sell Genius"

### 2. Editando componentes

No Lovable Studio, você pode:
- Editar componentes existentes
- Modificar textos, cores e imagens
- Visualizar as alterações em tempo real

### 3. Publicando as alterações

Quando estiver satisfeito com as alterações:
1. Clique em "Publish" no Lovable Studio
2. O Lovable fará push das mudanças para o repositório GitHub automaticamente
3. O workflow de GitHub Actions será acionado e fará o deploy das alterações para o servidor

## Componentes Lovable disponíveis

Os seguintes componentes podem ser editados através do Lovable:

- **QuizCover**: Página de capa do quiz
- **QuizQuestion**: Componente de pergunta do quiz
- **QuizLogic**: Lógica do funcionamento do quiz
- **ResultPageEditor**: Editor da página de resultados

## Boas práticas

- Faça um backup antes de realizar alterações significativas
- Teste as alterações no ambiente de desenvolvimento antes de publicar
- Use o sistema de controle de versão para acompanhar as mudanças

## Solução de problemas

Se você encontrar problemas com a publicação:
1. Verifique se o token de acesso do GitHub está válido
2. Confirme se o workflow do GitHub Actions está configurado corretamente
3. Verifique os logs de erro no GitHub Actions
EOL
  echo "✅ Documentação criada com sucesso!"
else
  echo "✅ Documentação LOVABLE.md já existe!"
fi

# 7. Verificar se existe o workflow do GitHub Actions
mkdir -p .github/workflows
if [ ! -f "./.github/workflows/lovable-deploy.yml" ]; then
  echo "🔄 Criando workflow de deploy para o Lovable..."
  cat > ./.github/workflows/lovable-deploy.yml << EOL
name: Lovable Deployment

on:
  push:
    branches:
      - main
    paths:
      - 'src/components/lovable/**'
      - 'public/lovable-uploads/**'

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build Project
        run: npm run build
        
      - name: Deploy to Server
        # Adicione aqui os comandos para deploy ao seu servidor
        run: echo "Deployment would happen here"
EOL
  echo "✅ Workflow de deploy criado com sucesso!"
else
  echo "✅ Workflow de deploy já existe!"
fi

echo "🎉 Atualização para o Lovable concluída com sucesso!"
echo "Para começar a usar o Lovable:"
echo "1. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo "2. Acesse o Lovable Studio para editar seus componentes remotamente"
echo "3. Publique suas alterações através do Lovable Studio"