import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  prefersReducedMotion,
  DURATION,
  EASE_OUT,
  EASE_IN_OUT,
  CSS_EASE_OUT,
  CSS_EASE_IN_OUT,
  STAGGER,
  TRIGGER_START,
  LENIS_OPTIONS,
} from '@/lib/motion';

describe('Motion System & Reduced Motion', () => {
  describe('prefersReducedMotion', () => {
    it('safely returns false in SSR environments where window is undefined', () => {
      expect(prefersReducedMotion()).toBe(false);
    });

    it('returns true when user prefers reduced motion in browser environment', () => {
      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      // Simulate browser window
      (globalThis as unknown as { window?: { matchMedia: typeof mockMatchMedia } }).window = {
        matchMedia: mockMatchMedia,
      };

      try {
        expect(prefersReducedMotion()).toBe(true);
      } finally {
        delete (globalThis as unknown as { window?: unknown }).window;
      }
    });

    it('returns false when reduced motion is not preferred in browser environment', () => {
      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      (globalThis as unknown as { window?: { matchMedia: typeof mockMatchMedia } }).window = {
        matchMedia: mockMatchMedia,
      };

      try {
        expect(prefersReducedMotion()).toBe(false);
      } finally {
        delete (globalThis as unknown as { window?: unknown }).window;
      }
    });
  });

  describe('Motion Tokens', () => {
    it('defines consistent easing curves for GSAP and CSS', () => {
      expect(EASE_OUT).toBe('expo.out');
      expect(EASE_IN_OUT).toBe('power3.inOut');
      expect(CSS_EASE_OUT).toContain('cubic-bezier');
      expect(CSS_EASE_IN_OUT).toContain('cubic-bezier');
    });

    it('defines hierarchy of durations', () => {
      expect(DURATION.micro).toBeLessThan(DURATION.transition);
      expect(DURATION.transition).toBeLessThan(DURATION.text);
      expect(DURATION.text).toBeLessThan(DURATION.media);
    });

    it('defines stagger timings for typography and item lists', () => {
      expect(STAGGER.lines).toBe(0.08);
      expect(STAGGER.items).toBe(0.12);
    });

    it('exports default scroll trigger start point', () => {
      expect(TRIGGER_START).toBe('top 80%');
    });
  });

  describe('Lenis Configuration', () => {
    it('disables touch scroll smoothing for native Android responsiveness', () => {
      expect(LENIS_OPTIONS.syncTouch).toBe(false);
      expect(LENIS_OPTIONS.smoothWheel).toBe(true);
      expect(LENIS_OPTIONS.lerp).toBe(0.09);
    });
  });
});
