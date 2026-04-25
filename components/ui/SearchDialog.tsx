'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import MiniSearch from 'minisearch';
import type { Locale } from '@/lib/i18n';
import type { SearchResult, SearchIndex } from '@/lib/search';

export function SearchDialog({
  open,
  onOpenChange,
  lang,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lang: Locale;
}) {
  const [index, setIndex] = useState<MiniSearch<SearchResult & { content: string }> | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || index) return;
    fetch(`/api/search-index?lang=${lang}`)
      .then((r) => r.json() as Promise<SearchIndex>)
      .then(({ documents }) => {
        const mini = new MiniSearch<SearchResult & { content: string }>({
          fields: ['title', 'description', 'content'],
          storeFields: ['id', 'type', 'title', 'description', 'href'],
          searchOptions: { boost: { title: 3, description: 2 }, prefix: true, fuzzy: 0.2 },
        });
        mini.addAll(documents);
        setIndex(mini);
      });
  }, [open, index, lang]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!index || !query) return setResults([]);
    const matches = index.search(query);
    setResults(matches.slice(0, 10) as unknown as SearchResult[]);
  }, [index, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-24"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-[var(--bg-elevated)] rounded-lg w-full max-w-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'pt' ? 'Buscar...' : 'Search...'}
          className="w-full p-4 bg-transparent outline-none border-b border-[var(--border)] text-lg"
        />
        <ul className="max-h-96 overflow-auto">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 p-3 hover:bg-[var(--code-bg)]"
              >
                <span className="text-xs text-[var(--text-muted)] uppercase">{r.type}</span>
                <span>{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
