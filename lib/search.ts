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
