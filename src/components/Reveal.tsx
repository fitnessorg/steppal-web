'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  DURATION,
  EASE_OUT,
  STAGGER,
  TRIGGER_START,
  prefersReducedMotion,
} from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Animate direct children in sequence rather than the block as one. */
  stagger?: boolean;
};

/**
 * Generic entry reveal for anything that isn't text: media, cards, rows.
 * Rises and fades once, on entry. Never replays on scroll-up — replaying
 * reveals makes a page feel restless.
 */
export function Reveal({ children, className, delay = 0, stagger = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? Array.from(el.children) : el;
      const reduced = prefersReducedMotion();

      gsap.from(targets, {
        opacity: 0,
        y: reduced ? 0 : 40,
        duration: reduced ? DURATION.micro : DURATION.media,
        ease: EASE_OUT,
        delay,
        stagger: stagger ? STAGGER.items : 0,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    },
    { scope: ref, dependencies: [delay, stagger] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
