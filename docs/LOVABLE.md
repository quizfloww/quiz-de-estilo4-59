# Integrações com Lovable

Este documento contém informações sobre como utilizar o Lovable para atualizar o projeto remotamente.

## O que é o Lovable?

O Lovable é uma plataforma visual para desenvolvedores React, que permite editar componentes através de uma interface amigável. Com ele, você pode fazer alterações no site sem precisar mexer diretamente no código.

## Como atualizar o projeto remotamente

### 1. Acessando o Lovable Studio

1. Acesse o [Lovable Studio](https://www.lovable.dev)
2. Faça login com sua conta
3. Selecione o projeto "Quiz Sell Genius"

### 2. Editando componentes

No Lovable Studio, você pode:
- Editar componentes existentes
- Modificar textos, cores e imagens
- Visualizar as alterações em tempo real

### 3. Publicando as alterações

Quando estiver satisfeito com as alterações:
1. Clique em "Publish" no Lovable Studio
2. O Lovable fará push das mudanças para o repositório GitHub automaticamente
3. O workflow de GitHub Actions será acionado e fará o deploy das alterações para o servidor

## Componentes Lovable disponíveis

Os seguintes componentes podem ser editados através do Lovable:

- **QuizCover**: Página de capa do quiz
- **QuizQuestion**: Componente de pergunta do quiz
- **QuizLogic**: Lógica do funcionamento do quiz
- **ResultPageEditor**: Editor da página de resultados

## Boas práticas

- Faça um backup antes de realizar alterações significativas
- Teste as alterações no ambiente de desenvolvimento antes de publicar
- Use o sistema de controle de versão para acompanhar as mudanças

## Solução de problemas

Se você encontrar problemas com a publicação:
1. Verifique se o token de acesso do GitHub está válido
2. Confirme se o workflow do GitHub Actions está configurado corretamente
3. Verifique os logs de erro no GitHub Actions