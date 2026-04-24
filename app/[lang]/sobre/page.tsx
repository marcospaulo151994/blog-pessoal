import type { Locale } from '@/lib/i18n';

const copy = {
  pt: { title: 'Sobre', body: 'Página sobre em construção.' },
  en: { title: 'About', body: 'About page under construction.' },
} as const;

export default async function Sobre({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = copy[lang];
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-4">{t.body}</p>
    </main>
  );
}
