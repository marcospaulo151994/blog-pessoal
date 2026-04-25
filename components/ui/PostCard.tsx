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
      <h2 className="text-2xl font-semibold mt-1 tracking-tight group-hover:text-[var(--accent)] transition-colors">
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
