import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { isLocale, type Locale } from '@/lib/i18n';
import { PostCard } from '@/components/ui/PostCard';

const copy = {
  pt: { title: 'Posts', empty: 'Nenhum post publicado ainda.' },
  en: { title: 'Posts', empty: 'No posts published yet.' },
} as const;

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
