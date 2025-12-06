#!/bin/bash

echo "🔍 TESTE DE CONECTIVIDADE FTP HOSTINGER"
echo "========================================="

# Configurações
FTP_SERVER1="files.000webhost.com"
FTP_SERVER2="185.158.133.1"
FTP_USER="u116045488"
FTP_PORT="21"

echo "1. Testando resolução DNS..."
echo "   - Servidor 1: $FTP_SERVER1"
dig +short $FTP_SERVER1 2>/dev/null || echo "   ❌ DNS não resolve"

echo "   - Servidor 2: $FTP_SERVER2"
dig +short $FTP_SERVER2 2>/dev/null || echo "   ❌ DNS não resolve"

echo -e "\n2. Testando conectividade na porta 21..."
echo "   - Testando $FTP_SERVER1:21"
timeout 10s bash -c "echo 'QUIT' | telnet $FTP_SERVER1 21" 2>/dev/null | head -3 || echo "   ❌ Não conectou"

echo "   - Testando $FTP_SERVER2:21"
timeout 10s bash -c "echo 'QUIT' | telnet $FTP_SERVER2 21" 2>/dev/null | head -3 || echo "   ❌ Não conectou"

echo -e "\n3. Testando conectividade SFTP (porta 22)..."
echo "   - Testando SFTP em $FTP_SERVER2:22"
timeout 10s ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $FTP_USER@$FTP_SERVER2 exit 2>/dev/null && echo "   ✅ SFTP conectou!" || echo "   ❌ SFTP não conectou"

echo -e "\n4. Informações do sistema:"
echo "   - IP externo: $(curl -s ifconfig.me || echo 'não detectado')"
echo "   - Data/hora: $(date)"

echo -e "\n📋 RECOMENDAÇÕES:"
echo "   • Se FTP falhar, usar SFTP"
echo "   • Verificar se senha FTP está no GitHub Secrets"
echo "   • Testar com Filezilla localmente primeiro"
echo "   • Contatar suporte Hostinger se nada funcionar"

echo -e "\n✅ Teste concluído!"
