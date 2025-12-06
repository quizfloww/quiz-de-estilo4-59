# Guia do Dashboard Administrativo

## 🎯 Visão Geral

O Quiz Sell Genius agora usa uma abordagem de **dashboard unificado** onde o painel antigo (mais estável) é a interface principal, mas integra todas as funcionalidades modernas.

## 🚀 Como Acessar

### Homepage
- Acesse: `http://localhost:8081/`
- Clique em **"🎛️ Acessar Dashboard Administrativo"**

### Dashboard Principal
- URL: `http://localhost:8081/admin`
- Interface principal com todas as funcionalidades integradas

### Dashboard Alternativo
- URL: `http://localhost:8081/admin/new`
- Interface mais moderna (opcional)

## 📋 Funcionalidades Principais

### 1. **Dashboard** (Aba Principal)
- Visão geral do sistema
- Acesso rápido a todas as funções
- Status e estatísticas

### 2. **Editor Visual** (Aba Editor)
- Editor unificado de páginas
- Interface drag & drop
- Edição em tempo real
- Preview integrado

### 3. **Editor de Oferta** (Aba Oferta)
- Edição da página de oferta do quiz
- Customização visual
- Gerenciamento de funis

### 4. **Analytics** (Aba Analytics)
- Métricas de performance
- Dados de conversão
- Relatórios detalhados

### 5. **A/B Test** (Aba A/B Test)
- Configuração de testes
- Monitoramento de resultados
- Análise comparativa

### 6. **Protótipo** (Aba Protótipo)
- Visualização de protótipos
- Testes de interface
- Versões experimentais

### 7. **Configurações** (Aba Config)
- Ajustes do sistema
- Configurações globais
- Preferências

## 🔧 Navegação

### Links Externos Rápidos
- **Ver Página de Resultados**: `/resultado`
- **Quiz Principal**: `/`

### Estrutura de Rotas
```
/                           → Homepage
/admin                      → Dashboard Principal
/admin/new                  → Dashboard Alternativo
/resultado                  → Página de Resultados
/quiz-descubra-seu-estilo   → Quiz com Oferta
```

## ✨ Vantagens da Nova Estrutura

### 🎯 **Facilidade de Acesso**
- Acesso direto ao editor visual
- Navegação simplificada
- Interface intuitiva

### 🔄 **Integração Completa**
- Todas as funcionalidades em um só lugar
- Edição sem sair do dashboard
- Preview integrado

### 🚀 **Performance**
- Carregamento otimizado
- Lazy loading dos componentes
- Cache inteligente

### 🛠️ **Manutenibilidade**
- Código organizado
- Componentes reutilizáveis
- Documentação integrada

## 🆘 Resolução de Problemas

### Problema: Editor não carrega
**Solução**: Recarregue a página ou acesse diretamente `/admin/editor`

### Problema: Dashboard em branco
**Solução**: Limpe o cache do navegador ou use o dashboard alternativo em `/admin/new`

### Problema: Erros de navegação
**Solução**: Sempre use os botões internos do dashboard em vez de navegação manual

## 📝 Notas Importantes

1. **Editor Principal**: Agora integrado diretamente no dashboard
2. **Navegação**: Use as abas para alternar entre funcionalidades
3. **Performance**: Sistema otimizado para carregamento rápido
4. **Compatibilidade**: Mantém acesso ao dashboard moderno como alternativa

## 🎉 Próximos Passos

1. Explore todas as abas do dashboard
2. Teste o editor visual na aba "Editor Visual"
3. Configure suas preferências na aba "Config"
4. Monitore performance na aba "Analytics"

---

**Dashboard versão 2.1.0** - Atualizado em 25 de Maio de 2025
