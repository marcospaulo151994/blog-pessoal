# Blog pessoal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um blog pessoal híbrido (portfólio + blog + garden) bilíngue pt-BR + en em Next.js 15 + Tailwind v4, conforme spec em `docs/superpowers/specs/2026-04-24-blog-pessoal-design.md`.

**Architecture:** Next.js 15 App Router com `[lang]` dynamic segment para i18n, middleware que detecta idioma e rewrita paths traduzidos, `@content-collections/core` para MDX tipado com Zod, MiniSearch client-side, `@vercel/og` para imagens sociais, Vercel Hobby para deploy. Conteúdo vive em `content/` (Markdown + assets co-localizados), código segue decomposição por responsabilidade (`app/`, `components/`, `lib/`).

**Tech Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · @content-collections/core · rehype-pretty-code · Shiki · MiniSearch · Framer Motion · @vercel/og · Vitest · Playwright · IBM Plex Serif/Sans/Mono · pnpm · Vercel

---

## Como usar este plano

- **Fases** correspondem ao §7 do spec. Cada fase termina com um "critério de pronto" verificável.
- **Tasks dentro de fases** são ordenadas por dependência. Não pule ordem.
- **Commits frequentes**: cada task termina com commit. Se uma task tem múltiplos commits, é dividida em sub-tasks.
- **Testing strategy:** Vitest para `lib/*` (lógica pura), Playwright para E2E dos fluxos críticos (i18n routing, busca, leitura de post). Páginas/CSS não têm testes automatizados — verificação manual no browser durante dev.
- **Branching:** trabalhe direto em `main` nesse repo (é um projeto pessoal solo; branches só atrapalham). Cada task deve compilar e passar testes — nunca commitar code broken.

---

# Fase 0 — Fundações

**Meta:** Next.js rodando com i18n funcional e páginas placeholder bilíngues, deployado na Vercel.

## Task 1: Inicializar projeto Next.js 15

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx` (placeholders default do Next)

- [ ] **Step 1: Inicializar com create-next-app**

```bash
cd /home/marcos/repos/blog-pessoal
pnpm dlx create-next-app@latest . \
  --typescript --tailwind --app --src-dir=false \
  --import-alias="@/*" --use-pnpm --no-eslint --turbopack
```

Se o diretório não estiver vazio, aceite o prompt pra continuar na pasta existente.

- [ ] **Step 2: Verificar que rodou**

```bash
pnpm dev
```

Acesse `http://localhost:3000`. Expected: tela default do Next.js.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Next.js 15 project"
```

## Task 2: Configurar ESLint + Prettier + Vitest

**Files:**
- Create: `eslint.config.mjs`, `.prettierrc.json`, `vitest.config.ts`, `tests/setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Instalar deps**

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-config-next \
  prettier eslint-config-prettier \
  vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom \
  @vitejs/plugin-react
```

- [ ] **Step 2: Criar `eslint.config.mjs`**

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin,
  prettierConfig,
);
```

- [ ] **Step 3: Criar `.prettierrc.json`**

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

- [ ] **Step 4: Criar `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});
```

- [ ] **Step 5: Criar `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Adicionar scripts no `package.json`**

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "format": "prettier --write .",
  "test": "vitest",
  "test:run": "vitest run",
  "test:ui": "vitest --ui"
}
```

- [ ] **Step 7: Rodar testes vazios pra confirmar setup**

```bash
pnpm test:run
```

Expected: "No test files found" sem erros de config.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: configure eslint, prettier, and vitest"
```

## Task 3: Criar `lib/i18n.ts` com locales e PATHS (TDD)

**Files:**
- Create: `lib/i18n.ts`
- Create: `tests/i18n.test.ts`

- [ ] **Step 1: Escrever teste falho**

```ts
// tests/i18n.test.ts
import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  translatePath,
  getCanonicalPath,
} from '@/lib/i18n';

describe('LOCALES', () => {
  it('contains pt and en', () => {
    expect(LOCALES).toEqual(['pt', 'en']);
  });
});

describe('DEFAULT_LOCALE', () => {
  it('is pt', () => {
    expect(DEFAULT_LOCALE).toBe('pt');
  });
});

