import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/sections/Footer';
import { Showcase } from '@/components/sections/Showcase';

describe('Header, Footer & Showcase Component Suite', () => {
  describe('Header navigation', () => {
    it('renders home brand link, rooted section links, theme toggle, and waitlist CTA', () => {
      const html = renderToStaticMarkup(<Header />);

      expect(html).toContain('aria-label="StepPal home"');
      expect(html).toContain('aria-label="Main"');
      expect(html).toContain('href="/#how"');
      expect(html).toContain('href="/#modes"');
      expect(html).toContain('href="/#contribute"');
      expect(html).toContain('href="/contribute"');
      expect(html).toContain('href="/changelog"');
      expect(html).toContain('href="/#waitlist"');
      expect(html).toContain('Get it');
      expect(html).toContain('Theme: Auto');
    });
  });

  describe('Footer navigation', () => {
    it('renders project and legal links with MIT notice', () => {
      const html = renderToStaticMarkup(<Footer />);

      expect(html).toContain('aria-label="Footer"');
      expect(html).toContain('href="https://github.com/fitnessorg"');
      expect(html).toContain('href="/contribute"');
      expect(html).toContain('href="/architecture"');
      expect(html).toContain('href="/changelog"');
      expect(html).toContain('href="/privacy"');
      expect(html).toContain('href="/terms"');
      expect(html).toContain('MIT');
    });
  });

  describe('Showcase accessible tablist', () => {
    it('renders accessible tablist and tabpanels for Today, Leaderboard, and Settlement screens', () => {
      const html = renderToStaticMarkup(<Showcase />);

      expect(html).toContain('role="tablist"');
      expect(html).toContain('aria-label="App preview screens"');
      expect(html).toContain('id="showcase-tab-0"');
      expect(html).toContain('id="showcase-tab-1"');
      expect(html).toContain('id="showcase-tab-2"');
      expect(html).toContain('id="showcase-panel-0"');
      expect(html).toContain('id="showcase-panel-1"');
      expect(html).toContain('id="showcase-panel-2"');
      expect(html).toContain('Today');
      expect(html).toContain('Leaderboard');
      expect(html).toContain('Settlement');
      expect(html).toContain('₦30,000');
      expect(html).toContain('+₦18,000');
    });
  });
});
