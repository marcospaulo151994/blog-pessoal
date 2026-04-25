import type { MetadataRoute } from 'next';
import { getPosts, getProjects, getNotes } from '@/lib/content';
import { PATHS, LOCALES } from '@/lib/i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = LOCALES.flatMap((lang) => [
    `/${lang}`,
    `/${lang}/${PATHS.posts[lang]}`,
    `/${lang}/${PATHS.projetos[lang]}`,
    `/${lang}/${PATHS.notas[lang]}`,
    `/${lang}/${PATHS.stack[lang]}`,
    `/${lang}/${PATHS.sobre[lang]}`,
  ]);

  const dynamicRoutes = LOCALES.flatMap((lang) => [
    ...getPosts({ lang }).map((p) => `/${lang}/${PATHS.posts[lang]}/${p.slug}`),
    ...getProjects({ lang }).map((p) => `/${lang}/${PATHS.projetos[lang]}/${p.slug}`),
    ...getNotes({ lang }).map((n) => `/${lang}/${PATHS.notas[lang]}/${n.slug}`),
  ]);

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
