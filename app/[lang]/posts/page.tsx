import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { PostCard } from '@/components/ui/PostCard';

const copy = {
  pt: {
    title: 'Posts',
    empty: 'Nenhum post publicado ainda.',
    description: 'Posts sobre ML, visão computacional e desenvolvimento.',
  },
  en: {
    title: 'Posts',
    empty: 'No posts published yet.',
    description: 'Posts on ML, computer vision, and software development.',
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

  const posts = getPosts({ lang });
  const t = copy[lang];

  return (
    <main className="max-w-[800px] mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold">{t.title}</h1>
      {posts.length === 0 ? (
        <p className="mt-6 text-[var(--text-muted)]">{t.empty}</p>
      ) : (
        <div className="mt-8">
          {posts.map((p) => (
            <PostCard
              key={p.translationKey}
              slug={p.slug}
              title={p.title}
              description={p.description}
              date={p.date}
              tags={p.tags}
              lang={lang as Locale}
            />
          ))}
        </div>
      )}
    </main>
  );
}
