import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';
import { shortDate, postNumber } from '@/lib/format';

export interface PostRowItem {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  /** Reading time in minutes. */
  mins: number;
}

interface PostRowProps {
  post: PostRowItem;
  /** Position in the visible list (0 = newest). */
  index: number;
  /** Total post count — used to compute the № value. */
  total: number;
  lang: Locale;
}

/**
 * A single row in a Dev-Premium-style post list.
 *
 * Layout (grid, mobile collapses):
 *   [№ 087]  [04.04]  Title…  [tag]  [7m]
 *
 * Hover effect provided by `.dp-row` in globals.css.
 */
export function PostRow({ post, index, total, lang }: PostRowProps) {
  const num = postNumber(index, total);
  const dateLabel = shortDate(post.date, lang);
  const primaryTag = post.tags[0];
  const minsLabel = `${post.mins}m`;

  return (
    <Link
      href={`/${lang}/${PATHS.posts[lang]}/${post.slug}`}
      className="block border-b border-[var(--border)] last:border-0"
    >
      <div className="dp-row grid items-center gap-4 px-3 py-3.5 -mx-3 grid-cols-[60px_60px_1fr_auto_40px]">
        <span className="dp-row-num font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
          {num}
        </span>
        <span className="dp-row-date font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
          {dateLabel}
        </span>
        <span className="text-[15px] font-medium text-[var(--text)] truncate">
          {post.title}
        </span>
        <span className="font-mono text-[11px] text-[var(--accent)] tracking-[0.5px] justify-self-start whitespace-nowrap">
          {primaryTag ?? ''}
        </span>
        <span className="font-mono text-[11px] text-[var(--text-muted)] text-right">
          {minsLabel}
        </span>
      </div>
    </Link>
  );
}
