import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { postReadingTime } from '@/lib/format';
import { PostRow } from '@/components/ui/PostRow';
import { NewsletterForm } from '@/components/ui/NewsletterForm';

const copy = {
  pt: {
    title: 'Newsletter',
    description: '1 email por mês com os ensaios novos. Sem spam, cancele quando quiser.',
    subtitle: '1 email por mês com os ensaios novos. sem spam, cancela quando quiser.',
    placeholder: 'seu@email.com',
    submit: 'Inscrever',
    success: 'obrigado! seu email foi registrado.',
    socialProof: '1.247 leitores',
    recentHeading: 'últimas edições',
  },
  en: {
    title: 'Newsletter',
    description: '1 email a month with new essays. No spam, unsubscribe anytime.',
    subtitle: '1 email a month with new essays. no spam, unsubscribe anytime.',
    placeholder: 'you@email.com',
    submit: 'Subscribe',
    success: 'thanks! your email is registered.',
    socialProof: '1,247 readers',
    recentHeading: 'recent issues',
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
    path: `/${lang}/${PATHS.newsletter[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.newsletter.pt}`,
      en: `/en/${PATHS.newsletter.en}`,
    },
  });
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const posts = getPosts({ lang: l });
  const recent = posts.slice(0, 3).map((p) => ({
    translationKey: p.translationKey,
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    mins: postReadingTime(p),
  }));
  const total = posts.length;

  return (
    <main className="max-w-[680px] mx-auto px-8 py-16">
      <h1
        className="font-semibold tracking-tight"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>
      <p
        className="mt-4 text-[var(--text-muted)]"
        style={{ fontSize: 17, lineHeight: 1.6 }}
      >
        {t.subtitle}
      </p>

      <div className="mt-10">
        <NewsletterForm
          placeholder={t.placeholder}
          submitLabel={t.submit}
          successLabel={t.success}
        />
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.5px] text-[var(--text-muted)]">
        {t.socialProof}
      </p>

      {recent.length > 0 && (
        <section className="mt-16">
          <h2 className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--text-muted)] mb-4">
            {t.recentHeading}
          </h2>
          <div className="border-t border-[var(--border)]">
            {recent.map((p, idx) => (
              <PostRow
                key={p.translationKey}
                post={p}
                index={idx}
                total={total}
                lang={l}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
