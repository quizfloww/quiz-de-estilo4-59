# Diagnóstico: Imagens não renderizam nas questões 4-9 do Editor de Funis

## Problema Relatado

As imagens das opções das questões 4-9 não aparecem no editor de funis (`/admin/funnels/:id/edit`).

## Fluxo de Dados Analisado

```
1. useFunnelStagesWithOptions (hook)
   └─ Busca stage_options do Supabase
   └─ Converte image_url para imageUrl (camelCase)
   └─ Retorna stages com config.options preenchido

2. FunnelEditorPage
   └─ Recebe stages via useFunnelStagesWithOptions
   └─ Chama convertStageToBlocks(stage, ...)
   └─ Passa para OptionsBlock

3. convertStageToBlocks (stageToBlocks.ts)
   └─ Lê config.options
   └─ Verifica hasImages = options.some(o => o.imageUrl || o.image_url)
   └─ Define displayType = config.displayType || (hasImages ? "both" : "text")
   └─ Cria bloco type: "options" com as opções

4. OptionsBlock.tsx
   └─ Recebe content.options e content.displayType
   └─ Converte: imageUrl = opt.imageUrl || opt.image_url
   └─ Passa para QuizOption

5. QuizOption.tsx
   └─ const imageUrl = option.imageUrl || option.image_url
   └─ const showImage = displayType !== "text" && imageUrl
   └─ Se showImage: renderiza <img src={imageUrl}>
```

## Possíveis Causas

### A) `image_url` está NULL no banco (`stage_options`)

**Verificação:**

```sql
SELECT stage_id, text, image_url
FROM stage_options
WHERE stage_id IN (
  SELECT id FROM funnel_stages
  WHERE funnel_id = 'SEU_FUNNEL_ID'
  AND type IN ('question', 'strategic')
  ORDER BY order_index
  OFFSET 3 LIMIT 6
)
ORDER BY stage_id, order_index;
```

Se `image_url` estiver NULL → o problema está na sincronização ou inserção dos dados.

### B) `displayType` está como "text" no config

**Verificação:**

```sql
SELECT order_index, title, config->>'displayType' as display_type
FROM funnel_stages
WHERE funnel_id = 'SEU_FUNNEL_ID'
AND type IN ('question', 'strategic')
ORDER BY order_index;
```

Se `displayType = 'text'` → as imagens não serão exibidas **por design**.

### C) `config.options` não tem `imageUrl`

O fallback usa `config.options[].imageUrl` se `stage_options.image_url` estiver vazio.
Se ambos estiverem vazios, não há imagem para exibir.

## Como Diagnosticar no Navegador

1. Abra o Editor de Funis no navegador
2. Abra DevTools (F12) > Network
3. Filtre por "stage_options" ou "funnel_stages"
4. Verifique as respostas:
   - `stage_options`: verifique se `image_url` está preenchido
   - `funnel_stages`: verifique se `config.displayType` e `config.options[].imageUrl`

### Script de Diagnóstico (cole no Console)

```javascript
// Veja o arquivo: scripts/diagnose-editor-images.js
```

## Soluções

### Se `image_url` está NULL no banco:

1. No editor, selecione o bloco de opções
2. No painel de propriedades, adicione imagens a cada opção
3. Salve o funil (Ctrl+S)

### Se `displayType` está como "text":

1. No editor, selecione o bloco de opções
2. No painel de propriedades, altere "Tipo de exibição" para "Imagem" ou "Imagem e Texto"
3. Salve o funil

### Se o problema persiste após adicionar imagens:

Pode haver um bug na sincronização. Verifique:

- `src/utils/syncBlocksToDatabase.ts` - função `extractOptionsFromBlock`
- `src/utils/stageToBlocks.ts` - função `convertStageToBlocks`

## Arquivos Relevantes

| Arquivo                                                | Função                                   |
| ------------------------------------------------------ | ---------------------------------------- |
| `src/hooks/useFunnelStages.ts`                         | Busca stages e options do Supabase       |
| `src/utils/stageToBlocks.ts`                           | Converte stage config para blocos canvas |
| `src/utils/syncBlocksToDatabase.ts`                    | Sincroniza blocos para o banco           |
| `src/components/canvas-editor/blocks/OptionsBlock.tsx` | Renderiza opções no editor               |
| `src/components/shared/QuizOption.tsx`                 | Componente de opção com imagem           |

## Testes Criados

- `tests/e2e/editor-options-images.spec.ts` - Diagnóstico com dados mockados
- `tests/e2e/editor-images-visual.spec.ts` - Verificação visual
- `scripts/diagnose-editor-images.js` - Script para console do navegador
