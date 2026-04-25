# Blog pessoal — Design

**Data:** 2026-04-24
**Autor:** Marcos Medeiros
**Status:** Aprovado — pronto pra plano de implementação

> **AMENDMENT 2026-04-25:** Visual direction redesigned to "Dev Premium" (Linear/Vercel/Resend inspired) following an external design handoff. The Peach Noir palette + IBM Plex trio described below were replaced with: dark default, purple accent (#a78bfa dark / #7c3aed light), Inter + JetBrains Mono, gridlines + glow gradient background. Architecture (hybrid: posts + projects + notes + stack + sobre) is preserved. New pages added: /now, /tags index, /newsletter, /404. See `docs/design-handoff/` and `docs/implementation-log.md` "Redesign Dev Premium" section for details.

---

## 1. Contexto e motivação

Este documento desenha um site/blog pessoal para servir três propósitos simultâneos:

- **Portfólio** de projetos pessoais e acadêmicos (incluindo o TCC em andamento sobre predição de direção de pênaltis com MediaPipe Pose + XGBoost/LSTM/CNN+LSTM).
- **Blog** datado, com posts sobre estudos, experimentos e aprendizados na interseção de visão computacional, machine learning e desenvolvimento.
- **Digital garden**, com notas em diferentes níveis de maturidade que evoluem no tempo.

O site é bilíngue (pt-BR + en), com tradução manual pelo autor. O idioma primário é pt-BR; inglês é opt-in por conteúdo.

### Público-alvo

- Comunidade brasileira de desenvolvedores/pesquisadores (pt-BR).
- Recrutadores e pesquisadores internacionais (en) — portfólio e conteúdo destacado.
- O próprio autor, como arquivo vivo do aprendizado durante a graduação e além.

### Por que não usar plataforma pronta

Um site custom em Next.js atende três objetivos que plataformas SaaS (Substack, Medium, Bear Blog) não atendem simultaneamente: **controle total** sobre identidade visual, **portabilidade** do conteúdo (Markdown local, git-versionado), e **o próprio site vira um projeto do portfólio** — recrutador avalia o blog tanto pelo conteúdo quanto pela implementação.

## 2. Decisões consolidadas

| Dimensão | Decisão |
|---|---|
| Arquétipo | Híbrido: `/projetos` + `/posts` + `/notas` (garden) + `/sobre` |
| Público | Bilíngue pt-BR + en, tradução manual opt-in por post |
| Stack | Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 |
| Escopo inicial | v0.1 com visão completa (Abordagem 3) — disciplinada por timeboxing |
| Visual | "Peach Noir" — paleta quente (light) / plum profundo (dark), micro-animações, sem ilustrações custom |
| Tipografia | IBM Plex trio completo (Serif + Sans + Mono) |
| Deploy | Vercel Hobby (grátis) + domínio custom (.dev/.com.br) |
| Custo mensal | ~R$5 (só domínio, amortizado) |

### Arquétipo: híbrido com "centro de gravidade" em posts

A home trata **posts** como protagonistas (`Escritos recentes` no primeiro scroll), com projetos e notas como seções secundárias. Motivo: portfólio de aluno começa pequeno; blog cresce com o tempo e sustenta descoberta via search/redes sociais/RSS.

### Features do MVP v0.1

Incluídas:
- MDX com syntax highlighting (Shiki server-side)
- Tags (1 nível)
- Search client-side (MiniSearch com índice no build)
- RSS feed
- Botões de compartilhamento social
- Dark mode toggle
- OG images geradas programaticamente (@vercel/og)
- Framer Motion com budget ≤20KB (page transitions + hover lifts + link underlines)
- i18n via App Router com segmentos de rota traduzidos
- Vercel Analytics
- Sitemap com hreflang

Excluídas explicitamente (ver §8 Non-goals):
- Comentários
- Newsletter
- Tradução automática
- Semantic search
- Code playground interativo
- Scroll reveals elaborados

## 3. Arquitetura e stack

### Stack técnica

```
Framework:     Next.js 15 (App Router) + React 19 + TypeScript
Estilização:   Tailwind CSS v4 + CSS vars (OKLCH) para tema
Fontes:        IBM Plex Serif + Sans + Mono via next/font/google
Conteúdo:      @content-collections/core (MDX tipado com Zod)
Highlight:     rehype-pretty-code + Shiki (server-side, zero JS no cliente)
GFM:           remark-gfm (tabelas, task lists)
Busca:         MiniSearch (~5KB gz) com Dialog ⌘K/Ctrl+K
OG images:     @vercel/og + Satori
Animação:      Framer Motion (budget 20KB gz)
Analytics:     @vercel/analytics
Deploy:        Vercel Hobby
Hosting git:   GitHub público (o repo vira projeto no portfólio)
```

### Estrutura de pastas

```
/
├── app/
│   ├── [lang]/
│   │   ├── page.tsx                    # home
│   │   ├── projetos/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── tags/[tag]/page.tsx
│   │   ├── notas/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── sobre/page.tsx
│   ├── api/
│   │   ├── og/route.tsx                # OG generator
│   │   ├── rss/route.ts                # RSS feed
│   │   └── sitemap/route.ts
│   └── globals.css
├── content/
│   ├── posts/
│   │   ├── 2026-04-24-mediapipe-landmarks.pt.mdx
│   │   ├── 2026-04-24-mediapipe-landmarks.en.mdx  (opt-in)
│   │   └── 2026-04-24-mediapipe-landmarks/        (assets co-localizados)
│   │       ├── pose-overlay.png
│   │       └── demo.mp4
│   ├── projetos/
│   └── notas/
├── components/
│   ├── mdx/
│   │   ├── Figure.tsx
│   │   ├── Callout.tsx
│   │   ├── VideoEmbed.tsx
│   │   └── CodePlayground.tsx          (stub na v0.1, implementado na v0.4)
│   ├── layout/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── RecentPosts.tsx
│   │   ├── FeaturedProjects.tsx
│   │   └── GardenPeek.tsx
│   └── ui/
│       ├── SearchDialog.tsx
│       ├── PostCard.tsx
│       ├── ProjectCard.tsx
│       ├── NoteCard.tsx
│       ├── MaturityBadge.tsx
│       ├── TagPill.tsx
│       ├── ShareButtons.tsx
│       ├── Reveal.tsx                   (no-op na v0.1, ativo na v0.3)
│       ├── PostComments.tsx             (stub na v0.1, ativo na v0.2)
│       └── NewsletterCta.tsx            (stub na v0.1, ativo na v0.2)
├── lib/
│   ├── content.ts                       # queries tipadas
│   ├── i18n.ts                          # locales + PATHS map
│   ├── search.ts                        # interface searchContent()
│   └── og.tsx                           # template da OG image
├── content-collections.ts               # schemas Zod
├── middleware.ts                        # detecção de idioma + rewrite
├── ROADMAP.md                           # features diferidas, tracked
└── README.md
```

### Contratos críticos (interfaces)

1. **`lib/content.ts`** expõe `getPosts({ lang })`, `getProject(slug, lang)`, `getNotes({ lang, maturity? })`, `getPostsByTag(tag, lang)`. Nenhuma página lê filesystem direto.
2. **`middleware.ts`** detecta idioma na ordem: cookie `NEXT_LANG` > `Accept-Language` > default `pt`. Redireciona `/` → `/{lang}`. Rewrites `/en/projects` → rota interna `/[lang]/projetos` via mapa.
3. **`content-collections.ts`** valida frontmatter com Zod; falha de schema quebra o build.
4. **`lib/search.ts`** expõe `searchContent(query: string, lang: Locale): SearchResult[]` — interface estável; v0.1 usa MiniSearch, v1.0+ pode trocar por embeddings sem mudar consumidores.

## 4. URL structure e i18n

### Esquema de rotas

```
/                                  → redirect para /pt ou /en (middleware)

/pt                                /en
├── /                              /
├── /projetos                      /projects
│   └── /projetos/[slug]           /projects/[slug]
├── /posts                         /posts
│   ├── /posts/[slug]              /posts/[slug]
│   └── /posts/tags/[tag]          /posts/tags/[tag]
├── /notas                         /notes
│   └── /notas/[slug]              /notes/[slug]
└── /sobre                         /about

/rss.xml                           /en/rss.xml
/sitemap.xml                       (único, com hreflang para todas URLs)
```

### Implementação

**Source of truth em `lib/i18n.ts`:**

```ts
export const LOCALES = ['pt', 'en'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'pt';

export const PATHS = {
  projetos: { pt: 'projetos', en: 'projects' },
  posts:    { pt: 'posts',    en: 'posts' },
  notas:    { pt: 'notas',    en: 'notes' },
  sobre:    { pt: 'sobre',    en: 'about' },
  tags:     { pt: 'tags',     en: 'tags' },
} as const;
```

**Middleware** (3 responsabilidades):
1. Detecção de idioma: cookie > Accept-Language > default pt.
2. Redirect `/` → `/{lang}`.
3. Rewrite de paths traduzidos (`/en/projects` → interna `/en/projetos`).

**`<LanguageSwitcher />`** usa o `PATHS` para traduzir a URL atual. Se a tradução do slug não existir, cai para a raiz da seção traduzida (ex.: `/pt/posts/meu-post-so-pt` → `/en/posts` com aviso).

### Política de conteúdo sem tradução

**Regra única:** se um post existe só em um idioma, não aparece no índice do outro idioma. Acesso direto à URL inexistente (ex.: `/en/posts/so-em-pt`) retorna **404 com link para a versão pt-BR** e mensagem "This post isn't translated to English. Read it in Portuguese →".

Motivação: mostrar conteúdo pt dentro de `/en/...` bagunça SEO e confunde hreflang.

### Slugs e chave de tradução

- **Slug é por idioma** (`projetos/tcc-penalidades` em pt, `projects/tcc-penalty-direction` em en).
- **`translationKey` compartilhado** no frontmatter une as duas versões.
- **Tags ficam em inglês nas URLs** (`/tags/ml`, `/tags/computer-vision`). Display traduzido via `lib/i18n.ts`.

### SEO e hreflang

Cada página renderiza:

```html
<link rel="alternate" hreflang="pt-BR" href="https://.../pt/..." />
<link rel="alternate" hreflang="en" href="https://.../en/..." />
<link rel="alternate" hreflang="x-default" href="https://.../pt/..." />
```

Sitemap único na raiz, com todas URLs e suas alternates em XML válido.

## 5. Modelo de conteúdo

### Tipo `Post` — artigos do blog

```ts
const Post = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.{pt,en}.mdx",
  schema: (z) => ({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(["pt", "en"]),
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
    projectKey: z.string().optional(),
    cover: z.string().optional(),
    readingTime: z.number().optional(),
  }),
});
```

### Tipo `Projeto` — portfólio

```ts
const Projeto = defineCollection({
  name: "projetos",
  directory: "content/projetos",
  include: "*.{pt,en}.mdx",
  schema: (z) => ({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(["pt", "en"]),
    title: z.string(),
    tagline: z.string().max(120),
    description: z.string(),
    period: z.object({
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
    }),
    status: z.enum(["active", "completed", "archived"]),
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
});
```

### Tipo `Nota` — garden

```ts
const Nota = defineCollection({
  name: "notas",
  directory: "content/notas",
  include: "*.{pt,en}.mdx",
  schema: (z) => ({
    translationKey: z.string(),
    slug: z.string(),
    lang: z.enum(["pt", "en"]),
    title: z.string(),
    maturity: z.enum(["seedling", "budding", "evergreen"]).default("seedling"),
    planted: z.coerce.date(),
    tended: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});
```

### Invariantes do build

O build **quebra** se qualquer condição abaixo for violada:

1. Um `translationKey` tem mais de 2 arquivos.
2. Arquivos `.pt.mdx` e `.en.mdx` com mesmo `translationKey` têm `tags` diferentes.
3. Post com `status: "published"` tem `description` vazia.
4. Data de `.en.mdx` é anterior à do `.pt.mdx` correspondente.

### Assets

Co-localizados em pasta com mesmo nome-base do arquivo:

```
content/posts/2026-04-24-mediapipe-landmarks.pt.mdx
content/posts/2026-04-24-mediapipe-landmarks/
├── pose-overlay.png
├── landmarks-diagram.svg
└── demo.mp4
```

Imagens passam por `next/image` com otimização automática. Vídeos >5MB vão para `/public` ou CDN externo (decisão caso-a-caso durante implementação).

### Componentes MDX disponíveis

- `<Figure src caption />` — imagem com legenda estilizada
- `<Callout type="info|warn|tip"> ... </Callout>` — blocos de destaque
- `<VideoEmbed src poster? />` — vídeo com lazy load
- `<CodePlayground lang code />` — stub na v0.1 (renderiza `<pre>` estático), implementação real em v0.4

Code blocks padrão via Shiki, server-side, zero JS no cliente.

### Fluxo de publicação

```
1. Criar:     content/posts/YYYY-MM-DD-slug.pt.mdx (status: "draft")
2. Dev:       NEXT_PUBLIC_DRAFTS=1 pnpm dev       (drafts visíveis)
3. Revisar:   conferir renderização local
4. Publicar:  status: "published" + git push      (deploy automático)
5. (Opcional) Escrever .en.mdx quando fizer sentido
```

## 6. Sistema visual e layout

### Paleta "Peach Noir" (CSS vars, OKLCH)

**Light — "Morning peach":**

```css
--bg-primary:      oklch(97% 0.02 65);
--bg-elevated:     oklch(99% 0.01 65);
--text-primary:    oklch(22% 0.04 50);
--text-muted:      oklch(45% 0.03 50);
--accent:          oklch(62% 0.18 25);    /* coral/laranja-avermelhado */
--accent-hover:    oklch(55% 0.20 25);
--link:            oklch(50% 0.14 240);   /* azul-petróleo */
--border:          oklch(90% 0.02 60);
--code-bg:         oklch(94% 0.01 60);
```

**Dark — "Midnight plum":**

```css
--bg-primary:      oklch(18% 0.03 330);   /* roxo profundo, não preto */
--bg-elevated:     oklch(22% 0.04 330);
--text-primary:    oklch(94% 0.01 65);    /* creme quente */
--text-muted:      oklch(70% 0.02 50);
--accent:          oklch(72% 0.16 30);    /* coral mais claro */
--link:            oklch(72% 0.12 230);
--border:          oklch(30% 0.03 330);
--code-bg:         oklch(25% 0.03 330);
```

Todas as cores em OKLCH (Tailwind v4 nativo) para gradientes perceptualmente uniformes e contraste calculável. Máximo 3 cores de acento; restante via variações de luminosidade.

### Tipografia

| Uso | Fonte | Pesos |
|---|---|---|
| Display (h1, hero) | IBM Plex Serif | 600, 700 |
| Body (parágrafos, h2–h4) | IBM Plex Sans | 400, 500, 600 |
| Code | IBM Plex Mono | 400, 600 |

Carregadas via `next/font/google` com subsets `latin` + `latin-ext` e `display: "swap"`.

- Escala tipográfica: **Major Third (1.250)**, calculada em `--text-xs` até `--text-5xl` em `globals.css`.
- Line-height do body: **1.75** (respiro para leitura longa).
- Max-width do corpo de post: **~680px** (leitura confortável).

### Micro-animações — budget rígido ≤20KB gz

- **Page transitions**: fade + slide 8px, 180ms. Respeita `prefers-reduced-motion`.
- **Hover lift** em cards: `translateY(-2px)` + sombra suave, 150ms.
- **Link underlines**: pseudo-elemento `::after` crescendo da esquerda, 200ms.
- **Dark mode toggle**: cross-fade + ícone rotaciona 180° (só o ícone).
- **Não incluído na v0.1**: scroll reveals, parallax, animações elaboradas. (Reveal component existe como no-op; ativa na v0.3.)

### Layouts das páginas

**Home (`/pt` ou `/en`):**

```
┌─────────────────────────────────────────────┐
│  Marcos Medeiros                      🌙 🔍  │
├─────────────────────────────────────────────┤
│   Olá. Escrevo sobre visão                  │  ← Plex Serif 5xl
│   computacional, machine learning           │
│   e o que aprendo no meu TCC.               │
│   [Ler posts →]  [Ver projetos →]           │
├─────────────────────────────────────────────┤
│   Escritos recentes                         │  ← 3 posts recentes
├─────────────────────────────────────────────┤
│   Em construção                             │  ← 1–2 projetos featured
├─────────────────────────────────────────────┤
│   Do garden                                 │  ← 3 notas (mix de maturidades)
└─────────────────────────────────────────────┘
Footer: RSS · GitHub · LinkedIn · Email
```

**`/posts`:** lista cronológica reversa, agrupada por ano. Cada item: data (muted), título (Plex Serif 2xl), descrição, tags (pills). Filtro por tag no topo.

**`/posts/[slug]`:** coluna central 680px. Header com título em Plex Serif, metadata (data, tempo de leitura, tags). Conteúdo MDX. Rodapé: posts anterior/próximo, share buttons, link para outra versão de idioma se existir, slots stub de `<PostComments>` e `<NewsletterCta>` (v0.2).

**`/projetos`:** grid de cards 2 colunas (desktop) / 1 coluna (mobile). Cada card: cover, título, tagline, status badge, stack pills, links primários.

**`/projetos/[slug]`:** header com período, stack, status, links. Corpo MDX narrativo. Ao final, listagem automática de posts com `projectKey` correspondente.

**`/notas`:** lista **não-cronológica**, agrupada por maturidade (seedling/budding/evergreen) **ou** por tag (toggle). Cada nota tem badge 🌱/🌿/🌳.

**`/notas/[slug]`:** título, maturity badge, `plantado`/`revisado`, tags, conteúdo, links para notas relacionadas (via `related`).

**`/sobre`:** uma página longa em prosa. Quem é, o que estuda, UPF, TCC, interesses, contato. Foto opcional.

### Display das maturidades (garden)

No frontmatter: `seedling | budding | evergreen` (inglês, estável).
No display:
- pt-BR: 🌱 Broto · 🌿 Crescendo · 🌳 Maduro
- en: 🌱 Seedling · 🌿 Budding · 🌳 Evergreen

Traduções vivem em `lib/i18n.ts`.

## 7. Fluxo de desenvolvimento e cronograma

### Princípio: timeboxing com checkpoints de sanidade

Abordagem de escopo completo (Abordagem 3) exige mitigação de "dev budget infinito". Mitigação é **timeboxing explícito por fase**. Se uma fase estoura >50% do estimado, próxima fase corta escopo — não expande.

### Fases do MVP v0.1

#### Fase 0 — Fundações (~1 semana, ~8-12h)

Meta: app Next.js rodando com i18n funcional e 1 página placeholder bilíngue.

Tarefas:
- `pnpm create next-app` (App Router, TS, Tailwind v4)
- `middleware.ts` com detecção de idioma + redirect `/` → `/pt`
- Rotas `[lang]/page.tsx` e `[lang]/sobre/page.tsx` com texto hardcoded
- `<LanguageSwitcher />` funcional pt ↔ en
- CSS vars da paleta Peach Noir (light) em `globals.css`
- Dark mode toggle (com `data-theme` attribute e persistência em localStorage)
- Deploy na Vercel, URL pública

**Critério de pronto:** URL Vercel mostra `/pt` e `/en`; toggle de dark mode funciona; switcher de idioma funciona.

#### Fase 1 — Pipeline de conteúdo (~1 semana, ~10-14h)

Meta: MDX renderizando com schema validado + 1 post real.

Tarefas:
- `@content-collections/core` com schemas Post/Projeto/Nota
- `rehype-pretty-code` + Shiki
- `components/mdx/Figure.tsx` e `Callout.tsx`
- `lib/content.ts` com queries
- Página `/[lang]/posts/[slug]`
- Página índice `/[lang]/posts`
- IBM Plex trio via `next/font`, tipografia aplicada

**Critério de pronto:** 1 post real (não lorem ipsum) escrito e renderizado em `/pt/posts/<slug>`.

#### Fase 2 — Portfólio e garden (~1 semana, ~8-12h)

Meta: as 3 seções existem com conteúdo real mínimo.

Tarefas:
- Páginas `/[lang]/projetos` e `/[lang]/projetos/[slug]`
- Páginas `/[lang]/notas` e `/[lang]/notas/[slug]` com `<MaturityBadge />`
- 1 projeto real (TCC) publicado
- 2 notas reais (seedling é aceitável — são rascunhos por definição)
- Tags funcionais: `/[lang]/posts/tags/[tag]` e filtro

**Critério de pronto:** home pode linkar para conteúdo real em todas as 3 seções.

#### Fase 3 — Home e descoberta (~4-6 dias, ~6-10h)

Meta: home com identidade, + busca, + RSS.

Tarefas:
- Home com hero, "Escritos recentes", "Em construção", "Do garden"
- `<SearchDialog />` com MiniSearch, atalho ⌘K/Ctrl+K
- `/rss.xml` (route handler)
- `/sitemap.xml` com hreflang
- `<ShareButtons />` no rodapé dos posts

**Critério de pronto:** visitante consegue descobrir conteúdo pela home, busca, RSS ou pesquisa.

#### Fase 4 — Polish e OG images (~3-5 dias, ~5-8h)

Meta: impressão visual equivalente à inspiração.

Tarefas:
- `/api/og` com `@vercel/og` gerando imagem pêssego + título em Plex Serif
- Open Graph + Twitter Cards metadata em todas páginas
- Framer Motion: page transitions + hover lifts (dentro do budget 20KB gz)
- Link underlines animados (`::after`)
- Vercel Analytics ativado
- Páginas `/sobre` em pt + en escritas

**Critério de pronto:** compartilhar URL no X/WhatsApp/LinkedIn mostra OG image correta; site "se parece" com a referência (Josh Comeau lite).

#### Fase 5 — Conteúdo inicial e lançamento (~1-2 semanas, parcialmente paralela à Fase 4)

Meta: conteúdo real mínimo antes do "go live" público.

Tarefas:
- 3 posts pt-BR publicados (ex.: "Status do TCC", "MediaPipe Pose: primeiras impressões", "Por que XGBoost")
- 2 projetos no portfólio (TCC + 1 projeto de cadeira)
- `/sobre` escrito em pt + en
- Domínio custom configurado e apontando

**Critério de pronto:** autor se sentiria confortável compartilhando a URL com recrutador ou em grupo do curso.

### Totais

- **Dev budget:** 4-6 semanas calendário (~35-55h efetivas).
- **Content budget (invariante):** 3 posts + 2 projetos + 2 notas + /sobre. **Esse invariante protege contra "blog nunca publicou"** — a v0.1 não é considerada completa sem ele.
- **Custo recorrente:** Vercel Hobby (grátis) + domínio (~R$40-60/ano). ~R$5/mês amortizado.

### Checkpoint de sanidade entre fases

Ao fim de cada fase, responder 3 perguntas (5 min):

1. O critério de pronto passou? Sim/Não.
2. A fase demorou >50% do estimado? Se sim, a próxima corta escopo.
3. Alguma decisão de design precisa mudar com base no aprendido? (Aceitável: "Plex Sans pesa na leitura longa, troco por Inter". Inaceitável: "me empolguei, quero adicionar X" — vai pro `ROADMAP.md`.)

### Cadência pós-lançamento

Meta: **1 post a cada 2-3 semanas**, sustentável ao lado de TCC e aulas. Cadência é meta-alvo, não obrigação — lapsos de 4-6 semanas são aceitáveis (ex.: semana de provas), mas lapsos de 2+ meses disparam retrospectiva sobre escopo/formato.

## 8. Roadmap v0.2+ e hooks arquiteturais

### Princípio: "adiar ≠ ignorar"

Features adiadas recebem **hooks arquiteturais na v0.1** para serem drop-in depois. Custo total dos hooks na v0.1: ~1h20min. Custo de não tê-los (refatoração futura): semanas.

### Tabela de hooks (implementar na v0.1)

| Feature adiada | Hook na v0.1 | Esforço hook | Fase (§7) |
|---|---|---|---|
| Comentários (Giscus) | `<PostComments postId={...} />` stub (retorna `null`) no final de `/posts/[slug]` | 15min | Fase 1 (junto com layout do post) |
| Newsletter | `<NewsletterCta />` stub no footer dos posts e `/sobre` | 10min | Fase 3 (montagem do footer) |
| Tradução automática | Schema já aceita `.pt.mdx`/`.en.mdx` com mesmo `translationKey`; adicionar script depois não muda nada | 0min | — (coberto pelo schema da Fase 1) |
| Semantic search | `lib/search.ts` expõe `searchContent()` como interface; MiniSearch é impl; trocar por embeddings depois muda só o corpo | 15min (interface) | Fase 3 (junto com SearchDialog) |
| Code playground | `<CodePlayground />` registrado como MDX component com fallback `<pre>` estático | 20min | Fase 1 (junto com outros MDX components) |
| Scroll reveals | `<Reveal type="fade">` como no-op (renderiza só `children`); na v0.3, adiciona Framer Motion | 15min | Fase 4 (junto com Framer Motion) |
| Traduções en dos posts legados | Não precisa de hook — só escrever o `.en.mdx` quando quiser | 0min | — |

### Tracking público

Três camadas:

1. **`ROADMAP.md` no repo** — arquivo único, versionado, sempre sincronizado. Features por prioridade com status (`pending` / `in_progress` / `done`).
2. **GitHub Issues** com labels `v0.2`, `v0.3`, `nice-to-have` — quando item vira trabalho real, sobe de `ROADMAP.md` para issue com descrição completa.
3. **Página `/roadmap`** (v0.3+) — expõe `ROADMAP.md` publicamente como accountability.

### Sequenciamento v0.2+

```
v0.2 — "Loop social"                              (~6-8h)
├── Giscus comments (ativar stub)
├── Newsletter embed (Buttondown trial grátis)
├── Traduzir os 3 primeiros posts pra EN
└── "Recent activity" widget na home

v0.3 — "Descoberta + polish"                      (~8-10h)
├── Search com highlight contextual (trecho do match)
├── OG images com variações por tag
├── RSS segmentado por tag
├── Scroll reveals (Reveal component ativado)
└── Página /roadmap pública

v0.4 — "Interatividade"                           (~15-25h)
├── CodePlayground ativado (Sandpack)
├── Demos embutidos de MediaPipe (vídeo + controles)
└── Visualização interativa de features

v1.0+ — "Se houver demanda real"
├── Semantic search com embeddings
├── Tradução automática com revisão
├── Analytics próprio (Umami self-hosted)
└── Conteúdo premium / área de assinantes
```

### Regra de promoção

Uma feature só sai do `ROADMAP.md` para implementação se tiver **2 usos reais identificados**.

Exceção: features "infra" que deterioram com tempo (ex.: traduções en dos primeiros posts — quanto mais tempo passa, mais difícil voltar e traduzir). Essas vão direto para v0.2 sem precisar da regra dos 2 usos.

## 9. Non-goals da v0.1

Lista explícita do que **NÃO** faz parte da v0.1, mesmo se bater empolgação:

- Comentários (Giscus/Disqus) — v0.2
- Newsletter — v0.2
- Tradução automática — v1.0+ (se fizer sentido)
- Semantic search com embeddings — v1.0+
- Code playground interativo (Sandpack) — v0.4
- Scroll reveals e parallax elaborados — v0.3
- Tradução en automática dos posts já escritos em pt — opt-in por post, não bloqueante
- Animações de página caprichadas (além das 4 micro-animações definidas)
- CMS visual (o conteúdo mora em MDX no git — sem admin UI)
- Área de login/membros — fora de escopo pra sempre, provavelmente
- Sistema de busca full-text avançado — MiniSearch cobre até ~50 posts

## 10. Questões em aberto

Resolver durante implementação, não bloqueantes para o design:

1. **Nome do domínio** — candidatos: `marcospaulo.dev`, `mpmedeiros.dev`, `marcosmedeiros.com.br`. Decisão durante Fase 5.
2. **Taxonomia inicial de tags** — começar enxuta (`tcc`, `ml`, `visao-computacional`, `notas`) e evoluir conforme o conteúdo aparece. Frontmatter já aceita array livre.
3. **Provedor do domínio** — Registro.br (.com.br) ou Porkbun/Cloudflare (.dev). Custo similar, decisão conforme extensão final.
4. **Foto em `/sobre`** — autor decide se quer foto ou só bio textual.

---

## Apêndice: links de referência

- **Inspirações visuais:**
  - [Josh Comeau](https://www.joshwcomeau.com) — direção visual base (sem ilustrações)
  - [brittanychiang.com](https://brittanychiang.com) — benchmark de portfólio
  - [maggieappleton.com](https://maggieappleton.com) — conceito de digital garden
  - [overreacted.io](https://overreacted.io) — referência de blog técnico minimalista
  - [jvns.ca](https://jvns.ca) — referência de cadência e foco em conteúdo

- **Tecnologias centrais:**
  - [Next.js 15 App Router](https://nextjs.org/docs/app)
  - [Tailwind CSS v4](https://tailwindcss.com)
  - [Content Collections](https://www.content-collections.dev/)
  - [rehype-pretty-code](https://rehype-pretty.pages.dev/)
  - [IBM Plex](https://www.ibm.com/plex/)
  - [@vercel/og](https://vercel.com/docs/functions/og-image-generation)
  - [MiniSearch](https://lucaong.github.io/minisearch/)
