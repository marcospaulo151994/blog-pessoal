import { getNotes } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { NoteCard } from '@/components/ui/NoteCard';

export function GardenPeek({ lang }: { lang: Locale }) {
  const notes = getNotes({ lang }).slice(0, 3);
  if (notes.length === 0) return null;
  const label = lang === 'pt' ? 'Do garden' : 'From the garden';

  return (
    <section className="py-10 border-t border-[var(--border)]">
      <h2 className="text-2xl font-semibold mb-4 tracking-tight">{label}</h2>
      {notes.map((n) => (
        <NoteCard
          key={n.translationKey}
          slug={n.slug}
          title={n.title}
          maturity={n.maturity}
          planted={n.planted}
          lang={lang}
        />
      ))}
    </section>
  );
}
