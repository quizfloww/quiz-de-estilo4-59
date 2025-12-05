# 📦 Backup de Editores Removidos

**Data:** Dezembro 5, 2025  
**Motivo:** Consolidação de editores - mantendo apenas EditorPage e FunnelEditor

## ✅ Editores Ativos

1. **EditorPage** (`/admin/editor`)
   - Editor de Fluxo do Quiz (QuizFlowEditor)
   - Editor Visual Completo (QuizOfferPageVisualEditor)

2. **FunnelEditorPage** (`/admin/funnels/:id/edit`)
   - Editor de Funnel com canvas avançado
   - 5 painéis resizáveis
   - 20 tipos de blocos
   - Publicação e validação

## ❌ Editores Removidos (Backup)

### 1. LiveEditorPage
- **Localização:** `_backup_editors/LiveEditorPage_backup.tsx`
- **Componente:** `_backup_editors/live-editor_backup/`
- **Rota:** Removida de `/admin/live-editor`
- **Razão:** Não acessível, menos completo que EditorPage
- **Nota:** Tinha 4 colunas (bom design, mas sem banco de dados)

### 2. EnhancedResultPageEditorPage
- **Localização:** `_backup_editors/EnhancedResultPageEditorPage_backup.tsx`
- **Rota:** `/advanced-editor` (removida)
- **Componente:** `_backup_editors/result-editor_backup/`
- **Razão:** Integrado no EditorPage como QuizOfferPageVisualEditor
- **Nota:** Complexidade alta, menos modular

### 3. ResultPageVisualEditor
- **Componente:** `_backup_editors/result-editor_backup/`
- **Razão:** Removido em favor de QuizOfferPageVisualEditor
- **Nota:** 91 arquivos - muito complexo, consolidado

## 📂 Estrutura de Backup

```
_backup_editors/
├── REMOVIDOS_E_BACKUP.md                         # Este arquivo
├── LiveEditorPage_backup.tsx                     # Página removida
├── EnhancedResultPageEditorPage_backup.tsx       # Página removida
├── live-editor_backup/                           # Componentes
│   ├── LiveQuizEditor.tsx
│   ├── sidebar/
│   ├── preview/
│   └── ...
└── result-editor_backup/                         # Componentes
    ├── ResultPageVisualEditor.tsx
    ├── EnhancedResultPageEditor.tsx
    ├── block-editors/
    ├── blocks/
    └── ...
```

## 🔄 Migrando de volta

Se precisar restaurar um editor removido:

```bash
# Restaurar LiveEditor
cp -r _backup_editors/live-editor_backup src/components/live-editor
cp _backup_editors/LiveEditorPage_backup.tsx src/pages/admin/LiveEditorPage.tsx

# Restaurar ResultPageEditor
cp -r _backup_editors/result-editor_backup src/components/result-editor
cp _backup_editors/EnhancedResultPageEditorPage_backup.tsx src/pages/EnhancedResultPageEditorPage.tsx
```

## 📊 Consolidação

| Editor | Status | Localização |
|--------|--------|-------------|
| EditorPage | ✅ Ativo | `/admin/editor` |
| FunnelEditor | ✅ Ativo | `/admin/funnels/:id/edit` |
| LiveEditor | ❌ Backup | `_backup_editors/` |
| ResultPageEditor | ❌ Backup | `_backup_editors/` |
| EnhancedResultPageEditor | ❌ Backup | `_backup_editors/` |

---

**Nota:** Os editores removidos são totalmente funcionais e podem ser restaurados a qualquer momento a partir dos backups.
