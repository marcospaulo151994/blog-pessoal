import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

// NOTE: stub created in Task 21 so the home page compiles before Task 18 lands.
// Task 18 will replace this with the proper implementation (cover image,
// status badges, stack pills, hover styles, etc.). Keep the prop signature
// stable so that swap-in is mechanical.
interface ProjectCardProps {
  slug: string;
  title: string;
  tagline: string;
  status: 'active' | 'completed' | 'archived';
  stack: string[];
  cover?: string;
  lang: Locale;
}

export function ProjectCard({ slug, title, tagline, status, stack, lang }: ProjectCardProps) {
  return (
    <article className="py-6 border-b border-[var(--border)] last:border-0">
      <h3 className="text-xl font-semibold tracking-tight">
        <Link href={`/${lang}/${PATHS.projetos[lang]}/${slug}`}>{title}</Link>
      </h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{tagline}</p>
      <div className="mt-2 text-xs text-[var(--text-muted)]">
        <span>{status}</span>
        {stack.length > 0 && <span> · {stack.join(', ')}</span>}
      </div>
    </article>
  );
}
