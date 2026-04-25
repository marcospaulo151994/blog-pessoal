import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByTag, getAllTags } from '@/lib/content';
import { isLocale, PATHS, type Locale, LOCALES } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { PostCard } from '@/components/ui/PostCard';

export async function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getAllTags(lang).map((tag) => ({ lang, tag }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}): Promise<Metadata> {
  const { lang, tag } = await params;
  if (!isLocale(lang)) return {};
  const title = lang === 'pt' ? `Posts com a tag #${tag}` : `Posts tagged #${tag}`;
  const description =
    lang === 'pt'
      ? `Todos os posts marcados com #${tag}.`
      : `All posts tagged with #${tag}.`;
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';
  return buildMetadata({
    title,
    description,
    path: `/${lang}/${PATHS.posts[lang]}/${PATHS.tags[lang]}/${tag}`,
    ogImageUrl: `${SITE}/api/og?title=${encodeURIComponent(title)}&tag=${encodeURIComponent(tag)}`,
  });
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
