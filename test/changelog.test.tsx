import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ECOSYSTEM_REPOS,
  FALLBACK_RELEASES,
  parseReleaseBody,
  sortReleases,
  fetchEcosystemReleases,
} from '@/lib/changelog';
import Changelog, { ChangelogView, metadata } from '@/app/changelog/page';
import ChangelogOgImage, {
  alt as changelogOgAlt,
  size as changelogOgSize,
  contentType as changelogOgContentType,
} from '@/app/changelog/opengraph-image';

describe('Ecosystem Changelog Hub & Aggregation', () => {
  describe('parseReleaseBody', () => {
    it('extracts the first prose line as summary and bullet items as highlights', () => {
      const raw = `
## Highlights
Shipped deterministic Soroban settlement across pots.
- Added 24-hour dispute window enforcement
* Published @steppal/sdk client
      `;

      const parsed = parseReleaseBody(raw);
      expect(parsed.summary).toBe('Shipped deterministic Soroban settlement across pots.');
      expect(parsed.highlights).toEqual([
        'Added 24-hour dispute window enforcement',
        'Published @steppal/sdk client',
      ]);
    });

    it('provides a clean fallback summary when body contains only headings or bullets', () => {
      const parsed = parseReleaseBody('# v0.1.0\n- Initial commit');
      expect(parsed.summary).toBe('Release update across the StepPal ecosystem.');
      expect(parsed.highlights).toEqual(['Initial commit']);
    });
  });

  describe('sortReleases', () => {
    it('sorts releases in descending chronological order without mutating input', () => {
      const unsorted = [
        FALLBACK_RELEASES[FALLBACK_RELEASES.length - 1],
        FALLBACK_RELEASES[0],
      ];
      const sorted = sortReleases(unsorted);

      expect(sorted[0].publishedAt >= sorted[1].publishedAt).toBe(true);
      expect(unsorted[0].id).toBe(FALLBACK_RELEASES[FALLBACK_RELEASES.length - 1].id);
    });
  });

  describe('fetchEcosystemReleases', () => {
    it('returns sorted fallback releases by default when network fetching is disabled', async () => {
      const releases = await fetchEcosystemReleases({ enableNetwork: false });

      expect(releases.length).toBe(FALLBACK_RELEASES.length);
      expect(releases[0].id).toBe('steppal-web-v0.3.0');
      expect(ECOSYSTEM_REPOS).toEqual(['steppal-core', 'steppal-mobile', 'steppal-web']);
    });

    it('fetches and normalizes live GitHub releases across all three repos when enabled', async () => {
      const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        const repo = ECOSYSTEM_REPOS.find((r) => url.includes(r)) ?? 'steppal-web';
        return new Response(
          JSON.stringify([
            {
              id: 1,
              tag_name: 'v1.0.0',
              name: `${repo} 1.0`,
              published_at: '2026-11-08T10:00:00Z',
              html_url: `https://github.com/fitnessorg/${repo}/releases/tag/v1.0.0`,
              body: `Major milestone for ${repo}.\n- Feature A\n- Feature B`,
              draft: false,
            },
            {
              id: 2,
              tag_name: 'v1.1.0-draft',
              draft: true,
            },
          ]),
          { status: 200 },
        );
      }) as unknown as typeof fetch;

      const releases = await fetchEcosystemReleases({
        enableNetwork: true,
        fetchImpl: mockFetch,
        githubToken: 'ghp_test_token',
      });

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(releases).toHaveLength(3);
      expect(releases.map((r) => r.repo).sort()).toEqual([
        'steppal-core',
        'steppal-mobile',
        'steppal-web',
      ]);
      expect(releases[0].highlights).toEqual(['Feature A', 'Feature B']);
    });

    it('falls back cleanly to curated snapshot releases when GitHub API returns 403 rate limit or network error', async () => {
      const failingFetch = vi.fn(async () => new Response('Rate limited', { status: 403 })) as unknown as typeof fetch;

      const releases = await fetchEcosystemReleases({
        enableNetwork: true,
        fetchImpl: failingFetch,
      });

      expect(releases).toEqual(sortReleases(FALLBACK_RELEASES));
    });

    it('falls back cleanly when GitHub repositories return empty release arrays', async () => {
      const emptyFetch = vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })) as unknown as typeof fetch;

      const releases = await fetchEcosystemReleases({
        enableNetwork: true,
        fetchImpl: emptyFetch,
      });

      expect(releases).toEqual(sortReleases(FALLBACK_RELEASES));
    });
  });

  describe('/changelog page and Open Graph route', () => {
    it('renders ecosystem releases, repo badges, highlights, and architecture/contribute links', () => {
      const html = renderToStaticMarkup(<Changelog />);

      expect(html).toContain('What shipped across the three repos.');
      expect(html).toContain('steppal-core');
      expect(html).toContain('steppal-mobile');
      expect(html).toContain('steppal-web');
      expect(html).toContain('Soroban Escrow Contract');
      expect(html).toContain('Health Connect Step Sync');
      expect(html).toContain('href="/architecture"');
      expect(html).toContain('href="/contribute"');
    });

    it('renders ChangelogView with custom release list including empty highlights branch', () => {
      const html = renderToStaticMarkup(
        <ChangelogView
          releases={[
            {
              id: 'steppal-core-v0.9.0',
              repo: 'steppal-core',
              tag: 'v0.9.0',
              title: 'Minimal Release',
              publishedAt: '2026-11-08',
              url: 'https://github.com/fitnessorg/steppal-core/releases/tag/v0.9.0',
              summary: 'Summary only release.',
              highlights: [],
            },
          ]}
        />,
      );

      expect(html).toContain('Minimal Release');
      expect(html).toContain('Summary only release.');
    });

    it('exports canonical metadata and a valid 1200x630 Open Graph PNG response for /changelog', async () => {
      expect(metadata.title).toBe('Changelog — StepPal');
      expect(metadata.alternates?.canonical).toBe('/changelog');
      expect(changelogOgAlt).toContain('StepPal Changelog');
      expect(changelogOgSize).toEqual({ width: 1200, height: 630 });
      expect(changelogOgContentType).toBe('image/png');

      const res = await ChangelogOgImage();
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('image/png');
    });
  });
});
