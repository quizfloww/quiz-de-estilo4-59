#!/bin/bash

# Script para preparar o pacote de deploy para a Hostinger
# Este script prepara um arquivo ZIP com todos os arquivos necessários para o deploy

echo "🚀 Preparando pacote de deploy para a Hostinger..."

# Definir variáveis
BUILD_DIR="/workspaces/quiz-sell-genius-66/dist"
DEPLOY_DIR="/workspaces/quiz-sell-genius-66/deploy"
ZIP_NAME="quiz-sell-genius-$(date +%Y%m%d-%H%M%S).zip"

# Criar diretório de deploy se não existir
mkdir -p $DEPLOY_DIR

# Verificar se temos o build completo
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "❌ ERRO: O build não foi encontrado em $BUILD_DIR"
    echo "Por favor, execute 'npm run build:hostinger' primeiro."
    exit 1
fi

# Verificar os arquivos críticos
echo "📋 Verificando arquivos críticos..."

CRITICAL_FILES=(
    "index.html"
    ".htaccess"
    "src/utils/critical-js.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        echo "❌ ERRO: Arquivo crítico $file não encontrado!"
        exit 1
    else
        echo "✅ $file encontrado"
    fi
done

# Copiar HTACCESS para o diretório raiz se ainda não estiver lá
if [ ! -f "$BUILD_DIR/.htaccess" ]; then
    if [ -f "/workspaces/quiz-sell-genius-66/public/.htaccess" ]; then
        echo "Copiando .htaccess para o diretório de build..."
        cp "/workspaces/quiz-sell-genius-66/public/.htaccess" "$BUILD_DIR/"
    elif [ -f "/workspaces/quiz-sell-genius-66/htaccess-final.txt" ]; then
        echo "Copiando htaccess-final.txt para o diretório de build como .htaccess..."
        cp "/workspaces/quiz-sell-genius-66/htaccess-final.txt" "$BUILD_DIR/.htaccess"
    else
        echo "⚠️ AVISO: Nenhum arquivo .htaccess encontrado para copiar!"
    fi
fi

# Criar pacote ZIP para deploy
echo "📦 Criando pacote ZIP para deploy..."
cd $BUILD_DIR && zip -r "$DEPLOY_DIR/$ZIP_NAME" . -x "*.DS_Store" "*.git*"

if [ $? -eq 0 ]; then
    echo "✅ Pacote ZIP criado com sucesso: $DEPLOY_DIR/$ZIP_NAME"
    echo "📊 Tamanho do pacote: $(du -h "$DEPLOY_DIR/$ZIP_NAME" | cut -f1)"
else
    echo "❌ ERRO: Falha ao criar o pacote ZIP!"
    exit 1
fi

# Instruções para deploy
echo -e "\n🌐 INSTRUÇÕES PARA DEPLOY NA HOSTINGER"
echo "1. Acesse o painel da Hostinger e vá para o Gerenciador de Arquivos"
echo "2. Navegue até a pasta 'public_html' ou a pasta raiz do domínio"
echo "3. Faça upload do arquivo ZIP: $ZIP_NAME"
echo "4. Extraia o conteúdo diretamente na pasta raiz"
echo "5. Verifique se o arquivo .htaccess está presente após a extração"

echo -e "\n✅ PÁGINAS A TESTAR APÓS O DEPLOY"
echo "- Página Inicial: https://giselegalvao.com.br/"
echo "- Página de Resultados: https://giselegalvao.com.br/resultado"
echo "- Página de Venda: https://giselegalvao.com.br/quiz-descubra-seu-estilo"

echo -e "\n🔍 VERIFICAÇÃO PÓS-DEPLOY"
echo "1. Verifique se a página inicial carrega corretamente"
echo "2. Verifique se as imagens estão nítidas e não borradas"
echo "3. Teste a navegação entre as páginas do funil"
echo "4. Verifique se o Facebook Pixel está registrando os eventos"
echo "5. Execute o Lighthouse para confirmar a melhoria no desempenho"

echo -e "\n✨ DEPLOY PREPARADO COM SUCESSO!"
