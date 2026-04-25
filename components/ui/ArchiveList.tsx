'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { type Locale } from '@/lib/i18n';
import { PostRow, type PostRowItem } from '@/components/ui/PostRow';

interface ArchiveListProps {
  lang: Locale;
  posts: Array<PostRowItem & { translationKey: string }>;
}

const copy = {
  pt: {
    placeholder: 'buscar por título, tag, ano…',
    countSuffix: 'posts',
    empty: 'nenhum resultado.',
  },
  en: {
    placeholder: 'search by title, tag, year…',
    countSuffix: 'posts',
    empty: 'no results.',
  },
} as const;

const ARCHIVE_INPUT_ID = 'archive-search-input';

export function ArchiveList({ lang, posts }: ArchiveListProps) {
  const t = copy[lang];
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K focuses the local input.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const total = posts.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const haystack = [
        p.title.toLowerCase(),
        p.tags.join(' ').toLowerCase(),
        String(p.date.getFullYear()),
      ].join(' ');
      return haystack.includes(q);
    });
  }, [query, posts]);

  return (
    <>
      <div
        className="flex items-center gap-3 mt-6"
        style={{
          padding: '12px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
        }}
      >
        <span className="text-[var(--text-dim)]" aria-hidden>
          ⌕
        </span>
        <input
          id={ARCHIVE_INPUT_ID}
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-[var(--text)] text-[14px]"
          aria-label={t.placeholder}
        />
        <span
          className="font-mono text-[11px] text-[var(--text-dim)]"
          style={{
            padding: '2px 6px',
            border: '1px solid var(--border)',
            borderRadius: 4,
          }}
        >
          ⌘K
        </span>
      </div>

      <div className="mt-8 border-t border-[var(--border)]">
        {filtered.length === 0 && (
          <p className="py-6 text-[var(--text-muted)] text-sm">{t.empty}</p>
        )}
        {filtered.map((p) => {
          // Find the post's index in the FULL list (so № stays stable when filtering)
          const trueIdx = posts.findIndex((x) => x.translationKey === p.translationKey);
          return (
            <PostRow
              key={p.translationKey}
              post={p}
              index={trueIdx >= 0 ? trueIdx : 0}
              total={total}
              lang={lang}
            />
          );
        })}
      </div>
    </>
  );
}
