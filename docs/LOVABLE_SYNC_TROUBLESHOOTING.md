# 🔧 Guia de Solução: Problemas de Sincronização do Lovable

## ✅ Status da Configuração

**DIAGNÓSTICO CONCLUÍDO**: Todas as configurações básicas estão corretas:
- ✅ Arquivo `.lovable` configurado com sincronização bidirecional
- ✅ Workflow GitHub Actions `lovable-deploy.yml` presente
- ✅ Arquivo `lovable.config.js` configurado
- ✅ Conexão com repositório GitHub ativa
- ✅ Sistema de cores do MorphingProgress corrigido para usar cores da marca

## 🚨 Principais Causas dos Problemas de Sincronização

### 1. **Token LOVABLE_TOKEN não configurado**
**Sintoma**: Workflow falha ou não executa
**Solução**:
```bash
# 1. Acesse o GitHub Repository Settings
https://github.com/vdp2025/quiz-sell-genius-66/settings/secrets/actions

# 2. Clique em "New repository secret"
# 3. Nome: LOVABLE_TOKEN
# 4. Valor: [Obter no Lovable Studio → Project Settings → API]
```

### 2. **Conexão não estabelecida no Lovable Studio**
**Sintoma**: Alterações no Lovable não aparecem no GitHub
**Solução**:
```
1. Acesse https://lovable.dev
2. Abra o projeto "Quiz Sell Genius"
3. Vá para Project Settings → GitHub
4. Conecte o repositório: vdp2025/quiz-sell-genius-66
5. Ative "Auto-sync from GitHub"
6. Ative "Auto-push to GitHub"
7. Defina branch principal como "main"
```

### 3. **Webhook não configurado**
**Sintoma**: GitHub não notifica o Lovable sobre mudanças
**Solução**:
```
1. No GitHub, vá para Settings → Webhooks
2. Adicione webhook do Lovable se não existir
3. URL: https://api.lovable.dev/webhooks/github
4. Content type: application/json
5. Eventos: Push, Pull requests
```

## 🔍 Comandos de Diagnóstico

### Verificar status completo:
```bash
./diagnose-lovable.sh
```

### Testar sincronização GitHub → Lovable:
```bash
echo "Teste sync $(date)" > sync-test.md
git add sync-test.md
git commit -m "Test: Sincronização GitHub para Lovable"
git push origin main
```

### Verificar workflow no GitHub Actions:
```bash
# Acesse: https://github.com/vdp2025/quiz-sell-genius-66/actions
# Verifique se o workflow "Lovable Deployment" executa após push
```

## 🎯 Teste de Sincronização Bidirecional

### 1. **Teste Lovable → GitHub**:
1. Abra o Lovable Studio
2. Faça uma pequena alteração visual
3. Clique em "Publish" ou "Save"
4. Verifique se aparece novo commit no GitHub

### 2. **Teste GitHub → Lovable**:
1. Faça alteração no código via VS Code
2. Commit e push para GitHub
3. Verifique se mudança aparece no Lovable Studio

## 🚀 Scripts de Correção Rápida

### Executar preparação completa:
```bash
npm run lovable:prepare
```

### Forçar sincronização:
```bash
git push origin main --force-with-lease
```

## 📞 Suporte e Troubleshooting

### Se o problema persistir:

1. **Verificar logs do GitHub Actions**:
   - Acesse Actions tab no GitHub
   - Verifique erros no workflow lovable-deploy

2. **Verificar permissões**:
   - Token deve ter escopo: `repo`, `workflow`
   - App Lovable deve ter acesso ao repositório

3. **Resetar configuração**:
   ```bash
   ./configure-lovable-github.sh [SEU_TOKEN_LOVABLE]
   ```

## 🎉 Indicadores de Sucesso

✅ **Sincronização funcionando quando**:
- Alterações no Lovable geram commits automáticos
- Push no GitHub aparece no Lovable Studio
- Workflow GitHub Actions executa sem erros
- Builds são deployadas automaticamente

---

**Última atualização**: Após correção das cores do MorphingProgress e configuração completa do sistema Lovable.
