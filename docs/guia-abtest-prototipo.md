# Guia de Acesso a Testes A/B e Protótipos - Quiz Sell Genius

Este documento fornece instruções detalhadas sobre como acessar e utilizar os recursos de testes A/B e protótipos no Quiz Sell Genius.

## Métodos de Acesso

Existem várias maneiras de acessar os recursos com privilégios administrativos:

### 1. Usando a Ferramenta HTML

A maneira mais fácil é abrir o arquivo `ferramenta-abtest-prototipo.html` no seu navegador. Esta ferramenta oferece uma interface amigável para:

- Acessar todas as páginas relevantes
- Configurar testes A/B
- Gerenciar seu acesso administrativo
- Criar bookmarklets para acesso rápido

### 2. Usando Bookmarklets

Você pode arrastar os bookmarklets da ferramenta HTML para sua barra de favoritos, ou criar manualmente com estes códigos:

**Acesso Multi-Páginas:**
```javascript
javascript:(function(){const d=prompt(`Selecione o destino:\n1. Editor de Resultado\n2. Gerenciador A/B\n3. Protótipo\n4. Admin A/B\n5. Editor Unificado`);localStorage.setItem('userRole','admin');localStorage.setItem('userName','Admin');let u='/';if(d==='1')u='/resultado/editor';else if(d==='2')u='/admin/ab-test-manager';else if(d==='3')u='/resultado-prototipo';else if(d==='4')u='/admin/ab-test';else if(d==='5')u='/admin/editor';window.location.href=u;})();
```

**Acesso Admin Rápido:**
```javascript
javascript:(function(){localStorage.setItem('userRole','admin');localStorage.setItem('userName','Admin');alert('✅ Acesso admin configurado!');})();
```

**Acesso Direto à Página de Testes A/B:**
```javascript
javascript:(function(){localStorage.setItem('userRole','admin');localStorage.setItem('userName','Admin');localStorage.setItem('adminTimestamp',Date.now().toString());if(!localStorage.getItem('ab_tests')){localStorage.setItem('ab_tests',JSON.stringify([{id:`test_${Date.now()}`,name:'Teste A/B da Página de Resultados',type:'result',isActive:true,startDate:new Date().toISOString(),variations:[{id:`var_${Date.now()}_a`,name:'Variação A (Original)',trafficPercentage:50,content:{}},{id:`var_${Date.now()}_b`,name:'Variação B',trafficPercentage:50,content:{}}]}]));}window.location.href='/admin/ab-test-manager';})();
```

### 3. Usando o Console do Navegador

Você pode copiar e colar o conteúdo de qualquer um destes arquivos no console do navegador:

- `acesso-abtest-prototipo.js` - Exibe um menu para escolher para qual página navegar
- `acesso-abtest-console.js` - Configura um teste A/B padrão e navega diretamente para o gerenciador
- `acesso-rapido.js` - Concede acesso admin e navega para o editor de resultados

## URLs Importantes

Depois de configurar seu acesso admin, você pode acessar estas URLs:

1. `/resultado/editor` - Editor de Página de Resultados
2. `/admin/ab-test-manager` - Gerenciador de Testes A/B
3. `/resultado-prototipo` - Página de Protótipo
4. `/admin/ab-test` - Página administrativa de Testes A/B
5. `/admin/editor` - Editor Unificado (Quiz, Resultados e Vendas)

## Gerenciamento de Testes A/B

### Fluxo de Trabalho Recomendado

1. Acesse o **Gerenciador de Testes A/B** (`/admin/ab-test-manager`) para criar ou gerenciar testes
2. Configure as variações do teste e suas porcentagens de tráfego
3. Ative o teste quando estiver pronto para iniciar
4. Use o **Editor de Página de Resultados** para personalizar o conteúdo de cada variação
5. Visualize os resultados e métricas no gerenciador

### Exemplo de Criação de Teste A/B

1. Acesse o gerenciador de testes A/B
2. Clique em "Novo Teste"
3. Configure o tipo como "result" para página de resultados
4. Adicione ao menos duas variações
5. Defina as porcentagens de tráfego (totalizando 100%)
6. Salve e ative o teste

### Dados de Teste

Os dados dos testes A/B são armazenados no localStorage com a chave `ab_tests`. O formato é:

```javascript
[
  {
    id: "test_123456789",
    name: "Teste A/B da Página de Resultados",
    type: "result",  // ou "sales" para página de vendas
    isActive: true,
    startDate: "2023-05-15T00:00:00.000Z",
    variations: [
      {
        id: "var_123_a",
        name: "Variação A (Original)",
        trafficPercentage: 50,
        content: {} // conteúdo específico da variação
      },
      {
        id: "var_123_b",
        name: "Variação B",
        trafficPercentage: 50,
        content: {} 
      }
    ]
  }
]
```

## Acesso ao Protótipo

O protótipo da página de resultados está disponível em `/resultado-prototipo`. Esta é uma versão sem o acesso direto ao editor visual, mas com recursos adicionais para testes.

Você pode alternar entre as versões A/B no protótipo usando o hook `useABTest`, que automaticamente determina qual variação exibir com base nas configurações de teste existentes.

## Solução de Problemas

Se encontrar dificuldades para acessar qualquer recurso:

1. Verifique se o `userRole` está configurado como "admin" no localStorage
2. Limpe o cache do navegador e tente novamente
3. Utilize a ferramenta de diagnóstico para verificar seu status de acesso
4. Se tiver problemas com os testes A/B, tente limpar e recriar os dados no localStorage

Para qualquer problema persistente, limpe completamente o localStorage e use a ferramenta HTML para reconfigurar tudo.
