#!/bin/bash

# Script de Demonstração do Sistema de Autenticação
# Quiz Sell Genius - Admin Authentication System

echo "🔐 ==============================================="
echo "   SISTEMA DE AUTENTICAÇÃO - QUIZ SELL GENIUS"
echo "=============================================== 🔐"
echo ""

echo "📋 CREDENCIAIS DE ACESSO:"
echo "   Email: consultoria@giselegalvao.com.br"
echo "   Senha: Gi\$ele0809"
echo ""

echo "🌐 LINKS DE TESTE:"
echo "   📱 Dashboard Admin: http://localhost:8083/admin"
echo "   ⚙️  Configurações:   http://localhost:8083/admin/settings"
echo "   📊 Analytics:       http://localhost:8083/admin/analytics"
echo "   🎨 Criativos:       http://localhost:8083/admin/criativos"
echo ""

echo "✅ FUNCIONALIDADES IMPLEMENTADAS:"
echo "   🔒 Hash bcrypt para senhas"
echo "   ⏰ Sessões de 24 horas"
echo "   🛡️  Proteção de todas as rotas admin"
echo "   🎨 Interface moderna de login"
echo "   🚪 Logout funcional"
echo "   🔄 Verificação automática de sessão"
echo ""

echo "🧪 PARA TESTAR:"
echo "   1. Acesse http://localhost:8083/admin"
echo "   2. Use as credenciais acima"
echo "   3. Navegue pelas seções admin"
echo "   4. Teste o logout no header"
echo "   5. Feche/abra o navegador (sessão persiste)"
echo ""

# Verificar se o servidor está rodando
if curl -s http://localhost:8083 > /dev/null; then
    echo "🟢 Servidor de desenvolvimento: ONLINE"
    echo "   👆 Pronto para testes!"
else
    echo "🔴 Servidor de desenvolvimento: OFFLINE"
    echo "   ⚠️  Execute: npm run dev"
fi

echo ""
echo "📝 Documentação completa em: SISTEMA_AUTENTICACAO_COMPLETO.md"
echo "🎯 Status: PRODUCTION READY ✅"
echo ""
