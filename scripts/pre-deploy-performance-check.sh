#!/bin/bash

# Script de verificação pré-deploy para garantir otimizações de desempenho
# Autor: GitHub Copilot
# Data: 14 de maio de 2025

echo "🚀 Iniciando verificações pré-deploy para otimizações de desempenho..."

# Cores para melhor legibilidade
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Array para coletar erros
errors=()
warnings=()

echo "🔍 Verificando arquivos críticos..."

# Verificar se .htaccess está presente
if [ -f "./htaccess-final.txt" ]; then
  echo -e "${GREEN}✅ htaccess-final.txt encontrado${NC}"
  
  # Verificar configurações de cache
  if grep -q "ExpiresByType.*1 year" "./htaccess-final.txt"; then
    echo -e "${GREEN}✅ Configurações de cache de longo prazo encontradas${NC}"
  else
    warnings+=("⚠️ htaccess-final.txt não possui configurações de cache de longo prazo")
  fi
  
  # Verificar headers de Cache-Control
  if grep -q "Cache-Control.*immutable" "./htaccess-final.txt"; then
    echo -e "${GREEN}✅ Headers Cache-Control immutable encontrados${NC}"
  else
    warnings+=("⚠️ htaccess-final.txt não possui headers Cache-Control imutáveis")
  fi
else
  errors+=("❌ htaccess-final.txt não encontrado - necessário para configurações de cache!")
fi

# Verificar configurações de browserslist
if [ -f "./.browserslistrc" ]; then
  echo -e "${GREEN}✅ .browserslistrc encontrado${NC}"
  
  # Verificar se navegadores legados estão excluídos
  if grep -q "not IE 11" "./.browserslistrc"; then
    echo -e "${GREEN}✅ Navegadores legados estão excluídos${NC}"
  else
    warnings+=("⚠️ .browserslistrc pode incluir navegadores obsoletos - verifique as configurações")
  fi
else
  warnings+=("⚠️ .browserslistrc não encontrado - transpilação JS pode ser excessiva")
fi

# Verificar configurações de preload no HTML
if [ -f "./index.html" ]; then
  echo -e "${GREEN}✅ index.html encontrado${NC}"
  
  # Verificar preconnect para recursos externos
  if grep -q "preconnect.*cloudinary" "./index.html"; then
    echo -e "${GREEN}✅ Preconnect para Cloudinary encontrado${NC}"
  else
    warnings+=("⚠️ Preconnect para Cloudinary não encontrado no index.html")
  fi
  
  # Verificar carregamento de fontes otimizado
  if grep -q "fonts.*media=\"print\".*onload" "./index.html"; then
    echo -e "${GREEN}✅ Carregamento otimizado de fontes encontrado${NC}"
  else
    warnings+=("⚠️ Fontes podem não estar carregando de forma otimizada")
  fi
  
  # Verificar scripts assíncronos
  if grep -q "script.*async" "./index.html"; then
    echo -e "${GREEN}✅ Scripts assíncronos encontrados${NC}"
    
    # Verificar se não há scripts com atributos async/defer misturados
    if grep -q "script.*async.*defer" "./index.html"; then
      errors+=("❌ Scripts com atributos async e defer misturados encontrados - isso causa problemas de build!")
    else
      echo -e "${GREEN}✅ Nenhum script com atributos async/defer misturados${NC}"
    fi
  else
    warnings+=("⚠️ Scripts podem não estar carregando de forma assíncrona")
  fi
else
  errors+=("❌ index.html não encontrado!")
fi

# Verificar configurações de code-splitting no vite.config.ts
if [ -f "./vite.config.ts" ]; then
  echo -e "${GREEN}✅ vite.config.ts encontrado${NC}"
  
  # Verificar se config de chunks está correta
  if grep -q "'vendor-router': \['react-router-dom'\]" "./vite.config.ts"; then
    echo -e "${GREEN}✅ Configuração de vendor-router correta${NC}"
  else
    if grep -q "'vendor-router': \['react-router" "./vite.config.ts"; then
      warnings+=("⚠️ Configuração de vendor-router pode estar incorreta - verifique se está usando apenas 'react-router-dom'")
    fi
  fi
else
  errors+=("❌ vite.config.ts não encontrado!")
fi

# Verificar script de preload de recursos
if [ -f "./src/utils/preloadResources.ts" ]; then
  echo -e "${GREEN}✅ Utilitário de preload encontrado${NC}"
  
  # Verificar se a configuração de vendor-router está correta
  if grep -q "vendor-router.*React Router DOM" "./src/utils/preloadResources.ts"; then
    echo -e "${GREEN}✅ Referência correta a React Router DOM no preload${NC}"
  fi
else
  warnings+=("⚠️ Utilitário de preload não encontrado - recursos críticos podem carregar tarde")
fi

# Verificar se o build foi executado com sucesso
if [ -d "./dist" ]; then
  echo -e "${GREEN}✅ Pasta dist encontrada${NC}"
  
  # Verificar tamanho dos bundles principais
  js_size=$(find ./dist -name "*.js" -type f -exec du -ch {} \; | grep total$ | cut -f1)
  echo -e "${GREEN}✅ Tamanho total dos arquivos JS: ${js_size}${NC}"
  
  css_size=$(find ./dist -name "*.css" -type f -exec du -ch {} \; | grep total$ | cut -f1)
  echo -e "${GREEN}✅ Tamanho total dos arquivos CSS: ${css_size}${NC}"
  
  # Verificar se há código dividido (code-splitting)
  js_count=$(find ./dist -name "*.js" | wc -l)
  if [ "$js_count" -gt "3" ]; then
    echo -e "${GREEN}✅ Code-splitting parece estar funcionando corretamente${NC}"
  else
    warnings+=("⚠️ Poucos arquivos JS detectados - code-splitting pode não estar funcionando")
  fi
else
  errors+=("❌ Pasta dist não encontrada - execute npm run build primeiro!")
fi

# Relatório final
echo ""
echo "📊 Resumo da verificação pré-deploy:"
echo "--------------------------------"

if [ ${#errors[@]} -eq 0 ] && [ ${#warnings[@]} -eq 0 ]; then
  echo -e "${GREEN}🎉 Nenhum problema encontrado! Seu site está otimizado para performance.${NC}"
else
  # Exibir erros
  if [ ${#errors[@]} -gt 0 ]; then
    echo -e "${RED}❌ ERROS CRÍTICOS ENCONTRADOS:${NC}"
    for error in "${errors[@]}"; do
      echo -e "${RED}$error${NC}"
    done
    echo ""
  fi
  
  # Exibir avisos
  if [ ${#warnings[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️ AVISOS (não bloqueiam o deploy, mas considere resolver):${NC}"
    for warning in "${warnings[@]}"; do
      echo -e "${YELLOW}$warning${NC}"
    done
  fi
fi

echo ""
echo "📝 Recomendações finais:"
echo "1. Execute testes Lighthouse após o deploy para confirmar melhorias"
echo "2. Verifique o impacto das otimizações nas métricas reais de usuários"
echo "3. Considere configurar monitoramento contínuo de desempenho"

# Sair com código de erro se houver problemas críticos
if [ ${#errors[@]} -gt 0 ]; then
  echo -e "${RED}⛔ Existem problemas críticos que devem ser corrigidos antes do deploy!${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Verificação concluída com sucesso!${NC}"
  exit 0
fi