describe('isLocale', () => {
  it('returns true for pt and en', () => {
    expect(isLocale('pt')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('returns false for other strings', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe('translatePath', () => {
  it('translates segments between locales', () => {
    expect(translatePath('/pt/projetos', 'pt', 'en')).toBe('/en/projects');
    expect(translatePath('/en/projects', 'en', 'pt')).toBe('/pt/projetos');
    expect(translatePath('/pt/sobre', 'pt', 'en')).toBe('/en/about');
  });

  it('preserves untranslated segments (slugs)', () => {
    expect(translatePath('/pt/posts/meu-post', 'pt', 'en')).toBe('/en/posts/meu-post');
  });

  it('keeps locale when target equals source', () => {
    expect(translatePath('/pt/projetos', 'pt', 'pt')).toBe('/pt/projetos');
  });

  it('returns locale root for unknown top segments', () => {
    expect(translatePath('/pt/xyz', 'pt', 'en')).toBe('/en');
  });
});

describe('getCanonicalPath', () => {
  it('maps translated path to canonical (internal pt) path', () => {
    expect(getCanonicalPath('/en/projects')).toBe('/en/projetos');
    expect(getCanonicalPath('/en/about')).toBe('/en/sobre');
    expect(getCanonicalPath('/pt/projetos')).toBe('/pt/projetos');
  });
});
```

- [ ] **Step 2: Rodar teste — deve falhar**

```bash
pnpm test:run tests/i18n.test.ts
```

Expected: FAIL com "Cannot find module '@/lib/i18n'".

- [ ] **Step 3: Implementar `lib/i18n.ts`**

```ts
// lib/i18n.ts
export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt';

// Rotas internas em pt; en é o "traduzido".
export const PATHS = {
  projetos: { pt: 'projetos', en: 'projects' },
  posts: { pt: 'posts', en: 'posts' },
  notas: { pt: 'notas', en: 'notes' },
  sobre: { pt: 'sobre', en: 'about' },
  tags: { pt: 'tags', en: 'tags' },
} as const;

type PathKey = keyof typeof PATHS;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

function findKeyForSegment(segment: string, locale: Locale): PathKey | null {
  for (const key of Object.keys(PATHS) as PathKey[]) {
    if (PATHS[key][locale] === segment) return key;
  }
  return null;
}

export function translatePath(path: string, from: Locale, to: Locale): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0 || !isLocale(parts[0])) return path;

  const [, topSegment, ...rest] = parts;
  if (!topSegment) return `/${to}`;

  const key = findKeyForSegment(topSegment, from);
  if (!key) return `/${to}`;

  const translatedTop = PATHS[key][to];
  return `/${to}/${translatedTop}${rest.length ? '/' + rest.join('/') : ''}`;
}

export function getCanonicalPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 2 || !isLocale(parts[0])) return path;

  const [locale, topSegment, ...rest] = parts;
  const key = findKeyForSegment(topSegment, locale as Locale);
  if (!key) return path;

  const canonical = PATHS[key].pt;
  return `/${locale}/${canonical}${rest.length ? '/' + rest.join('/') : ''}`;
}
```

- [ ] **Step 4: Rodar teste — deve passar**

```bash
pnpm test:run tests/i18n.test.ts
```

Expected: PASS (todos os testes verdes).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(i18n): add locales, PATHS map, and translate helpers"
```

## Task 4: `detectLocale` + middleware (TDD)

**Files:**
- Create: `lib/locale-detect.ts`, `middleware.ts`
- Create: `tests/locale-detect.test.ts`

- [ ] **Step 1: Escrever teste falho**

```ts
// tests/locale-detect.test.ts
import { describe, it, expect } from 'vitest';
import { detectLocale } from '@/lib/locale-detect';

describe('detectLocale', () => {
  it('prefers cookie over header', () => {
    expect(detectLocale({ cookie: 'en', header: 'pt-BR,pt;q=0.9' })).toBe('en');
  });

  it('falls back to Accept-Language header', () => {
    expect(detectLocale({ cookie: null, header: 'en-US,en;q=0.9' })).toBe('en');
    expect(detectLocale({ cookie: null, header: 'pt-BR,pt;q=0.9' })).toBe('pt');
  });

  it('falls back to default when nothing matches', () => {
    expect(detectLocale({ cookie: null, header: 'fr-FR' })).toBe('pt');
    expect(detectLocale({ cookie: null, header: null })).toBe('pt');
  });

  it('ignores invalid cookie values', () => {
    expect(detectLocale({ cookie: 'xyz', header: 'en' })).toBe('en');
  });
});
```

- [ ] **Step 2: FAIL**

```bash
pnpm test:run tests/locale-detect.test.ts
```

- [ ] **Step 3: Implementar `lib/locale-detect.ts`**

```ts
// lib/locale-detect.ts
import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from './i18n';

interface Input {
  cookie: string | null;
  header: string | null;
}

export function detectLocale({ cookie, header }: Input): Locale {
  if (cookie && isLocale(cookie)) return cookie;

  if (header) {
    const preferred = header
      .split(',')
      .map((p) => p.trim().split(';')[0].split('-')[0])
      .find((lang) => (LOCALES as readonly string[]).includes(lang));
    if (preferred && isLocale(preferred)) return preferred;
  }

  return DEFAULT_LOCALE;
}
```

- [ ] **Step 4: PASS**

```bash
pnpm test:run tests/locale-detect.test.ts
```

- [ ] **Step 5: Implementar `middleware.ts`**

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { isLocale, getCanonicalPath } from '@/lib/i18n';
import { detectLocale } from '@/lib/locale-detect';

const COOKIE_NAME = 'NEXT_LANG';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|txt|xml|webp|mp4|woff|woff2|js|css)$/)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/')[1];

  if (!firstSegment || !isLocale(firstSegment)) {
    const detected = detectLocale({
      cookie: request.cookies.get(COOKIE_NAME)?.value ?? null,
      header: request.headers.get('accept-language'),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${detected}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const canonical = getCanonicalPath(pathname);
  if (canonical !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(i18n): add middleware with locale detection and rewrites"
```

## Task 5: Estrutura de rotas `[lang]/` com placeholders

**Files:**
- Delete: `app/page.tsx` (default do Next)
- Create: `app/[lang]/layout.tsx`, `app/[lang]/page.tsx`, `app/[lang]/sobre/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Remover home default**

```bash
rm app/page.tsx
```

- [ ] **Step 2: Criar `app/[lang]/layout.tsx`**

```tsx
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <div data-lang={lang}>{children}</div>;
}
```

- [ ] **Step 3: Criar `app/[lang]/page.tsx`**

```tsx
import type { Locale } from '@/lib/i18n';

const copy = {
  pt: { hello: 'Olá', placeholder: 'Em breve, conteúdo aqui.' },
  en: { hello: 'Hello', placeholder: 'Content coming soon.' },
} as const;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = copy[lang];
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{t.hello}</h1>
      <p className="mt-4">{t.placeholder}</p>
    </main>
  );
}
```

- [ ] **Step 4: Criar `app/[lang]/sobre/page.tsx`**

```tsx
import type { Locale } from '@/lib/i18n';

const copy = {
  pt: { title: 'Sobre', body: 'Página sobre em construção.' },
  en: { title: 'About', body: 'About page under construction.' },
} as const;

export default async function Sobre({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = copy[lang];
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-4">{t.body}</p>
    </main>
  );
}
```

- [ ] **Step 5: Ajustar `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marcos Medeiros',
  description: 'Posts, projetos e notas sobre ML e visão computacional.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* carrega o script de tema antes da hidratação para evitar FOUC */}
        <script src="/theme-init.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Testar rotas manualmente**

```bash
pnpm dev
```

Abra:
- `http://localhost:3000/` → redireciona pra `/pt` (default)
- `http://localhost:3000/pt` → "Olá"
- `http://localhost:3000/en` → "Hello"
- `http://localhost:3000/pt/sobre` → "Sobre"
- `http://localhost:3000/en/about` → "About" (rewrite)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(app): add [lang] routes with home and sobre placeholders"
```

## Task 6: `<LanguageSwitcher />`

**Files:**
- Create: `components/layout/LanguageSwitcher.tsx`

- [ ] **Step 1: Implementar**

```tsx
// components/layout/LanguageSwitcher.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, translatePath, type Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
};

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const other = LOCALES.find((l) => l !== currentLang)!;
  const href = translatePath(pathname, currentLang, other);

  return (
    <Link
      href={href}
      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
      aria-label={`Switch to ${labels[other]}`}
      onClick={() => {
        document.cookie = `NEXT_LANG=${other};path=/;max-age=31536000;samesite=lax`;
      }}
    >
      {labels[other]}
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(layout): add LanguageSwitcher component"
```

## Task 7: Paleta Peach Noir + dark mode toggle

**Files:**
- Modify: `app/globals.css`
- Create: `public/theme-init.js`, `components/layout/ThemeToggle.tsx`, `components/layout/Nav.tsx`
- Modify: `app/[lang]/layout.tsx`

- [ ] **Step 1: Escrever `app/globals.css` com CSS vars e animações base**

```css
@import 'tailwindcss';

@theme {
  --font-serif: 'IBM Plex Serif', Georgia, serif;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'Fira Code', monospace;
}

:root {
  --bg-primary: oklch(97% 0.02 65);
  --bg-elevated: oklch(99% 0.01 65);
  --text-primary: oklch(22% 0.04 50);
  --text-muted: oklch(45% 0.03 50);
  --accent: oklch(62% 0.18 25);
  --accent-hover: oklch(55% 0.20 25);
  --link: oklch(50% 0.14 240);
  --border: oklch(90% 0.02 60);
  --code-bg: oklch(94% 0.01 60);
}

:root[data-theme='dark'] {
  --bg-primary: oklch(18% 0.03 330);
  --bg-elevated: oklch(22% 0.04 330);
  --text-primary: oklch(94% 0.01 65);
  --text-muted: oklch(70% 0.02 50);
  --accent: oklch(72% 0.16 30);
  --accent-hover: oklch(65% 0.18 30);
  --link: oklch(72% 0.12 230);
  --border: oklch(30% 0.03 330);
  --code-bg: oklch(25% 0.03 330);
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.75;
  transition: background 200ms ease, color 200ms ease;
}

h1, h2, h3 {
  font-family: var(--font-serif);
  line-height: 1.2;
}

code {
  font-family: var(--font-mono);
  background: var(--code-bg);
  padding: 0.1em 0.3em;
  border-radius: 0.2em;
}

a {
  color: var(--link);
  text-decoration: none;
  position: relative;
}

a:hover::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: currentColor;
  animation: grow 200ms ease forwards;
}

@keyframes grow {
  from { transform: scaleX(0); transform-origin: left; }
  to { transform: scaleX(1); transform-origin: left; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Criar `public/theme-init.js`**

Este script roda antes da hidratação, evitando "flash" de tema errado. Fica em `/public` pra não precisar de inline script.

```js
// public/theme-init.js
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // localStorage pode falhar (ex: Safari private mode) — default para light
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
```

Já está referenciado em `app/layout.tsx` da Task 5 via `<script src="/theme-init.js" />`.

- [ ] **Step 3: Criar `components/layout/ThemeToggle.tsx`**

```tsx
// components/layout/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    setTheme(current ?? 'light');
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  if (!mounted) return <div className="w-6 h-6" aria-hidden />;

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="text-xl"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

- [ ] **Step 4: Criar `components/layout/Nav.tsx`**

```tsx
// components/layout/Nav.tsx
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { PATHS, type Locale } from '@/lib/i18n';

const labels = {
  pt: { posts: 'Posts', projetos: 'Projetos', notas: 'Notas', sobre: 'Sobre' },
  en: { posts: 'Posts', projetos: 'Projects', notas: 'Notes', sobre: 'About' },
} as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = labels[lang];
  return (
    <nav className="flex items-center justify-between py-6 px-8 border-b border-[var(--border)]">
      <Link href={`/${lang}`} className="text-lg font-semibold font-serif">
        Marcos Medeiros
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href={`/${lang}/${PATHS.posts[lang]}`}>{t.posts}</Link>
        <Link href={`/${lang}/${PATHS.projetos[lang]}`}>{t.projetos}</Link>
        <Link href={`/${lang}/${PATHS.notas[lang]}`}>{t.notas}</Link>
        <Link href={`/${lang}/${PATHS.sobre[lang]}`}>{t.sobre}</Link>
        <LanguageSwitcher currentLang={lang} />
        <ThemeToggle />
      </div>
    </nav>
  );
}
```

- [ ] **Step 5: Integrar no `app/[lang]/layout.tsx`**

```tsx
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { Nav } from '@/components/layout/Nav';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div data-lang={lang} className="min-h-screen">
      <Nav lang={lang as Locale} />
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Testar manualmente**

```bash
pnpm dev
```

- Toggle troca entre 🌙/☀️, cores mudam sem flash no reload.
- Switcher navega `/pt/projetos` ↔ `/en/projects`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(layout): add Peach Noir palette, theme toggle, and main nav"
```

## Task 8: `ROADMAP.md` inicial

**Files:**
- Create: `ROADMAP.md`

- [ ] **Step 1: Escrever ROADMAP.md**

```markdown
# Roadmap

## v0.1 — MVP em construção
Ver `docs/superpowers/plans/2026-04-24-blog-pessoal.md`.

## v0.2 — "Loop social"
- [ ] Giscus comments (ativar stub `<PostComments />`)
- [ ] Newsletter embed (Buttondown trial grátis)
- [ ] Traduzir os 3 primeiros posts pra EN
- [ ] "Recent activity" widget na home

## v0.3 — "Descoberta + polish"
- [ ] Search com highlight contextual (trecho do match)
- [ ] OG images com variações por tag (cor/ícone)
- [ ] RSS segmentado por tag (/rss/ml.xml)
- [ ] Scroll reveals (ativar `<Reveal>`)
- [ ] Página `/roadmap` pública

## v0.4 — "Interatividade"
- [ ] CodePlayground ativado (Sandpack)
- [ ] Demos embutidos de MediaPipe (vídeo + controles)
- [ ] Visualização interativa de features

## v1.0+ — "Se houver demanda real"
- [ ] Semantic search com embeddings
- [ ] Tradução automática com revisão
- [ ] Analytics próprio (Umami self-hosted)
```

- [ ] **Step 2: Commit**

```bash
git add ROADMAP.md
git commit -m "docs: add ROADMAP.md tracking deferred features"
```

## Task 9: Deploy inicial na Vercel

**Files:**
- Create: `README.md`

- [ ] **Step 1: Criar repositório no GitHub**

```bash
gh repo create marcos-medeiros/blog-pessoal --public --source=. \
  --description="Blog pessoal de Marcos Medeiros"
git push -u origin main
```

Sem `gh`: criar via github.com, depois:

```bash
git remote add origin <URL>
git push -u origin main
```

- [ ] **Step 2: Importar na Vercel**

https://vercel.com/new → importar o repo. Vercel detecta Next.js. Deploy em ~2 min.

- [ ] **Step 3: Verificar deploy**

Acesse a URL `.vercel.app`:
- `/` redireciona (idioma detectado)
- `/pt`, `/en` funcionam
- `/en/about` renderiza "About"
- Dark mode persiste

- [ ] **Step 4: Adicionar README**

```markdown
# Blog pessoal — Marcos Medeiros

Site pessoal em Next.js 15. [Ver em produção](https://<dominio>).

## Stack
Next.js 15 · Tailwind v4 · MDX (content-collections) · Vercel

## Docs
- [Design spec](./docs/superpowers/specs/2026-04-24-blog-pessoal-design.md)
- [Implementation plan](./docs/superpowers/plans/2026-04-24-blog-pessoal.md)
- [Roadmap](./ROADMAP.md)
```

- [ ] **Step 5: Commit e push**

```bash
git add README.md
git commit -m "docs: add README with deploy URL"
git push
```

**Critério de pronto Fase 0:** URL Vercel mostra `/pt` e `/en`, toggle de tema funciona, switcher de idioma funciona.

---

# Fase 1 — Pipeline de conteúdo

**Meta:** MDX renderizando com schema validado + 1 post real em pt-BR.

## Task 10: Instalar e configurar content-collections

**Files:**
- Create: `content-collections.ts`
- Modify: `next.config.ts`, `tsconfig.json`

- [ ] **Step 1: Instalar**

```bash
pnpm add -D @content-collections/core @content-collections/next @content-collections/mdx
```

- [ ] **Step 2: `content-collections.ts` mínimo**

```ts
import { defineConfig } from '@content-collections/core';

export default defineConfig({
  collections: [],
});
```

- [ ] **Step 3: Integrar com `next.config.ts`**

```ts
import type { NextConfig } from 'next';
import { withContentCollections } from '@content-collections/next';

const nextConfig: NextConfig = {};

export default withContentCollections(nextConfig);
```

- [ ] **Step 4: Alias em `tsconfig.json`**

Em `compilerOptions.paths`:

```json
"content-collections": ["./.content-collections/generated"]
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: install and configure content-collections"
```

## Task 11: Schemas Post/Projeto/Nota

**Files:**
- Modify: `content-collections.ts`

- [ ] **Step 1: Implementar schemas**

```ts
// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [rehypePrettyCode, {
      theme: { dark: 'github-dark-dimmed', light: 'github-light' },
      keepBackground: false,
    }],
  ],
};

const Post = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '*.{pt,en}.mdx',
  schema: (z) => ({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(['pt', 'en']),
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    projectKey: z.string().optional(),
    cover: z.string().optional(),
    readingTime: z.number().optional(),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, mdxOptions);
    return { ...doc, body };
  },
});

