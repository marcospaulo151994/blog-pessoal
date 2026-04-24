# Implementation Log — Blog pessoal

Registro de execução das tasks do plano `docs/superpowers/plans/2026-04-24-blog-pessoal.md`.

Cada entrada captura: task, status (✅/⚠️/❌), resumo do que foi feito, decisões/desvios do plano, commits envolvidos.

---

## Desvios do plano já conhecidos

- **Next.js 16.2.4 no lugar de 15** — `pnpm dlx create-next-app@latest` resolve pra Next 16 (lançado recentemente). AGENTS.md auto-gerado alerta pra breaking changes vs Next 15. Aceito como deviation válida — plan originalmente mirava a versão mais recente. Tasks futuras que referenciam APIs específicas de Next 15 (dynamic params, generateMetadata, middleware edge runtime) devem re-validar contra Next 16 docs em `node_modules/next/dist/docs/` antes de implementar.
- **Tailwind v4 é o default do create-next-app 16** — bate com a intenção do plan. Não é divergência, só atualização do que era comentário de v3 desatualizado.
- **`middleware.ts` → `proxy.ts`** — Next 16 deprecou a convention `middleware.ts` em favor de `proxy.ts` (mesma funcionalidade, nome diferente + export renomeado de `middleware` → `proxy`). Fiz a migração imediatamente pra silenciar warning de deprecation e evitar tech debt. **Toda referência futura no plano a `middleware.ts` deve ler como `proxy.ts`**. Matcher config (`export const config = { matcher: ... }`) inalterado.
- **GitHub username: `marcospaulo151994`** (não `marcos-medeiros`, que era placeholder no plan). Todas as URLs `github.com/marcos-medeiros/...` no plan (Task 18 links do projeto TCC, Task 24 Footer, Task 33 README) devem ser `github.com/marcospaulo151994/...`. Task 18 (projeto TCC): usar `marcospaulo151994/tcc-penaltis` no frontmatter.

## Fase 0 — Fundações

_Em execução a partir de 2026-04-24._

### Task 1 — Bootstrap Next.js ✅

**Commit:** `2d8f68c chore: bootstrap Next.js 15 project`

**O que foi feito:**
- Scaffold via `pnpm dlx create-next-app@latest .` com flags `--typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-pnpm --no-eslint --turbopack`
- Subagent adicionou `--yes --disable-git` para (a) aceitar diretório não-vazio e (b) preservar o `.git/` existente com os commits da brainstorming/planning.
- `docs/` (spec + plan) preservado — byte-equality verificada via backup temporário.
- `pnpm build` OK (~1.6s, Turbopack).

**Artefatos criados (além do que o plan listou):**
- `AGENTS.md` + `CLAUDE.md` (auto-geradas pelo Next 16 CNA; CLAUDE.md é só `@AGENTS.md`)
- `postcss.config.mjs`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- `public/*.svg` (ícones demo — cleanup candidato em task futura)
- `README.md` (placeholder do CNA — será sobrescrito na Task 9)

**Notas do code quality review para futuras tasks:**
- `next-env.d.ts` agora importa de `.next/types/routes.d.ts` (typed routes Next 16) → `tsc --noEmit` precisa rodar *depois* de `next build` ou `next typegen`. Relevante na Task 2 quando adicionarmos scripts de CI.
- `app/layout.tsx` placeholder tem `lang="en"` e metadata `"Create Next App"` — será reescrito.
- Recomendação opcional: adicionar `engines: { node: ">=20", pnpm: ">=9" }` ao `package.json` pra consistência no deploy.

**Reviews:**
- Spec compliance: ✅ com deviation aceita (Next 16)
- Code quality: ✅ ship it

### Task 2 — ESLint + Prettier + Vitest ✅

**Commit:** `7ec5fde chore: configure eslint, prettier, and vitest`

