import { describe, it, expect, afterEach } from 'vitest';
import { siteUrl } from '@/lib/site';
import sitemap from '@/app/sitemap';

const saved = { ...process.env };

afterEach(() => {
  process.env = { ...saved };
});

describe('siteUrl', () => {
  it('prefers an explicitly configured origin', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://steppal.ng';
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'steppal.vercel.app';

    expect(siteUrl()).toBe('https://steppal.ng');
  });

  it("falls back to Vercel's production URL so a fresh deploy is already correct", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'steppal.vercel.app';

    expect(siteUrl()).toBe('https://steppal.vercel.app');
  });

  it('falls back to localhost rather than a domain nobody owns', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;

    expect(siteUrl()).toBe('http://localhost:3000');
  });

  it('includes /changelog alongside core routes in the generated sitemap', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://steppal.ng';
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('https://steppal.ng');
    expect(urls).toContain('https://steppal.ng/contribute');
    expect(urls).toContain('https://steppal.ng/architecture');
    expect(urls).toContain('https://steppal.ng/changelog');
    expect(urls).toContain('https://steppal.ng/privacy');
    expect(urls).toContain('https://steppal.ng/terms');
  });
});
