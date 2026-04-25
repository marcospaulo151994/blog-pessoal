'use client';
import type { Locale } from '@/lib/i18n';

export function ShareButtons({ url, title, lang }: { url: string; title: string; lang: Locale }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const x = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const ln = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div className="flex gap-3 text-sm">
      <a href={x} target="_blank" rel="noopener">X</a>
      <a href={ln} target="_blank" rel="noopener">LinkedIn</a>
      <button onClick={() => navigator.clipboard.writeText(url)} className="underline">
        {lang === 'pt' ? 'Copiar link' : 'Copy link'}
      </button>
    </div>
  );
}
