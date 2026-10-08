# 🍳 Receitas Culinárias

> **Aplicação no ar:** `https://<seu-usuario-github>.github.io/receitas-culinarias/` _(atualize este link após o deploy manual no GitHub Pages)_
>
> **Repositório:** `https://github.com/<seu-usuario-github>/receitas-culinarias` _(atualize após criar o repositório)_

Projeto final da disciplina de desenvolvimento web (Pós Web), construído em **React + TypeScript** consumindo a API pública [DummyJSON](https://dummyjson.com), com o tema **Receitas culinárias** (`/recipes`).

## Tema escolhido

**Receitas culinárias** — vitrine de pratos com fotos, tempo de preparo, porções, ingredientes, modo de preparo e filtro por cozinha/tag, além de uma área administrativa autenticada para cadastrar, editar e remover receitas.

## Como executar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 20+ e npm.

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# build de produção
npm run build

# pré-visualizar o build de produção
npm run preview

# testes unitários / de componentes (Vitest + RTL)
npm run test
npm run test:watch   # modo watch
npm run test:ui      # interface do Vitest

# testes end-to-end (Playwright) — builda o projeto e sobe via `vite preview`
npx playwright install --with-deps   # apenas na primeira vez
npm run e2e
npm run e2e:ui

# lint
npm run lint
```

Login de teste para a área administrativa (usuário da própria DummyJSON):

- **Usuário:** `emilys`
- **Senha:** `emilyspass`

## Uso de Inteligência Artificial

Este projeto foi desenvolvido com apoio do **GitHub Copilot (agente em VS Code, modelo Claude Sonnet 4.5)** para acelerar tarefas repetitivas: estruturação inicial das pastas, criação dos schemas Zod, dos serviços Axios, dos componentes Mantine, dos testes Vitest/RTL/Playwright e dos workflows de CI/CD. Todo o código gerado foi **revisado, testado (lint, type-check, testes unitários e E2E) e ajustado manualmente** antes de ser considerado parte do projeto — as decisões de arquitetura (estrutura de pastas, estratégia de autenticação, modelagem dos contextos e organização das rotas) foram validadas item a item com base no checklist abaixo.

## Checklist dos 10 requisitos técnicos

### 1. Estrutura de componentes e tipagem com TypeScript
Projeto inicializado com `npm create vite@latest . -- --template react-ts`. Os componentes ficam em [src/components](src/components), [src/layouts](src/layouts) e [src/pages](src/pages), todos componentes funcionais com props tipadas via `interface` (sem uso de `any`). O [RecipeCard](src/components/RecipeCard.tsx) demonstra composição via `children` (slot para ações extras, como o botão de favoritar). A organização de estilos é feita com os componentes do Mantine UI (estilização via `styles`/`style` e tema central em [src/theme.ts](src/theme.ts)), com CSS global mínimo em [src/index.css](src/index.css).

### 2. Estado reativo, imutabilidade e ciclo de vida
Estados locais com `useState` em todas as páginas (ex.: [HomePage](src/pages/HomePage.tsx), [RecipeDetailPage](src/pages/RecipeDetailPage.tsx), [AdminDashboardPage](src/pages/admin/AdminDashboardPage.tsx)), sempre atualizando arrays/objetos de forma imutável com spread (`...`), por exemplo em [FavoritesContext](src/context/FavoritesContext.tsx) (`current.filter(...)` / `[...current, id]`). Os `useEffect` de busca de dados usam array de dependências preciso e retornam função de limpeza (flag `isCancelled`) para evitar `setState` após desmontagem/mudança de parâmetros — ver [useRecipeExplorer](src/hooks/useRecipeExplorer.ts), [RecipeDetailPage](src/pages/RecipeDetailPage.tsx) e [AdminDashboardPage](src/pages/admin/AdminDashboardPage.tsx). O `AuthContext` também limpa um listener de `storage` no cleanup.

### 3. Estado global com Context API e Custom Hooks
Dois contextos globais: [AuthContext](src/context/AuthContext.tsx) (sessão do usuário/token) e [FavoritesContext](src/context/FavoritesContext.tsx) (receitas favoritas, persistidas em `localStorage`). Cada contexto é consumido exclusivamente através de um custom hook dedicado — [useAuth](src/hooks/useAuth.ts) e [useFavorites](src/hooks/useFavorites.ts) — que lança um erro explícito caso usado fora do respectivo Provider.

### 4. Roteamento e layouts com React Router
Rotas declarativas centralizadas em [src/App.tsx](src/App.tsx) usando `react-router-dom`. O [MainLayout](src/layouts/MainLayout.tsx) mantém cabeçalho e navegação persistentes, renderizando as páginas filhas via `<Outlet />`. A navegação usa `<NavLink>` com indicação de rota ativa (peso de fonte dinâmico via `isActive`), navegação programática com `useNavigate()` (login, logout, voltar, salvar/cancelar formulário) e rota dinâmica `/receitas/:id` capturada com `useParams()` em [RecipeDetailPage](src/pages/RecipeDetailPage.tsx).

### 5. Interface gráfica e formulários com Mantine UI
`<MantineProvider>` configurado em [src/main.tsx](src/main.tsx) com tema customizado em [src/theme.ts](src/theme.ts). Layout responsivo com `AppShell`, `Grid` e `Stack`. Formulários construídos com `@mantine/form` em [LoginPage](src/pages/LoginPage.tsx) e [RecipeFormPage](src/pages/admin/RecipeFormPage.tsx). Listagem com paginação em [HomePage](src/pages/HomePage.tsx) (`Pagination`) e tabela paginada em [AdminDashboardPage](src/pages/admin/AdminDashboardPage.tsx) (`Table` + `Pagination`), com feedback de carregamento via `Loader` e `LoadingOverlay`.

### 6. Fluxo de autenticação JWT e rotas protegidas
Tela de [LoginPage](src/pages/LoginPage.tsx) consome `POST /auth/login` através de [authService](src/services/authService.ts). O token JWT (`accessToken`) é persistido em `localStorage` (constante `TOKEN_STORAGE_KEY` em [src/services/api.ts](src/services/api.ts)), e o status de autenticação é sincronizado no [AuthContext](src/context/AuthContext.tsx). O componente [ProtectedRoute](src/routes/ProtectedRoute.tsx) bloqueia o acesso a `/admin/*` redirecionando para `/login` quando não autenticado.

### 7. Consumo de API REST, interceptors e validação com Zod
Axios centralizado em [src/services/api.ts](src/services/api.ts) com `baseURL: 'https://dummyjson.com'`. Interceptor de requisição injeta `Authorization: Bearer <token>`; interceptor de resposta trata falhas de rede/HTTP e expõe uma `ApiError` com mensagem amigável (sessão expirada, erro de conexão, etc.), consumida pelos estados de carregamento/erro de cada página. Schemas Zod (`z.object`) em [src/schemas/recipe.schema.ts](src/schemas/recipe.schema.ts) e [src/schemas/auth.schema.ts](src/schemas/auth.schema.ts) definem os tipos (`z.infer`) e validam as respostas da API com `.safeParse()` em [recipesService](src/services/recipesService.ts) e [authService](src/services/authService.ts). Os schemas de formulário são integrados ao Mantine com `zod4Resolver` (pacote `mantine-form-zod-resolver`, compatível com Zod 4).

### 8. Testes automatizados com Vitest e RTL
Configuração do Vitest em [vite.config.ts](vite.config.ts) (`environment: jsdom`, `setupFiles`). Testes em [RecipeCard.test.tsx](src/components/RecipeCard.test.tsx), [LoginPage.test.tsx](src/pages/LoginPage.test.tsx), [AuthContext.test.tsx](src/context/AuthContext.test.tsx) e [FavoritesContext.test.tsx](src/context/FavoritesContext.test.tsx) usam consultas acessíveis (`getByRole`, `getByText`, `getByLabelText`), simulam interação com `@testing-library/user-event` e isolam dependências com um wrapper de providers em memória ([src/test/test-utils.tsx](src/test/test-utils.tsx)) e mocks (`vi.mock`) dos serviços de API.

### 9. Testes ponta a ponta com Playwright
Configurado em [playwright.config.ts](playwright.config.ts), sobe a build de produção via `vite preview` (simulando o GitHub Pages) antes dos testes. Dois fluxos completos em [e2e/auth.spec.ts](e2e/auth.spec.ts) (login, redirecionamento para a área administrativa e logout) e [e2e/search.spec.ts](e2e/search.spec.ts) (busca de receita e navegação até a tela de detalhes), usando localizadores semânticos (`getByRole`, `getByLabel`, `getByPlaceholder`) e rodando em modo headless por padrão.

### 10. Pipeline de CI/CD e deploy em produção
- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)): a cada push/PR para `main`, faz checkout, configura Node.js, instala dependências com `npm ci` (lockfile congelado), roda lint, Vitest e Playwright.
- **CD** ([.github/workflows/cd.yml](.github/workflows/cd.yml)): a cada push em `main`, builda o projeto e publica `dist/` no GitHub Pages via `actions/deploy-pages`.
- `base` ajustado em [vite.config.ts](vite.config.ts) para `/receitas-culinarias/` (ajuste para o nome real do repositório, se diferente) e fallback de SPA implementado com [public/404.html](public/404.html) + script de restauração de rota em [index.html](index.html), garantindo que links diretos e recarregamentos funcionem no GitHub Pages.
- **Pendente de ação manual** (fora do escopo deste commit, conforme combinado): criação do repositório no GitHub, push do código, ativação do GitHub Pages (Settings → Pages → Source: GitHub Actions), configuração de proteção da branch `main` (exigir Pull Request + aprovação do CI antes de merge) e execução efetiva dos workflows.

## Estrutura de pastas

```
src/
  components/   # componentes reutilizáveis (ex: RecipeCard)
  context/      # Context API (Auth, Favorites)
  hooks/        # custom hooks (useAuth, useFavorites, useRecipeExplorer)
  layouts/      # layout principal com AppShell + Outlet
  pages/        # páginas públicas e administrativas
  routes/       # ProtectedRoute
  schemas/      # schemas Zod (recipe, auth)
  services/     # Axios (api.ts) + serviços (recipesService, authService)
  test/         # setup e utilitários de teste
e2e/            # testes Playwright
.github/workflows/  # pipelines de CI e CD
```
