import type { Locale } from '@/lib/i18n';
import { NewsletterCta } from '@/components/ui/NewsletterCta';

export function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className="mt-20 border-t border-[var(--border)] py-8 text-sm text-[var(--text-muted)]">
      <div className="max-w-[1000px] mx-auto px-4 flex flex-wrap gap-4 justify-between">
        <div>© {new Date().getFullYear()} Marcos Paulo de Medeiros</div>
        <div className="flex gap-4">
          <a href={`/${lang === 'pt' ? '' : 'en/'}rss.xml`}>RSS</a>
          <a href="https://github.com/marcospaulo151994" target="_blank" rel="noopener">GitHub</a>
          <a href="www.linkedin.com/in/marcospaulodm" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:marcospaulo_medeiros@hotmail.com">Email</a>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-4 mt-4">
        <NewsletterCta />
      </div>
    </footer>
  );
}
