'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

/**
 * Three states, matching how the OS actually works: explicit light, explicit
 * dark, or follow the system. Cycling through all three is honest — a two-way
 * toggle silently strands anyone who wants to go back to following their OS.
 *
 * The no-flash script lives in layout.tsx and runs before paint.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    setTheme((localStorage.getItem('theme') as Theme) ?? 'system');
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    if (next === 'system') {
      localStorage.removeItem('theme');
      document.documentElement.removeAttribute('data-theme');
    } else {
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
    }
  };

  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
  const label: Record<Theme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' };

  return (
    <button
      type="button"
      onClick={() => apply(next[theme])}
      aria-label={`Theme: ${label[theme]}. Click to change.`}
      className="t-label rounded-full border border-surface-2 px-3 py-1.5 text-ink-soft transition-colors hover:border-flame hover:text-ink"
    >
      {label[theme]}
    </button>
  );
}
