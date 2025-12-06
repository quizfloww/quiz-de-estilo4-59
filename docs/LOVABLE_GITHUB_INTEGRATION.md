# Configuração de Integração Lovable com GitHub

## Configuração Completa Implementada

- ✅ Webhook configurado para atualizações em tempo real
- ✅ Workflow de GitHub Actions configurado para deploy
- ✅ Integração bidirecional configurada
- ✅ Estrutura de projeto Lovable inicializada

## Próximos Passos

### 1. Configurar Secrets no GitHub

Para que o workflow funcione corretamente, você precisa adicionar o seguinte secret no GitHub:

1. Acesse o repositório no GitHub
2. Vá para Settings → Secrets and variables → Actions
3. Clique em "New repository secret"
4. Adicione o secret:
   - Nome: `LOVABLE_TOKEN`
   - Valor: [Obtenha este token no Lovable Studio em Project Settings → API]

### 2. Verificar Conexão no Lovable Studio

1. Acesse o Lovable Studio
2. Abra seu projeto "Quiz Sell Genius"
3. Vá para Project Settings → GitHub
4. Verifique se:
   - "Auto-sync from GitHub" está ativado
   - "Auto-push to GitHub" está ativado
   - A branch principal está definida como "main"

### 3. Teste da Integração

Para testar se a integração está funcionando:

1. Faça uma pequena alteração no editor Lovable
2. Verifique se um commit é criado automaticamente no GitHub
3. Faça uma pequena alteração no código e dê push para o GitHub
4. Verifique se as alterações aparecem no Lovable Studio

## Suporte

Se encontrar algum problema, verifique:
- Permissões do GitHub App do Lovable
- Configuração correta dos webhooks
- Status do token API do Lovable
