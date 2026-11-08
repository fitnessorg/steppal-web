import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ThemeToggle,
  readTheme,
  serverTheme,
  subscribeTheme,
  applyTheme,
  NEXT_THEME,
  THEME_LABEL,
  STORAGE_KEY,
} from '@/components/ThemeToggle';

describe('ThemeToggle & External Theme Store', () => {
  afterEach(() => {
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
    delete (globalThis as unknown as { document?: unknown }).document;
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  describe('State Machine & Constants', () => {
    it('cycles through all three states: system -> light -> dark -> system', () => {
      expect(NEXT_THEME.system).toBe('light');
      expect(NEXT_THEME.light).toBe('dark');
      expect(NEXT_THEME.dark).toBe('system');
    });

    it('provides human-readable labels for each theme state', () => {
      expect(THEME_LABEL.system).toBe('Auto');
      expect(THEME_LABEL.light).toBe('Light');
      expect(THEME_LABEL.dark).toBe('Dark');
    });

    it('returns system as the deterministic server snapshot to prevent hydration mismatches', () => {
      expect(serverTheme()).toBe('system');
    });
  });

  describe('readTheme', () => {
    it('returns system when localStorage is unavailable or empty', () => {
      expect(readTheme()).toBe('system');

      (globalThis as unknown as { localStorage: Storage }).localStorage = {
        getItem: vi.fn(() => null),
      } as unknown as Storage;

      expect(readTheme()).toBe('system');
    });

    it('reads stored light and dark themes from localStorage', () => {
      const store = new Map<string, string>();
      (globalThis as unknown as { localStorage: Storage }).localStorage = {
        getItem: vi.fn((k: string) => store.get(k) ?? null),
      } as unknown as Storage;

      store.set(STORAGE_KEY, 'light');
      expect(readTheme()).toBe('light');

      store.set(STORAGE_KEY, 'dark');
      expect(readTheme()).toBe('dark');
    });

    it('falls back to system if stored value is corrupted or invalid', () => {
      (globalThis as unknown as { localStorage: Storage }).localStorage = {
        getItem: vi.fn(() => 'neon-purple'),
      } as unknown as Storage;

      expect(readTheme()).toBe('system');
    });

    it('falls back to system when localStorage throws in private browsing', () => {
      (globalThis as unknown as { localStorage: Storage }).localStorage = {
        getItem: vi.fn(() => {
          throw new Error('SecurityError: storage blocked');
        }),
      } as unknown as Storage;

      expect(readTheme()).toBe('system');
    });
  });

  describe('applyTheme & subscribeTheme', () => {
    it('persists explicit theme, stamps data-theme on documentElement, and notifies subscribers', () => {
      const setItem = vi.fn();
      const removeItem = vi.fn();
      const setAttribute = vi.fn();
      const removeAttribute = vi.fn();
      const addEventListener = vi.fn();
      const removeEventListener = vi.fn();

      (globalThis as unknown as { localStorage: unknown }).localStorage = { setItem, removeItem };
      (globalThis as unknown as { document: unknown }).document = {
        documentElement: { setAttribute, removeAttribute },
      };
      (globalThis as unknown as { window: unknown }).window = {
        addEventListener,
        removeEventListener,
      };

      const listener = vi.fn();
      const unsubscribe = subscribeTheme(listener);
      expect(addEventListener).toHaveBeenCalledWith('storage', listener);

      applyTheme('dark');
      expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, 'dark');
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(listener).toHaveBeenCalledTimes(1);

      applyTheme('system');
      expect(removeItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(removeAttribute).toHaveBeenCalledWith('data-theme');
      expect(listener).toHaveBeenCalledTimes(2);

      unsubscribe();
      expect(removeEventListener).toHaveBeenCalledWith('storage', listener);

      applyTheme('light');
      expect(listener).toHaveBeenCalledTimes(2); // no longer called after unsubscribe
    });

    it('still updates DOM attribute even when localStorage throws', () => {
      const setAttribute = vi.fn();
      const removeAttribute = vi.fn();

      (globalThis as unknown as { localStorage: unknown }).localStorage = {
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
        removeItem: () => {
          throw new Error('QuotaExceededError');
        },
      };
      (globalThis as unknown as { document: unknown }).document = {
        documentElement: { setAttribute, removeAttribute },
      };

      applyTheme('light');
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');

      applyTheme('system');
      expect(removeAttribute).toHaveBeenCalledWith('data-theme');
    });
  });

  describe('SSR Component Rendering', () => {
    it('renders button with Auto label and accessible aria-label on server', () => {
      const html = renderToStaticMarkup(<ThemeToggle />);
      expect(html).toContain('Auto');
      expect(html).toContain('aria-label="Theme: Auto. Click to change."');
      expect(html).toContain('type="button"');
    });
  });
});
