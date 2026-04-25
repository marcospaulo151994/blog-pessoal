import { getProjects } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { ProjectCard } from '@/components/ui/ProjectCard';

export function FeaturedProjects({ lang }: { lang: Locale }) {
  const featured = getProjects({ lang })
    .filter((p) => p.featured)
    .slice(0, 2);
  if (featured.length === 0) return null;
  const label = lang === 'pt' ? 'Em construção' : 'Building';

  return (
    <section className="py-10 border-t border-[var(--border)]">
      <h2 className="font-serif text-2xl mb-4">{label}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {featured.map((p) => (
          <ProjectCard
            key={p.translationKey}
            slug={p.slug}
            title={p.title}
            tagline={p.tagline}
            status={p.status}
            stack={p.stack}
            cover={p.cover}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}