const Projeto = defineCollection({
  name: 'projetos',
  directory: 'content/projetos',
  include: '*.{pt,en}.mdx',
  schema: (z) => ({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(['pt', 'en']),
    title: z.string(),
    tagline: z.string().max(120),
    description: z.string(),
    period: z.object({
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
    }),
    status: z.enum(['active', 'completed', 'archived']),
    stack: z.array(z.string()),
    links: z.object({
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      paper: z.string().url().optional(),
    }).optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, mdxOptions);
    return { ...doc, body };
  },
});

const Nota = defineCollection({
  name: 'notas',
  directory: 'content/notas',
  include: '*.{pt,en}.mdx',
  schema: (z) => ({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(['pt', 'en']),
    title: z.string(),
    maturity: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    planted: z.coerce.date(),
    tended: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc, mdxOptions);
    return { ...doc, body };
  },
});

export default defineConfig({
  collections: [Post, Projeto, Nota],
});
```

- [ ] **Step 2: Instalar deps de MDX**

```bash
pnpm add rehype-pretty-code shiki remark-gfm
```

- [ ] **Step 3: Criar diretórios de conteúdo**

```bash
mkdir -p content/posts content/projetos content/notas
touch content/posts/.gitkeep content/projetos/.gitkeep content/notas/.gitkeep
```

- [ ] **Step 4: Verificar build**

```bash
pnpm build
```

Expected: build completa sem erros (collections vazias ok).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(content): define Post/Projeto/Nota schemas with MDX pipeline"
```

## Task 12: IBM Plex + estilos de code block

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Adicionar IBM Plex em `app/layout.tsx`**

