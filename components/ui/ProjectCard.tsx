import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

interface ProjectCardProps {
  slug: string;
  title: string;
  tagline: string;
  status: 'active' | 'completed' | 'archived';
  stack: string[];
  cover?: string;
  lang: Locale;
}

const statusLabels: Record<'pt' | 'en', Record<ProjectCardProps['status'], string>> = {
  pt: { active: 'ativo', completed: 'concluído', archived: 'arquivado' },
  en: { active: 'active', completed: 'completed', archived: 'archived' },
};

export function ProjectCard({ slug, title, tagline, status, stack, lang }: ProjectCardProps) {
  const href = `/${lang}/${PATHS.projetos[lang]}/${slug}`;
  return (
    <Link href={href} className="block">
      <article className="dp-card rounded-xl p-7 h-full">
        <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
          {statusLabels[lang][status]}
        </div>
        <h3
          className="mt-3 font-semibold tracking-tight text-[var(--text)]"
          style={{ fontSize: 22, letterSpacing: '-0.5px', lineHeight: 1.2 }}
        >
          {title}
        </h3>
        <p
          className="mt-2 text-[var(--text-muted)]"
          style={{ fontSize: 14, lineHeight: 1.6 }}
        >
          {tagline}
        </p>
        {stack.length > 0 && (
          <div className="mt-5 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
            {stack.join(' · ')}
          </div>
        )}
      </article>
    </Link>
  );
}
