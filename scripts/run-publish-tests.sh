#!/bin/bash

# Script para executar testes de publicação do editor de funil
# Uso: ./run-publish-tests.sh [opcao]

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Testes E2E - Funcionalidade Publicar${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Função para mostrar menu
show_menu() {
    echo -e "${YELLOW}Escolha uma opção:${NC}"
    echo ""
    echo "  1) Testes Simplificados (14 testes - Rápido)"
    echo "  2) Testes Completos (28 testes - Detalhado)"
    echo "  3) Todos os testes de publicação"
    echo "  4) Modo UI (Interativo)"
    echo "  5) Com debug"
    echo "  6) Apenas Chrome"
    echo "  7) Apenas Firefox"
    echo "  8) Gerar relatório HTML"
    echo "  9) Ver último relatório"
    echo "  0) Sair"
    echo ""
}

# Função para executar teste
run_test() {
    local cmd=$1
    local desc=$2
    
    echo -e "${GREEN}▶ Executando: ${desc}${NC}"
    echo -e "${BLUE}$ ${cmd}${NC}"
    echo ""
    
    eval $cmd
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Testes concluídos com sucesso!${NC}"
    else
        echo ""
        echo -e "${RED}✗ Alguns testes falharam (código: ${exit_code})${NC}"
    fi
    
    return $exit_code
}

# Se recebeu argumento, executa direto
if [ ! -z "$1" ]; then
    case $1 in
        simple|1)
            run_test "npx playwright test funnel-publish-simple.spec.ts" "Testes Simplificados"
            ;;
        full|2)
            run_test "npx playwright test funnel-publish.spec.ts" "Testes Completos"
            ;;
        all|3)
            run_test "npx playwright test --grep 'Publicar'" "Todos os Testes de Publicação"
            ;;
        ui|4)
            run_test "npx playwright test funnel-publish-simple.spec.ts --ui" "Modo UI"
            ;;
        debug|5)
            run_test "npx playwright test funnel-publish-simple.spec.ts --debug" "Modo Debug"
            ;;
        chrome|6)
            run_test "npx playwright test funnel-publish-simple.spec.ts --project=chromium" "Chrome"
            ;;
        firefox|7)
            run_test "npx playwright test funnel-publish-simple.spec.ts --project=firefox" "Firefox"
            ;;
        report|8)
            run_test "npx playwright test funnel-publish-simple.spec.ts --reporter=html" "Com Relatório"
            echo ""
            echo -e "${YELLOW}Para ver o relatório, execute: npx playwright show-report${NC}"
            ;;
        show|9)
            npx playwright show-report
            ;;
        *)
            echo -e "${RED}Opção inválida: $1${NC}"
            echo ""
            echo "Uso: $0 [simple|full|all|ui|debug|chrome|firefox|report|show]"
            exit 1
            ;;
    esac
    exit $?
fi

# Menu interativo
while true; do
    show_menu
    read -p "Digite sua escolha: " choice
    echo ""
    
    case $choice in
        1)
            run_test "npx playwright test funnel-publish-simple.spec.ts" "Testes Simplificados"
            ;;
        2)
            run_test "npx playwright test funnel-publish.spec.ts" "Testes Completos"
            ;;
        3)
            run_test "npx playwright test --grep 'Publicar'" "Todos os Testes"
            ;;
        4)
            run_test "npx playwright test funnel-publish-simple.spec.ts --ui" "Modo UI"
            ;;
        5)
            run_test "npx playwright test funnel-publish-simple.spec.ts --debug" "Modo Debug"
            ;;
        6)
            run_test "npx playwright test funnel-publish-simple.spec.ts --project=chromium" "Chrome"
            ;;
        7)
            run_test "npx playwright test funnel-publish-simple.spec.ts --project=firefox" "Firefox"
            ;;
        8)
            run_test "npx playwright test funnel-publish-simple.spec.ts --reporter=html" "Com Relatório"
            echo ""
            echo -e "${YELLOW}Para ver o relatório, execute: npx playwright show-report${NC}"
            ;;
        9)
            echo -e "${GREEN}▶ Abrindo relatório...${NC}"
            npx playwright show-report
            ;;
        0)
            echo -e "${GREEN}Saindo...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida! Tente novamente.${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}------------------------------------------------${NC}"
    read -p "Pressione ENTER para continuar..."
    clear
done
