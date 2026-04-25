# Handoff: Blog Pessoal — Direção "Dev Premium"

## Overview

Redesign do blog pessoal de Diego Costa (atualmente em `https://blog-pessoal-silk-nine.vercel.app/pt`). A direção escolhida é **"Dev Premium"** — estética inspirada em Linear / Vercel / Resend: gradientes sutis, tipografia mista (sans + mono), gridlines de fundo, dark mode como default e light mode bem trabalhado. Tom técnico, contemporâneo, silencioso.

O blog é em português (com possibilidade de PT/EN no futuro), mistura posts técnicos de TI com posts pessoais (vida, stack, projetos), e precisa suportar: dark/light, tempo de leitura, tags, busca, newsletter/RSS, "now page", links sociais, multilíngue.

## About the Design Files

Os arquivos em `reference/` são **referências de design feitas em HTML** — protótipos clicáveis que mostram a aparência e o comportamento desejados. **Não são código de produção para copiar diretamente.**

A tarefa é **recriar essas telas no codebase em desenvolvimento** (você já tem um Claude Code rodando nele) usando os padrões, libs e convenções já estabelecidos lá. Se o projeto usa Next.js + Tailwind, faça em Next.js + Tailwind. Se usa MDX para posts, mantenha MDX. As referências são guia visual e de comportamento, não estrutura de código.

## Fidelity

**Hi-fi.** Cores, tipografia, espaçamentos e interações estão definidos. Recrie pixel-perfect dentro do que o codebase suporta.

## Páginas / Telas

São 8 páginas, todas dentro de um shell único (header fixo + footer + grid de fundo + glow gradient no topo):

### 1. Home (`/`)
**Propósito:** entrada do blog. Hero curto, post em destaque, lista dos 4 posts seguintes.

**Layout:**
- Hero: status pill "● escrevendo agora" (com bullet pulsando), H1 (~64px, weight 600, letter-spacing -2.5), subtítulo em `textMuted`, dois CTAs (primário "ler último ensaio" + secundário "ver arquivo").
- Featured card: post mais recente em destaque, com flag `[01] · em destaque` em mono, título grande (32-36px), blurb, e meta footer (data · min). Hover → border vira `borderStrong`, surface vira `surfaceHover`.
- Lista de "leituras recentes": 4 rows. Cada row: número `№ 086`, data curta (`04.04`), título, tag colorida (em `accent`), tempo (`7m`). Hover desloca a row 2px para a direita.
- Link `ver todos os 87 posts →` no fim.

### 2. Post individual (`/posts/[slug]`)
**Propósito:** leitura confortável.

**Layout:**
- Container max-width ~720px, centralizado.
- Botão `← voltar` no topo.
- Título grande (~52px, weight 600, letter-spacing -2).
- Linha de meta em mono (11px, `textMuted`): `№ 087 · 19 abr 2026 · Rust · 11 min de leitura`. **Cada item com `white-space: nowrap`**, container com `flex-wrap: wrap`.
- Corpo do post: parágrafos com `font-size: 17`, `line-height: 1.75`, `color: text` (com 90% opacidade opcional).
- Inline code: `background: code` (accent com 12% alpha), `color: codeText`, padding `2px 6px`, border-radius 4.
- Code block: `background: surface`, border 1px `border`, padding 24, mono 13px, com header opcional `// arquivo.rs` em `textDim`.
- Footer do post: divider, linha "se gostou, me manda email" + tags relacionadas.

### 3. Arquivo (`/arquivo`)
**Propósito:** lista completa dos posts, com busca.

**Layout:**
- H1 "Arquivo" + contador "087 posts".
- Search bar: input full-width com placeholder `buscar por título, tag, ano…`, atalho `⌘K` em mono à direita. Border 1px `border`, focus → `borderStrong`.
- Lista com a mesma row pattern da home, mas todos os 87 posts (paginar ou virtualizar conforme o caso).

### 4. Sobre (`/sobre`)
**Propósito:** bio.

**Layout:**
- H1 "Sobre" + parágrafo de bio (até 3 parágrafos, font-size 17).
- Grid de 2 colunas com cards: "Stack atual", "Onde me achar", "O que escrevo aqui", "Disponibilidade".
- Cada card: title em mono uppercase 11px `textMuted`, conteúdo em sans 14px.

### 5. Now (`/now`)
**Propósito:** página `/now` no estilo nownownow.com.

