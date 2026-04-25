# marcos.run

Site pessoal de Marcos Medeiros, em Next.js 16. [Ver em produção](https://blog-pessoal-silk-nine.vercel.app/pt) — domínio `marcos.run` planejado.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · MDX (em breve via content-collections) · Vercel

## Estrutura

- `app/[lang]/` — rotas bilíngues pt/en
- `components/layout/` — Nav, LanguageSwitcher, ThemeToggle
- `lib/` — i18n utilities
- `proxy.ts` — detecção de idioma + rewrites (Next 16 "proxy" convention)

## Scripts

```bash
pnpm dev        # dev server com Turbopack
pnpm build      # build de produção
pnpm lint       # ESLint
pnpm test:run   # Vitest (roda e sai)
pnpm test       # Vitest watch mode
```

## Docs

- [Design spec](./docs/superpowers/specs/2026-04-24-blog-pessoal-design.md)
- [Implementation plan](./docs/superpowers/plans/2026-04-24-blog-pessoal.md)
- [Implementation log](./docs/implementation-log.md)
- [Roadmap](./ROADMAP.md)
