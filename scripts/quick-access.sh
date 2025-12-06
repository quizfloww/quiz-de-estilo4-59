#!/bin/bash

# Quiz Sell Genius - Script de Acesso Rápido ao Dashboard
# Este script facilita o acesso aos diferentes componentes do sistema

echo "🎯 Quiz Sell Genius - Dashboard Administrativo"
echo "=============================================="
echo ""

# Verificar se o servidor está rodando
if curl -s http://localhost:8082 > /dev/null 2>&1; then
    echo "✅ Servidor detectado na porta 8082"
    PORT=8082
elif curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo "✅ Servidor detectado na porta 8081" 
    PORT=8081
elif curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Servidor detectado na porta 8080"
    PORT=8080
else
    echo "❌ Servidor não encontrado. Iniciando..."
    cd /workspaces/quiz-sell-genius-66
    npm run dev &
    sleep 3
    PORT=8080
    echo "✅ Servidor iniciado"
fi

echo ""
echo "🔗 Links de Acesso Rápido:"
echo "------------------------"
echo "📄 Homepage:                http://localhost:$PORT/"
echo "🎛️  Dashboard Principal:     http://localhost:$PORT/admin"
echo "🆕 Dashboard Alternativo:   http://localhost:$PORT/admin/new"
echo "✏️  Editor Visual:          http://localhost:$PORT/admin/editor" 
echo "📊 Página de Resultados:    http://localhost:$PORT/resultado"
echo "🎯 Quiz com Oferta:         http://localhost:$PORT/quiz-descubra-seu-estilo"
echo ""

echo "🎯 Funcionalidades no Dashboard Principal:"
echo "----------------------------------------"
echo "• Aba Dashboard    → Visão geral e acesso rápido"
echo "• Aba Editor       → Editor visual integrado"
echo "• Aba Oferta       → Editor de página de oferta"
echo "• Aba Analytics    → Métricas e relatórios"
echo "• Aba A/B Test     → Configuração de testes"
echo "• Aba Protótipo    → Visualização de protótipos"
echo "• Aba Config       → Configurações do sistema"
echo ""

# Abrir automaticamente no navegador se disponível
if command -v xdg-open > /dev/null; then
    echo "🌐 Abrindo dashboard no navegador..."
    xdg-open "http://localhost:$PORT/admin"
elif command -v open > /dev/null; then
    echo "🌐 Abrindo dashboard no navegador..."
    open "http://localhost:$PORT/admin"
fi

echo "✨ Sistema pronto para uso!"
echo "📖 Consulte DASHBOARD_GUIDE.md para mais informações"
