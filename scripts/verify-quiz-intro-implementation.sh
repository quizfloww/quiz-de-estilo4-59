#!/bin/bash

# Script para verificar a implementação do quiz que sempre mostra a introdução
echo "🧪 Verificando implementação do QuizIntro..."

# Verificar alterações no código
echo "📋 Verificando modificações em QuizPage.tsx..."
if grep -q "Modificado: Sempre exibir o QuizIntro primeiro" /workspaces/quiz-sell-genius-66/src/components/QuizPage.tsx; then
  echo "✅ QuizPage.tsx foi modificado corretamente"
else
  echo "❌ ALERTA: Não foi encontrada a modificação esperada em QuizPage.tsx"
fi

# Verificar se a referência ao sessionStorage foi removida
echo "🔍 Verificando remoção do uso de sessionStorage..."
if grep -q "sessionStorage.setItem('hasSeenIntroThisSession', 'true')" /workspaces/quiz-sell-genius-66/src/components/QuizPage.tsx; then
  echo "❌ ALERTA: sessionStorage ainda está sendo utilizado em QuizPage.tsx"
else
  echo "✅ Referência ao sessionStorage removida com sucesso"
fi

# Verificar se o estado inicial do showIntro está definido como true
echo "🔍 Verificando estado inicial de showIntro..."
if grep -q "const \[showIntro, setShowIntro\] = useState(true)" /workspaces/quiz-sell-genius-66/src/components/QuizPage.tsx; then
  echo "✅ Estado inicial de showIntro está corretamente definido como true"
else
  echo "❌ ALERTA: Estado inicial de showIntro pode não estar definido como true"
fi

# Verificar a existência dos arquivos de teste
echo "📁 Verificando arquivos de teste..."
if [ -f "/workspaces/quiz-sell-genius-66/tests/intro-flow-test.js" ]; then
  echo "✅ Arquivo de teste intro-flow-test.js encontrado"
else
  echo "❌ ERRO: Arquivo de teste intro-flow-test.js não encontrado"
fi

if [ -f "/workspaces/quiz-sell-genius-66/public/test-quiz-intro.html" ]; then
  echo "✅ Página de teste test-quiz-intro.html encontrada"
else
  echo "❌ ERRO: Página de teste test-quiz-intro.html não encontrada"
fi

echo ""
echo "✅ Verificação concluída!"
echo ""
echo "Para testar manualmente:"
echo "1. Inicie o servidor com 'npm run dev'"
echo "2. Acesse http://localhost:5173/ e confirme que o QuizIntro aparece"
echo "3. Insira um nome e confirme que o quiz funciona normalmente"
echo "4. Feche o navegador e abra novamente a aplicação"
echo "5. Confirme que o QuizIntro aparece novamente, mesmo que seu nome ainda esteja salvo"
echo ""
echo "Para executar o teste automatizado:"
echo "1. Acesse http://localhost:5173/test-quiz-intro.html"
echo "2. Siga as instruções na página de teste"
