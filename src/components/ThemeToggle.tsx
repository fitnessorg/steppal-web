'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

/**
 * The stored theme, read as an external store rather than copied into state by
 * an effect.
 *
 * Two problems this avoids. Setting state inside an effect renders twice and
 * is flagged by the React compiler. And a lazy useState initialiser reading
 * localStorage would disagree with the server-rendered HTML and trip a
 * hydration mismatch. useSyncExternalStore has a separate server snapshot
 * built in, which is exactly the shape of this problem: the server cannot know
 * the answer, and the client learns it on the first commit.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changing the theme should change it here too.
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readTheme(): Theme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
  } catch {
    // Private browsing and blocked site data both throw here.
    return 'system';
  }
}

/** The server has no way to know, so it renders the default. */
function serverTheme(): Theme {
  return 'system';
}

/**
 * Three states, matching how the OS actually works: explicit light, explicit
 * dark, or follow the system. Cycling through all three is honest — a two-way
 * toggle silently strands anyone who wants to go back to following their OS.
 *
 * The no-flash script lives in layout.tsx and runs before paint.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);

  const apply = useCallback((next: Theme) => {
    try {
      if (next === 'system') {
        localStorage.removeItem(STORAGE_KEY);
        document.documentElement.removeAttribute('data-theme');
      } else {
        localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.setAttribute('data-theme', next);
      }
    } catch {
      // Still apply the attribute even if the choice cannot be remembered.
      if (next === 'system') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', next);
    }

    listeners.forEach((l) => l());
  }, []);

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