**Layout:**
- H1 "Agora" + subtítulo em itálico `textMuted` "atualizado em 19 abr 2026".
- Lista de 3-5 itens em cards verticais, cada um: emoji ou ícone pequeno, label em mono uppercase, descrição.
- Link no rodapé "o que é uma /now page?" → nownownow.com.

### 6. Tags (`/tags`)
**Propósito:** índice de tags.

**Layout:**
- H1 "Tags".
- Grid de chips clicáveis. Cada chip: nome da tag + contador (`Rust 12`). Hover → `surfaceHover`. Tamanho da chip proporcional ao count (ou todos iguais — escolha do dev).

### 7. 404 (`/404`)
**Layout:**
- "404" em fonte gigante (~200px), com `background: linear-gradient(135deg, accent, text)` + `background-clip: text`.
- "página não encontrada" abaixo.
- Botão "voltar pra home".

### 8. Newsletter (`/newsletter`)
**Propósito:** página de assinatura standalone.

**Layout:**
- H1 "Newsletter", subtítulo curto.
- Input email + botão "assinar" (botão usa `text` como bg em dark, `accent` em light).
- Social proof: "1,247 leitores" em mono pequeno.
- Lista das 3 últimas edições com data e título.

## Shell (presente em todas as páginas)

### Header (sticky top)
- Logo: dot 8×8 com gradient (em dark: `linear-gradient(135deg, #fff 0%, #888 100%)`; em light: o inverso), nome `diego costa` weight 600, badge `v2.0` em mono dentro de uma border 1px.
- Nav central: `home / arquivo / sobre / now / tags`. Item ativo = `bg: surfaceHover`, weight 500. Inativo = `textMuted`.
- Direita: toggle de tema (☀/☾, border 1px), botão "newsletter" (bg `text`, color `bg`).
- Border-bottom 1px `border`. Background com leve blur/transparência.

### Footer
- Border-top 1px `border`, padding 24×32.
- Esquerda: `© 2026 diego costa · feito com cuidado` em mono 12px `textMuted`.
- Direita: links sociais (github, twitter, email, rss).

### Background
- `background: bg` base.
- Glow gradient no topo: radial gradient `glowA → glowB → transparente`, posição absolute top, height ~600px, opacity 1, mask para fade.
- Grid sutil: linhas verticais + horizontais a cada 40px, opacity ~0.03 em dark, ~0.04 em light, com `mask-image: radial-gradient(ellipse at center, black, transparent 80%)`.

## Interações & comportamento

- **Toggle de tema:** dark ↔ light, persiste em `localStorage`. Transições suaves nos backgrounds (200ms). Default = dark.
- **Nav:** SPA-like, sem reload. URL muda (use o roteador do framework).
- **Hover states:**
  - Cards: `surfaceHover` + `borderStrong` em 150ms.
  - Rows da lista de posts: `transform: translateX(2px)`, número e data ficam mais opacos (`text` em vez de `textMuted`).
  - Links inline (`.dp-link`): underline aparece via `::after` com opacity 0 → 0.5.
  - Tags chips: `surfaceHover`.
- **Busca:** filtra a lista localmente por título/tag/ano. `⌘K` (ou `Ctrl+K`) foca o input.
- **Pulsar no status pill da home:** `@keyframes dpPulse { 0%,100% { opacity: .5 } 50% { opacity: 1 } }`, 2s infinite no bullet.
- **Fade-up nas entradas de página:** `@keyframes dpFadeUp { from { opacity:0; transform: translateY(8px) } to { opacity:1; transform:none } }`, 400ms ease-out no container principal a cada navegação.

## State Management

Mínimo. Apenas:
- `theme: 'dark' | 'light'` (persiste em localStorage).
- `page` ou rota atual (gerenciada pelo router).
- Estado de busca local na página `/arquivo`.

Posts e tags vêm de MDX/CMS/lo que o codebase já usa — não precisa replicar a estrutura de `data.jsx` (é só mock).

## Design Tokens

### Cores — dark (default)
```
bg:           #0a0a0c
surface:      #101013
surfaceHover: #15151a
border:       rgba(255,255,255,0.08)
borderStrong: rgba(255,255,255,0.14)
text:         #ededed
textMuted:    rgba(237,237,237,0.55)
textDim:      rgba(237,237,237,0.35)
accent:       #a78bfa     /* roxo claro */
accentDim:    rgba(167,139,250,0.5)
code:         rgba(167,139,250,0.12)
codeText:     #c4b5fd
success:      #4ade80
glowA:        rgba(120,80,180,0.18)
glowB:        rgba(80,120,200,0.10)
```

