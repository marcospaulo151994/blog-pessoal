import { describe, it, expect } from 'vitest';
import { getPosts, getPostBySlug } from '@/lib/content';

describe('getPosts', () => {
  it('returns only published posts for the given lang', () => {
    const posts = getPosts({ lang: 'pt' });
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.status === 'published')).toBe(true);
    expect(posts.every((p) => p.lang === 'pt')).toBe(true);
  });

  it('sorts posts by date desc', () => {
    const posts = getPosts({ lang: 'pt' });
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date.getTime() >= posts[i].date.getTime()).toBe(true);
    }
  });
});

describe('getPostBySlug', () => {
  it('returns a post matching slug and lang', () => {
    const post = getPostBySlug('mediapipe-pose-landmarks', 'pt');
    expect(post?.title).toBe('MediaPipe Pose: do que é feito um esqueleto de 33 pontos');
  });

  it('returns null for unknown slug', () => {
    expect(getPostBySlug('nao-existe', 'pt')).toBeNull();
  });
});
