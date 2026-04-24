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
  lang,
  maturity,
}: {
  lang: Locale;
  maturity?: 'seedling' | 'budding' | 'evergreen';
}) {
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
