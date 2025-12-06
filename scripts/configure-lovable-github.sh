#!/bin/bash

# Cores para saída no terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar mensagens formatadas
show_message() {
  echo -e "${BLUE}[Configuração Lovable]${NC} $1"
}

show_success() {
  echo -e "${GREEN}[✓] $1${NC}"
}

show_warning() {
  echo -e "${YELLOW}[!] $1${NC}"
}

# Verifica se o token foi fornecido
if [ -z "$1" ]; then
  show_warning "Uso: ./configure-lovable-github.sh <LOVABLE_API_TOKEN>"
  exit 1
fi

TOKEN=$1

# ID do projeto Lovable (extraído do nome da pasta do workspace)
PROJECT_ID=$(basename "$(pwd)")
show_message "Configurando projeto: $PROJECT_ID"

# API endpoint do Lovable
API_BASE_URL="https://api.lovable.dev/api"

# Configurar integração GitHub
show_message "Configurando integração GitHub..."

# Dados para atualizar as configurações do GitHub
JSON_DATA=$(cat <<EOF
{
  "settings": {
    "github": {
      "autoSyncFromGithub": true,
      "autoPushToGithub": true,
      "branch": "main"
    }
  }
}
EOF
)

# Chamada à API para atualizar as configurações
RESPONSE=$(curl -s -X PATCH "$API_BASE_URL/projects/$PROJECT_ID/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_DATA")

# Verificar se a chamada à API foi bem-sucedida
if [[ $RESPONSE == *"\"success\":true"* ]]; then
  show_success "Configuração GitHub atualizada com sucesso!"
  echo -e "\nConfigurações atualizadas:"
  echo "- Auto-sync from GitHub: ${GREEN}Ativado${NC}"
  echo "- Auto-push to GitHub: ${GREEN}Ativado${NC}"
  echo "- Branch principal: ${GREEN}main${NC}"
else
  show_warning "Falha ao atualizar as configurações. Resposta da API:"
  echo "$RESPONSE"
  echo -e "\nVerifique se o token é válido e tem permissões suficientes."
fi

# Atualizar o arquivo .lovable local
echo -e "\nAtualizando arquivo de configuração local..."
if [ -f ".lovable" ]; then
  # Substitui ou adiciona configurações do GitHub
  LOVABLE_CONTENT=$(cat .lovable)
  
  # Se já tiver configuração do GitHub, atualiza, senão adiciona
  if [[ $LOVABLE_CONTENT == *"\"github\":"* ]]; then
    # Substituir o objeto github existente
    NEW_CONTENT=$(echo "$LOVABLE_CONTENT" | jq '.github = {"autoSyncFromGithub":true,"autoPushToGithub":true,"branch":"main"}')
  else
    # Adicionar novo objeto github
    NEW_CONTENT=$(echo "$LOVABLE_CONTENT" | jq '. + {"github":{"autoSyncFromGithub":true,"autoPushToGithub":true,"branch":"main"}}')
  fi
  
  echo "$NEW_CONTENT" > .lovable
  show_success "Arquivo .lovable atualizado!"
else
  # Cria o arquivo .lovable do zero
  cat > .lovable <<EOF
{
  "github": {
    "autoSyncFromGithub": true,
    "autoPushToGithub": true,
    "branch": "main"
  },
  "projectName": "Quiz Sell Genius",
  "projectId": "$PROJECT_ID",
  "version": "1.0.0"
}
EOF
  show_success "Arquivo .lovable criado!"
fi

show_message "Configuração completa! Sincronização bidirecional com GitHub configurada."
echo -e "\nPróximos passos:"
echo "1. Verifique no Lovable Studio se as configurações foram aplicadas"
echo "2. Configure o token LOVABLE_TOKEN no GitHub como secret de Actions"
echo "3. Teste a integração fazendo alterações nos dois sistemas"
