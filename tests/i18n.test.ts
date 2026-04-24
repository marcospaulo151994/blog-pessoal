import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  translatePath,
  getCanonicalPath,
} from '@/lib/i18n';

describe('LOCALES', () => {
  it('contains pt and en', () => {
    expect(LOCALES).toEqual(['pt', 'en']);
  });
});

describe('DEFAULT_LOCALE', () => {
  it('is pt', () => {
    expect(DEFAULT_LOCALE).toBe('pt');
  });
});

describe('isLocale', () => {
  it('returns true for pt and en', () => {
    expect(isLocale('pt')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('returns false for other strings', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe('translatePath', () => {
  it('translates segments between locales', () => {
    expect(translatePath('/pt/projetos', 'pt', 'en')).toBe('/en/projects');
    expect(translatePath('/en/projects', 'en', 'pt')).toBe('/pt/projetos');
    expect(translatePath('/pt/sobre', 'pt', 'en')).toBe('/en/about');
  });

  it('preserves untranslated segments (slugs)', () => {
    expect(translatePath('/pt/posts/meu-post', 'pt', 'en')).toBe('/en/posts/meu-post');
  });

  it('keeps locale when target equals source', () => {
    expect(translatePath('/pt/projetos', 'pt', 'pt')).toBe('/pt/projetos');
  });

  it('returns locale root for unknown top segments', () => {
    expect(translatePath('/pt/xyz', 'pt', 'en')).toBe('/en');
  });
});

describe('getCanonicalPath', () => {
  it('maps translated path to canonical (internal pt) path', () => {
    expect(getCanonicalPath('/en/projects')).toBe('/en/projetos');
    expect(getCanonicalPath('/en/about')).toBe('/en/sobre');
    expect(getCanonicalPath('/pt/projetos')).toBe('/pt/projetos');
  });
});
