import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';

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

  return <div data-lang={lang}>{children}</div>;
}
