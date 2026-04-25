import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const description =
    lang === 'pt'
      ? 'Ferramentas, linguagens e tecnologias que uso no dia-a-dia.'
      : 'Tools, languages, and technology I use daily.';
  return buildMetadata({
    title: 'Stack',
    description,
    path: `/${lang}/${PATHS.stack[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.stack.pt}`,
      en: `/en/${PATHS.stack.en}`,
    },
  });
}

const copy = {
  pt: {
    title: 'Stack',
    intro: 'ferramentas, linguagens e tecnologias que uso no dia-a-dia.',
    sections: {
      languages: 'linguagens & runtimes',
      ides: 'editores & ides',
      ml: 'ml & data science',
      frontend: 'frontend & web',
      hardware: 'hardware',
      tools: 'outras ferramentas',
    },
    placeholder: 'em construção.',
  },
  en: {
    title: 'Stack',
    intro: 'tools, languages, and technology I use daily.',
    sections: {
      languages: 'languages & runtimes',
      ides: 'editors & ides',
      ml: 'ml & data science',
      frontend: 'frontend & web',
      hardware: 'hardware',
      tools: 'other tools',
    },
    placeholder: 'under construction.',
  },
} as const;

export default async function StackPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];

  const sectionOrder: (keyof typeof t.sections)[] = [
    'languages',
    'ides',
    'ml',
    'frontend',
    'hardware',
    'tools',
  ];

  return (
    <main className="max-w-[760px] mx-auto px-8 py-16">
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
        {t.intro}
      </p>

      {sectionOrder.map((key) => (
        <section key={key} className="mt-10">
          <div className="font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-muted)] mb-3">
            {t.sections[key]}
          </div>
          <p
            className="text-[var(--text-muted)] italic"
            style={{ fontSize: 14, lineHeight: 1.6 }}
          >
            {t.placeholder}
          </p>
        </section>
      ))}
    </main>
  );
}
