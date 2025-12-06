# Sistema de Import/Export JSON - Funil Completo

## Como funciona

### 1. **Exportação (Download ícone)**

Ao clicar no botão de **Download** no header do editor, o sistema exporta:

```json
{
  "name": "Nome do Funil",
  "slug": "nome-do-funil",
  "globalConfig": {
    "logoUrl": "...",
    "primaryColor": "#...",
    "branding": {...}
  },
  "stages": [
    {
      "id": "stage-uuid",
      "type": "intro",
      "title": "Introdução",
      "order_index": 0,
      "is_enabled": true,
      "config": {
        "subtitle": "...",
        "imageUrl": "...",
        // Todos os campos do config
      },
      "blocks": [
        {
          "id": "block-uuid",
          "type": "header",
          "order": 0,
          "content": {
            "logoUrl": "...",
            "showLogo": true
          }
        },
        // Todos os blocos da stage
      ]
    }
  ],
  "exportDate": "2025-12-06T...",
  "version": "1.0"
}
```

### 2. **Importação (Upload ícone)**

Quando você importa um JSON:

#### Fluxo de processamento:

1. **Validação**: Verifica se o JSON tem estrutura válida
2. **Metadata do funil**: Atualiza `name` e `globalConfig` se presentes
3. **Para cada stage no JSON**:

   a) **Encontra stage correspondente** por `order_index`

   b) **Se stage JÁ EXISTE no funil**:

   - **Atualiza**: `title`, `type`, `config`, `is_enabled`
   - Preserva o `id` da stage existente

   c) **Se stage NÃO EXISTE** (JSON tem mais stages):

   - **Cria nova stage** automaticamente
   - Útil para adicionar etapas via JSON

   d) **Processa blocos** (super flexível):

   - **Se JSON tem `blocks`**: Usa blocos do JSON ✅
   - **Se JSON só tem `config`**: Converte config → blocos ✅
   - **Se JSON não tem nem um nem outro**: Stage vazia (adiciona blocos depois) ✅

   e) **Salva no Supabase**: `saveStageBocks()` persiste tudo

4. **Stages não processadas**:

   - Stages que existem no funil mas NÃO estão no JSON são **mantidas**
   - Não remove automaticamente (por segurança)

5. **Atualiza estado local**:
   - `stageBlocks` ← blocos importados/convertidos
   - `localStages` ← stages atualizadas + novas
   - `initialStageBlocks` ← snapshot para detectar mudanças

### 3. **Consumo dos blocos**

Quando você clica em uma stage após importar:

```typescript
// Este useEffect verifica:
if (stage && !stageBlocks[activeStageId]) {
  // Só converte se NÃO existirem blocos
  const blocks = convertStageToBlocks(stage, ...);
  setStageBlocks(...);
}
```

**Resultado**:

- ✅ Blocos importados são **preservados**
- ✅ Só reconverte do config se blocos não existirem
- ✅ Você pode editar e salvar normalmente

### 4. **Tipos flexíveis**

Agora aceita qualquer `type` de stage:

```json
{
  "type": "intro"      // ✅
  "type": "question"   // ✅
  "type": "offer"      // ✅
  "type": "upsell"     // ✅
  "type": "video-vsl"  // ✅ (customizado)
  "type": "qualquer-coisa"  // ✅
}
```

O sistema usa `getStageCategory()` para mapear para o renderer apropriado.

## Casos de uso

### Caso 1: Clonar funil entre ambientes

1. Exporta JSON do funil em DEV
2. Importa no PROD
3. Tudo funciona: metadata, stages, blocos, configs

### Caso 2: Backup e versionamento

1. Exporta JSON antes de mudanças grandes
2. Se der problema, re-importa a versão anterior
3. Restaura tudo: estrutura + blocos

### Caso 3: Templates reutilizáveis

1. Cria funil modelo perfeito
2. Exporta JSON
3. Importa em novos funis como base
4. Customiza a partir daí

### Caso 4: Edição em massa

1. Exporta JSON
2. Edita no VS Code (buscar/substituir URLs, textos, etc)
3. Re-importa
4. Todas as mudanças aplicadas instantaneamente

## Formato recomendado

Para máxima compatibilidade, sempre inclua tanto `config` quanto `blocks`:

```json
{
  "config": {
    "subtitle": "Texto",
    "ctaText": "Botão",
    "ctaUrl": "https://..."
  },
  "blocks": [
    {
      "id": "unique-id",
      "type": "ctaOffer",
      "content": {
        "ctaText": "Botão",
        "ctaUrl": "https://..."
      }
    }
  ]
}
```

Assim funciona em qualquer versão do sistema.

## Troubleshooting

**Q: Importei mas os blocos não aparecem**
A: Verifique se o JSON tem array `blocks` dentro de cada stage

**Q: Importei mas o tipo da stage está errado**
A: Adicione campo `type` em cada stage no JSON

**Q: Mudanças não persistem após salvar**
A: Clique em "Salvar" no header após importar

**Q: Posso importar só algumas stages?**
A: Sim! O sistema só atualiza stages que encontrar por `order_index`
