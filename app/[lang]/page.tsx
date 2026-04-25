import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { longDate, postReadingTime } from '@/lib/format';
import { PostRow } from '@/components/ui/PostRow';

const copy = {
  pt: {
    title: 'marcos.run',
    description: 'Posts, projetos e notas sobre ML e visão computacional — Marcos Medeiros.',
    statusPill: 'escrevendo agora',
    headlineLine1: 'notas técnicas, projetos pessoais',
    headlineLine2: 'e o que estou aprendendo agora.',
    subtitle: 'blog pessoal de marcos medeiros — visão computacional, ml, segurança.',
    ctaPrimary: 'ler último ensaio',
    ctaSecondary: 'ver arquivo',
    featuredFlag: 'em destaque',
    minsSuffix: 'm de leitura',
    recentHeading: 'leituras recentes',
    seeAll: (n: number) => `ver todos os ${n} posts →`,
    empty: 'Nenhum post publicado ainda.',
  },
  en: {
    title: 'marcos.run',
    description: 'Posts, projects, and notes on ML and computer vision — Marcos Medeiros.',
    statusPill: 'writing now',
    headlineLine1: 'technical notes, personal projects,',
    headlineLine2: "and what I'm learning right now.",
    subtitle: 'personal blog by marcos medeiros — computer vision, ml, security.',
    ctaPrimary: 'read latest essay',
    ctaSecondary: 'see archive',
    featuredFlag: 'featured',
    minsSuffix: 'min read',
    recentHeading: 'recent reads',
    seeAll: (n: number) => `see all ${n} posts →`,
    empty: 'No posts published yet.',
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
    path: `/${lang}`,
    alternatePaths: { pt: '/pt', en: '/en' },
  });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const posts = getPosts({ lang: l });
  const total = posts.length;
  const featured = posts[0];
  const rest = posts.slice(1, 5); // up to 4 rows

  const archiveHref = `/${l}/${PATHS.posts[l]}`;
  const featuredHref = featured
    ? `/${l}/${PATHS.posts[l]}/${featured.slug}`
    : archiveHref;

  return (
    <main className="max-w-[1100px] mx-auto px-8 py-16">
      {/* Hero */}
      <section>
        <div
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 mb-6"
          style={{ paddingTop: 6, paddingBottom: 6, paddingLeft: 12, paddingRight: 12 }}
        >
          <span
            className="dp-pulse inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--success)' }}
            aria-hidden
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.5px] text-[var(--text-muted)]">
            {t.statusPill}
          </span>
        </div>

        <h1
          className="font-semibold max-w-[820px]"
          style={{
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: '-2.5px',
          }}
        >
          {t.headlineLine1}
          <br />
          {t.headlineLine2}
        </h1>

        <p
          className="text-[var(--text-muted)] mt-5 max-w-[600px]"
          style={{ fontSize: 17, lineHeight: 1.5 }}
        >
          {t.subtitle}
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href={featuredHref}
            className="inline-flex items-center font-medium transition-opacity hover:opacity-85"
            style={{
              background: 'var(--text)',
              color: 'var(--bg)',
              padding: '10px 20px',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={archiveHref}
            className="inline-flex items-center font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>

      {/* Featured card */}
      {featured && (
        <section className="mt-16">
          <Link href={featuredHref} className="block">
            <article
              className="dp-card rounded-xl"
              style={{ padding: 32, borderRadius: 12 }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)] mb-4">
                [01] · {t.featuredFlag}
              </div>
              <h2
                className="font-semibold text-[var(--text)]"
                style={{ fontSize: 34, lineHeight: 1.15, letterSpacing: '-1px' }}
              >
                {featured.title}
              </h2>
              <p
                className="text-[var(--text-muted)] mt-3"
                style={{ fontSize: 15, lineHeight: 1.6 }}
              >
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-6 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
                <span className="whitespace-nowrap">{longDate(featured.date, l)}</span>
                <span>·</span>
                <span className="whitespace-nowrap">
                  {postReadingTime(featured)} {t.minsSuffix}
                </span>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* Recent posts */}
      {rest.length > 0 && (
        <section className="mt-16">
          <h2 className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--text-muted)] mb-4">
            {t.recentHeading}
          </h2>
          <div className="border-t border-[var(--border)]">
            {rest.map((p, idx) => (
              <PostRow
                key={p.translationKey}
                post={{
                  slug: p.slug,
                  title: p.title,
                  date: p.date,
                  tags: p.tags,
                  mins: postReadingTime(p),
                }}
                // index in the FULL list (not in `rest`) — featured is idx 0, so rest starts at 1
                index={idx + 1}
                total={total}
                lang={l}
              />
            ))}
          </div>
          <div className="mt-6">
            <Link
              href={archiveHref}
              className="dp-link font-mono text-[11px] uppercase tracking-[0.5px] text-[var(--text-muted)]"
            >
              {t.seeAll(total)}
            </Link>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <p className="mt-16 text-[var(--text-muted)]">{t.empty}</p>
      )}
    </main>
  );
}
