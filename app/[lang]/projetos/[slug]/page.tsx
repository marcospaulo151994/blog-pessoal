import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allProjetos } from 'content-collections';
import { getProjectBySlug, getProjects } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { longDate } from '@/lib/format';
import { MDXContent } from '@/components/mdx/MDXContent';

const copy = {
  pt: {
    back: '← projetos',
    statusLabel: 'status',
    stackLabel: 'stack',
    periodLabel: 'período',
    linksLabel: 'links',
    statuses: { active: 'ativo', completed: 'concluído', archived: 'arquivado' },
    repo: 'repo',
    demo: 'demo',
    paper: 'paper',
    present: 'em andamento',
  },
  en: {
    back: '← projects',
    statusLabel: 'status',
    stackLabel: 'stack',
    periodLabel: 'period',
    linksLabel: 'links',
    statuses: { active: 'active', completed: 'completed', archived: 'archived' },
    repo: 'repo',
    demo: 'demo',
    paper: 'paper',
    present: 'ongoing',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = getProjectBySlug(slug, lang);
  if (!project) return {};

  const alternates: Partial<Record<Locale, string>> = {
    [project.lang]: `/${project.lang}/${PATHS.projetos[project.lang]}/${project.slug}`,
  };
  const other = allProjetos.find(
    (p) => p.translationKey === project.translationKey && p.lang !== project.lang,
  );
  if (other) {
    alternates[other.lang] = `/${other.lang}/${PATHS.projetos[other.lang]}/${other.slug}`;
  }

  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/${project.lang}/${PATHS.projetos[project.lang]}/${project.slug}`,
    alternatePaths: alternates,
  });
}

export async function generateStaticParams() {
  const pt = getProjects({ lang: 'pt' });
  const en = getProjects({ lang: 'en' });
  return [
    ...pt.map((p) => ({ lang: 'pt', slug: p.slug })),
    ...en.map((p) => ({ lang: 'en', slug: p.slug })),
  ];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = getProjectBySlug(slug, lang);
  if (!project) notFound();

  const l = lang as Locale;
  const t = copy[l];

  const indexHref = `/${l}/${PATHS.projetos[l]}`;
  const start = longDate(project.period.start, l);
  const end = project.period.end ? longDate(project.period.end, l) : t.present;

  return (
    <article className="max-w-[720px] mx-auto px-8 py-12">
      <Link
        href={indexHref}
        className="dp-link font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]"
      >
        {t.back}
      </Link>

      <h1
        className="font-semibold mt-10"
        style={{ fontSize: 52, lineHeight: 1.05, letterSpacing: '-2px' }}
      >
        {project.title}
      </h1>

      <p
        className="mt-5 text-[var(--text-muted)]"
        style={{ fontSize: 17, lineHeight: 1.6 }}
      >
        {project.tagline}
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)]">
          <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
            {t.statusLabel}
          </div>
          <div className="mt-2 text-[14px]">{t.statuses[project.status]}</div>
        </div>
        <div className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)]">
          <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
            {t.periodLabel}
          </div>
          <div className="mt-2 text-[14px]">
            {start} — {end}
          </div>
        </div>
        {project.stack.length > 0 && (
          <div className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)] md:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
              {t.stackLabel}
            </div>
            <div className="mt-2 text-[14px] font-mono text-[var(--text-muted)]">
              {project.stack.join(' · ')}
            </div>
          </div>
        )}
        {project.links && (project.links.repo || project.links.demo || project.links.paper) && (
          <div className="border border-[var(--border)] rounded-xl p-5 bg-[var(--surface)] md:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
              {t.linksLabel}
            </div>
            <div className="mt-2 text-[14px] flex gap-4">
              {project.links.repo && (
                <a href={project.links.repo} target="_blank" rel="noopener" className="dp-link text-[var(--text)]">
                  {t.repo}
                </a>
              )}
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noopener" className="dp-link text-[var(--text)]">
                  {t.demo}
                </a>
              )}
              {project.links.paper && (
                <a href={project.links.paper} target="_blank" rel="noopener" className="dp-link text-[var(--text)]">
                  {t.paper}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="prose-content mt-12">
        <MDXContent code={project.body} />
      </div>
    </article>
  );
}
