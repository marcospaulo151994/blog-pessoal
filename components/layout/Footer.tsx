import type { Locale } from '@/lib/i18n';

export function Footer({ lang }: { lang: Locale }) {
  const rssHref = `/${lang === 'pt' ? '' : 'en/'}rss.xml`;
  return (
    <footer className="border-t border-[var(--border)] mt-32">
      <div className="max-w-[1100px] mx-auto px-8 py-6 flex items-center justify-between text-[12px] text-[var(--text-muted)] font-mono">
        <span>© {new Date().getFullYear()} marcos paulo de medeiros · feito com cuidado</span>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/marcospaulo151994"
            target="_blank"
            rel="noopener"
            className="hover:text-[var(--text)] transition-colors"
          >
            github
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener"
            className="hover:text-[var(--text)] transition-colors"
          >
            twitter
          </a>
          <a
            href="mailto:marcospaulo_medeiros@hotmail.com"
            className="hover:text-[var(--text)] transition-colors"
          >
            email
          </a>
          <a href={rssHref} className="hover:text-[var(--text)] transition-colors">
            rss
          </a>
        </div>
      </div>
    </footer>
  );
}
