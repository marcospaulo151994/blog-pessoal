'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, translatePath, type Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
};

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const other = LOCALES.find((l) => l !== currentLang)!;
  const href = translatePath(pathname, currentLang, other);

  return (
    <Link
      href={href}
      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)]"
      aria-label={`Switch to ${labels[other]}`}
      onClick={() => {
        document.cookie = `NEXT_LANG=${other};path=/;max-age=31536000;samesite=lax`;
      }}
    >
      {labels[other]}
    </Link>
  );
}
