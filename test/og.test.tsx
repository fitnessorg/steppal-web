import { describe, it, expect } from 'vitest';
import RootImage, { alt as rootAlt, size as rootSize, contentType as rootContentType } from '@/app/opengraph-image';
import ArchitectureImage, { alt as archAlt, size as archSize } from '@/app/architecture/opengraph-image';
import ContributeImage, { alt as contribAlt, size as contribSize } from '@/app/contribute/opengraph-image';
import { OgCard } from '@/lib/og-card';
import { metadata as archMeta } from '@/app/architecture/page';
import { metadata as contribMeta } from '@/app/contribute/page';
import { metadata as privacyMeta } from '@/app/privacy/page';
import { metadata as termsMeta } from '@/app/terms/page';

describe('Open Graph & Metadata Infrastructure', () => {
  describe('OgCard component', () => {
    it('renders a styled layout containing brand elements and badges', () => {
      const card = OgCard({
        eyebrow: 'System Design',
        badge: 'Technical Spec',
        title: 'Where the money sits',
        description: 'Settlement rules and Soroban contracts on Stellar.',
        pills: ['Rust', 'Postgres'],
      });

      expect(card).toBeDefined();
      expect(card.type).toBe('div');
      expect(card.props.style.backgroundColor).toBe('#0C0A08');
      expect(card.props.style.border).toBe('14px solid #FF4A1C');
    });
  });

  describe('Route Open Graph Image generators', () => {
    it('generates the root OG image with correct dimensions and headers', async () => {
      expect(rootAlt).toBe('StepPal — put money on your step goal');
      expect(rootSize).toEqual({ width: 1200, height: 630 });
      expect(rootContentType).toBe('image/png');

      const response = await RootImage();
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');
    });

    it('generates the architecture OG image with correct dimensions', async () => {
      expect(archAlt).toContain('Architecture');
      expect(archSize).toEqual({ width: 1200, height: 630 });

      const response = await ArchitectureImage();
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');
    });

    it('generates the contribute OG image with correct dimensions', async () => {
      expect(contribAlt).toContain('Contribute');
      expect(contribSize).toEqual({ width: 1200, height: 630 });

      const response = await ContributeImage();
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');
    });
  });

  describe('Page metadata completeness audit', () => {
    it('exports canonical URLs, OpenGraph, and Twitter card metadata for /architecture', () => {
      expect(archMeta.alternates?.canonical).toBe('/architecture');
      expect(archMeta.openGraph?.title).toContain('Architecture');
      expect((archMeta.twitter as { card?: string })?.card).toBe('summary_large_image');
    });

    it('exports canonical URLs, OpenGraph, and Twitter card metadata for /contribute', () => {
      expect(contribMeta.alternates?.canonical).toBe('/contribute');
      expect(contribMeta.openGraph?.title).toContain('Contribute');
      expect((contribMeta.twitter as { card?: string })?.card).toBe('summary_large_image');
    });

    it('exports canonical URLs, OpenGraph, and Twitter card metadata for /privacy', () => {
      expect(privacyMeta.alternates?.canonical).toBe('/privacy');
      expect(privacyMeta.openGraph?.title).toContain('Privacy');
      expect((privacyMeta.twitter as { card?: string })?.card).toBe('summary_large_image');
    });

    it('exports canonical URLs, OpenGraph, and Twitter card metadata for /terms', () => {
      expect(termsMeta.alternates?.canonical).toBe('/terms');
      expect(termsMeta.openGraph?.title).toContain('Terms');
      expect((termsMeta.twitter as { card?: string })?.card).toBe('summary_large_image');
    });
  });
});
