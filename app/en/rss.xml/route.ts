import { getPosts } from '@/lib/content';
import { PATHS } from '@/lib/i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';

export async function GET() {
  const posts = getPosts({ lang: 'en' });
  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE}/en/${PATHS.posts.en}/${p.slug}</link>
      <guid>${SITE}/en/${PATHS.posts.en}/${p.slug}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>marcos.run — Blog</title>
    <link>${SITE}/en</link>
    <description>Posts on ML, computer vision, and security.</description>
    <language>en-US</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } });
}
