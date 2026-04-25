'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SearchTrigger } from '@/components/ui/SearchTrigger';
import { PATHS, type Locale } from '@/lib/i18n';

const labels = {
  pt: {
    posts: 'Arquivo',
    projetos: 'Projetos',
    notas: 'Notas',
    stack: 'Stack',
    now: 'Now',
    sobre: 'Sobre',
  },
  en: {
    posts: 'Archive',
    projetos: 'Projects',
    notas: 'Notes',
    stack: 'Stack',
    now: 'Now',
    sobre: 'About',
  },
} as const;

type NavKey = keyof typeof labels.pt;
const navOrder: readonly NavKey[] = ['posts', 'projetos', 'notas', 'stack', 'now', 'sobre'];

export function Nav({ lang }: { lang: Locale }) {
  const t = labels[lang];
  const pathname = usePathname() ?? '';

  const hrefFor = (key: NavKey) => `/${lang}/${PATHS[key][lang]}`;

  const isActive = (key: NavKey) => {
    const target = hrefFor(key);
    return pathname === target || pathname.startsWith(target + '/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)] backdrop-blur-md bg-[color:var(--bg)]/80">
      <div className="max-w-[1100px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* LEFT: logo dot + brand + v2.0 badge */}
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, var(--text), var(--text-muted))',
            }}
          />
          <span className="font-semibold text-[15px]">marcos.run</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[var(--border)] rounded text-[var(--text-muted)] tracking-wide">
            v2.0
          </span>
        </Link>

        {/* CENTER: nav links */}
        <div className="flex items-center gap-1 text-sm">
          {navOrder.map((key) => (
            <Link
              key={key}
              href={hrefFor(key)}
              className={
                isActive(key)
                  ? 'px-3 py-1.5 rounded bg-[var(--surface-hover)] text-[var(--text)] font-medium'
                  : 'px-3 py-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text)] transition-colors'
              }
            >
              {t[key]}
            </Link>
          ))}
        </div>

        {/* RIGHT: search + lang + theme + Inscrever */}
        <div className="flex items-center gap-2">
          <SearchTrigger lang={lang} />
          <LanguageSwitcher currentLang={lang} />
          <ThemeToggle />
          <Link
            href={`/${lang}/${PATHS.newsletter[lang]}`}
            className="ml-2 px-3 py-1.5 rounded text-[13px] font-medium bg-[var(--text)] text-[var(--bg)] hover:opacity-85 transition-opacity"
          >
            {lang === 'pt' ? 'Inscrever' : 'Subscribe'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
