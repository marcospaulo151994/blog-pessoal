'use client';

import { useEffect, useState } from 'react';
import { SearchDialog } from './SearchDialog';
import type { Locale } from '@/lib/i18n';

export function SearchTrigger({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Search" className="text-xl">
        🔍
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} lang={lang} />
    </>
  );
}
