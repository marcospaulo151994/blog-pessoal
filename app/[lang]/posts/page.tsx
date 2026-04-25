import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { postReadingTime } from '@/lib/format';
import { ArchiveList } from '@/components/ui/ArchiveList';

const copy = {
  pt: {
    title: 'Arquivo',
    empty: 'Nenhum post publicado ainda.',
    description: 'Posts sobre ML, visão computacional e desenvolvimento.',
    countSuffix: 'posts',
  },
  en: {
    title: 'Archive',
    empty: 'No posts published yet.',
    description: 'Posts on ML, computer vision, and software development.',
    countSuffix: 'posts',
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
    path: `/${lang}/${PATHS.posts[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.posts.pt}`,
      en: `/en/${PATHS.posts.en}`,
    },
  });
}

export default async function PostsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const posts = getPosts({ lang: l });
  const total = posts.length;
  const totalLabel = `${String(total).padStart(3, '0')} ${t.countSuffix}`;

  // Pre-shape posts as plain serializable data for the client component.
  const items = posts.map((p) => ({
    translationKey: p.translationKey,
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    mins: postReadingTime(p),
  }));

  return (
    <main className="max-w-[1100px] mx-auto px-8 py-12">
      <h1
        className="font-semibold"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.5px] text-[var(--text-muted)]">
        {totalLabel}
      </p>

      {posts.length === 0 ? (
        <p className="mt-6 text-[var(--text-muted)]">{t.empty}</p>
      ) : (
        <ArchiveList lang={l} posts={items} />
      )}
    </main>
  );
}
