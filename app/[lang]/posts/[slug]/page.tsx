import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allPosts } from 'content-collections';
import { getPostBySlug, getPosts } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { longDate, postReadingTime, postNumber } from '@/lib/format';
import { MDXContent } from '@/components/mdx/MDXContent';
import { TagPill } from '@/components/ui/TagPill';
import { PostComments } from '@/components/ui/PostComments';
import { ShareButtons } from '@/components/ui/ShareButtons';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';

const copy = {
  pt: {
    back: '← voltar',
    minsSuffix: 'min de leitura',
    likedTitle: 'se gostou, me manda email',
    email: 'marcospaulo_medeiros@hotmail.com',
  },
  en: {
    back: '← back',
    minsSuffix: 'min read',
    likedTitle: 'if you liked it, email me',
    email: 'marcospaulo_medeiros@hotmail.com',
  },
} as const;

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

  const l = lang as Locale;
  const t = copy[l];

  // Compute № based on the post's position in the published list (newest = highest)
  const allList = getPosts({ lang: l });
  const idx = allList.findIndex((p) => p.slug === post.slug);
  const numLabel = idx >= 0 ? postNumber(idx, allList.length) : `№ ${String(allList.length).padStart(3, '0')}`;

  const dateLabel = longDate(post.date, l);
  const mins = postReadingTime(post);
  const primaryTag = post.tags[0];

  const archiveHref = `/${l}/${PATHS.posts[l]}`;

  return (
    <article className="max-w-[720px] mx-auto px-8 py-12">
      <Link
        href={archiveHref}
        className="dp-link font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]"
      >
        {t.back}
      </Link>

      <h1
        className="font-semibold mt-10"
        style={{ fontSize: 52, lineHeight: 1.05, letterSpacing: '-2px' }}
      >
        {post.title}
      </h1>

      <div className="flex flex-wrap gap-3 mt-6 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
        <span className="whitespace-nowrap">{numLabel}</span>
        <span>·</span>
        <time className="whitespace-nowrap" dateTime={post.date.toISOString()}>
          {dateLabel}
        </time>
        {primaryTag && (
          <>
            <span>·</span>
            <span className="whitespace-nowrap text-[var(--accent)]">{primaryTag}</span>
          </>
        )}
        <span>·</span>
        <span className="whitespace-nowrap">
          {mins} {t.minsSuffix}
        </span>
      </div>

      <div className="prose-content mt-12">
        <MDXContent code={post.body} />
      </div>

      <footer className="mt-16 pt-8 border-t border-[var(--border)] space-y-6">
        <p className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
          {t.likedTitle} —{' '}
          <a href={`mailto:${t.email}`} className="dp-link text-[var(--text)]">
            {t.email}
          </a>
        </p>
        {post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} lang={l} />
            ))}
          </div>
        )}
        <ShareButtons
          url={`${SITE}/${l}/${PATHS.posts[l]}/${post.slug}`}
          title={post.title}
          lang={l}
        />
        <PostComments postId={post.translationKey} />
      </footer>
    </article>
  );
}
