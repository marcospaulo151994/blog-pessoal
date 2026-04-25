import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { Hero } from '@/components/home/Hero';
import { RecentPosts } from '@/components/home/RecentPosts';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { GardenPeek } from '@/components/home/GardenPeek';

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
