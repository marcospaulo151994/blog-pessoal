import { notFound } from 'next/navigation';
import { getPostsByTag, getAllTags } from '@/lib/content';
import { isLocale, type Locale, LOCALES } from '@/lib/i18n';
import { PostCard } from '@/components/ui/PostCard';

export async function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getAllTags(lang).map((tag) => ({ lang, tag }))
  );
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}) {
  const { lang, tag } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getPostsByTag(tag, lang);
  if (posts.length === 0) notFound();

  return (
    <main className="max-w-[800px] mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">
        {lang === 'pt' ? 'Posts com a tag' : 'Posts tagged'} <code>#{tag}</code>
      </h1>
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
    </main>
  );
}