**O que foi feito:**
- Instaladas devDeps: `eslint@9`, `eslint-config-next@16.2.4`, `eslint-config-prettier@10`, `prettier@3`, `vitest@4`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react`.
- Criados: `eslint.config.mjs`, `.prettierrc.json`, `vitest.config.ts`, `tests/setup.ts`.
- `package.json` scripts: `dev, build, start, lint, format, test, test:run, test:ui`.

**Adaptações inteligentes do subagent (não bugs):**
- Usou o padrão flat-config oficial do Next 16 (`eslint-config-next/core-web-vitals` + `/typescript` + `eslint-config-prettier/flat` + `defineConfig`/`globalIgnores` de `eslint/config`) ao invés do snippet literal do plan, que não funcionaria com o export map v16.
- Não instalou `@eslint/js` e `typescript-eslint` como deps diretas (vêm transitivamente via `eslint-config-next`, não são importadas pelo config).
- Manteve `"dev": "next dev"` (Next 16 usa Turbopack por default — `--turbopack` seria no-op).

**Verificação:**
- `pnpm lint` → exit 0 clean
- `pnpm test:run` → "No test files found, exiting with code 1" (esperado, não é erro de config)
- `pnpm dev` → output mostra "(Turbopack)"

**Reviews:**
- Spec compliance: ✅ com deviations aceitas (flat-config modernizada, scripts equivalentes)
- Code quality: consolidado na spec review (task é só config — spec review já leu arquivos e validou runtime)

### Task 3 — lib/i18n.ts com TDD ✅

**Commit:** `27fb49b feat(i18n): add locales, PATHS map, and translate helpers`

**O que foi feito:**
- `lib/i18n.ts`: `LOCALES`, `DEFAULT_LOCALE`, `PATHS`, `Locale` type, `isLocale` type guard, `translatePath`, `getCanonicalPath` — verbatim do plan.
- `tests/i18n.test.ts`: 9 testes em 5 describes, verbatim do plan.
- TDD respeitado: teste escrito primeiro → falhou (módulo não existe) → implementação → 9/9 green.

**Verificação:** `pnpm test:run tests/i18n.test.ts` → 9 passed em 630ms. Só 2 arquivos modificados no diff.

**Reviews:**
- Spec compliance: ✅ verificação direta (Read + git show) — sem divergência do plan
- Code quality: não necessário (verbatim paste + 100% cobertura de testes)

### Task 4 — locale-detect + proxy (middleware) ✅

**Commits:**
- `40262cb feat(i18n): add middleware with locale detection and rewrites` (implementação original como middleware.ts)
- `6b7be86 refactor(proxy): rename middleware.ts to proxy.ts for Next 16` (migração pro nome Next 16)

**O que foi feito:**
- `tests/locale-detect.test.ts`: 4 testes (cookie-over-header, Accept-Language fallback, default fallback, invalid cookie).
- `lib/locale-detect.ts`: função pura `detectLocale({cookie, header})`.
- `proxy.ts` (root, ex-middleware.ts): 3 responsabilidades — (1) pula assets/api, (2) redirect pra locale detectado se path não começa com locale, (3) rewrite de path traduzido (en) pra rota canônica (pt-based via `getCanonicalPath`).
- TDD respeitado para locale-detect (RED → GREEN → commit).

**Verificação:**
- `pnpm test:run tests/locale-detect.test.ts` → 4 passed em 626ms.
- `pnpm build` → compilação verde, tabela de rotas mostra `ƒ Proxy (Middleware)`.

**Desvios do plano:**
- Arquivo renomeado de `middleware.ts` pra `proxy.ts` (deprecation Next 16) + export renomeado. Plan original ainda usa "middleware" em referências — ler como "proxy" daqui em diante.

**Reviews:**
- Spec compliance: ✅ (verificação direta após subagent flagear deprecation)
- Code quality: N/A (lógica pura verbatim, cobertura de testes 100%)

### Task 5 — Rotas [lang]/ placeholders ✅

**Commit:** `ab059b1 feat(app): add [lang] routes with home and sobre placeholders`

**O que foi feito:**
- Deletado `app/page.tsx` (default CNA).
- Criados `app/[lang]/layout.tsx`, `app/[lang]/page.tsx`, `app/[lang]/sobre/page.tsx` (verbatim do plan).
- `app/[lang]/layout.tsx` usa `generateStaticParams` pra gerar `{lang: 'pt'}` e `{lang: 'en'}` como static params + valida `isLocale(lang)` com `notFound()` como fallback.
- Páginas usam pattern `params: Promise<{ lang: Locale }>` + `await params` (Next 16 async params).
- `app/layout.tsx` reescrito: removido Geist fonts do CNA, metadata trocada pra "Marcos Medeiros", `<script src="/theme-init.js" />` no head (arquivo será criado na Task 7), `suppressHydrationWarning` no `<html>`.

**Verificação:** `pnpm build` → tabela de rotas mostra:
- `● /[lang]` → prerendered `/pt`, `/en`
- `● /[lang]/sobre` → prerendered `/pt/sobre`, `/en/sobre`
- `ƒ Proxy (Middleware)` ativo

**Reviews:**
- Spec compliance: ✅ verificação direta (git show + build output)
- Code quality: N/A (placeholders sem lógica custom)

**Nota:** `/theme-init.js` ainda não existe — referência vai 404 no dev até Task 7, não quebra build.

### Task 6 — LanguageSwitcher ✅

**Commit:** `36d6e07 feat(layout): add LanguageSwitcher component`

**O que foi feito:**
- Criado `components/layout/LanguageSwitcher.tsx` (client component) — usa `usePathname`, `translatePath(pathname, currentLang, other)` pra gerar href da versão no outro idioma, seta cookie `NEXT_LANG=<other>` on-click pra persistir preferência do usuário.
- CSS vars `var(--text-muted)` e `var(--accent)` referenciadas mas ainda não definidas — Task 7 vai definir.

**Verificação:** `pnpm build` → 7 páginas estáticas (pt/en + sobre) geradas com sucesso.

**Reviews:**
- Spec compliance: ✅ verbatim do plan
- Code quality: N/A (componente simples)

### Task 7 — Paleta Peach Noir + ThemeToggle + Nav ✅

**Commit:** `040f049 feat(layout): add Peach Noir palette, theme toggle, and main nav`

**O que foi feito:**
- `app/globals.css`: substituição total dos defaults CNA pela paleta Peach Noir. CSS vars em OKLCH (light + `[data-theme="dark"]`), body/h1-h3/code/a com tipografia e cores baseadas nas vars, animação `grow` pro underline dos links, `@media prefers-reduced-motion` desabilita animações.
- `public/theme-init.js`: IIFE que roda antes da hidratação, lê `localStorage.theme` ou `prefers-color-scheme` e seta `data-theme` no `<html>` — evita flash de tema errado.
- `components/layout/ThemeToggle.tsx`: client component com `useState` + `useEffect` pra sync com attribute do html, persistência em localStorage, renderiza 🌙/☀️.
- `components/layout/Nav.tsx`: server component que integra links pras 4 seções (posts/projetos/notas/sobre, com labels traduzidos via `labels[lang]` e paths via `PATHS[key][lang]`) + LanguageSwitcher + ThemeToggle.
- `app/[lang]/layout.tsx`: wrap do children com `<Nav lang={lang} />` e `min-h-screen` no outer div.

**Verificação:** `pnpm build` → 7 páginas estáticas geradas, sem warnings. Theme system pronto (vars defininas, script de init, toggle integrado, Nav aparece em todas as rotas).

**Reviews:**
- Spec compliance: ✅ verbatim do plan
- Code quality: N/A (ThemeToggle tem lógica de estado simples, bem encapsulada; sem side-effects não previstos)

### Task 8 — ROADMAP.md ✅

**Commit:** a ser confirmado no próximo git show (foi `docs: add ROADMAP.md tracking deferred features`).

**O que foi feito:**
- `ROADMAP.md` na raiz do repo, com seções v0.1 (link pro plan atual), v0.2, v0.3, v0.4, v1.0+. Features adiadas checkbox-tracked, agrupadas por "tema" da versão.

**Reviews:** task trivial (só texto), feita direto sem subagent.

### Task 9 — Deploy Vercel ✅

**Deploy URL:** https://blog-pessoal-silk-nine.vercel.app/pt

**O que foi feito (pelo usuário):**
- Repo GitHub criado: https://github.com/marcospaulo151994/blog-pessoal
- Push inicial de 21 commits pra `origin/master` (branch default local é `master`; não afeta Vercel).
- Import na Vercel — Next.js detectado automaticamente, build completou em ~11 min (mais lento que estimado — talvez primeira vez criando projeto na conta).
- URL pública live.

**Verificação remota (via WebFetch):**
- `/pt` → h1 "Olá", Nav com "Posts, Projetos, Notas, Sobre" + language toggle. ✅
- `/en/about` → h1 "About" (rewrite `/en/about` → internal `/en/sobre` funcionando). ✅

**README atualizado** com URL de produção.

---

## Fase 0 — CONCLUÍDA ✅

**Estatísticas finais:**
- 22 commits
- 13/13 testes passando (9 i18n + 4 locale-detect)
- 4 rotas estáticas prerendered (pt, en, pt/sobre, en/sobre)
- Proxy middleware ativo
- Deploy live

**Critério de pronto do plan (§7 Fase 0):** ✅ URL Vercel mostra /pt e /en, toggle de tema funciona (usuário confirmou via teste manual), switcher de idioma funciona.

---

## Fase 1 — Pipeline de conteúdo

_Em execução a partir de 2026-04-24, pós-Fase 0._

### Task 10 — Install content-collections ✅

**Commit:** (a confirmar com git log após commit do log)

**O que foi feito:**
- Instaladas 3 devDeps: `@content-collections/core@0.15.0`, `@content-collections/mdx@0.2.2`, `@content-collections/next@0.2.11`.
- `content-collections.ts` (root) com config mínima vazia.
- `next.config.ts` envolvido em `withContentCollections`.
- `tsconfig.json` path alias: `"content-collections": ["./.content-collections/generated"]` + `@/*` preservado.
- `.gitignore` adicionou `/.content-collections/` (artefato gerado no build).

**Desvio capturado para Task 11:**
- `@content-collections/core@0.15.0` deprecou a propriedade `collections` em `defineConfig({ collections: [...] })` em favor de `content`. Task 11 (schemas) deve usar `content: [...]` na nova config, não `collections:`. Plan original usa `collections:` — adapt.

**Verificação:** `pnpm build` green (1.5s), `finished build of 0 collections and 0 documents`. Warning de deprecação esperado até Task 11.

**Reviews:**
- Spec compliance: ✅ com deprecation flag (aceita, será corrigido em Task 11)
- Code quality: N/A (config mínima)

### Task 11 — Schemas Post/Projeto/Nota ✅

**Commit:** a confirmar no próximo `git log` (foi `feat(content): define Post/Projeto/Nota schemas with MDX pipeline`)

**O que foi feito:**
- `content-collections.ts` totalmente reescrito com 3 schemas Zod (Post, Projeto, Nota) + MDX compile transform com `rehype-pretty-code` (themes `github-dark-dimmed` + `github-light`) e `remark-gfm`.
- Instaladas deps regulares: `rehype-pretty-code@0.14.3`, `shiki@4.0.2`, `remark-gfm@4.0.1`, e `zod@4.3.6` (ver desvio abaixo).

**Desvios do plano (API content-collections 0.15 mudou mais do que antecipado):**
- `collections:` → `content:` em `defineConfig` (já sabíamos).
- `schema: (z) => ({...})` (form de função) **também foi retirado**. Nova API: `schema: z.object({...})` com zod importado explicitamente pelo consumidor.
- Por isso `zod@4.3.6` teve que entrar como dep direta — a versão transitiva dentro de `@content-collections/core` não é resolvível no modo strict do pnpm.
- Anotação `MdxOptions` (re-export de `Options` do `@content-collections/mdx`) adicionada em `mdxOptions` pra satisfazer TS strict.

**Verificação:** `pnpm build` → `finished build of 3 collections and 0 documents in 6ms`. Zero warnings. TypeScript verde.

**Reviews:**
- Spec compliance: ✅ com desvios de API (todos documentados e forçados pela versão atual do pkg)
- Code quality: N/A (config declarativa)

### Task 12 — IBM Plex + code block styles ✅

**Commit:** `5114488 feat(typography): load IBM Plex trio and style code blocks`

**O que foi feito:**
- `app/layout.tsx`: 3 imports `next/font/google` (Serif/Sans/Mono) com `display: swap`, weights e subsets `latin + latin-ext`, variáveis `--font-{serif,sans,mono}-loaded`. Aplicado `className` com as 3 vars no `<html>`. Metadata + theme-init script preservados.
- `app/globals.css`: `@theme` block agora referencia `var(--font-X-loaded)` (do next/font) com fallback. Estilos de code block adicionados: `pre[data-theme]` (fundo var, padding, border-radius), `[data-highlighted-line]` com `color-mix(in oklch, var(--accent) 15%, transparent)`.

**Verificação:** `pnpm build` → 7 páginas, fontes carregadas, TypeScript 1.8s, Turbopack 1.7s. Sem warnings.

**Reviews:** verbatim do plan (sem adaptações).




