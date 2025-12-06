# Gisele Galvão Website

This repository contains the source code for the Gisele Galvão website.

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
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_ENV`, opcional `VITE_SENTRY_DSN`.
- Defina o comando de build: `npm run build` e diretório de saída: `dist`.
- Preview Deploys para PRs: habilite automaticamente nas configurações do projeto.
- Opcional: adicione token `VERCEL_TOKEN` e `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` nos Secrets do GitHub para deploy via Actions.

## Containerização

- Dockerfile de produção: build com Node e serve com Nginx.

## Segurança

- CSP, HSTS e cabeçalhos comuns no `vercel.json`.
- Recomendado: RLS no Supabase, auditoria de dependências (`npm audit`).

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
  - `VITE_SUPABASE_URL` (Project URL do Supabase), `VITE_SUPABASE_ANON_KEY` (Anon/Public key), `VITE_APP_ENV` (ex: `production`), `VITE_SENTRY_DSN` (opcional).
- Build & Output:
  - Build: `npm run build` | Output: `dist` | Node 20.
- Secrets no GitHub (para workflow):
  - `VERCEL_TOKEN` (Account Settings → Tokens) e `VERCEL_PROJECT_ID` (Project Settings → General).
- Teste o deploy:
  - Preview: `vercel deploy` | Produção: `vercel deploy --prod`.
