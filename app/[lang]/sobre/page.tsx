import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, PATHS, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';

const copy = {
  pt: {
    title: 'Sobre',
    body: 'Página sobre em construção.',
    description: 'Sobre Marcos Medeiros — UPF, ML e visão computacional.',
  },
  en: {
    title: 'About',
    body: 'About page under construction.',
    description: 'About Marcos Medeiros — UPF, ML, and computer vision.',
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
    path: `/${lang}/${PATHS.sobre[lang]}`,
    alternatePaths: {
      pt: `/pt/${PATHS.sobre.pt}`,
      en: `/en/${PATHS.sobre.en}`,
    },
  });
}

export default async function Sobre({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-4">{t.body}</p>
    </main>
  );
}
