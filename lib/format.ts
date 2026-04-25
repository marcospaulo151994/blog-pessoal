import type { Locale } from './i18n';

/**
 * "04.04" format (DD.MM)
 */
export function shortDate(d: Date, _lang: Locale): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}`;
}

/**
 * "19 abr 2026" or "Apr 19, 2026"
 */
export function longDate(d: Date, lang: Locale): string {
  return d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Renders the № post number for a list. The newest post (idx 0) gets the highest
 * number, equal to the total count.
 *
 * Format: `№ 001`, `№ 087`, etc. — always padded to 3 digits.
 */
export function postNumber(idx: number, total: number): string {
  return `№ ${String(total - idx).padStart(3, '0')}`;
}

/**
 * Reading time in minutes from a body text. ~200 words per minute, minimum 1.
 */
export function readingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Returns the explicit reading time from the post frontmatter when present,
 * otherwise estimates from the description as a coarse fallback.
 */
export function postReadingTime(post: { readingTime?: number; description: string }): number {
  if (post.readingTime && post.readingTime > 0) return post.readingTime;
  // crude approximation: descriptions are short, multiply for a body-ish estimate
  const descWords = post.description.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round((descWords * 6) / 200));
}
