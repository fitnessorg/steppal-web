import { describe, it, expect } from 'vitest';
import React from 'react';
import { slugify, extractText, enhanceHeadings, Prose } from '@/components/Prose';

describe('Prose heading permalinks', () => {
  describe('slugify', () => {
    it('converts plain headings to clean hyphenated slugs', () => {
      expect(slugify('Three repos, one seam')).toBe('three-repos-one-seam');
      expect(slugify('Why not GPS')).toBe('why-not-gps');
      expect(slugify('Settlement is not a leaderboard')).toBe('settlement-is-not-a-leaderboard');
    });

    it('strips punctuation, quotes, and symbols', () => {
      expect(slugify('A step count is a claim, not a fact!')).toBe('a-step-count-is-a-claim-not-a-fact');
      expect(slugify("What you don't know: details & caveats")).toBe('what-you-dont-know-details-caveats');
    });

    it('handles multiple consecutive spaces and leading/trailing whitespace', () => {
      expect(slugify('   lots   of   spaces   ')).toBe('lots-of-spaces');
    });
  });

  describe('extractText', () => {
    it('extracts text from strings and numbers', () => {
      expect(extractText('Simple string')).toBe('Simple string');
      expect(extractText(42)).toBe('42');
    });

    it('extracts text from nested React elements', () => {
      const element = (
        <span>
          Hello <code>World</code>!
        </span>
      );
      expect(extractText(element)).toBe('Hello World!');
    });

    it('handles arrays of React nodes', () => {
      const nodes = ['First ', <strong key="bold">Bold</strong>, ' Last'];
      expect(extractText(nodes)).toBe('First Bold Last');
    });
  });

  describe('enhanceHeadings', () => {
    it('attaches generated id, group class, and permalink anchor to h2 and h3 elements', () => {
      const content = (
        <div>
          <h2>Three repos, one seam</h2>
          <p>Some paragraph</p>
          <h3>Why not GPS</h3>
        </div>
      );

      const enhanced = enhanceHeadings(content) as React.ReactElement;
      expect(enhanced).toBeDefined();

      const children = React.Children.toArray((enhanced.props as { children: React.ReactNode }).children);
      const h2 = children[0] as React.ReactElement<{ id: string; className: string; children: React.ReactNode }>;
      expect(h2.props.id).toBe('three-repos-one-seam');
      expect(h2.props.className).toContain('group');
      expect(h2.props.className).toContain('scroll-mt-24');

      const h2Children = React.Children.toArray(h2.props.children);
      const anchor = h2Children[1] as React.ReactElement<{ href: string; className: string }>;
      expect(anchor.props.href).toBe('#three-repos-one-seam');
      expect(anchor.props.className).toBe('heading-anchor');

      const h3 = children[2] as React.ReactElement<{ id: string }>;
      expect(h3.props.id).toBe('why-not-gps');
    });

    it('deduplicates identical heading slugs with numerical suffixes', () => {
      const content = (
        <>
          <h2>Overview</h2>
          <h2>Overview</h2>
        </>
      );

      const enhanced = enhanceHeadings(content);
      const array = React.Children.toArray(enhanced) as React.ReactElement<{ id: string }>[];
      expect(array[0].props.id).toBe('overview');
      expect(array[1].props.id).toBe('overview-1');
    });

    it('preserves custom IDs if already provided on heading', () => {
      const content = <h2 id="custom-id">Custom Heading</h2>;
      const enhanced = enhanceHeadings(content) as React.ReactElement<{ id: string }>;
      expect(enhanced.props.id).toBe('custom-id');
    });
  });

  describe('Prose component', () => {
    it('renders article and prose-body containing enhanced headings', () => {
      const tree = Prose({
        eyebrow: 'Architecture',
        title: 'System Design',
        lede: 'An introductory note.',
        children: <h2>First section</h2>,
      });

      expect(tree).toBeDefined();
      expect(tree.type).toBe('main');
    });
  });
});
