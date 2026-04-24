# Implementation Log — Blog pessoal

Registro de execução das tasks do plano `docs/superpowers/plans/2026-04-24-blog-pessoal.md`.

Cada entrada captura: task, status (✅/⚠️/❌), resumo do que foi feito, decisões/desvios do plano, commits envolvidos.

---

## Desvios do plano já conhecidos

- **Next.js 16.2.4 no lugar de 15** — `pnpm dlx create-next-app@latest` resolve pra Next 16 (lançado recentemente). AGENTS.md auto-gerado alerta pra breaking changes vs Next 15. Aceito como deviation válida — plan originalmente mirava a versão mais recente. Tasks futuras que referenciam APIs específicas de Next 15 (dynamic params, generateMetadata, middleware edge runtime) devem re-validar contra Next 16 docs em `node_modules/next/dist/docs/` antes de implementar.
- **Tailwind v4 é o default do create-next-app 16** — bate com a intenção do plan. Não é divergência, só atualização do que era comentário de v3 desatualizado.

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

