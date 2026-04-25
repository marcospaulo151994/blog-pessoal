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
    intro:
      'Ferramentas, linguagens e tecnologias que uso no dia-a-dia. Em construção — vou preenchendo conforme penso no que entra.',
    sections: {
      languages: 'Linguagens & runtimes',
      ides: 'Editores & IDEs',
      ml: 'ML & data science',
      frontend: 'Frontend & web',
      hardware: 'Hardware',
      tools: 'Outras ferramentas',
    },
    placeholder: 'Em construção.',
  },
  en: {
    title: 'Stack',
    intro:
      'Tools, languages, and technology I use daily. Work in progress — filling in as I think of what belongs here.',
    sections: {
      languages: 'Languages & runtimes',
      ides: 'Editors & IDEs',
      ml: 'ML & data science',
      frontend: 'Frontend & web',
      hardware: 'Hardware',
      tools: 'Other tools',
    },
    placeholder: 'Under construction.',
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
    <main className="max-w-[760px] mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold">{t.title}</h1>
      <p className="mt-3 text-[var(--text-muted)]">{t.intro}</p>

      {sectionOrder.map((key) => (
        <section key={key} className="mt-10">
          <h2 className="font-serif text-2xl mb-3">{t.sections[key]}</h2>
          <p className="text-[var(--text-muted)] italic">{t.placeholder}</p>
        </section>
      ))}
    </main>
  );
}
