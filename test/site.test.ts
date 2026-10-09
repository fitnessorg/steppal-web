import { describe, it, expect, afterEach } from 'vitest';
import { siteUrl } from '@/lib/site';

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
});