### Cores — light
```
bg:           #fafaf7
surface:      #ffffff
surfaceHover: #f5f5f0
border:       rgba(0,0,0,0.08)
borderStrong: rgba(0,0,0,0.14)
text:         #0a0a0c
textMuted:    rgba(10,10,12,0.6)
textDim:      rgba(10,10,12,0.4)
accent:       #7c3aed     /* roxo mais saturado p/ contraste */
accentDim:    rgba(124,58,237,0.5)
code:         rgba(124,58,237,0.08)
codeText:     #5b21b6
success:      #16a34a
glowA:        rgba(167,139,250,0.16)
glowB:        rgba(96,165,250,0.10)
```

### Tipografia
- **Sans:** Inter, Söhne, system fallbacks. `font-feature-settings: "ss01", "cv11"` se a fonte suportar.
- **Mono:** JetBrains Mono, Söhne Mono, ui-monospace.

Escala (em px):
- Hero H1: 64 / weight 600 / letter-spacing -2.5
- Post H1: 52 / weight 600 / letter-spacing -2
- Page H1: 40 / weight 600 / letter-spacing -1.5
- H2: 24 / weight 600 / letter-spacing -0.5
- Body grande (post): 17 / line-height 1.75
- Body padrão: 14-15 / line-height 1.6
- Meta/labels: 11 mono / letter-spacing 0.5 / uppercase quando aplicável
- Code inline: 13 mono
- Code block: 13 mono / line-height 1.6

### Espaçamento
Escala 4-base: 4, 8, 12, 14, 16, 20, 24, 32, 48, 64, 96.
- Padding lateral do shell: 32 desktop, 20 mobile.
- Gap entre rows da lista: 0 (rows têm padding próprio 16-20 vertical e divider 1px).
- Container max-width: 1100 (lista), 720 (post).

### Border radius
- Buttons / pills: 6
- Cards: 12
- Code block: 8
- Logo dot: 50% (full circle)

### Shadows
Praticamente nenhuma — o design depende de borders sutis e gradientes, não de shadows. Se precisar de elevação (modal, dropdown), use `0 8px 32px rgba(0,0,0,0.3)` em dark e `0 8px 32px rgba(0,0,0,0.08)` em light.

## Assets

Nenhum asset binário. Tudo é CSS/SVG/texto. Logo é um dot com gradient (sem imagem).

Fontes precisam ser carregadas pelo codebase (Inter + JetBrains Mono via Google Fonts ou self-hosted).

## Screenshots

Em `screenshots/`, cada página em dark e light:

| # | Página         | Dark                          | Light                          |
|---|----------------|-------------------------------|--------------------------------|
| 1 | Home           | `01-home-dark.png`            | `01-home-light.png`            |
| 2 | Post           | `02-post-dark.png`            | `02-post-light.png`            |
| 3 | Arquivo        | `03-archive-dark.png`         | `03-archive-light.png`         |
| 4 | Sobre          | `04-about-dark.png`           | `04-about-light.png`           |
| 5 | Now            | `05-now-dark.png`             | `05-now-light.png`             |
| 6 | Tags           | `06-tags-dark.png`            | `06-tags-light.png`            |
| 7 | 404            | `07-404-dark.png`             | `07-404-light.png`             |
| 8 | Newsletter     | `08-newsletter-dark.png`      | `08-newsletter-light.png`      |

## Files (referência)

Em `reference/`:
- `Blog - Protótipo Dev Premium.html` — entry point, abre o protótipo completo.
- `prototype/data.jsx` — posts e tags mockados (apenas exemplo de conteúdo).
- `prototype/shell.jsx` — `DPColors`, `DPFonts`, header, footer, background, keyframes, contexto de nav.
- `prototype/pages-main.jsx` — Home, Post individual, Arquivo.
- `prototype/pages-secondary.jsx` — Sobre, Now, Tags, 404, Newsletter.
- `prototype/app.jsx` — root, roteamento por estado, providers.

Para abrir localmente: sirva a pasta `reference/` com qualquer servidor estático (`python -m http.server`, `npx serve`, etc.) e acesse o HTML.

## Notas finais

- Mantenha o **dark como default**. Light é refinado, mas a personalidade do blog é dark.
- Resista a adicionar ilustrações/emojis decorativos. A estética é silenciosa, sustentada por tipografia, espaçamento e o gradient de fundo.
- O mock está em PT. Quando implementar PT/EN, mantenha as mesmas hierarquias visuais — só troca o conteúdo.
- O número `№` antes do post (ex: `№ 087`) é parte da identidade — mantenha em mono e em `textMuted`.
