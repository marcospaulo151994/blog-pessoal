import { NextRequest, NextResponse } from 'next/server';
import { buildSearchIndex } from '@/lib/search';
import { isLocale } from '@/lib/i18n';

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang');
  if (!lang || !isLocale(lang)) return NextResponse.json({ error: 'bad lang' }, { status: 400 });
  const index = await buildSearchIndex(lang);
  return NextResponse.json(index);
}
