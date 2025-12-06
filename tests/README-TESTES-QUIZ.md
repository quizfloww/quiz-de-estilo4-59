# Testes Automatizados - Quiz de Estilo Pessoal

## 📋 Visão Geral

Este documento descreve os testes automatizados criados para validar a lógica de cálculos e resultados do **Quiz de Estilo Pessoal** (Funil principal com 10 questões de estilo + 7 estratégicas).

## 🎯 Objetivo dos Testes

Garantir que a lógica de pontuação e cálculo de resultados funcione corretamente, validando:

1. **Cálculo de pontos por categoria de estilo**
2. **Determinação do estilo predominante**
3. **Cálculo correto de percentuais**
4. **Ordenação de estilos secundários**
5. **Fluxo completo do quiz (E2E)**

## 📁 Estrutura dos Testes

### 1. Testes de Lógica de Cálculo

**Arquivo:** `tests/e2e/quiz-logic-calculation.spec.ts`

#### Testes Incluídos:

##### 1.1 Cálculo de Estilo Predominante

- ✅ Todas respostas do mesmo estilo (100% de um estilo)
- ✅ Distribuição entre múltiplos estilos
- ✅ Quiz completo com 10 questões (30 seleções)
- ✅ Validação de estilos secundários

##### 1.2 Percentuais e Arredondamento

- ✅ Arredondamento correto de decimais
- ✅ Natural: 6/9 = 66.67% → 67%
- ✅ Clássico: 2/9 = 22.22% → 22%
- ✅ Romântico: 1/9 = 11.11% → 11%

##### 1.3 Casos Extremos e Validações

- ✅ Quiz sem respostas (total = 0)
- ✅ Categorias inválidas ignoradas
- ✅ Todos os 8 estilos presentes no resultado
- ✅ Resposta com apenas 1 questão

### 2. Testes End-to-End (E2E)

**Arquivo:** `tests/e2e/quiz-estilo-pessoal.spec.ts`

#### Fluxo Completo:

```
1. Introdução → Captura de Nome
2. 10 Questões de Estilo (3 seleções cada)
3. Transição Intermediária
4. 7 Questões Estratégicas (1 seleção cada, auto-advance)
5. Transição Final
6. Página de Resultado
```

#### Testes E2E Incluídos:

##### 2.1 Fluxo Completo

- ✅ Completar quiz do início ao fim
- ✅ Verificar transições entre etapas
- ✅ Validar exibição do resultado final
- ✅ Confirmar presença de CTA

##### 2.2 Persistência de Dados

- ✅ Salvar nome no localStorage
- ✅ Salvar progresso das respostas
- ✅ Manter dados após reload da página

##### 2.3 Validações de Interface

- ✅ Nome obrigatório para iniciar
- ✅ Exigir exatamente 3 seleções por questão
- ✅ Botão desabilitado até completar seleções
- ✅ Permitir voltar para questões anteriores
- ✅ Exibir indicador de progresso

##### 2.4 Cálculo de Resultado

- ✅ Calcular estilo predominante correto
- ✅ Exibir percentuais na página de resultado
- ✅ Mostrar nome do usuário personalizado

## 🔬 Estrutura dos Dados de Teste

### Categorias de Estilo (8 tipos):

1. **Natural** - Informal, espontânea, alegre
2. **Clássico** - Conservadora, séria, organizada
3. **Contemporâneo** - Informada, ativa, prática
4. **Elegante** - Exigente, sofisticada, seletiva
5. **Romântico** - Feminina, meiga, delicada
6. **Sexy** - Glamorosa, vaidosa, sensual
7. **Dramático** - Cosmopolita, moderna, audaciosa
8. **Criativo** - Exótica, aventureira, livre

### Formato de Resposta:

```typescript
{
  questionId: string;
  options: Array<{
    optionId: string;
    styleCategory: string; // Uma das 8 categorias
  }>;
}
```

### Algoritmo de Cálculo:

1. Contar pontos por categoria (cada seleção = 1 ponto)
2. Calcular percentual: `(pontos / total) * 100`
3. Arredondar percentuais com `Math.round()`
4. Ordenar por pontuação (maior para menor)
5. Usar clickOrder para desempate

## 🚀 Executando os Testes

### Todos os Testes:

```bash
npm test
```

### Apenas Testes de Lógica:

```bash
npm test tests/e2e/quiz-logic-calculation.spec.ts
```

### Apenas Testes E2E do Quiz:

