import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNotes } from '@/lib/content';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { NoteCard } from '@/components/ui/NoteCard';

const copy = {
  pt: {
    title: 'Notas',
    description: 'Rascunhos, ideias e notas em diferentes estágios de maturação.',
    subtitle: 'rascunhos, ideias e notas em diferentes estágios de maturação.',
    empty: 'ainda sem notas no garden.',
    sections: {
      seedling: 'seedling 🌱',
      budding: 'budding 🌿',
      evergreen: 'evergreen 🌳',
    },
  },
  en: {
    title: 'Notes',
    description: 'Drafts, ideas, and notes at different stages.',
    subtitle: 'drafts, ideas, and notes at different stages.',
    empty: 'no notes in the garden yet.',
    sections: {
      seedling: 'seedling 🌱',
      budding: 'budding 🌿',
      evergreen: 'evergreen 🌳',
    },
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
    path: `/${lang}/${PATHS.notas[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.notas.pt}`,
      en: `/en/${PATHS.notas.en}`,
    },
  });
}

const maturityOrder: Array<'seedling' | 'budding' | 'evergreen'> = [
  'seedling',
  'budding',
  'evergreen',
];

export default async function NotasIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const notes = getNotes({ lang: l });
  const grouped = maturityOrder.map((m) => ({
    maturity: m,
    items: notes.filter((n) => n.maturity === m),
  }));

  return (
    <main className="max-w-[1100px] mx-auto px-8 py-16">
      <h1
        className="font-semibold tracking-tight"
        style={{ fontSize: 40, letterSpacing: '-1.5px' }}
      >
        {t.title}
      </h1>
      <p className="mt-3 italic font-mono text-[var(--text-muted)]" style={{ fontSize: 13 }}>
        {t.subtitle}
      </p>

      {notes.length === 0 ? (
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)]">
          {t.empty}
        </p>
      ) : (
        <div className="mt-12 space-y-12">
          {grouped.map(
            ({ maturity, items }) =>
              items.length > 0 && (
                <section key={maturity}>
                  <h2 className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--text-muted)] mb-3">
                    {t.sections[maturity]}
                  </h2>
                  <div className="border-t border-[var(--border)]">
                    {items.map((n) => (
                      <NoteCard
                        key={n.translationKey}
                        slug={n.slug}
                        title={n.title}
                        maturity={n.maturity}
                        planted={n.planted}
                        lang={l}
                      />
                    ))}
                  </div>
                </section>
              ),
          )}
        </div>
      )}
    </main>
  );
}
