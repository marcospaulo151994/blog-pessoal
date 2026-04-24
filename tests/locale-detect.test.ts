import { describe, it, expect } from 'vitest';
import { detectLocale } from '@/lib/locale-detect';

describe('detectLocale', () => {
  it('prefers cookie over header', () => {
    expect(detectLocale({ cookie: 'en', header: 'pt-BR,pt;q=0.9' })).toBe('en');
  });

  it('falls back to Accept-Language header', () => {
    expect(detectLocale({ cookie: null, header: 'en-US,en;q=0.9' })).toBe('en');
    expect(detectLocale({ cookie: null, header: 'pt-BR,pt;q=0.9' })).toBe('pt');
  });

  it('falls back to default when nothing matches', () => {
    expect(detectLocale({ cookie: null, header: 'fr-FR' })).toBe('pt');
    expect(detectLocale({ cookie: null, header: null })).toBe('pt');
  });

  it('ignores invalid cookie values', () => {
    expect(detectLocale({ cookie: 'xyz', header: 'en' })).toBe('en');
  });
});
