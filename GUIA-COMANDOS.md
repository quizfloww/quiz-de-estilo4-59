# 🛠️ Guia de Comandos - Editor de Funis

## 🚀 Desenvolvimento

### Iniciar Servidor

```bash
npm run dev
```

- Porta: `http://localhost:8080`
- Hot reload ativado
- Tempo de inicialização: ~217ms

### Build de Produção

```bash
npm run build
```

- Tempo: ~18.75s
- Output: `dist/`
- Compressão: gzip + brotli

### Preview da Build

```bash
npm run preview
```

---

## 🧪 Testes

### Rodar Testes

```bash
npm run test
```

### Testes com Coverage

```bash
npm run test:coverage
```

---

## 🔍 Verificação de Tipos

### TypeScript Check

```bash
npx tsc --noEmit
```

### ESLint

```bash
npm run lint
```

---

## 📦 Dependências

### Atualizar Browserslist

```bash
npx update-browserslist-db@latest
```

### Instalar Dependências

```bash
npm install
```

### Limpar Cache

```bash
rm -rf node_modules dist .vite
npm install
```

---

## 🎨 Editor de Funis

### Acessar Editor

```
http://localhost:8080/admin/funis/:id/edit
```

### Páginas Principais

- `/admin` - Dashboard administrativo
- `/admin/funis` - Lista de funis
- `/admin/funis/:id/edit` - Editor visual
- `/admin/analytics` - Analytics
- `/admin/ab-tests` - Testes A/B

---

## 🔧 Controles Avançados no Editor

### 1. Template Helper

**Variáveis disponíveis:**

- `{userName}` - Nome do usuário
- `{category}` - Estilo principal
- `{percentage}` - Percentual (ex: 85%)
- `{congratsMessage}` - Mensagem de parabéns
- `{powerMessage}` - Mensagem de poder
- `{styleImage}` - URL da imagem do estilo
- `{guideImage}` - URL da imagem do guia
- `{secondary1}` / `{secondary2}` - Estilos secundários
- `{emoji}` - Emoji do estilo
- `{hookMessage}` - Gancho personalizado
- `{resultTitle}` - Título do resultado
- `{transformationMessage}` - Mensagem de transformação
- `{userEmail}` - Email do usuário

**Exemplo de uso:**

```
"Olá {userName}, você é {percentage} {category}!"
→ "Olá Maria, você é 85% Elegante!"
```

### 2. Teste A/B

**Configuração:**

1. Ativar teste A/B no bloco
2. Definir nome do teste (ex: `headline-test-1`)
3. Adicionar variantes com pesos
4. Configurar alterações de conteúdo (JSON)
5. Definir eventos de tracking

**Exemplo de override:**

```json
{
  "text": "Nova mensagem para teste",
  "buttonText": "CTA alternativo"
}
```

### 3. Animações

**Tipos disponíveis:**

- `fade-in` - Fade gradual
- `slide-up` - Deslizar de baixo
- `slide-down` - Deslizar de cima
- `scale-in` - Aumentar gradualmente
- `bounce` - Efeito de pulo
- `pulse` - Pulsar

**Configurações:**

- Duração: 100-2000ms
- Delay: 0-1000ms
- Easing: linear, ease, ease-in, ease-out, ease-in-out
- Desabilitar em baixo desempenho: sim/não

---

## 🐛 Debug

### Logs de Console

```javascript
// Template rendering
console.log("Template context:", context);

// A/B Test assignment
console.log("Assigned variant:", variant);

// Image optimization
console.log("Optimized URL:", optimizedUrl);
```

### LocalStorage

```javascript
// Ver variante A/B atribuída
localStorage.getItem("ab-test-headline-test-1");

// Limpar testes A/B
localStorage.clear();

// Ver configuração salva
localStorage.getItem("result_page_config_default");
```

### DevTools

- **React DevTools:** Inspecionar componentes
- **Network:** Verificar otimização de imagens
- **Performance:** Analisar animações

---

## 📊 Estrutura de Dados

### Block Example

```json
{
  "id": "block-123",
  "type": "heading",
  "order": 1,
  "content": {
    "text": "Olá {userName}!",
    "fontSize": "2xl",
    "textAlign": "center"
  },
  "abTest": {
    "enabled": true,
    "testName": "headline-test",
    "variants": [
      {
        "id": "variant-a",
        "name": "Original",
        "weight": 0.5,
        "content": {}
      },
      {
        "id": "variant-b",
        "name": "Alternativa",
        "weight": 0.5,
        "content": {
          "text": "Bem-vindo {userName}!"
        }
      }
    ],
    "trackingEvents": ["view", "click"]
  },
  "animation": {
    "type": "fade-in",
    "duration": 500,
    "delay": 0,
    "easing": "ease-out",
    "disableOnLowPerformance": true
  }
}
```

---

## 🔐 Segurança

### Variáveis de Ambiente

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 📈 Performance

### Bundle Analysis

```bash
npm run build
# Analisar dist/assets/
```

### Lighthouse

```bash
# Instalar Lighthouse CI
npm install -g @lhci/cli

# Rodar audit
lhci autorun
```

### Core Web Vitals

- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Limpar e reinstalar
rm -rf node_modules dist .vite
npm install
npm run build
```

### Dev Server Issues

```bash
# Matar processos na porta 8080
lsof -ti:8080 | xargs kill -9

# Reiniciar
npm run dev
```

### TypeScript Errors

```bash
# Verificar erros
npx tsc --noEmit

# Atualizar types
npm install --save-dev @types/node @types/react @types/react-dom
```

### Hot Reload Not Working

```bash
# Verificar .gitignore
# Adicionar ao vite.config.ts:
server: {
  watch: {
    usePolling: true
  }
}
```

---

## 📞 Suporte

### Logs Úteis

```bash
# Ver logs do Vite
npm run dev -- --debug

# Ver logs do build
npm run build -- --debug
```

### Documentação

- [CORRECOES-IMPLEMENTADAS.md](./CORRECOES-IMPLEMENTADAS.md)
- [RESUMO-CORRECOES.md](./RESUMO-CORRECOES.md)
- [COMPARATIVO-MODELO-REAL-VS-EDITAVEL.md](./COMPARATIVO-MODELO-REAL-VS-EDITAVEL.md)
- [MELHORIAS-MODELO-EDITAVEL.md](./MELHORIAS-MODELO-EDITAVEL.md)

---

**Última atualização:** 07/12/2025  
**Versão:** 1.0.0  
**Status:** ✅ Operacional
