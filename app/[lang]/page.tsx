import type { Locale } from '@/lib/i18n';

const copy = {
  pt: { hello: 'Olá', placeholder: 'Em breve, conteúdo aqui.' },
  en: { hello: 'Hello', placeholder: 'Content coming soon.' },
} as const;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = copy[lang];
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{t.hello}</h1>
      <p className="mt-4">{t.placeholder}</p>
    </main>
  );
}
