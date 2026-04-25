import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { ProjectCard } from '@/components/ui/ProjectCard';

const copy = {
  pt: {
    title: 'Projetos',
    description: 'Projetos pessoais — ML, visão computacional e ferramentas.',
    empty: 'ainda não tem projetos publicados.',
  },
  en: {
    title: 'Projects',
    description: 'Personal projects — ML, computer vision, and tooling.',
    empty: 'no projects yet.',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = copy[lang];
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: `/${lang}/${PATHS.projetos[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.projetos.pt}`,
      en: `/en/${PATHS.projetos.en}`,
    },
  });
}

export default async function ProjetosIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const projects = getProjects({ lang: l });

  return (
    <main className="max-w-[1100px] mx-auto px-8 py-16">
      <h1
        className="font-semibold tracking-tight"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>

      {projects.length === 0 ? (
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
          {t.empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {projects.map((p) => (
            <ProjectCard
              key={p.translationKey}
              slug={p.slug}
              title={p.title}
              tagline={p.tagline}
              status={p.status}
              stack={p.stack}
              cover={p.cover}
              lang={l}
            />
          ))}
        </div>
      )}
    </main>
  );
}
