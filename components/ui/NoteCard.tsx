import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

// NOTE: stub created in Task 21 so the home page compiles before Task 19 lands.
// Task 19 will replace this with the proper implementation (maturity icon,
// planted/tended dates, tag list). Keep the prop signature stable so that
// swap-in is mechanical.
interface NoteCardProps {
  slug: string;
  title: string;
  maturity: 'seedling' | 'budding' | 'evergreen';
  planted: Date;
  lang: Locale;
}

export function NoteCard({ slug, title, maturity, planted, lang }: NoteCardProps) {
  const dateLabel = planted.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return (
    <article className="py-4 border-b border-[var(--border)] last:border-0">
      <h3 className="text-lg font-semibold tracking-tight">
        <Link href={`/${lang}/${PATHS.notas[lang]}/${slug}`}>{title}</Link>
      </h3>
      <div className="mt-1 text-xs text-[var(--text-muted)]">
        <span>{maturity}</span>
        <span> · {dateLabel}</span>
      </div>
    </article>
  );
}
