import Link from 'next/link';
import { PATHS, type Locale } from '@/lib/i18n';

const copy = {
  pt: {
    line1: 'Olá. Bem vindo ao meu quintal digital!',
    line2: 'Aqui nada faz sentido, sinta-se à vontade para explorar.',
    cta1: 'Ler posts →',
    cta2: 'Ver projetos →',
  },
  en: {
    line1: 'Hello. Welcome to my digital garden!',
    line2: 'Everything is nonsense in here, feel free to explore.',
    cta1: 'Read posts →',
    cta2: 'See projects →',
  },
} as const;

export function Hero({ lang }: { lang: Locale }) {
  const t = copy[lang];
  return (
    <section className="py-20">
      <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
        {t.line1}
        <br />
        {t.line2}
      </h1>
      <div className="flex gap-4 mt-8 text-lg">
        <Link href={`/${lang}/${PATHS.posts[lang]}`} className="text-[var(--accent)]">
          {t.cta1}
        </Link>
        <Link href={`/${lang}/${PATHS.projetos[lang]}`}>{t.cta2}</Link>
      </div>
    </section>
  );
}
