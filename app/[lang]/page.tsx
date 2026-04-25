import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/metadata';
import { Hero } from '@/components/home/Hero';
import { RecentPosts } from '@/components/home/RecentPosts';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { GardenPeek } from '@/components/home/GardenPeek';

const copy = {
  pt: {
    title: 'marcos.run',
    description: 'Posts, projetos e notas sobre ML e visão computacional — Marcos Medeiros.',
  },
  en: {
    title: 'marcos.run',
    description: 'Posts, projects, and notes on ML and computer vision — Marcos Medeiros.',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = copy[lang];
  return buildMetadata({
    title: t.title,
    description: t.description,
    path: `/${lang}`,
    alternatePaths: { pt: '/pt', en: '/en' },
  });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  return (
    <main className="max-w-[800px] mx-auto px-4">
      <Hero lang={l} />
      <RecentPosts lang={l} />
      <FeaturedProjects lang={l} />
      <GardenPeek lang={l} />
    </main>
  );
}
