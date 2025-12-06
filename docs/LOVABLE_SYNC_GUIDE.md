# Configuração e Solução de Problemas do Lovable

## 📋 Resumo da Configuração

O sistema Lovable foi configurado com múltiplas soluções para garantir sincronização confiável:

### ✅ Arquivos Configurados

1. **`.lovable`** - Arquivo principal de configuração
2. **`.lovable-trigger`** - Trigger de sincronização forçada
3. **`reativar-lovable.sh`** - Script completo de reativação
4. **`scripts/manual-sync.js`** - Sincronização manual
5. **`scripts/test-sync.js`** - Teste de conectividade
6. **`.github/workflows/lovable-auto-sync.yml`** - Sincronização automática

### 🚀 Como Usar

#### Reativação Completa

```bash
./reativar-lovable.sh
```

#### Sincronização Manual

```bash
node scripts/manual-sync.js
```

#### Via VS Code Tasks

- `Ctrl+Shift+P` → "Tasks: Run Task"
- Selecione "Reativar Lovable Sync" ou "Lovable: Sync Manual"

### 🔧 Solução de Problemas

#### 1. Lovable não está sincronizando

**Solução:**

```bash
# Execute o script de reativação
./reativar-lovable.sh

# Ou use a tarefa do VS Code
# Ctrl+Shift+P → Tasks: Run Task → Reativar Lovable Sync
```

#### 2. Verificar se token está configurado

**No GitHub:**

1. Acesse: https://github.com/vdp2025/quiz-sell-genius-66/settings/secrets/actions
2. Verifique se existe `LOVABLE_TOKEN`

#### 3. Verificar configurações no Lovable Studio

1. Acesse: https://lovable.dev
2. Abra o projeto "Quiz Sell Genius"
3. Vá para Project Settings → GitHub
4. Verifique se auto-sync está ativado

#### 4. Testar conectividade

```bash
node scripts/test-sync.js
```

### 📊 Monitoramento

#### Verificar última sincronização

```bash
cat .lovable | grep lastUpdate
cat .lovable-trigger
```

#### Verificar logs do GitHub Actions

1. Acesse: https://github.com/vdp2025/quiz-sell-genius-66/actions
2. Verifique workflows:
   - "Sincronização Lovable Automática"
   - "Implantação Lovable Corrigida"

### 🔄 Fluxo de Sincronização

1. **Automático (GitHub Actions)**: A cada 6 horas
2. **Manual**: Execute `./reativar-lovable.sh`
3. **Via VS Code**: Use as tarefas configuradas
4. **Forçado**: O sistema atualiza timestamps automaticamente

### 📝 Timestamps Importantes

- **`.lovable-trigger`**: Timestamp de sincronização forçada
- **`.lovable` → `sync.timestamp`**: Timestamp da configuração
- **`.lovable` → `lastUpdate`**: Data/hora da última atualização

### 🐛 Debug

Se ainda houver problemas:

1. **Verifique conectividade:**

   ```bash
   curl -s --head https://lovable.dev
   curl -s --head https://api.lovable.dev
   ```

2. **Verifique status do git:**

   ```bash
   git status
   git log --oneline -5
   ```

3. **Execute diagnóstico completo:**
   ```bash
   ./diagnose-lovable.sh
   ```

### ⚡ Próximos Passos Recomendados

1. ✅ Execute `./reativar-lovable.sh` agora
2. ✅ Verifique token no GitHub
3. ✅ Configure webhook no Lovable (se disponível)
4. ✅ Teste fazendo uma pequena alteração no Lovable Studio
5. ✅ Monitore se novos commits aparecem no GitHub

---

**Data da configuração:** $(date)
**Status:** Configuração completa implementada