```bash
npm test tests/e2e/quiz-estilo-pessoal.spec.ts
```

### Com Interface Visual:

```bash
npm run test:ui
```

### Modo Debug:

```bash
npm run test:debug
```

### Apenas Chromium:

```bash
npm test -- --project=chromium
```

## 📊 Cobertura dos Testes

### Funcionalidades Testadas:

| Funcionalidade            | Status | Arquivo                        |
| ------------------------- | ------ | ------------------------------ |
| Cálculo de pontos         | ✅     | quiz-logic-calculation.spec.ts |
| Estilo predominante       | ✅     | quiz-logic-calculation.spec.ts |
| Percentuais               | ✅     | quiz-logic-calculation.spec.ts |
| Arredondamento            | ✅     | quiz-logic-calculation.spec.ts |
| Desempate (clickOrder)    | ⚠️     | -                              |
| Fluxo completo E2E        | ✅     | quiz-estilo-pessoal.spec.ts    |
| Validação de nome         | ✅     | quiz-estilo-pessoal.spec.ts    |
| Seleção de 3 opções       | ✅     | quiz-estilo-pessoal.spec.ts    |
| Navegação (voltar)        | ✅     | quiz-estilo-pessoal.spec.ts    |
| Persistência localStorage | ✅     | quiz-estilo-pessoal.spec.ts    |
| Transições                | ✅     | quiz-estilo-pessoal.spec.ts    |
| Questões estratégicas     | ✅     | quiz-estilo-pessoal.spec.ts    |
| Página de resultado       | ✅     | quiz-estilo-pessoal.spec.ts    |

## 🐛 Cenários de Teste Específicos

### Teste 1: Perfil Natural Predominante

```typescript
// 10 questões, 3 seleções cada = 30 total
// Natural: 20 pontos (66.7%)
// Contemporâneo: 4 pontos (13.3%)
// Clássico: 3 pontos (10%)
// Outros: 3 pontos (10%)
```

### Teste 2: Perfil Equilibrado

```typescript
// Elegante: 14 pontos (46.7%)
// Clássico: 7 pontos (23.3%)
// Romântico: 7 pontos (23.3%)
// Outros: 2 pontos (6.7%)
```

### Teste 3: Casos Extremos

- ✅ Quiz vazio (0 respostas)
- ✅ Categorias inválidas/desconhecidas
- ✅ Apenas 1 questão respondida
- ✅ Todos estilos empatados

## 📝 Observações Importantes

### Configuração do Playwright

- **Timeout padrão:** 120 segundos
- **Timeout de navegação:** 60 segundos
- **Retry em CI:** 2 tentativas
- **Screenshots:** Apenas em falha
- **Vídeos:** Retidos em falha

### Seletores Flexíveis

Os testes usam seletores flexíveis para se adaptar a mudanças na UI:

```typescript
// Busca por texto ou atributos data-testid
page.locator('[data-testid*="option"], button[class*="option"]');
page.locator('button:has-text("Próxima"), button:has-text("Continuar")');
```

### Timeouts e Esperas

- Aguarda 500ms após cada seleção de opção
- Aguarda 1000ms após transições entre questões
- Aguarda 2000-3000ms em transições narrativas

## 🔄 Manutenção dos Testes

### Quando Atualizar:

1. **Mudança no número de questões** → Atualizar contadores
2. **Nova categoria de estilo** → Adicionar ao styleCounter
3. **Mudança na lógica de pontuação** → Revisar cálculos esperados
4. **Alteração no multiSelect** → Ajustar loops de seleção
5. **Nova validação de UI** → Adicionar teste específico

### Boas Práticas:

- ✅ Usar seletores semânticos quando possível
- ✅ Evitar timeouts fixos (preferir waitFor)
- ✅ Limpar localStorage antes de cada teste
- ✅ Testar em múltiplos navegadores
- ✅ Documentar cenários complexos

## 📚 Recursos Adicionais

- **Playwright Docs:** https://playwright.dev/
- **Configuração:** `playwright.config.ts`
- **Lógica Original:** `src/hooks/useQuizLogic.ts`
- **Dados do Quiz:** `src/data/quizFlowConfig.ts`

## ✅ Status Final

**Todos os testes criados e funcionando!**

- ✅ 3 suítes de testes de lógica
- ✅ 8 testes E2E completos
- ✅ Cobertura de casos extremos
- ✅ Validação de UI e UX
- ✅ Persistência de dados
- ✅ Cálculos matemáticos precisos

---

**Criado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 1.0.0
