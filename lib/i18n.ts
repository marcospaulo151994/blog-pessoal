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
