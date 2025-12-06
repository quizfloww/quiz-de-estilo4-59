#!/bin/bash

# Cores para saída no terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Quiz Sell Genius - Acesso ao Editor com Loading${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "Este script abre o navegador com acesso à página de carregamento"
echo "simulando o progresso de arquivos (2000 de 3700 carregados)."
echo ""
echo "Escolha o tipo de editor para acessar:"
echo ""
echo "1) Editor Unificado (com carregamento)"
echo "2) Editor Visual (com carregamento)"
echo "3) Editor de Resultado (com carregamento)"
echo "4) Painel Admin (com carregamento)"
echo "5) Página de acesso rápido HTML"
echo "0) Sair"
echo ""

read -p "Digite sua escolha (0-5): " choice

# URL base varia conforme o ambiente
PORT=8082
BASE_URL="http://localhost:${PORT}"

# Testa se o servidor está acessível
check_server() {
  echo -e "${BLUE}Verificando servidor em ${BASE_URL}...${NC}"
  if curl -s --head --request GET ${BASE_URL} | grep "200 OK" > /dev/null; then 
    echo -e "${GREEN}✅ Servidor respondendo!${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️ Servidor não está respondendo em ${BASE_URL}${NC}"
    echo -e "${YELLOW}Verifique se o servidor está rodando na porta ${PORT}.${NC}"
    return 1
  fi
}

# Função para abrir no navegador
open_browser() {
  url="${BASE_URL}${1}"
  echo -e "${BLUE}Abrindo navegador em: ${url}${NC}"
  
  # Detecta o sistema operacional e abre o navegador adequadamente
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "${url}" 2>/dev/null || sensible-browser "${url}" 2>/dev/null || {
      echo -e "${YELLOW}⚠️ Não foi possível abrir o navegador automaticamente.${NC}"
      echo -e "${YELLOW}Por favor, acesse manualmente: ${url}${NC}"
    }
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "${url}"
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start "${url}"
  else
    echo -e "${YELLOW}⚠️ Sistema operacional não reconhecido.${NC}"
    echo -e "${YELLOW}Por favor, acesse manualmente: ${url}${NC}"
  fi
}

# Executa baseado na escolha
if [[ $choice != 0 ]]; then
  if check_server; then
    case $choice in
      1)
        echo -e "${GREEN}Abrindo Editor Unificado com simulação de loading...${NC}"
        open_browser "/acesso/unificado"
        ;;
      2)
        echo -e "${GREEN}Abrindo Editor Visual com simulação de loading...${NC}"
        open_browser "/acesso/editor"
        ;;
      3)
        echo -e "${GREEN}Abrindo Editor de Resultado com simulação de loading...${NC}"
        open_browser "/acesso/resultado"
        ;;
      4)
        echo -e "${GREEN}Abrindo Painel Admin com simulação de loading...${NC}"
        open_browser "/acesso/admin"
        ;;
      5)
        echo -e "${GREEN}Abrindo página de acesso rápido HTML...${NC}"
        open_browser "/acesso-editor.html"
        ;;
      *)
        echo -e "${YELLOW}Opção inválida.${NC}"
        ;;
    esac
  fi
else
  echo -e "${BLUE}Saindo...${NC}"
fi

echo ""
echo -e "${BLUE}============================================${NC}"
