# Guia de Acesso ao Lovable.dev

Este guia explica como acessar e usar o ambiente Lovable.dev para o Quiz Sell Genius, especialmente para acessar as rotas do painel administrativo e ferramentas de edição.

## O que é o Lovable.dev?

Lovable.dev é uma plataforma de desenvolvimento visual que permite editar componentes React de maneira interativa. Foi integrada ao projeto Quiz Sell Genius para facilitar o desenvolvimento e customização de componentes.

## Como Acessar

Existem duas maneiras principais de acessar o ambiente Lovable.dev:

### 1. URL Direto

Acesse diretamente pela URL:
```
https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com
```

### 2. Usando Bookmarklets

Para facilitar o acesso, foram criados bookmarklets que você pode adicionar à barra de favoritos do seu navegador:

- **Acesso Admin (Lovable.dev)**:
  ```javascript
  javascript:(function(){const isInLovable=window.location.hostname.includes('lovableproject.com')||window.location.hostname.includes('lovable.dev');if(isInLovable){window.location.href=window.location.origin+'/admin';return;}const lovableUrl='https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/admin';window.open(lovableUrl,'_blank');})()
  ```

- **Acesso Editor Visual (Lovable.dev)**:
  ```javascript
  javascript:(function(){const isInLovable=window.location.hostname.includes('lovableproject.com')||window.location.hostname.includes('lovable.dev');if(isInLovable){window.location.href=window.location.origin+'/resultado/editor';return;}const lovableUrl='https://a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com/resultado/editor';window.open(lovableUrl,'_blank');})()
  ```

Para instalar os bookmarklets:
1. Abra o arquivo `acesso-lovable-dev.html` no seu navegador
2. Arraste os botões para sua barra de favoritos
3. Clique no favorito quando quiser acessar o ambiente Lovable.dev

## Rotas Disponíveis no Lovable.dev

O ambiente Lovable.dev foi configurado para ter acesso às seguintes rotas:

- `/admin` - Painel administrativo principal
- `/admin/editor` - Editor unificado
- `/admin/settings` - Configurações
- `/admin/analytics` - Analytics
- `/admin/ab-test` - Gerenciador de Testes A/B
- `/admin/ab-test-manager` - Interface completa de Testes A/B
- `/admin/prototipo` - Visualizar protótipo no painel admin
- `/resultado` - Visualizar página de resultado
- `/resultado/editor` - Editor visual aprimorado
- `/quiz` - Interface do quiz
- `/prototipo` - Página de protótipo

## Detectando o Ambiente Lovable.dev

O aplicativo foi configurado para detectar automaticamente quando está sendo executado no ambiente Lovable.dev e carregar as rotas apropriadas. A detecção é baseada nos seguintes critérios:

```javascript
const isRunningInLovable = () => {
  return typeof window !== 'undefined' && (
    window.location.hostname.includes('lovableproject.com') || 
    window.location.hostname.includes('lovable.dev') ||
    window.location.search.includes('lovable=true')
  );
};
```

Isso significa que você também pode forçar o modo Lovable.dev localmente adicionando `?lovable=true` a qualquer URL enquanto desenvolve em ambiente local.

## Configuração do Lovable.dev

O ambiente Lovable.dev está configurado através dos seguintes arquivos:

1. `lovable.config.js` - Configuração principal do projeto Lovable
2. `lovable.ts` - Interface de definição de componentes Lovable
3. `src/lovable-routes.tsx` - Configuração de rotas específicas para o ambiente Lovable.dev
4. `src/App.tsx` - Lógica de detecção do ambiente Lovable.dev e carregamento das rotas apropriadas

Esta configuração permite acessar o painel admin do Quiz Sell Genius diretamente pelo ambiente Lovable.dev, facilitando o desenvolvimento e testes.

## Observações Importantes

- O ambiente Lovable.dev é destinado apenas para desenvolvimento e teste, não para produção
- Qualquer alteração feita através do Lovable.dev não será automaticamente publicada em produção
- Para publicar mudanças feitas no ambiente Lovable.dev, você precisará seguir os procedimentos normais de deploy
