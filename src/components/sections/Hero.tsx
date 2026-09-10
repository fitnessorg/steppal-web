'use client';

import { useRef } from 'react';
import Image from 'next/image';
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
 * Order: panel scales in → product settles → wordmark lands → tagline → CTA →
 * meta row. The product arrives before the name, so the thing is introduced
 * before it is labelled.
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

      const word = SplitText.create('[data-hero-word]', { type: 'chars', mask: 'chars' });

      tl.from('[data-hero-panel]', {
        scaleY: 0.55,
        opacity: 0,
        duration: DURATION.media,
        transformOrigin: 'center bottom',
      })
        .from(
          '[data-hero-shot]',
          { scale: 1.14, opacity: 0, y: 30, duration: DURATION.media * 1.1 },
          '-=1.15',
        )
        .from('[data-hero-tape] > *', { opacity: 0, duration: DURATION.text, stagger: 0.06 }, '-=1.0')
        .from(word.chars, { yPercent: 115, duration: DURATION.text, stagger: 0.04 }, '-=0.9')
        .from('[data-hero-tag]', { opacity: 0, y: 24, duration: DURATION.text }, '-=0.75')
        .from('[data-hero-cta]', { opacity: 0, y: 20, duration: DURATION.text }, '-=0.9')
        .from(
          '[data-hero-meta] > *',
          { opacity: 0, y: 16, duration: DURATION.text, stagger: STAGGER.items },
          '-=0.95',
        );

      return () => word.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="px-(--spacing-gutter) pt-4 pb-16">
      {/* ---- the panel: product first, name second ---- */}
      <div
        data-hero-panel
        className="relative overflow-hidden rounded-xl bg-stage"
        style={{
          backgroundImage:
            'radial-gradient(120% 90% at 50% 8%, color-mix(in srgb, var(--color-flame) 16%, transparent), transparent 60%)',
        }}
      >
        {/* running tape, as on a shoebox */}
        <div
          data-hero-tape
          className="flex items-center justify-between gap-4 overflow-hidden px-5 py-3 md:px-8"
        >
          {['Steps', 'Stakes', 'Settled', 'Steps', 'Stakes', 'Settled'].map((w, i) => (
            <span key={i} className="t-label whitespace-nowrap text-flame">
              ▪ {w}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-center px-6 pb-10 pt-2 md:pb-16">
          <Image
            data-hero-shot
            src="/steppal-mark.png"
            alt="StepPal"
            width={514}
            height={354}
            priority
            className="h-auto w-full max-w-[min(52vw,620px)] drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ---- the name ---- */}
      <h1 data-hero data-hero-word className="t-hero mt-8">
        STEPPAL
      </h1>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <p data-hero data-hero-tag className="t-lead max-w-[34ch]">
          Put money on your step goal. Your friends put money on theirs. At the end of the
          week, it settles itself.
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

      <div
        data-hero-meta
        className="mt-16 grid grid-cols-2 gap-6 border-t border-surface-2 pt-6 md:grid-cols-4"
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
