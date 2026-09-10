'use client';

import { RevealText } from '@/components/RevealText';

/**
 * One sentence, occupying most of the screen. Type as the entire visual.
 * The quiet stretch that makes the sections around it land.
 */
export function Hook() {
  return (
    <section className="flex min-h-[80svh] items-center px-(--spacing-gutter) py-(--spacing-section)">
      <RevealText as="p" className="t-display max-w-[16ch]">
        A goal with nothing at stake is just a{' '}
        <span className="text-ink-faint">wish</span>.
      </RevealText>
    </section>
  );
}
