'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE_OUT, STAGGER, prefersReducedMotion } from '@/lib/motion';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(SplitText);

/**
 * One orchestrated timeline, not five independent tweens. This is the first
 * three seconds and it sets the impression for everything after it.
 *
 * Order: rule draws → label → wordmark lands → tagline → CTA → meta row.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      if (reduced) {
        tl.from('[data-hero]', { opacity: 0, duration: DURATION.micro, stagger: 0.06 });
        return;
      }

      const word = SplitText.create('[data-hero-word]', {
        type: 'chars',
        mask: 'chars',
      });

      tl.from('[data-hero-rule]', { scaleX: 0, duration: DURATION.media, transformOrigin: 'left' })
        .from('[data-hero-label]', { opacity: 0, y: 12, duration: DURATION.text }, '-=1.1')
        .from(
          word.chars,
          { yPercent: 115, duration: DURATION.text, stagger: 0.045 },
          '-=0.95',
        )
        .from('[data-hero-tag]', { opacity: 0, y: 24, duration: DURATION.text }, '-=0.7')
        .from('[data-hero-cta]', { opacity: 0, y: 20, duration: DURATION.text }, '-=0.85')
        .from(
          '[data-hero-meta] > *',
          { opacity: 0, y: 16, duration: DURATION.text, stagger: STAGGER.items },
          '-=0.9',
        );

      return () => word.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[92svh] flex-col justify-between px-(--spacing-gutter) pt-32 pb-12"
    >
      <div>
        <div data-hero-rule className="h-px w-full bg-surface-2" />
        <p data-hero data-hero-label className="t-label mt-5">
          Open source · Built on Stellar
        </p>
      </div>

      <div className="py-12">
        <h1 data-hero data-hero-word className="t-hero">
          STEPPAL
        </h1>

        <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p data-hero data-hero-tag className="t-lead max-w-[34ch]">
            Put money on your step goal. Your friends put money on theirs. At the end of
            the week, it settles itself.
          </p>

          <div data-hero data-hero-cta className="shrink-0">
            <MagneticButton
              href="#waitlist"
              className="inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-medium text-accent-ink"
            >
              Join the waitlist
              <span aria-hidden>→</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        data-hero-meta
        className="grid grid-cols-2 gap-6 border-t border-surface-2 pt-6 md:grid-cols-4"
      >
        {[
          ['Group size', '2–20 friends'],
          ['Runs for', '7 days'],
          ['Steps from', 'Health Connect'],
          ['Pot held by', 'A contract'],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="t-label">{k}</p>
            <p className="mt-1.5 text-ink">{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
