#!/bin/bash

echo "🔄 Reativando Sincronização Lovable"
echo "===================================="

# 1. Atualizar timestamp no arquivo .lovable-trigger
echo "📅 Atualizando timestamp de sincronização..."
CURRENT_TIMESTAMP=$(date +%s)
echo "LOVABLE_FORCE_SYNC=$CURRENT_TIMESTAMP" > .lovable-trigger

# 2. Atualizar configuração .lovable
echo "⚙️ Atualizando configuração .lovable..."
cat > .lovable << EOF
{
  "github": {
    "autoSyncFromGithub": true,
    "autoPushToGithub": true,
    "branch": "main"
  },
  "projectName": "Quiz Sell Genius",
  "projectId": "quiz-sell-genius-66",
  "version": "2.1.$CURRENT_TIMESTAMP",
  "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "features": {
    "componentTagger": true,
    "liveEditing": true,
    "enhancedSync": true,
    "visualEditor": true,
    "forceSync": true,
    "webhookAlternative": true
  },
  "editor": {
    "enableLiveMode": true,
    "autoSave": true,
    "componentHighlighting": true
  },
  "sync": {
    "forced": true,
    "timestamp": $CURRENT_TIMESTAMP,
    "method": "webhook-alternative",
    "tokenRequired": false
  },
  "scripts": {
    "prepare": "node scripts/prepare-lovable.js",
    "sync": "node scripts/manual-sync.js",
    "test": "node scripts/test-sync.js"
  }
}
EOF

# 3. Verificar se o diretório scripts existe
echo "📁 Verificando diretório scripts..."
if [ ! -d "scripts" ]; then
    mkdir -p scripts
    echo "✅ Diretório scripts criado"
fi

# 4. Criar script de sincronização manual
echo "🔧 Criando script de sincronização manual..."
cat > scripts/manual-sync.js << 'EOF'
const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando sincronização manual do Lovable...');

// Atualizar timestamp
const timestamp = Math.floor(Date.now() / 1000);
const triggerContent = `LOVABLE_FORCE_SYNC=${timestamp}`;

fs.writeFileSync('.lovable-trigger', triggerContent);
console.log('✅ Timestamp atualizado:', timestamp);

// Verificar configuração
if (fs.existsSync('.lovable')) {
    const config = JSON.parse(fs.readFileSync('.lovable', 'utf8'));
    config.sync.timestamp = timestamp;
    config.lastUpdate = new Date().toISOString();
    
    fs.writeFileSync('.lovable', JSON.stringify(config, null, 2));
    console.log('✅ Configuração .lovable atualizada');
}

console.log('🎉 Sincronização manual concluída!');
EOF

# 5. Criar script de teste de sincronização
echo "🧪 Criando script de teste..."
cat > scripts/test-sync.js << 'EOF'
const https = require('https');

console.log('🧪 Testando conexão com Lovable...');

// Testar conexão com api.lovable.dev
const testConnection = (hostname) => {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: hostname,
            port: 443,
            path: '/',
            method: 'HEAD'
        }, (res) => {
            console.log(`✅ ${hostname}: ${res.statusCode}`);
            resolve(res.statusCode);
        });
        
        req.on('error', (error) => {
            console.log(`❌ ${hostname}: ${error.message}`);
            reject(error);
        });
        
        req.setTimeout(5000, () => {
            console.log(`⏰ ${hostname}: Timeout`);
            req.destroy();
            reject(new Error('Timeout'));
        });
        
        req.end();
    });
};

Promise.all([
    testConnection('lovable.dev').catch(() => null),
    testConnection('api.lovable.dev').catch(() => null)
]).then(() => {
    console.log('🎉 Teste de conectividade concluído!');
});
EOF

# 6. Fazer os scripts executáveis
chmod +x scripts/manual-sync.js
chmod +x scripts/test-sync.js

# 7. Executar sincronização manual
echo "🚀 Executando sincronização manual..."
node scripts/manual-sync.js

# 8. Testar conectividade
echo "🌐 Testando conectividade..."
node scripts/test-sync.js

# 9. Verificar status do git
echo "📊 Status do repositório:"
git status --porcelain

echo ""
echo "✅ Reativação do Lovable concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Verifique se o token LOVABLE_TOKEN está configurado no GitHub"
echo "2. Acesse https://lovable.dev e verifique as configurações do projeto"
echo "3. Teste fazendo uma pequena alteração no Lovable Studio"
echo "4. Execute 'git log --oneline -5' para ver se novos commits aparecem"