# 🎯 GUIA VISUAL: Navegação no Dashboard Analytics

## 🚀 ACESSO RÁPIDO

### URL Principal
```
http://localhost:8080/admin
```

### Navegação por Abas

1. **📊 Dashboard** - Visão geral
2. **✏️ Editor** - Editor visual  
3. **🎯 Oferta** - Editor de ofertas
4. **📈 Analytics** - Métricas (FOCO PRINCIPAL)
5. **🧪 A/B Test** - Testes A/B
6. **🎨 Protótipo** - Protótipos
7. **⚙️ Config** - Configurações

---

## 📈 ABA ANALYTICS - NAVEGAÇÃO DETALHADA

### Sub-abas Disponíveis:

#### 1. **Visão Geral**
- Métricas principais
- Gráficos de performance
- Status do sistema

#### 2. **Funil de Conversão** 
- Taxa de conversão por etapa
- Análise de abandono
- Otimizações sugeridas

#### 3. **Análise de Usuários**
- Demografia
- Comportamento de navegação
- Segmentação

#### 4. **Progresso do Quiz**
- Tempo médio de conclusão
- Taxa de abandono por pergunta
- Engajamento

#### 5. **Campanhas UTM** ⭐
- **CONFIGURAÇÃO PRINCIPAL DE UTM**
- Análise por source/medium/campaign
- Gráficos de performance
- Integração com Supabase

#### 6. **Integrações** ⭐⭐⭐
- **CONFIGURAÇÃO PRINCIPAL DE PIXELS**
- **SELEÇÃO GRANULAR DE EVENTOS**
- **TESTES DE CONECTIVIDADE**

#### 7. **Dados Brutos**
- Exportação de dados
- Relatórios customizados

---

## 🎯 CONFIGURAÇÃO DE PIXELS (Aba Integrações)

### Como Acessar:
1. `/admin` → Aba **Analytics** → Sub-aba **Integrações**

### Funcionalidades Disponíveis:

#### **Tab 1: Pixels**
- ✅ Facebook Pixel ID
- ✅ Access Token
- ✅ Switch Ativar/Desativar
- ✅ Teste de conexão
- ✅ **Configuração granular de eventos:**
  - quiz_start
  - quiz_answer
  - quiz_complete
  - result_view
  - lead_generated
  - sale
  - button_click

#### **Tab 2: Analytics**
- ✅ Google Analytics 4
- ✅ Measurement ID
- ✅ Eventos paralelos

#### **Tab 3: Marketing**
- ✅ Outras plataformas
- ✅ Integrações futuras

#### **Tab 4: API**
- ✅ Tokens de acesso
- ✅ Webhooks

#### **Tab 5: Webhooks**
- ✅ Endpoints externos
- ✅ Configurações de callback

#### **Tab 6: Log de Eventos**
- ✅ Monitoramento em tempo real
- ✅ Debug de eventos

---

## 📊 CONFIGURAÇÃO UTM (Aba Campanhas UTM)

### Como Acessar:
1. `/admin` → Aba **Analytics** → Sub-aba **Campanhas UTM**

### Dados Exibidos:
- ✅ Gráficos por source
- ✅ Análise por medium
- ✅ Performance por campaign
- ✅ Tabela detalhada com métricas
- ✅ Taxa de conversão por canal

### Integração Automática:
- ✅ Captura automática de parâmetros
- ✅ Armazenamento no Supabase
- ✅ Histórico completo
- ✅ Análise em tempo real

---

## 🧪 TESTES A/B

### Interface Principal:
1. `/admin` → Aba **A/B Test**

### Interface Avançada:
1. `/admin/ab-test-manager` (URL direta)

### Funcionalidades:
- ✅ Criação de testes
- ✅ Configuração de variações
- ✅ Distribuição de tráfego
- ✅ Métricas de conversão
- ✅ Preview lado a lado

---

## 🎛️ CONFIGURAÇÃO DE EVENTOS

### Localização Principal:
`/admin` → **Analytics** → **Integrações** → **Tab Pixels**

### Eventos Configuráveis:

#### 1. **quiz_start** 
- Switch individual ✅
- Descrição: "Início do quiz"
- Status visual

#### 2. **quiz_answer**
- Switch individual ✅  
- Descrição: "Respostas do quiz"
- Status visual

#### 3. **quiz_complete**
- Switch individual ✅
- Descrição: "Conclusão do quiz" 
- Status visual

#### 4. **result_view**
- Switch individual ✅
- Descrição: "Visualização de resultado"
- Status visual

#### 5. **lead_generated**
- Switch individual ✅
- Descrição: "Captura de lead"
- Status visual

#### 6. **sale**
- Switch individual ✅
- Descrição: "Conversão de venda"
- Status visual

#### 7. **button_click**
- Switch individual ✅
- Descrição: "Cliques em botões"
- Status visual

### Interface:
- ✅ Collapsible para economia de espaço
- ✅ Tooltips informativos
- ✅ Switches visuais coloridos
- ✅ Descrições contextuais
- ✅ Ícones de informação

---

## 🔧 COMO TESTAR A FUNCIONALIDADE

### 1. Testar Facebook Pixel:
```
/admin → Analytics → Integrações → Pixels → Botão "Testar Conexão"
```

### 2. Verificar UTM Parameters:
```
/admin → Analytics → Campanhas UTM → Visualizar dados
```

### 3. Configurar Eventos:
```
/admin → Analytics → Integrações → Pixels → Seção "Configurar eventos rastreados"
```

### 4. Criar Teste A/B:
```
/admin → A/B Test → Botão "Criar Novo Teste"
ou
/admin/ab-test-manager → Interface completa
```

### 5. Visualizar Métricas:
```
/admin → Analytics → Visão Geral → Métricas em tempo real
```

---

## ⚡ DICAS DE NAVEGAÇÃO

### Atalhos Rápidos:
- **F12** → Console para logs de pixel
- **Ctrl+Shift+R** → Refresh completo
- **Ctrl+K** → Busca rápida

### URLs Diretas:
```
/admin/analytics          → Analytics direto
/admin/ab-test-manager   → Gerenciador A/B
/admin/editor            → Editor visual
/admin/settings          → Configurações
```

### Troubleshooting:
1. Se pixel não funcionar → Verificar console (F12)
2. Se UTM não aparecer → Verificar conexão Supabase
3. Se A/B não ativar → Verificar localStorage
4. Se métricas não carregarem → Refresh da página

---

## 🎯 STATUS DE FUNCIONALIDADES

| Funcionalidade | Status | Localização |
|----------------|--------|-------------|
| 📊 Configuração Pixels | ✅ FUNCIONANDO | `/admin` → Analytics → Integrações |
| 🎯 UTM Parameters | ✅ FUNCIONANDO | `/admin` → Analytics → Campanhas UTM |
| 🧪 Seleção Eventos | ✅ FUNCIONANDO | `/admin` → Analytics → Integrações → Pixels |
| 📈 Gráficos Analytics | ✅ FUNCIONANDO | `/admin` → Analytics → Todas abas |
| 🔄 Testes A/B | ✅ FUNCIONANDO | `/admin` → A/B Test |
| 📱 Interface Responsiva | ✅ FUNCIONANDO | Todas as páginas |
| 🔗 Integração Supabase | ✅ FUNCIONANDO | UTM e dados |
| ⚡ Performance | ✅ OTIMIZADO | Lazy loading ativo |

---

**🎉 CONCLUSÃO:** Dashboard completamente funcional e intuitivo para tomada de decisões! ✅
