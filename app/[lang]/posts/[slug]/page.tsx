import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/content';
import { isLocale, type Locale } from '@/lib/i18n';
import { MDXContent } from '@/components/mdx/MDXContent';
import { TagPill } from '@/components/ui/TagPill';
import { PostComments } from '@/components/ui/PostComments';

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
      <footer className="mt-16 pt-8 border-t border-[var(--border)]">
        <PostComments postId={post.translationKey} />
      </footer>
    </article>
  );
}
