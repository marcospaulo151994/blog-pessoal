# Roadmap

## v0.1 — MVP em construção
Ver `docs/superpowers/plans/2026-04-24-blog-pessoal.md`.

### Domínio
- [ ] Comprar `marcosmedeiros.dev` (Cloudflare Registrar, ~$12/ano) e migrar do `vercel.app`
- [ ] **05-26/12/2026:** ativar backorder de `marcos.run` em SnapNames + NameJet (vence 06/10/2026, drop esperado ~26/12 após grace + redemption periods). Cap de leilão: definir antes de ativar (sugestão: $300).

### Conteúdo placeholder a substituir por real
- [ ] Bio real em `/sobre` (atualmente placeholder)
- [ ] Conteúdo real em `/agora` (atualmente placeholder)
- [ ] Conteúdo real em `/stack` (atualmente "em construção")

## v0.2 — "Loop social"
- [ ] Giscus comments (ativar stub `<PostComments />`)
- [ ] **Newsletter backend** (form em `/newsletter` é stub — integrar Buttondown/ConvertKit)
- [ ] Traduzir os 3 primeiros posts pra EN
- [ ] "Recent activity" widget na home

## v0.3 — "Descoberta + polish"
- [ ] Search com highlight contextual (trecho do match)
- [ ] OG images com variações por tag (cor/ícone)
- [ ] RSS segmentado por tag (/rss/ml.xml)
- [ ] Scroll reveals (re-introduzir, agora em CSS-only)
- [ ] Página `/roadmap` pública

### v0.3 — concluído pelo redesign Dev Premium (2026-04-25)
- [x] CSS keyframes no lugar de Framer Motion (cortou ~45KB gz; Framer removido inteiro do bundle)
- [x] Stub `Reveal.tsx` removido (sem uso após redesign)

## v0.4 — "Interatividade"
- [ ] CodePlayground ativado (Sandpack)
- [ ] Demos embutidos de MediaPipe (vídeo + controles)
- [ ] Visualização interativa de features

## v1.0+ — "Se houver demanda real"
- [ ] Semantic search com embeddings
- [ ] Tradução automática com revisão
- [ ] Analytics próprio (Umami self-hosted)
