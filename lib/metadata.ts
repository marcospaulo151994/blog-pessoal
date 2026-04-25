import type { Metadata } from 'next';
import { LOCALES, type Locale } from './i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  ogImageUrl?: string;
  alternatePaths?: Partial<Record<Locale, string>>;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImageUrl,
  alternatePaths,
}: PageMetadata): Metadata {
  const ogUrl = ogImageUrl ?? `${SITE}/api/og?title=${encodeURIComponent(title)}`;
  const languages: Record<string, string> = {};
  LOCALES.forEach((lang) => {
    const altPath = alternatePaths?.[lang];
    if (altPath) {
      languages[lang === 'pt' ? 'pt-BR' : 'en'] = `${SITE}${altPath}`;
    }
  });
  languages['x-default'] = `${SITE}${alternatePaths?.pt ?? path}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `${SITE}${path}`,
      images: [ogUrl],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  };
}
