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
