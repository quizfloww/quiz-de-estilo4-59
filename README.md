# 🎨 Quiz Sell Genius - Gisele Galvão

Sistema de quiz interativo com funil de vendas e analytics avançado, pronto para escalar.

## ✨ Features para Escalabilidade

- 🚀 **Google Analytics 4 (GA4)** - Tracking completo de eventos e conversões
- 🐛 **Sentry** - Error tracking e performance monitoring em produção
- 📊 **Web Vitals** - Monitoramento automático de performance (LCP, FID, CLS)
- 🧪 **A/B Testing** - Sistema completo de testes A/B com tracking de conversão
- 🔐 **Validações** - Input validation e sanitização para segurança
- 📱 **PWA Ready** - Service Workers e offline-first
- ⚡ **Performance** - Code-splitting, lazy loading, otimização de imagens

## 📚 Documentação

- **[GUIA-SETUP-ESCALA.md](./GUIA-SETUP-ESCALA.md)** - Configuração completa para escala
- **[EXEMPLOS-USO-ESCALA.md](./EXEMPLOS-USO-ESCALA.md)** - Exemplos práticos de uso
- **[ANALYTICS_REPORT.md](./docs/ANALYTICS_REPORT.md)** - Relatório de analytics
- **[GUIA-COMANDOS.md](./GUIA-COMANDOS.md)** - Comandos úteis

## CI/CD Setup

This project is configured with continuous integration and continuous deployment (CI/CD) using GitHub Actions. When changes are pushed to the `main` branch, the site is automatically built and deployed to Hostinger.

### Setup Instructions

1. **Connect Lovable to GitHub**

   - In the Lovable editor, click on the GitHub button in the top right corner
   - Connect your GitHub account if not already connected
   - Create a new repository or connect to an existing one
   - Push your code to GitHub

2. **Configure GitHub Secrets**
   To deploy to Hostinger via FTP, you need to add the following secrets in your GitHub repository:

   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `FTP_SERVER`: Your Hostinger FTP server (e.g., `ftp.giselegalvao.com.br`)
     - `FTP_USERNAME`: Your Hostinger FTP username
     - `FTP_PASSWORD`: Your Hostinger FTP password
     - `FTP_SERVER_DIR`: The directory to deploy to (e.g., `/public_html/` or `/`)

3. **Test the Workflow**
   - Make a small change to your code in Lovable
   - Push the changes to GitHub
   - Go to the "Actions" tab in your GitHub repository to monitor the workflow
   - Once completed, verify that your changes are live on your website

### Workflow Details

The CI/CD workflow consists of two jobs:

- `build`: Checks out the code, installs dependencies, and builds the project
- `deploy`: Takes the build artifacts and deploys them to Hostinger via FTP

To manually trigger a deployment, you can use the "Run workflow" button on the Actions tab in GitHub.

## Arquitetura e Padrões

- Componentes em `src/components`, hooks em `src/hooks`, dados em `src/data`.
- Validação e normalização de dados (snake/camel) centralizadas nos hooks.
- Padrões adotados: camadas de UI (componentes), dados (hooks/serviços) e configuração (schemas Lovable). Evolui facilmente para Clean Architecture.

## Testes

- E2E: Playwright (`npm run test:e2e`).
- Unit/Integração: Vitest (`npm run test:unit`).

## Qualidade de Código

- ESLint/Prettier configurados. Use `npm run lint` e `npm run format`.

## CI/CD

- GitHub Actions: build, lint, typecheck, unit e E2E (opcional). Workflow em `.github/workflows/ci.yml`.
- Vercel: `vercel.json` com headers de segurança e cache de assets.

### Deploy na Vercel

