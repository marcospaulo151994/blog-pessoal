import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from './i18n';

interface Input {
  cookie: string | null;
  header: string | null;
}

export function detectLocale({ cookie, header }: Input): Locale {
  if (cookie && isLocale(cookie)) return cookie;

  if (header) {
    const preferred = header
      .split(',')
      .map((p) => p.trim().split(';')[0].split('-')[0])
      .find((lang) => (LOCALES as readonly string[]).includes(lang));
    if (preferred && isLocale(preferred)) return preferred;
  }

  return DEFAULT_LOCALE;
}
