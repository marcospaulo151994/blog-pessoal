import { NextRequest, NextResponse } from 'next/server';
import { isLocale, getCanonicalPath } from '@/lib/i18n';
import { detectLocale } from '@/lib/locale-detect';

const COOKIE_NAME = 'NEXT_LANG';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|txt|xml|webp|mp4|woff|woff2|js|css)$/)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/')[1];

  if (!firstSegment || !isLocale(firstSegment)) {
    const detected = detectLocale({
      cookie: request.cookies.get(COOKIE_NAME)?.value ?? null,
      header: request.headers.get('accept-language'),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${detected}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const canonical = getCanonicalPath(pathname);
  if (canonical !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