- Crie o projeto na Vercel e conecte ao repositório GitHub.
- Configure as variáveis de ambiente (use `.env.example` como referência):
  - `VITE_SUPABASE_URL` = `https://mrymyxayqqtlxearvqkz.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = sua anon/publishable key do projeto `mrymyxayqqtlxearvqkz`
  - Opcional: `VITE_SUPABASE_PUBLISHABLE_KEY` (o client aceita como fallback)
  - `VITE_APP_ENV`, opcional `VITE_SENTRY_DSN`.

> Importante: remova quaisquer referências antigas ao projeto `swmhecalfwbonxabfanu` nas variáveis de ambiente.

- Defina o comando de build: `npm run build` e diretório de saída: `dist`.
- Preview Deploys para PRs: habilite automaticamente nas configurações do projeto.
- Opcional: adicione token `VERCEL_TOKEN` e `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` nos Secrets do GitHub para deploy via Actions.

## Containerização

- Dockerfile de produção: build com Node e serve com Nginx.

## Segurança

### Headers HTTP

- CSP, HSTS e cabeçalhos comuns no `vercel.json`.

### Row Level Security (RLS) no Supabase

- Todas as tabelas têm RLS habilitado.
- Políticas seguras: usuários públicos só podem ler funis publicados.
- Administradores (autenticados) têm acesso completo.
- Migration de correção: `supabase/migrations/20251206000000_fix_security_policies.sql`

### Rotação de Chaves (IMPORTANTE!)

Se suas credenciais foram expostas (ex: commitadas no Git), siga estes passos:

1. **Supabase - Rotacionar Anon Key:**

   - Acesse: https://supabase.com/dashboard/project/mrymyxayqqtlxearvqkz/settings/api
   - Clique em "Regenerate" na seção "anon public" key
   - Atualize `VITE_SUPABASE_ANON_KEY` na Vercel e no `.env` local

2. **Supabase - Rotacionar Service Key (se exposta):**

   - Na mesma página, regenere a "service_role" key
   - Esta chave NUNCA deve estar no frontend

3. **Vercel Token:**

   - Acesse: https://vercel.com/account/tokens
   - Revogue o token antigo e crie um novo
   - Atualize o secret `VERCEL_TOKEN` no GitHub

4. **GitHub Secrets:**
   - Acesse: https://github.com/giselegal/quiz-de-estilo4-58/settings/secrets/actions
   - Atualize todos os secrets afetados

### Auditoria de Dependências

- Execute `npm audit` regularmente
- Use `npm audit fix` para corrigir vulnerabilidades automáticas
- Vulnerabilidades atuais: 3 moderadas (esbuild/vite - apenas dev server)

### Boas Práticas

- Nunca commite arquivos `.env` (já está no `.gitignore`)
- Use `.env.example` como template sem valores reais
- Variáveis sensíveis devem estar apenas na Vercel/hosting

## Versionamento

- SemVer, branches de feature e release; PRs com validação.

## Roadmap

- Observabilidade (Sentry/Logs), i18n, autenticação (JWT/OAuth), cache (Redis), APIs documentadas (OpenAPI), ambientes separados.

## Observabilidade (Sentry)

- Habilite `VITE_SENTRY_DSN` nas variáveis de ambiente para inicializar o Sentry no front.
- Amostragem padrão: `tracesSampleRate=0.2`, `replaysSessionSampleRate=0.1`, `replaysOnErrorSampleRate=1.0`.
- Pacotes: `@sentry/react` e `@sentry/integrations` (Replay).

## Deploy via GitHub Actions (Vercel)

- Workflow opcional: `.github/workflows/vercel-deploy.yml`.
- Requer secrets: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` (opcional `VERCEL_SCOPE`).

## Guia de Setup Vercel (passo a passo)

- Instale a CLI: `npm i -g vercel` e faça login: `vercel login`.
- Na Vercel, importe o repositório do GitHub e selecione framework "Vite".
- Configure Environment Variables (Production/Preview):
  - `VITE_SUPABASE_URL` = `https://mrymyxayqqtlxearvqkz.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = sua anon/publishable key
  - Opcional: `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_APP_ENV` (ex: `production`), `VITE_SENTRY_DSN` (opcional).
- Build & Output:
  - Build: `npm run build` | Output: `dist` | Node 20.
- Secrets no GitHub (para workflow):
  - `VERCEL_TOKEN` (Account Settings → Tokens) e `VERCEL_PROJECT_ID` (Project Settings → General).
- Teste o deploy:
  - Preview: `vercel deploy` | Produção: `vercel deploy --prod`.
