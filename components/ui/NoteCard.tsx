import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';
import { shortDate } from '@/lib/format';

interface NoteCardProps {
  slug: string;
  title: string;
  maturity: 'seedling' | 'budding' | 'evergreen';
  planted: Date;
  lang: Locale;
}

const maturityIcon: Record<NoteCardProps['maturity'], string> = {
  seedling: '🌱',
  budding: '🌿',
  evergreen: '🌳',
};

export function NoteCard({ slug, title, maturity, planted, lang }: NoteCardProps) {
  const dateLabel = shortDate(planted, lang);
  const href = `/${lang}/${PATHS.notas[lang]}/${slug}`;

  return (
    <Link href={href} className="block border-b border-[var(--border)] last:border-0">
      <div className="dp-row grid items-center gap-4 px-3 py-3.5 -mx-3 grid-cols-[28px_60px_1fr]">
        <span aria-hidden style={{ fontSize: '1.1em' }}>
          {maturityIcon[maturity]}
        </span>
        <span className="dp-row-date font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
          {dateLabel}
        </span>
        <span className="text-[15px] font-medium text-[var(--text)] truncate">
          {title}
        </span>
      </div>
    </Link>
  );
}
