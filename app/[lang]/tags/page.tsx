import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';

const copy = {
  pt: {
    title: 'Tags',
    description: 'Índice de tags do blog.',
    subtitle: 'navegue por assunto.',
    empty: 'ainda sem tags.',
  },
  en: {
    title: 'Tags',
    description: 'Tag index for the blog.',
    subtitle: 'browse by subject.',
    empty: 'no tags yet.',
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
    path: `/${lang}/${PATHS.tags[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.tags.pt}`,
      en: `/en/${PATHS.tags.en}`,
    },
  });
}

export default async function TagsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const tags = getAllTags(l).map((tag) => ({
    tag,
    count: getPostsByTag(tag, l).length,
  }));

  return (
    <main className="max-w-[1100px] mx-auto px-8 py-16">
      <h1
        className="font-semibold tracking-tight"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>
      <p className="mt-3 text-[var(--text-muted)]" style={{ fontSize: 15 }}>
        {t.subtitle}
      </p>

      {tags.length === 0 ? (
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
          {t.empty}
        </p>
      ) : (
        <div className="mt-10 flex flex-wrap gap-2.5">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/${l}/${PATHS.posts[l]}/${PATHS.tags[l]}/${tag}`}
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] transition-colors"
              style={{ padding: '8px 16px' }}
            >
              <span className="text-[13px] text-[var(--text)]">{tag}</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