```tsx
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

const serif = IBM_Plex_Serif({
  weight: ['600', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-serif-loaded',
});
const sans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans-loaded',
});
const mono = IBM_Plex_Mono({
  weight: ['400', '600'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-mono-loaded',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script src="/theme-init.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Ajustar vars em `globals.css`**

Substituir o `@theme` block:

```css
@theme {
  --font-serif: var(--font-serif-loaded), Georgia, serif;
  --font-sans: var(--font-sans-loaded), system-ui, sans-serif;
  --font-mono: var(--font-mono-loaded), 'Fira Code', monospace;
}
```

- [ ] **Step 3: Estilos de code block**

Adicionar em `globals.css`:

```css
pre[data-theme] {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid var(--border);
  margin: 1rem 0;
  font-size: 0.875rem;
}
pre[data-theme] code { background: none; padding: 0; }
[data-highlighted-line] {
  background: color-mix(in oklch, var(--accent) 15%, transparent);
  display: inline-block;
  width: 100%;
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(typography): load IBM Plex trio and style code blocks"
```

## Task 13: Componentes MDX

**Files:**
- Create: `components/mdx/Figure.tsx`, `Callout.tsx`, `VideoEmbed.tsx`, `CodePlayground.tsx`, `index.ts`, `MDXContent.tsx`

- [ ] **Step 1: `Figure.tsx`**

```tsx
import Image from 'next/image';

export function Figure({
  src, caption, width = 800, height = 450,
}: {
  src: string; caption?: string; width?: number; height?: number;
}) {
  return (
    <figure className="my-6">
      <Image src={src} alt={caption ?? ''} width={width} height={height} className="rounded-lg w-full h-auto" />
      {caption && (
        <figcaption className="text-sm text-[var(--text-muted)] mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 2: `Callout.tsx`**

```tsx
import type { ReactNode } from 'react';

const styles = {
  info: { border: 'border-blue-400', icon: 'ℹ️' },
  warn: { border: 'border-amber-400', icon: '⚠️' },
  tip: { border: 'border-green-400', icon: '💡' },
} as const;

export function Callout({
  type = 'info', children,
}: { type?: keyof typeof styles; children: ReactNode }) {
  const s = styles[type];
  return (
    <div className={`border-l-4 ${s.border} bg-[var(--bg-elevated)] p-4 my-4 rounded-r-lg`}>
      <div className="flex gap-2">
        <span>{s.icon}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `VideoEmbed.tsx`**

```tsx
export function VideoEmbed({ src, poster }: { src: string; poster?: string }) {
  return (
    <video controls preload="metadata" poster={poster} className="w-full rounded-lg my-6">
      <source src={src} />
    </video>
  );
}
```

- [ ] **Step 4: `CodePlayground.tsx` (stub)**

```tsx
// v0.1 stub: renderiza pre estático. v0.4 substitui por Sandpack.
export function CodePlayground({ lang, code }: { lang: string; code: string }) {
  return (
    <pre className="my-4">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
}
```

- [ ] **Step 5: `MDXContent.tsx` wrapper**

```tsx
import { MDXContent as BaseMDXContent } from '@content-collections/mdx/react';
import { mdxComponents } from './index';

export function MDXContent({ code }: { code: string }) {
  return <BaseMDXContent code={code} components={mdxComponents} />;
}
```

- [ ] **Step 6: Registry `components/mdx/index.ts`**

```ts
import { Figure } from './Figure';
import { Callout } from './Callout';
import { VideoEmbed } from './VideoEmbed';
import { CodePlayground } from './CodePlayground';

export const mdxComponents = {
  Figure, Callout, VideoEmbed, CodePlayground,
};
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(mdx): add Figure, Callout, VideoEmbed, CodePlayground and wrapper"
```

## Task 14: `lib/content.ts` com queries tipadas

**Files:**
- Create: `lib/content.ts`, `tests/content.test.ts`
- Create: fixture `content/posts/2026-04-24-exemplo.pt.mdx`

- [ ] **Step 1: Criar fixture mínima**

```mdx
<!-- content/posts/2026-04-24-exemplo.pt.mdx -->
---
translationKey: "exemplo"
slug: "exemplo"
lang: "pt"
title: "Post exemplo"
description: "Teste de schema e query."
date: 2026-04-24
tags: ["teste"]
status: "published"
---

Conteúdo do post exemplo.
```

- [ ] **Step 2: Implementar `lib/content.ts`**

```ts
// lib/content.ts
import { allPosts, allProjetos, allNotas } from 'content-collections';
import type { Locale } from './i18n';

export function getPosts({ lang }: { lang: Locale }) {
  return allPosts
    .filter((p) => p.lang === lang && p.status === 'published')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getPostBySlug(slug: string, lang: Locale) {
  return allPosts.find((p) => p.slug === slug && p.lang === lang) ?? null;
}

export function getPostsByTag(tag: string, lang: Locale) {
  return getPosts({ lang }).filter((p) => p.tags.includes(tag));
}

export function getAllTags(lang: Locale): string[] {
  const set = new Set<string>();
  getPosts({ lang }).forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getProjects({ lang }: { lang: Locale }) {
  return allProjetos
    .filter((p) => p.lang === lang)
    .sort((a, b) => a.order - b.order || b.period.start.getTime() - a.period.start.getTime());
}

export function getProjectBySlug(slug: string, lang: Locale) {
  return allProjetos.find((p) => p.slug === slug && p.lang === lang) ?? null;
}

export function getNotes({
  lang, maturity,
}: { lang: Locale; maturity?: 'seedling' | 'budding' | 'evergreen' }) {
  return allNotas
    .filter((n) => n.lang === lang)
    .filter((n) => (maturity ? n.maturity === maturity : true))
    .sort((a, b) => b.planted.getTime() - a.planted.getTime());
}

export function getNoteBySlug(slug: string, lang: Locale) {
  return allNotas.find((n) => n.slug === slug && n.lang === lang) ?? null;
}

export function getPostsByProjectKey(key: string, lang: Locale) {
  return getPosts({ lang }).filter((p) => p.projectKey === key);
}
```

- [ ] **Step 3: Escrever teste**

```ts
// tests/content.test.ts
import { describe, it, expect } from 'vitest';
import { getPosts, getPostBySlug } from '@/lib/content';

describe('getPosts', () => {
  it('returns only published posts for the given lang', () => {
    const posts = getPosts({ lang: 'pt' });
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.status === 'published')).toBe(true);
    expect(posts.every((p) => p.lang === 'pt')).toBe(true);
  });

  it('sorts posts by date desc', () => {
    const posts = getPosts({ lang: 'pt' });
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date.getTime() >= posts[i].date.getTime()).toBe(true);
    }
  });
});

describe('getPostBySlug', () => {
  it('returns a post matching slug and lang', () => {
    const post = getPostBySlug('exemplo', 'pt');
    expect(post?.title).toBe('Post exemplo');
  });

  it('returns null for unknown slug', () => {
    expect(getPostBySlug('nao-existe', 'pt')).toBeNull();
  });
});
```

Nota: os testes dependem do build do content-collections. Rodar `pnpm build` uma vez antes para gerar `.content-collections/generated/`.

- [ ] **Step 4: PASS**

```bash
pnpm build
pnpm test:run tests/content.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(content): add typed queries in lib/content.ts"
```

## Task 15: Post detail + `<PostComments>` stub + `<TagPill>`

**Files:**
- Create: `app/[lang]/posts/[slug]/page.tsx`, `components/ui/PostComments.tsx`, `components/ui/TagPill.tsx`

- [ ] **Step 1: `PostComments` stub**

```tsx
// v0.1 stub — v0.2 substitui por Giscus.
export function PostComments({ postId }: { postId: string }) {
  return null;
}
```

- [ ] **Step 2: `TagPill`**

```tsx
import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

export function TagPill({ tag, lang }: { tag: string; lang: Locale }) {
  return (
    <Link
      href={`/${lang}/${PATHS.posts[lang]}/${PATHS.tags[lang]}/${tag}`}
      className="inline-block text-xs px-2 py-1 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
    >
      #{tag}
    </Link>
  );
}
```

- [ ] **Step 3: Página de detalhe**

```tsx
// app/[lang]/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/content';
import { isLocale, type Locale } from '@/lib/i18n';
import { MDXContent } from '@/components/mdx/MDXContent';
import { TagPill } from '@/components/ui/TagPill';
import { PostComments } from '@/components/ui/PostComments';

export async function generateStaticParams() {
  const ptPosts = getPosts({ lang: 'pt' });
  const enPosts = getPosts({ lang: 'en' });
  return [
    ...ptPosts.map((p) => ({ lang: 'pt', slug: p.slug })),
    ...enPosts.map((p) => ({ lang: 'en', slug: p.slug })),
  ];
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const dateLabel = post.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <article className="max-w-[680px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
          {post.title}
        </h1>
        <div className="flex gap-3 items-center mt-4 text-sm text-[var(--text-muted)]">
          <time dateTime={post.date.toISOString()}>{dateLabel}</time>
          {post.readingTime && (
            <span>· {post.readingTime} {lang === 'pt' ? 'min de leitura' : 'min read'}</span>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {post.tags.map((t) => <TagPill key={t} tag={t} lang={lang as Locale} />)}
          </div>
        )}
      </header>
      <div className="prose-content">
        <MDXContent code={post.body} />
      </div>
      <footer className="mt-16 pt-8 border-t border-[var(--border)]">
        <PostComments postId={post.translationKey} />
      </footer>
    </article>
  );
}
```

- [ ] **Step 4: Estilos de prose em `globals.css`**

```css
.prose-content { font-size: 1.0625rem; }
.prose-content h2 { font-family: var(--font-serif); font-size: 1.875rem; margin-top: 2rem; margin-bottom: 0.75rem; }
.prose-content h3 { font-family: var(--font-serif); font-size: 1.5rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
.prose-content p { margin: 1rem 0; }
.prose-content ul, .prose-content ol { margin: 1rem 0; padding-left: 1.5rem; }
.prose-content ul { list-style: disc; }
.prose-content ol { list-style: decimal; }
.prose-content blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem; margin: 1.5rem 0;
  color: var(--text-muted); font-style: italic;
}
```

- [ ] **Step 5: Testar no browser**

`pnpm dev` → `/pt/posts/exemplo`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(posts): add post detail page with MDX and comment stub"
```

## Task 16: Índice `/[lang]/posts`

**Files:**
- Create: `app/[lang]/posts/page.tsx`, `components/ui/PostCard.tsx`

- [ ] **Step 1: `PostCard`**

```tsx
// components/ui/PostCard.tsx
import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';
import { TagPill } from './TagPill';

interface PostCardProps {
  slug: string; title: string; description: string;
  date: Date; tags: string[]; lang: Locale;
}

export function PostCard({ slug, title, description, date, tags, lang }: PostCardProps) {
  const dateLabel = date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  return (
    <article className="py-6 border-b border-[var(--border)] last:border-0 group">
      <time className="text-sm text-[var(--text-muted)]">{dateLabel}</time>
      <h2 className="font-serif text-2xl mt-1 group-hover:text-[var(--accent)] transition-colors">
        <Link href={`/${lang}/${PATHS.posts[lang]}/${slug}`}>{title}</Link>
      </h2>
      <p className="mt-2 text-[var(--text-muted)]">{description}</p>
      {tags.length > 0 && (
        <div className="flex gap-2 mt-3">
          {tags.map((t) => <TagPill key={t} tag={t} lang={lang} />)}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Índice**

```tsx
// app/[lang]/posts/page.tsx
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { isLocale, type Locale } from '@/lib/i18n';
import { PostCard } from '@/components/ui/PostCard';

const copy = {
  pt: { title: 'Posts', empty: 'Nenhum post publicado ainda.' },
  en: { title: 'Posts', empty: 'No posts published yet.' },
} as const;

export default async function PostsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getPosts({ lang });
  const t = copy[lang];

  return (
    <main className="max-w-[800px] mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold">{t.title}</h1>
      {posts.length === 0 ? (
        <p className="mt-6 text-[var(--text-muted)]">{t.empty}</p>
      ) : (
        <div className="mt-8">
          {posts.map((p) => (
            <PostCard
              key={p.translationKey}
              slug={p.slug}
              title={p.title}
              description={p.description}
              date={p.date}
              tags={p.tags}
              lang={lang as Locale}
            />
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(posts): add posts index page"
```

## Task 17: Escrever 1º post real (TCC status)

**Files:**
- Create: `content/posts/2026-04-24-tcc-status.pt.mdx`
- Delete: `content/posts/2026-04-24-exemplo.pt.mdx` (fixture)

- [ ] **Step 1: Escrever o post (~600 palavras)**

Conteúdo sobre status atual do TCC: problema (predição de direção de pênaltis), stack (MediaPipe Pose + XGBoost/LSTM/CNN+LSTM), o que foi feito, próximos passos.

Frontmatter:

```yaml
---
translationKey: "tcc-status-abril-2026"
slug: "tcc-status-abril-2026"
lang: "pt"
title: "Status do TCC: prevendo direção de pênaltis com pose estimation"
description: "Onde estou no TCC sobre predição de direção de cobranças de pênalti com MediaPipe Pose + XGBoost, LSTM e CNN+LSTM."
date: 2026-04-24
tags: ["tcc", "ml", "visao-computacional", "mediapipe"]
status: "published"
projectKey: "tcc-penalty-direction"
---
```

- [ ] **Step 2: Remover fixture**

```bash
rm content/posts/2026-04-24-exemplo.pt.mdx
```

Ajustar `tests/content.test.ts` se ele referenciava `exemplo` — trocar pra `tcc-status-abril-2026`.

- [ ] **Step 3: Verificar no browser**

```bash
pnpm dev
# /pt/posts/tcc-status-abril-2026
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: add first real post — TCC status"
```

**Critério de pronto Fase 1:** `/pt/posts/tcc-status-abril-2026` renderiza com tipografia Plex, tags clicáveis.

---

# Fase 2 — Portfólio e garden

**Meta:** 3 seções do híbrido com conteúdo real mínimo.

## Task 18: Projetos — páginas, componente, 1 projeto

**Files:**
- Create: `app/[lang]/projetos/page.tsx`, `app/[lang]/projetos/[slug]/page.tsx`
- Create: `components/ui/ProjectCard.tsx`
- Create: `content/projetos/tcc-penalty-direction.pt.mdx`

- [ ] **Step 1: `ProjectCard`**

```tsx
import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

interface Props {
  slug: string; title: string; tagline: string;
  status: 'active' | 'completed' | 'archived';
  stack: string[]; cover?: string; lang: Locale;
}

const statusLabel = {
  pt: { active: 'Em andamento', completed: 'Concluído', archived: 'Arquivado' },
  en: { active: 'Active', completed: 'Completed', archived: 'Archived' },
} as const;

export function ProjectCard({ slug, title, tagline, status, stack, cover, lang }: Props) {
  return (
    <Link
      href={`/${lang}/${PATHS.projetos[lang]}/${slug}`}
      className="block p-6 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:-translate-y-0.5 bg-[var(--bg-elevated)]"
    >
      {cover && (
        <img src={cover} alt="" className="w-full h-40 object-cover rounded-md mb-4" />
      )}
      <div className="text-xs text-[var(--text-muted)] mb-2">
        {statusLabel[lang][status]}
      </div>
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{tagline}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {stack.slice(0, 5).map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded bg-[var(--code-bg)]">{s}</span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Índice de projetos**

```tsx
// app/[lang]/projetos/page.tsx
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/content';
import { isLocale, type Locale } from '@/lib/i18n';
import { ProjectCard } from '@/components/ui/ProjectCard';

const copy = {
  pt: { title: 'Projetos', empty: 'Ainda não tem projetos publicados.' },
  en: { title: 'Projects', empty: 'No projects yet.' },
} as const;

export default async function ProjetosIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const projects = getProjects({ lang });
  const t = copy[lang];

  return (
    <main className="max-w-[1000px] mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold">{t.title}</h1>
      {projects.length === 0 ? (
        <p className="mt-6 text-[var(--text-muted)]">{t.empty}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {projects.map((p) => (
            <ProjectCard
              key={p.translationKey}
              slug={p.slug}
              title={p.title}
              tagline={p.tagline}
              status={p.status}
              stack={p.stack}
              cover={p.cover}
              lang={lang as Locale}
            />
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Detalhe do projeto**

```tsx
// app/[lang]/projetos/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getProjects, getPostsByProjectKey } from '@/lib/content';
import { isLocale, type Locale, PATHS } from '@/lib/i18n';
import { MDXContent } from '@/components/mdx/MDXContent';

export async function generateStaticParams() {
  const pt = getProjects({ lang: 'pt' });
  const en = getProjects({ lang: 'en' });
  return [
    ...pt.map((p) => ({ lang: 'pt', slug: p.slug })),
    ...en.map((p) => ({ lang: 'en', slug: p.slug })),
  ];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const project = getProjectBySlug(slug, lang);
  if (!project) notFound();

  const relatedPosts = getPostsByProjectKey(project.translationKey, lang);
  const t = lang === 'pt'
    ? { status: 'Status', stack: 'Stack', related: 'Posts relacionados' }
    : { status: 'Status', stack: 'Stack', related: 'Related posts' };

  return (
    <article className="max-w-[760px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold">{project.title}</h1>
        <p className="text-lg text-[var(--text-muted)] mt-3">{project.tagline}</p>
        <dl className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div><dt className="font-semibold">{t.status}</dt><dd>{project.status}</dd></div>
          <div><dt className="font-semibold">{t.stack}</dt><dd>{project.stack.join(', ')}</dd></div>
        </dl>
        {project.links && (
          <div className="flex gap-3 mt-4 text-sm">
            {project.links.repo && <a href={project.links.repo} target="_blank" rel="noopener">Repo ↗</a>}
            {project.links.demo && <a href={project.links.demo} target="_blank" rel="noopener">Demo ↗</a>}
            {project.links.paper && <a href={project.links.paper} target="_blank" rel="noopener">Paper ↗</a>}
          </div>
        )}
      </header>
      <div className="prose-content">
        <MDXContent code={project.body} />
      </div>
      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--border)]">
          <h2 className="font-serif text-2xl">{t.related}</h2>
          <ul className="mt-4 space-y-2">
            {relatedPosts.map((p) => (
              <li key={p.translationKey}>
                <Link href={`/${lang}/${PATHS.posts[lang]}/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
```

- [ ] **Step 4: Escrever o projeto do TCC**

```mdx
<!-- content/projetos/tcc-penalty-direction.pt.mdx -->
---
translationKey: "tcc-penalty-direction"
slug: "tcc-penaltis"
lang: "pt"
title: "Predição de direção de pênaltis com pose estimation"
tagline: "TCC — usando MediaPipe Pose + modelos clássicos e profundos pra antecipar a direção do chute."
description: "Trabalho de conclusão de curso (Ciência da Computação, UPF) investigando como features de pose estimation podem ser usadas pra predizer a direção de cobranças de pênalti."
period:
  start: 2025-08-01
status: "active"
stack: ["Python", "MediaPipe Pose", "XGBoost", "LSTM", "CNN+LSTM", "OpenCV"]
links:
  repo: "https://github.com/marcos-medeiros/tcc-penaltis"
featured: true
order: 1
---

## Contexto

<!-- descrever problema, motivação, contribuições esperadas -->

## Stack e abordagens

<!-- XGBoost baseline, LSTM temporal, CNN+LSTM end-to-end -->

## Status atual

<!-- feito, falta -->
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(projetos): add projetos index, detail, and TCC project"
```

## Task 19: Garden — páginas, `<MaturityBadge>`, 2 notas

**Files:**
- Create: `app/[lang]/notas/page.tsx`, `app/[lang]/notas/[slug]/page.tsx`
- Create: `components/ui/MaturityBadge.tsx`, `NoteCard.tsx`
- Create: 2 notas em `content/notas/`

- [ ] **Step 1: `MaturityBadge`**

```tsx
import type { Locale } from '@/lib/i18n';

type Maturity = 'seedling' | 'budding' | 'evergreen';

const labels = {
  pt: { seedling: 'Broto', budding: 'Crescendo', evergreen: 'Maduro' },
  en: { seedling: 'Seedling', budding: 'Budding', evergreen: 'Evergreen' },
} as const;

const icons: Record<Maturity, string> = {
  seedling: '🌱', budding: '🌿', evergreen: '🌳',
};

export function MaturityBadge({ maturity, lang }: { maturity: Maturity; lang: Locale }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]"
      title={labels[lang][maturity]}
    >
      <span aria-hidden>{icons[maturity]}</span>
      {labels[lang][maturity]}
    </span>
  );
}
```

- [ ] **Step 2: `NoteCard`**

```tsx
import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';
import { MaturityBadge } from './MaturityBadge';

interface Props {
  slug: string; title: string;
  maturity: 'seedling' | 'budding' | 'evergreen';
  planted: Date; lang: Locale;
}

export function NoteCard({ slug, title, maturity, planted, lang }: Props) {
  return (
    <Link
      href={`/${lang}/${PATHS.notas[lang]}/${slug}`}
      className="block py-3 border-b border-[var(--border)] last:border-0 hover:text-[var(--accent)] transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{title}</span>
        <MaturityBadge maturity={maturity} lang={lang} />
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Índice (agrupado por maturidade)**

```tsx
// app/[lang]/notas/page.tsx
import { notFound } from 'next/navigation';
import { getNotes } from '@/lib/content';
import { isLocale, type Locale } from '@/lib/i18n';
import { NoteCard } from '@/components/ui/NoteCard';

const copy = {
  pt: {
    title: 'Notas',
    intro: 'Notas em diferentes estágios de maturação. Algumas são apenas ideias; outras, pensamentos já estáveis.',
    groups: { evergreen: '🌳 Maduras', budding: '🌿 Crescendo', seedling: '🌱 Brotos' },
  },
  en: {
    title: 'Notes',
    intro: 'Notes at different stages of maturity. Some are just ideas; others are stable thoughts.',
    groups: { evergreen: '🌳 Evergreen', budding: '🌿 Budding', seedling: '🌱 Seedlings' },
  },
} as const;

export default async function NotasIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const all = getNotes({ lang });
  const groups = {
    evergreen: all.filter((n) => n.maturity === 'evergreen'),
    budding: all.filter((n) => n.maturity === 'budding'),
    seedling: all.filter((n) => n.maturity === 'seedling'),
  };
  const t = copy[lang];
  const order = ['evergreen', 'budding', 'seedling'] as const;

  return (
    <main className="max-w-[760px] mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold">{t.title}</h1>
      <p className="mt-3 text-[var(--text-muted)]">{t.intro}</p>
      {order.map((m) => groups[m].length > 0 && (
        <section key={m} className="mt-8">
          <h2 className="font-serif text-xl mb-2">{t.groups[m]}</h2>
          {groups[m].map((n) => (
            <NoteCard
              key={n.translationKey}
              slug={n.slug}
              title={n.title}
              maturity={n.maturity}
              planted={n.planted}
              lang={lang as Locale}
            />
          ))}
        </section>
      ))}
    </main>
  );
}
```

- [ ] **Step 4: Detalhe da nota**

```tsx
// app/[lang]/notas/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNoteBySlug, getNotes } from '@/lib/content';
import { allNotas } from 'content-collections';
import { isLocale, type Locale, PATHS } from '@/lib/i18n';
import { MDXContent } from '@/components/mdx/MDXContent';
import { MaturityBadge } from '@/components/ui/MaturityBadge';

export async function generateStaticParams() {
  const pt = getNotes({ lang: 'pt' });
  const en = getNotes({ lang: 'en' });
  return [
    ...pt.map((n) => ({ lang: 'pt', slug: n.slug })),
    ...en.map((n) => ({ lang: 'en', slug: n.slug })),
  ];
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const note = getNoteBySlug(slug, lang);
  if (!note) notFound();

  const related = note.related
    .map((key) => allNotas.find((n) => n.translationKey === key && n.lang === lang))
    .filter(Boolean);

  return (
    <article className="max-w-[680px] mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">{note.title}</h1>
        <div className="flex items-center gap-3 mt-3 text-sm text-[var(--text-muted)]">
          <MaturityBadge maturity={note.maturity} lang={lang as Locale} />
          <span>·</span>
          <time>{note.planted.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US')}</time>
        </div>
      </header>
      <div className="prose-content">
        <MDXContent code={note.body} />
      </div>
      {related.length > 0 && (
        <aside className="mt-10 pt-6 border-t border-[var(--border)]">
          <h3 className="font-serif text-lg">{lang === 'pt' ? 'Relacionadas' : 'Related'}</h3>
          <ul className="mt-2 space-y-1">
            {related.map((n) => n && (
              <li key={n.translationKey}>
                <Link href={`/${lang}/${PATHS.notas[lang]}/${n.slug}`}>{n.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
```

- [ ] **Step 5: Escrever 2 notas reais**

`content/notas/xgboost-vs-lightgbm.pt.mdx`:

```mdx
---
translationKey: "xgboost-vs-lightgbm"
slug: "xgboost-vs-lightgbm"
lang: "pt"
title: "XGBoost vs LightGBM pra dados tabulares pequenos"
maturity: "seedling"
planted: 2026-04-24
tags: ["ml", "gradient-boosting"]
related: []
---

Rascunho inicial. Por que escolhi XGBoost pro TCC mesmo sabendo que LightGBM costuma ser mais rápido...
```

`content/notas/train-val-test-splits.pt.mdx`:

```mdx
---
translationKey: "train-val-test-splits"
slug: "train-val-test-splits"
lang: "pt"
title: "Train/val/test: separação temporal vs aleatória"
maturity: "budding"
planted: 2026-04-20
tended: 2026-04-24
tags: ["ml", "experimento"]
related: []
---

Nota em construção sobre quando faz sentido separar por tempo e quando separar aleatoriamente...
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(notas): add garden pages with maturity grouping and 2 notes"
```

## Task 20: Página `/tags/[tag]`

**Files:**
- Create: `app/[lang]/posts/tags/[tag]/page.tsx`

- [ ] **Step 1: Implementar**

```tsx
// app/[lang]/posts/tags/[tag]/page.tsx
import { notFound } from 'next/navigation';
import { getPostsByTag, getAllTags } from '@/lib/content';
import { isLocale, type Locale, LOCALES } from '@/lib/i18n';
import { PostCard } from '@/components/ui/PostCard';

export async function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getAllTags(lang).map((tag) => ({ lang, tag }))
  );
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}) {
  const { lang, tag } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getPostsByTag(tag, lang);
  if (posts.length === 0) notFound();

  return (
    <main className="max-w-[800px] mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">
        {lang === 'pt' ? 'Posts com a tag' : 'Posts tagged'} <code>#{tag}</code>
      </h1>
      <div className="mt-8">
        {posts.map((p) => (
          <PostCard
            key={p.translationKey}
            slug={p.slug}
            title={p.title}
            description={p.description}
            date={p.date}
            tags={p.tags}
            lang={lang as Locale}
          />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(posts): add tag filter page"
```

**Critério de pronto Fase 2:** projetos e notas acessíveis; home (Fase 3) poderá linkar pra conteúdo real.

---

# Fase 3 — Home e descoberta

**Meta:** home com identidade + busca + RSS + sitemap + share.

## Task 21: Componentes da home

**Files:**
- Create: `components/home/Hero.tsx`, `RecentPosts.tsx`, `FeaturedProjects.tsx`, `GardenPeek.tsx`
- Modify: `app/[lang]/page.tsx`

- [ ] **Step 1: `Hero`**

```tsx
import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

const copy = {
  pt: {
    line1: 'Olá. Escrevo sobre visão computacional,',
    line2: 'machine learning e o que aprendo no meu TCC.',
    cta1: 'Ler posts →', cta2: 'Ver projetos →',
  },
  en: {
    line1: 'Hi. I write about computer vision,',
    line2: 'machine learning, and what I learn during my thesis.',
    cta1: 'Read posts →', cta2: 'See projects →',
  },
} as const;

export function Hero({ lang }: { lang: Locale }) {
  const t = copy[lang];
  return (
    <section className="py-20">
      <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
        {t.line1}<br />{t.line2}
      </h1>
      <div className="flex gap-4 mt-8 text-lg">
        <Link href={`/${lang}/${PATHS.posts[lang]}`} className="text-[var(--accent)]">{t.cta1}</Link>
        <Link href={`/${lang}/${PATHS.projetos[lang]}`}>{t.cta2}</Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `RecentPosts`**

```tsx
import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { PATHS, type Locale } from '@/lib/i18n';
import { PostCard } from '@/components/ui/PostCard';

export function RecentPosts({ lang }: { lang: Locale }) {
  const posts = getPosts({ lang }).slice(0, 3);
  if (posts.length === 0) return null;
  const label = lang === 'pt' ? 'Escritos recentes' : 'Recent writing';
  const allLabel = lang === 'pt' ? 'todos os posts →' : 'all posts →';

  return (
    <section className="py-10 border-t border-[var(--border)]">
      <h2 className="font-serif text-2xl mb-4">{label}</h2>
      {posts.map((p) => (
        <PostCard key={p.translationKey} slug={p.slug} title={p.title}
          description={p.description} date={p.date} tags={p.tags} lang={lang} />
      ))}
      <Link href={`/${lang}/${PATHS.posts[lang]}`} className="inline-block mt-4 text-sm">
        {allLabel}
      </Link>
    </section>
  );
}
```

- [ ] **Step 3: `FeaturedProjects`**

```tsx
import { getProjects } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { ProjectCard } from '@/components/ui/ProjectCard';

export function FeaturedProjects({ lang }: { lang: Locale }) {
  const featured = getProjects({ lang }).filter((p) => p.featured).slice(0, 2);
  if (featured.length === 0) return null;
  const label = lang === 'pt' ? 'Em construção' : 'Building';

  return (
    <section className="py-10 border-t border-[var(--border)]">
      <h2 className="font-serif text-2xl mb-4">{label}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {featured.map((p) => (
          <ProjectCard key={p.translationKey} slug={p.slug} title={p.title}
            tagline={p.tagline} status={p.status} stack={p.stack} cover={p.cover} lang={lang} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `GardenPeek`**

```tsx
import { getNotes } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { NoteCard } from '@/components/ui/NoteCard';

export function GardenPeek({ lang }: { lang: Locale }) {
  const notes = getNotes({ lang }).slice(0, 3);
  if (notes.length === 0) return null;
  const label = lang === 'pt' ? 'Do garden' : 'From the garden';

  return (
    <section className="py-10 border-t border-[var(--border)]">
      <h2 className="font-serif text-2xl mb-4">{label}</h2>
      {notes.map((n) => (
        <NoteCard key={n.translationKey} slug={n.slug} title={n.title}
          maturity={n.maturity} planted={n.planted} lang={lang} />
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Atualizar `app/[lang]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { Hero } from '@/components/home/Hero';
import { RecentPosts } from '@/components/home/RecentPosts';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { GardenPeek } from '@/components/home/GardenPeek';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  return (
    <main className="max-w-[800px] mx-auto px-4">
      <Hero lang={l} />
      <RecentPosts lang={l} />
      <FeaturedProjects lang={l} />
      <GardenPeek lang={l} />
    </main>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(home): add hero, recent posts, featured projects, garden peek"
```

## Task 22: Busca com MiniSearch

**Files:**
- Create: `lib/search.ts`, `app/api/search-index/route.ts`
- Create: `components/ui/SearchDialog.tsx`, `SearchTrigger.tsx`
- Modify: `components/layout/Nav.tsx`

- [ ] **Step 1: Instalar**

```bash
pnpm add minisearch
```

- [ ] **Step 2: `lib/search.ts`**

```ts
import type { Locale } from './i18n';

export interface SearchResult {
  id: string;
  type: 'post' | 'projeto' | 'nota';
  title: string;
  description?: string;
  href: string;
}

export interface SearchIndex {
  documents: Array<SearchResult & { content: string }>;
}

// Interface estável — v0.1 usa MiniSearch client-side; v1.0+ pode trocar por embeddings.
export async function buildSearchIndex(lang: Locale): Promise<SearchIndex> {
  const { getPosts, getProjects, getNotes } = await import('./content');
  const { PATHS } = await import('./i18n');

  const posts = getPosts({ lang }).map((p) => ({
    id: `post-${p.translationKey}`,
    type: 'post' as const,
    title: p.title,
    description: p.description,
    content: p.description,
    href: `/${lang}/${PATHS.posts[lang]}/${p.slug}`,
  }));

  const projects = getProjects({ lang }).map((p) => ({
    id: `projeto-${p.translationKey}`,
    type: 'projeto' as const,
    title: p.title,
    description: p.tagline,
    content: `${p.tagline} ${p.description} ${p.stack.join(' ')}`,
    href: `/${lang}/${PATHS.projetos[lang]}/${p.slug}`,
  }));

  const notes = getNotes({ lang }).map((n) => ({
    id: `nota-${n.translationKey}`,
    type: 'nota' as const,
    title: n.title,
    content: n.title,
    href: `/${lang}/${PATHS.notas[lang]}/${n.slug}`,
  }));

  return { documents: [...posts, ...projects, ...notes] };
}
```

- [ ] **Step 3: Rota do índice**

```ts
// app/api/search-index/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { buildSearchIndex } from '@/lib/search';
import { isLocale } from '@/lib/i18n';

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang');
  if (!lang || !isLocale(lang)) return NextResponse.json({ error: 'bad lang' }, { status: 400 });
  const index = await buildSearchIndex(lang);
  return NextResponse.json(index);
}
```

- [ ] **Step 4: `SearchDialog`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import MiniSearch from 'minisearch';
import type { Locale } from '@/lib/i18n';
import type { SearchResult, SearchIndex } from '@/lib/search';

export function SearchDialog({
  open, onOpenChange, lang,
}: { open: boolean; onOpenChange: (v: boolean) => void; lang: Locale }) {
  const [index, setIndex] = useState<MiniSearch<SearchResult & { content: string }> | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || index) return;
    fetch(`/api/search-index?lang=${lang}`)
      .then((r) => r.json() as Promise<SearchIndex>)
      .then(({ documents }) => {
        const mini = new MiniSearch<SearchResult & { content: string }>({
          fields: ['title', 'description', 'content'],
          storeFields: ['id', 'type', 'title', 'description', 'href'],
          searchOptions: { boost: { title: 3, description: 2 }, prefix: true, fuzzy: 0.2 },
        });
        mini.addAll(documents);
        setIndex(mini);
      });
  }, [open, index, lang]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!index || !query) return setResults([]);
    const matches = index.search(query);
    setResults(matches.slice(0, 10) as unknown as SearchResult[]);
  }, [index, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-24"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-[var(--bg-elevated)] rounded-lg w-full max-w-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'pt' ? 'Buscar...' : 'Search...'}
          className="w-full p-4 bg-transparent outline-none border-b border-[var(--border)] text-lg"
        />
        <ul className="max-h-96 overflow-auto">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 p-3 hover:bg-[var(--code-bg)]"
              >
                <span className="text-xs text-[var(--text-muted)] uppercase">{r.type}</span>
                <span>{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `SearchTrigger`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchDialog } from './SearchDialog';
import type { Locale } from '@/lib/i18n';

export function SearchTrigger({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Search" className="text-xl">🔍</button>
      <SearchDialog open={open} onOpenChange={setOpen} lang={lang} />
    </>
  );
}
```

- [ ] **Step 6: Integrar no `Nav.tsx`**

Importar e adicionar `<SearchTrigger lang={lang} />` antes do `<ThemeToggle />`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(search): add search dialog with MiniSearch and ⌘K shortcut"
```

## Task 23: RSS e sitemap

**Files:**
- Create: `app/rss.xml/route.ts`, `app/en/rss.xml/route.ts`, `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: RSS pt**

```ts
import { getPosts } from '@/lib/content';
import { PATHS } from '@/lib/i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marcospaulo.dev';

export async function GET() {
  const posts = getPosts({ lang: 'pt' });
  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE}/pt/${PATHS.posts.pt}/${p.slug}</link>
      <guid>${SITE}/pt/${PATHS.posts.pt}/${p.slug}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Marcos Medeiros — Blog</title>
    <link>${SITE}/pt</link>
    <description>Posts sobre ML, visão computacional e TCC.</description>
    <language>pt-BR</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } });
}
```

- [ ] **Step 2: RSS en**

Copiar o `route.ts` pra `app/en/rss.xml/route.ts`, trocar `'pt'` → `'en'` e `'pt-BR'` → `'en-US'`.

- [ ] **Step 3: Sitemap**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getPosts, getProjects, getNotes } from '@/lib/content';
import { PATHS, LOCALES } from '@/lib/i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marcospaulo.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = LOCALES.flatMap((lang) => [
    `/${lang}`,
    `/${lang}/${PATHS.posts[lang]}`,
    `/${lang}/${PATHS.projetos[lang]}`,
    `/${lang}/${PATHS.notas[lang]}`,
    `/${lang}/${PATHS.sobre[lang]}`,
  ]);

  const dynamicRoutes = LOCALES.flatMap((lang) => [
    ...getPosts({ lang }).map((p) => `/${lang}/${PATHS.posts[lang]}/${p.slug}`),
    ...getProjects({ lang }).map((p) => `/${lang}/${PATHS.projetos[lang]}/${p.slug}`),
    ...getNotes({ lang }).map((n) => `/${lang}/${PATHS.notas[lang]}/${n.slug}`),
  ]);

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
```

- [ ] **Step 4: Robots**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marcospaulo.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(seo): add RSS feeds, sitemap, and robots.txt"
```

## Task 24: Share buttons + Footer + `<NewsletterCta>` stub

**Files:**
- Create: `components/ui/ShareButtons.tsx`, `NewsletterCta.tsx`, `components/layout/Footer.tsx`
- Modify: `app/[lang]/posts/[slug]/page.tsx`, `app/[lang]/layout.tsx`

- [ ] **Step 1: `ShareButtons`**

```tsx
'use client';
import type { Locale } from '@/lib/i18n';

export function ShareButtons({ url, title, lang }: { url: string; title: string; lang: Locale }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const x = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const ln = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div className="flex gap-3 text-sm">
      <a href={x} target="_blank" rel="noopener">X</a>
      <a href={ln} target="_blank" rel="noopener">LinkedIn</a>
      <button onClick={() => navigator.clipboard.writeText(url)} className="underline">
        {lang === 'pt' ? 'Copiar link' : 'Copy link'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: `NewsletterCta` stub**

```tsx
// v0.1 stub — v0.2 substitui por Buttondown/ConvertKit embed.
export function NewsletterCta() {
  return null;
}
```

- [ ] **Step 3: `Footer`**

```tsx
import type { Locale } from '@/lib/i18n';
import { NewsletterCta } from '@/components/ui/NewsletterCta';

export function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="mt-20 border-t border-[var(--border)] py-8 text-sm text-[var(--text-muted)]">
      <div className="max-w-[1000px] mx-auto px-4 flex flex-wrap gap-4 justify-between">
        <div>© {new Date().getFullYear()} Marcos Medeiros</div>
        <div className="flex gap-4">
          <a href={`/${lang === 'pt' ? '' : 'en/'}rss.xml`}>RSS</a>
          <a href="https://github.com/marcos-medeiros" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com/in/marcos-medeiros" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:marcospaulo_medeiros@hotmail.com">Email</a>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-4 mt-4">
        <NewsletterCta />
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Integrar footer no `app/[lang]/layout.tsx`**

```tsx
// envolver a estrutura:
<div data-lang={lang} className="min-h-screen flex flex-col">
  <Nav lang={lang as Locale} />
  <div className="flex-1">{children}</div>
  <Footer lang={lang as Locale} />
</div>
```

- [ ] **Step 5: Share no rodapé do post**

No `app/[lang]/posts/[slug]/page.tsx`, antes de `<PostComments>`:

```tsx
import { ShareButtons } from '@/components/ui/ShareButtons';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? '';

// ...
<ShareButtons
  url={`${SITE}/${lang}/posts/${post.slug}`}
  title={post.title}
  lang={lang as Locale}
/>
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(layout): add footer, share buttons, and newsletter stub"
```

**Critério de pronto Fase 3:** visitante descobre conteúdo por home, busca (⌘K), RSS ou sitemap.

---

# Fase 4 — Polish e OG images

**Meta:** impressão visual equivalente à referência + OG automática.

## Task 25: OG generator `/api/og`

**Files:**
- Create: `app/api/og/route.tsx`

- [ ] **Step 1: Implementar**

```tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'Marcos Medeiros';
  const tag = searchParams.get('tag') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: 'oklch(97% 0.02 65)',
          padding: 80,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 28, color: 'oklch(45% 0.03 50)' }}>
          marcospaulo.dev
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, color: 'oklch(22% 0.04 50)', lineHeight: 1.1 }}>
          {title}
        </div>
        {tag && (
          <div style={{ fontSize: 24, color: 'oklch(62% 0.18 25)' }}>#{tag}</div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

- [ ] **Step 2: Testar**

`http://localhost:3000/api/og?title=Status+do+TCC&tag=ml` — deve retornar PNG.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(og): add OG image generator with Peach palette"
```

## Task 26: Metadata helper + aplicar em posts

**Files:**
- Create: `lib/metadata.ts`
- Modify: `app/[lang]/posts/[slug]/page.tsx` (e análogos em projetos/notas/sobre)

- [ ] **Step 1: Helper**

```ts
// lib/metadata.ts
import type { Metadata } from 'next';
import { LOCALES, type Locale } from './i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marcospaulo.dev';

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  ogImageUrl?: string;
  alternatePaths?: Partial<Record<Locale, string>>;
}

export function buildMetadata({
  title, description, path, ogImageUrl, alternatePaths,
}: PageMetadata): Metadata {
  const ogUrl = ogImageUrl ?? `${SITE}/api/og?title=${encodeURIComponent(title)}`;
  const languages: Record<string, string> = {};
  LOCALES.forEach((lang) => {
    if (alternatePaths?.[lang]) {
      languages[lang === 'pt' ? 'pt-BR' : 'en'] = `${SITE}${alternatePaths[lang]}`;
    }
  });
  languages['x-default'] = `${SITE}${alternatePaths?.pt ?? path}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}${path}`, languages },
    openGraph: {
      title, description,
      url: `${SITE}${path}`,
      images: [ogUrl],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: [ogUrl],
    },
  };
}
```

- [ ] **Step 2: Aplicar em posts**

No topo de `app/[lang]/posts/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { allPosts } from 'content-collections';
import { PATHS } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPostBySlug(slug, lang as Locale);
  if (!post) return {};

  const alternates: Partial<Record<Locale, string>> = {
    [post.lang]: `/${post.lang}/${PATHS.posts[post.lang]}/${post.slug}`,
  };
  const other = allPosts.find((p) => p.translationKey === post.translationKey && p.lang !== post.lang);
  if (other) alternates[other.lang] = `/${other.lang}/${PATHS.posts[other.lang]}/${other.slug}`;

  const tagQuery = post.tags[0] ? `&tag=${post.tags[0]}` : '';
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/${post.lang}/${PATHS.posts[post.lang]}/${post.slug}`,
    ogImageUrl: `/api/og?title=${encodeURIComponent(post.title)}${tagQuery}`,
    alternatePaths: alternates,
  });
}
```

- [ ] **Step 3: Aplicar padrão em projetos e notas**

Replicar `generateMetadata` em `app/[lang]/projetos/[slug]/page.tsx` e `app/[lang]/notas/[slug]/page.tsx`, ajustando `PATHS` e os campos (projetos usam `tagline` como description; notas usam o `title` como fallback).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(seo): add metadata helper with OG, hreflang, and Twitter Cards"
```

## Task 27: Framer Motion + `<Reveal>` stub

**Files:**
- Create: `components/ui/Reveal.tsx`, `components/layout/PageTransition.tsx`
- Modify: `app/[lang]/layout.tsx`

- [ ] **Step 1: Instalar**

```bash
pnpm add framer-motion
```

- [ ] **Step 2: `PageTransition`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: `Reveal` no-op**

```tsx
// v0.1 stub — v0.3 adiciona scroll-triggered via Framer Motion.
import type { ReactNode } from 'react';

export function Reveal({ children }: { type?: 'fade' | 'slide'; children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 4: Integrar `PageTransition`**

Em `app/[lang]/layout.tsx`, envolver `{children}`:

```tsx
import { PageTransition } from '@/components/layout/PageTransition';
// ...
<div className="flex-1"><PageTransition>{children}</PageTransition></div>
```

- [ ] **Step 5: Checar bundle**

```bash
pnpm build
```

Se Framer Motion estourar 20KB gz client-side, avaliar import seletivo ou migrar page transitions pra CSS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(animation): add page transitions and Reveal stub"
```

## Task 28: Vercel Analytics

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Instalar**

```bash
pnpm add @vercel/analytics
```

- [ ] **Step 2: Integrar**

```tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head><script src="/theme-init.js" /></head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Ativar no dashboard Vercel**

Project → Analytics → Enable.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: enable Vercel Analytics"
```

## Task 29: `/sobre` em pt + en

**Files:**
- Modify: `app/[lang]/sobre/page.tsx`

- [ ] **Step 1: Substituir placeholder por bio real**

Biografia: Marcos Paulo Medeiros, graduação em CS na UPF (Universidade de Passo Fundo), TCC sobre pose estimation + ML aplicado a esportes (direção de pênaltis), interesses em visão computacional e ML aplicada. Contatos: email, GitHub, LinkedIn.

Duas versões (pt + en) no mesmo arquivo via `copy` object.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "content: write real sobre/about page"
```

**Critério de pronto Fase 4:** compartilhar URL mostra OG image correta; site "se parece" com referência Josh Comeau lite.

---

# Fase 5 — Conteúdo final e lançamento

**Meta:** 3 posts + 2 projetos + domínio + go-live.

## Task 30: Post 2 — MediaPipe Pose primeiras impressões

**Files:**
- Create: `content/posts/<data>-mediapipe-impressoes.pt.mdx`

- [ ] **Step 1: Escrever (~500-800 palavras)**

Conteúdo: o que é o MediaPipe, como funciona pose estimation, o que descobri testando pra meu caso (cobranças de pênalti), limitações, comparação com OpenPose. Incluir code block Python de exemplo.

Frontmatter:

```yaml
---
translationKey: "mediapipe-primeiras-impressoes"
slug: "mediapipe-primeiras-impressoes"
lang: "pt"
title: "MediaPipe Pose: primeiras impressões"
description: "O que aprendi nas primeiras semanas testando MediaPipe Pose pro TCC — o bom, o estranho, e por que escolhi ela."
date: <data-atual>
tags: ["mediapipe", "visao-computacional", "tcc"]
status: "published"
projectKey: "tcc-penalty-direction"
---
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "content: add post on MediaPipe Pose first impressions"
```

## Task 31: Post 3 — Por que XGBoost pra direção de pênalti

**Files:**
- Create: `content/posts/<data>-xgboost-penalti.pt.mdx`

- [ ] **Step 1: Escrever**

Conteúdo: por que começar com XGBoost antes de ir pra redes profundas. Discussão do baseline, feature engineering a partir de landmarks, resultados preliminares.

Frontmatter similar ao anterior, com tags ["xgboost", "ml", "tcc"] e `projectKey: "tcc-penalty-direction"`.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "content: add post on XGBoost choice for penalty direction"
```

## Task 32: 2º projeto

**Files:**
- Create: `content/projetos/<projeto>.pt.mdx`

- [ ] **Step 1: Escolher um projeto pré-existente**

Candidatos: trabalho de BD, compiladores, web, etc. Recuperar do GitHub/drives, escrever descrição.

- [ ] **Step 2: Escrever `.pt.mdx`**

Com `featured: false`, `status: 'completed'` ou `'archived'` conforme o caso.

- [ ] **Step 3: Commit**

```bash
git add content/projetos/<slug>.pt.mdx
git commit -m "content: add second project to portfolio"
```

## Task 33: Domínio custom

- [ ] **Step 1: Comprar domínio**

Candidatos: `marcospaulo.dev` (~$12/ano Porkbun/Cloudflare), `marcosmedeiros.com.br` (~R$40/ano Registro.br).

- [ ] **Step 2: Apontar DNS pra Vercel**

Vercel → Project → Settings → Domains → adicionar → seguir instruções DNS.

- [ ] **Step 3: `NEXT_PUBLIC_SITE_URL` em produção**

Vercel → Project → Settings → Environment Variables: `NEXT_PUBLIC_SITE_URL=https://<dominio>`.

- [ ] **Step 4: Re-deploy**

Trigger re-deploy ou push commit vazio:

```bash
git commit --allow-empty -m "chore: trigger redeploy with NEXT_PUBLIC_SITE_URL"
git push
```

- [ ] **Step 5: Verificar**

- HTTPS funciona
- `/sitemap.xml` acessível
- Compartilhar URL mostra OG correta

- [ ] **Step 6: Atualizar README**

```bash
git add README.md
git commit -m "docs: update README with production URL"
```

## Task 34: Lançamento

- [ ] **Step 1: QA final**

- Abrir home, /posts, 1 post, /projetos, /notas, /sobre no mobile e desktop, light e dark
- Compartilhar 1 post no X e LinkedIn pessoal — conferir OG
- Validar RSS em https://validator.w3.org/feed/
- Testar ⌘K em 3 browsers diferentes
- Clicar todos os CTAs da home

- [ ] **Step 2: Tag + commit "go live"**

```bash
git commit --allow-empty -m "release: v0.1 — blog go live"
git tag v0.1.0
git push --tags
```

- [ ] **Step 3: Anunciar**

- Grupos/comunidades UPF
- LinkedIn pessoal
- Atualizar bio do GitHub com link
- Adicionar link no template de assinatura de email

**Critério de pronto Fase 5:** autor confortável compartilhando URL com recrutador ou grupo de curso.

---

# Auto-revisão do plano

**Cobertura do spec (mapa seção → task):**

| Seção do spec | Tasks |
|---|---|
| §3 Arquitetura e stack | 1, 2, 10, 12 |
| §4 URL structure e i18n | 3, 4, 5, 6 |
| §5 Modelo de conteúdo | 11, 13, 14 |
| §6 Sistema visual | 7, 12, 15, 18, 19, 21, 27 |
| §7 Fases 0-5 | Tasks agrupadas por fase (1-34) |
| §8 Hooks arquiteturais | PostComments (15), NewsletterCta (24), search interface (22), CodePlayground (13), Reveal (27) — todos stubs implementados |
| §9 Non-goals | Respeitados (comentários, newsletter, tradução auto, code playground, scroll reveals ficaram como stubs ou fora) |
| §10 Questões em aberto | Domínio resolvido na Task 33 |

**Placeholder scan:** nenhum TBD/TODO bloqueante. Tasks 17, 29, 30, 31, 32 pedem conteúdo real do autor — explícito, não é placeholder de implementação.

**Type consistency:**
- `getPosts/getProjects/getNotes` com mesma assinatura em lib/content.ts (Task 14) e usos (Tasks 16, 18, 19, 21, 22, 23).
- `translatePath(path, from, to)` consistente entre definição (Task 3) e uso (Task 6).
- `PATHS[key][lang]` consistente.
- `MaturityBadge` tipo literal `'seedling' | 'budding' | 'evergreen'` mesmo em schema (Task 11) e componentes (Task 19, 21).
- `SearchResult` definido em `lib/search.ts` (Task 22) e usado em `SearchDialog`.
