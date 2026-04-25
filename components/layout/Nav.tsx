import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { PATHS, type Locale } from '@/lib/i18n';

const labels = {
  pt: { posts: 'Posts', projetos: 'Projetos', notas: 'Notas', stack: 'Stack', sobre: 'Sobre' },
  en: { posts: 'Posts', projetos: 'Projects', notas: 'Notes', stack: 'Stack', sobre: 'About' },
} as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = labels[lang];
  return (
    <nav className="flex items-center justify-between py-6 px-8 border-b border-[var(--border)]">
      <Link href={`/${lang}`} className="text-lg font-semibold font-mono">
        marcos.run
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href={`/${lang}/${PATHS.posts[lang]}`}>{t.posts}</Link>
        <Link href={`/${lang}/${PATHS.projetos[lang]}`}>{t.projetos}</Link>
        <Link href={`/${lang}/${PATHS.notas[lang]}`}>{t.notas}</Link>
        <Link href={`/${lang}/${PATHS.stack[lang]}`}>{t.stack}</Link>
        <Link href={`/${lang}/${PATHS.sobre[lang]}`}>{t.sobre}</Link>
        <LanguageSwitcher currentLang={lang} />
        <ThemeToggle />
      </div>
    </nav>
  );
}
