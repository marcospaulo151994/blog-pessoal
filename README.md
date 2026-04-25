# marcos.run

Site pessoal de Marcos Medeiros, em Next.js 16. [Ver em produção](https://blog-pessoal-silk-nine.vercel.app/pt) — domínio `marcos.run` planejado.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Dev Premium tokens (CSS vars + glow gradient + gridlines) · Inter + JetBrains Mono via `next/font` · MDX via content-collections · Vercel

Sem Framer Motion (transições leves em CSS keyframes); sem IBM Plex (substituído por Inter/JetBrains Mono no redesign 2026-04-25).

## Estrutura

- `app/[lang]/` — rotas bilíngues pt/en
- `components/layout/` — Nav, LanguageSwitcher, ThemeToggle, Footer
- `components/ui/` — cards, busca, archive, share buttons
- `components/mdx/` — Figure, Callout, VideoEmbed, CodePlayground stub
- `lib/` — i18n, content queries, search, metadata helpers
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

- [Design spec](./docs/superpowers/specs/2026-04-24-blog-pessoal-design.md) (com amendment do redesign Dev Premium)
- [Design handoff (Dev Premium)](./docs/design-handoff/) — paleta, tipografia, componentes do redesign de 2026-04-25
- [Implementation plan](./docs/superpowers/plans/2026-04-24-blog-pessoal.md)
- [Implementation log](./docs/implementation-log.md)
- [Roadmap](./ROADMAP.md)
