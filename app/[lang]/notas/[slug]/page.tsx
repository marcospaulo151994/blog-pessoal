import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allNotas } from 'content-collections';
import { getNoteBySlug, getNotes } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { longDate } from '@/lib/format';
import { MDXContent } from '@/components/mdx/MDXContent';

const copy = {
  pt: {
    back: '← notas',
    plantedLabel: 'plantado em',
    tendedLabel: 'cuidado em',
    maturityLabel: 'maturidade',
    maturity: { seedling: 'seedling 🌱', budding: 'budding 🌿', evergreen: 'evergreen 🌳' },
  },
  en: {
    back: '← notes',
    plantedLabel: 'planted',
    tendedLabel: 'tended',
    maturityLabel: 'maturity',
    maturity: { seedling: 'seedling 🌱', budding: 'budding 🌿', evergreen: 'evergreen 🌳' },
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const note = getNoteBySlug(slug, lang);
  if (!note) return {};

  const alternates: Partial<Record<Locale, string>> = {
    [note.lang]: `/${note.lang}/${PATHS.notas[note.lang]}/${note.slug}`,
  };
  const other = allNotas.find(
    (n) => n.translationKey === note.translationKey && n.lang !== note.lang,
  );
  if (other) {
    alternates[other.lang] = `/${other.lang}/${PATHS.notas[other.lang]}/${other.slug}`;
  }

  return buildMetadata({
    title: note.title,
    description: note.title,
    path: `/${note.lang}/${PATHS.notas[note.lang]}/${note.slug}`,
    alternatePaths: alternates,
  });
}

export async function generateStaticParams() {
  const pt = getNotes({ lang: 'pt' });
  const en = getNotes({ lang: 'en' });
  return [
    ...pt.map((n) => ({ lang: 'pt', slug: n.slug })),
    ...en.map((n) => ({ lang: 'en', slug: n.slug })),
  ];
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const note = getNoteBySlug(slug, lang);
  if (!note) notFound();

  const l = lang as Locale;
  const t = copy[l];
  const indexHref = `/${l}/${PATHS.notas[l]}`;

  return (
    <article className="max-w-[720px] mx-auto px-8 py-12">
      <Link
        href={indexHref}
        className="dp-link font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]"
      >
        {t.back}
      </Link>

      <h1
        className="font-semibold mt-10"
        style={{ fontSize: 52, lineHeight: 1.05, letterSpacing: '-2px' }}
      >
        {note.title}
      </h1>

      <div className="flex flex-wrap gap-3 mt-6 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.5px]">
        <span className="whitespace-nowrap">{t.maturity[note.maturity]}</span>
        <span>·</span>
        <span className="whitespace-nowrap">
          {t.plantedLabel} {longDate(note.planted, l)}
        </span>
        {note.tended && (
          <>
            <span>·</span>
            <span className="whitespace-nowrap">
              {t.tendedLabel} {longDate(note.tended, l)}
            </span>
          </>
        )}
      </div>

      <div className="prose-content mt-12">
        <MDXContent code={note.body} />
      </div>
    </article>
  );
}
