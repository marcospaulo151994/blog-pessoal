import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div data-lang={lang} className="relative min-h-screen flex flex-col">
      {/* Background glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse at top, var(--glow-a), var(--glow-b), transparent)',
        }}
        aria-hidden
      />
      {/* Background gridlines */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse at center, black, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black, transparent 80%)',
        }}
        aria-hidden
      />
      <Nav lang={lang as Locale} />
      <div className="flex-1 page-fade-up relative">{children}</div>
      <Footer lang={lang as Locale} />
    </div>
  );
}
