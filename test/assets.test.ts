import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import nextConfig from '@/../next.config';

describe('Asset & Performance Configuration', () => {
  describe('next.config.ts', () => {
    it('configures modern AVIF and WebP image format negotiation', () => {
      expect(nextConfig.images?.formats).toEqual(['image/avif', 'image/webp']);
    });

    it('sets cache TTL for immutable static images', () => {
      expect(nextConfig.images?.minimumCacheTTL).toBe(31536000);
    });
  });

  describe('Static Assets Optimization', () => {
    it('verifies hero brand mark is compressed under 100KB', () => {
      const assetPath = path.join(process.cwd(), 'public', 'steppal-mark.png');
      expect(fs.existsSync(assetPath)).toBe(true);

      const stats = fs.statSync(assetPath);
      // Previously 218,457 bytes (~218KB). Compressed to ~87KB.
      expect(stats.size).toBeLessThan(100 * 1024);
      expect(stats.size).toBeGreaterThan(10 * 1024);
    });

    it('verifies favicon and app icon assets exist in src/app', () => {
      const iconPath = path.join(process.cwd(), 'src', 'app', 'icon.png');
      expect(fs.existsSync(iconPath)).toBe(true);
      const faviconPath = path.join(process.cwd(), 'src', 'app', 'favicon.ico');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });

    it('verifies dynamic search engine crawl directives exist', () => {
      const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
      expect(fs.existsSync(robotsPath)).toBe(true);
      const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
      expect(fs.existsSync(sitemapPath)).toBe(true);
    });

    it('keeps public/ free of unused create-next-app boilerplate SVGs', () => {
      const boilerplateFiles = ['file.svg', 'globe.svg', 'next.svg', 'vercel.svg', 'window.svg'];
      for (const file of boilerplateFiles) {
        const filePath = path.join(process.cwd(), 'public', file);
        expect(fs.existsSync(filePath)).toBe(false);
      }
    });
  });
});
