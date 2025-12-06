# Como usar o Dashboard de Analytics de Criativos

## Acessando o Dashboard

O Dashboard de Analytics de Criativos pode ser acessado diretamente através da URL:
```
/admin/creative-analytics
```

## Instruções para Rastreamento de Criativos

Para utilizar efetivamente o dashboard de analytics de criativos, você precisa incluir o parâmetro `utm_content` nas URLs dos seus anúncios e campanhas.

### Estrutura recomendada para URLs:

```
https://seusite.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=quiz_style&utm_content=NOME_DO_CRIATIVO
```

### Exemplos de valores para `utm_content`:

1. **Formato + Público + Característica**:
   - `video_mulheres_25_35_depoimento`
   - `imagem_homens_40_50_desconto`
   - `carrossel_jovens_antes_depois`

2. **Tema + Estilo + Variação**:
   - `elegante_mulher_vestido`
   - `casual_jovem_jeans`
   - `profissional_executiva`

3. **Para testes A/B**:
   - `headline_v1`
   - `headline_v2`
   - `oferta_padrao`
   - `oferta_urgencia`

## Como os Dados são Rastreados

Quando um visitante chega ao site através de um link com `utm_content`, o sistema:

1. Captura o valor do parâmetro `utm_content`
2. Associa todas as ações subsequentes desse usuário ao criativo (visualizações, início do quiz, etc)
3. Calcula métricas de desempenho para cada criativo

## Gerando Dados de Teste

Se você deseja ver como o dashboard funciona sem dados reais:

1. Acesse o Dashboard de Analytics de Criativos
2. Clique no botão "Gerar Dados de Teste"
3. O sistema criará dados fictícios para três criativos diferentes
4. O dashboard será atualizado automaticamente

## Exportando Dados

Para análises mais detalhadas ou para compartilhar com a equipe de marketing:

1. Clique no botão "Exportar" no topo do dashboard
2. Um arquivo JSON será baixado com todos os dados de analytics
3. Este arquivo pode ser importado em ferramentas externas de análise

## Limpando Dados

Se precisar limpar os dados para um novo período de análise:

1. Clique no botão "Limpar Dados"
2. Confirme a ação na janela de diálogo
3. Todos os dados de analytics serão removidos do armazenamento local do navegador

---

*Documento criado em: 31/05/2025*
