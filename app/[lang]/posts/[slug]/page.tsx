import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from 'content-collections';
import { getPostBySlug, getPosts } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { MDXContent } from '@/components/mdx/MDXContent';
import { TagPill } from '@/components/ui/TagPill';
import { PostComments } from '@/components/ui/PostComments';
import { ShareButtons } from '@/components/ui/ShareButtons';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPostBySlug(slug, lang);
  if (!post) return {};

  const alternates: Partial<Record<Locale, string>> = {
    [post.lang]: `/${post.lang}/${PATHS.posts[post.lang]}/${post.slug}`,
  };
  const other = allPosts.find(
    (p) => p.translationKey === post.translationKey && p.lang !== post.lang,
  );
  if (other) {
    alternates[other.lang] = `/${other.lang}/${PATHS.posts[other.lang]}/${other.slug}`;
  }

  const tagQuery = post.tags[0] ? `&tag=${post.tags[0]}` : '';
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/${post.lang}/${PATHS.posts[post.lang]}/${post.slug}`,
    ogImageUrl: `${SITE}/api/og?title=${encodeURIComponent(post.title)}${tagQuery}`,
    alternatePaths: alternates,
  });
}

export async function generateStaticParams() {
  const ptPosts = getPosts({ lang: 'pt' });
  const enPosts = getPosts({ lang: 'en' });
  return [
    ...ptPosts.map((p) => ({ lang: 'pt', slug: p.slug })),
    ...enPosts.map((p) => ({ lang: 'en', slug: p.slug })),
  ];
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const dateLabel = post.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <article className="max-w-[680px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
          {post.title}
        </h1>
        <div className="flex gap-3 items-center mt-4 text-sm text-[var(--text-muted)]">
          <time dateTime={post.date.toISOString()}>{dateLabel}</time>
          {post.readingTime && (
            <span>· {post.readingTime} {lang === 'pt' ? 'min de leitura' : 'min read'}</span>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {post.tags.map((t) => <TagPill key={t} tag={t} lang={lang as Locale} />)}
          </div>
        )}
      </header>
      <div className="prose-content">
        <MDXContent code={post.body} />
      </div>
      <footer className="mt-16 pt-8 border-t border-[var(--border)] space-y-6">
        <ShareButtons
          url={`${SITE}/${lang}/posts/${post.slug}`}
          title={post.title}
          lang={lang as Locale}
        />
        <PostComments postId={post.translationKey} />
      </footer>
    </article>
  );
}
