import { getPosts } from '@/lib/content';
import { PATHS } from '@/lib/i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog-pessoal-silk-nine.vercel.app';

export async function GET() {
  const posts = getPosts({ lang: 'pt' });
  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE}/pt/${PATHS.posts.pt}/${p.slug}</link>
      <guid>${SITE}/pt/${PATHS.posts.pt}/${p.slug}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>marcos medeiros — blog</title>
    <link>${SITE}/pt</link>
    <description>notas técnicas, projetos pessoais e o que estou aprendendo agora.</description>
    <language>pt-BR</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } });
}
