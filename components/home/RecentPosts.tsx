import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { PATHS, type Locale } from '@/lib/i18n';
import { PostCard } from '@/components/ui/PostCard';

export function RecentPosts({ lang }: { lang: Locale }) {
  const posts = getPosts({ lang }).slice(0, 3);
  if (posts.length === 0) return null;
  const label = lang === 'pt' ? 'Escritos recentes' : 'Recent writing';
  const allLabel = lang === 'pt' ? 'todos os posts →' : 'all posts →';

  return (
    <section className="py-10 border-t border-[var(--border)]">
      <h2 className="text-2xl font-semibold mb-4 tracking-tight">{label}</h2>
      {posts.map((p) => (
        <PostCard
          key={p.translationKey}
          slug={p.slug}
          title={p.title}
          description={p.description}
          date={p.date}
          tags={p.tags}
          lang={lang}
        />
      ))}
      <Link href={`/${lang}/${PATHS.posts[lang]}`} className="inline-block mt-4 text-sm">
        {allLabel}
      </Link>
    </section>
  );
}
