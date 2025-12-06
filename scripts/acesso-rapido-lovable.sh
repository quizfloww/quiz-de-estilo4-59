#!/bin/bash
# Script para acessar rapidamente o editor Lovable para páginas específicas

echo "🚀 Quiz Sell Genius - Acesso Rápido ao Editor Lovable"
echo "========================================================"
echo ""
echo "Selecione a página que deseja editar:"
echo ""
echo "1) Página de Venda (Modo Editor)"
echo "2) Página de Resultado (Modo Editor)"
echo "3) Quiz 'Descubra seu Estilo' (Modo Editor)"
echo "4) Editor Completo Lovable"
echo "5) Visualizar Quiz 'Descubra seu Estilo' (Sem editor)"
echo "6) Visualizar Página de Resultado (Sem editor)"
echo "7) Visualizar Página de Venda (Sem editor)"
echo ""
read -p "Digite o número da opção (1-7): " option

# URLs dos ambientes
LOVABLE_DEV_URL="https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com"
PRODUCTION_URL="https://giselegalvao.com.br"

# Pergunta sobre qual ambiente usar
echo "Selecione o ambiente:"
echo "A) Ambiente de Desenvolvimento (Lovable)"
echo "B) Ambiente de Produção (giselegalvao.com.br)"
read -p "Digite a opção (A/B): " env_option

# Define a URL base com base na seleção do ambiente
if [[ $env_option == "B" || $env_option == "b" ]]; then
  ACTIVE_URL=$PRODUCTION_URL
  echo "✅ Usando ambiente de produção: $PRODUCTION_URL"
else
  ACTIVE_URL=$LOVABLE_DEV_URL
  echo "✅ Usando ambiente de desenvolvimento: $LOVABLE_DEV_URL"
fi

echo ""

case $option in
  1)
    echo "Abrindo editor para a Página de Venda..."
    echo "URL: $ACTIVE_URL/offer?lovable=true"
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/offer?lovable=true"
    ;;
  2)
    echo "Abrindo editor para a Página de Resultado..."
    echo "URL: $ACTIVE_URL/resultado?lovable=true"
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/resultado?lovable=true"
    ;;
  3)
    echo "Abrindo editor para o Quiz 'Descubra seu Estilo'..."
    echo "URL: $ACTIVE_URL/quiz-descubra-seu-estilo?lovable=true" 
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/quiz-descubra-seu-estilo?lovable=true"
    ;;
  4)
    echo "Abrindo Editor Completo Lovable..."
    echo "URL: $ACTIVE_URL/admin/editor"
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/admin/editor"
    ;;
  5)
    echo "Visualizando Quiz 'Descubra seu Estilo' (Sem editor)..."
    echo "URL: $ACTIVE_URL/quiz-descubra-seu-estilo"
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/quiz-descubra-seu-estilo"
    ;;
  6)
    echo "Visualizando Página de Resultado (Sem editor)..."
    echo "URL: $ACTIVE_URL/resultado"
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/resultado"
    ;;
  7)
    echo "Visualizando Página de Venda (Sem editor)..."
    echo "URL: $ACTIVE_URL/offer"
    echo "Copie este link e cole no seu navegador: $ACTIVE_URL/offer"
    ;;
  *)
    echo "Opção inválida!"
    exit 1
    ;;
esac

echo ""
echo "Para abrir o editor no modo visual completo, adicione '?lovable=true' ao final da URL."
echo "Por exemplo: $ACTIVE_URL/quiz-descubra-seu-estilo?lovable=true"
echo ""
echo "⚠️ Importante: Certifique-se de estar logado no Lovable antes de acessar estas URLs."
