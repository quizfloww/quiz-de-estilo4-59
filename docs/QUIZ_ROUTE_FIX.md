# 🎯 Como Acessar o Quiz - Guia de Rotas

## 🚨 **PROBLEMA RESOLVIDO: Rota "/" não funcionava**

### **📍 Problema Identificado:**

O componente `ABTestRedirect` estava interceptando a rota raiz "/" e redirecionando automaticamente para outras páginas do teste A/B, impedindo o acesso direto ao quiz.

### **✅ Soluções Implementadas:**

#### **1. Múltiplas Formas de Acessar o Quiz:**

**🔸 Rota Principal:**

```
http://localhost:5173/quiz
```

**🔸 Rota Raiz com Parâmetros:**

```
http://localhost:5173/?quiz=true
http://localhost:5173/?force-quiz=true
http://localhost:5173/?skip-ab=true
```

**🔸 Rota Raiz (com teste A/B):**

```
http://localhost:5173/
```

_Nota: Esta rota redireciona automaticamente para `/resultado` ou `/descubra-seu-estilo` baseado no teste A/B_

#### **2. Modificações Realizadas:**

**📝 `ABTestRedirect.tsx`:**

- Adicionado suporte para parâmetros `?quiz=true`, `?force-quiz=true`, `?skip-ab=true`
- Permite bypass do teste A/B quando necessário
- Mantém funcionalidade do teste A/B para usuários normais

**📝 `App.tsx`:**

- Adicionada rota `/quiz` que sempre exibe o quiz
- Rota "/" mantida para teste A/B
- Ambas as rotas carregam o mesmo componente `QuizPage`

**📝 `_redirects`:**

- Adicionado suporte SPA para rota `/quiz`
- Garante que refresh da página funcione corretamente

### **🎮 Como Usar:**

#### **Para Desenvolvedores/Testes:**

```bash
# Acesso direto ao quiz (recomendado para desenvolvimento)
http://localhost:5173/quiz

# Acesso com parâmetro (útil para testes)
http://localhost:5173/?quiz=true
```

#### **Para Usuários Finais:**

```bash
# Teste A/B normal (redireciona automaticamente)
http://localhost:5173/

# Resultado direto
http://localhost:5173/resultado

# Landing page estilo
http://localhost:5173/descubra-seu-estilo
```

### **🔍 Como Testar:**

1. **Teste do Quiz:**

   ```bash
   curl -I http://localhost:5173/quiz
   # Deve retornar 200 e carregar o quiz
   ```

2. **Teste do A/B Test:**

   ```bash
   # Abra em modo incógnito
   http://localhost:5173/
   # Deve redirecionar para /resultado ou /descubra-seu-estilo
   ```

3. **Teste do Bypass:**
   ```bash
   http://localhost:5173/?quiz=true
   # Deve carregar o quiz diretamente
   ```

### **📊 Status das Rotas:**

| Rota                   | Status         | Função                  |
| ---------------------- | -------------- | ----------------------- |
| `/`                    | ✅ Funcionando | Teste A/B (redireciona) |
| `/quiz`                | ✅ Funcionando | Quiz direto (nova)      |
| `/?quiz=true`          | ✅ Funcionando | Quiz com bypass         |
| `/resultado`           | ✅ Funcionando | Página de resultado     |
| `/descubra-seu-estilo` | ✅ Funcionando | Landing page            |
| `/admin`               | ✅ Funcionando | Dashboard               |

### **🚀 Próximos Passos:**

1. **Testar em produção** todas as rotas
2. **Monitorar analytics** do teste A/B
3. **Documentar** qual rota usar em cada cenário
4. **Considerar** adicionar botão "Fazer Quiz" nas landing pages

---

**Data:** 4 de junho de 2025  
**Status:** ✅ RESOLVIDO  
**Rotas de Teste:**

- Quiz: http://localhost:5173/quiz
- A/B Test: http://localhost:5173/
- Bypass: http://localhost:5173/?quiz=true
