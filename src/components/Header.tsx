'use client';

import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';

const LINKS = [
  ['How it works', '#how'],
  ['Modes', '#modes'],
  ['Open source', '#contribute'],
];

/**
 * Sits inside the frame. Sticky rather than fixed so it can't collide with the
 * pinned showcase section further down the page.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-2/70 bg-ground/95 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-6 px-(--spacing-gutter) py-4">
        <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="StepPal home">
          <Image
            src="/steppal-mark.png"
            alt=""
            width={514}
            height={354}
            priority
            className="logo-mark h-7 w-auto md:h-8"
          />
          <span className="font-(family-name:--font-display) text-sm font-bold tracking-tight">
            StepPal
          </span>
        </a>

        <nav className="hidden gap-8 md:flex" aria-label="Main">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="t-label text-ink-soft transition-colors hover:text-flame"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#waitlist"
            className="t-label rounded-full bg-flame px-4 py-1.5 text-flame-ink"
          >
            Get it
          </a>
        </div>
      </div>
    </header>
  );
}
