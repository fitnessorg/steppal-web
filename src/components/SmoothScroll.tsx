'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LENIS_OPTIONS, prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts Lenis once and drives it from GSAP's ticker so both share a single
 * RAF loop. Two independent loops is the usual cause of jittery scroll-linked
 * animation.
 *
 * Scoped strictly to interactive/motion routes (the landing page). Prose and
 * document pages (/architecture, /contribute, /privacy, /terms) intentionally
 * do not mount this component to avoid scroll hijack and heavy RAF listeners.
 *
 * Disabled entirely under prefers-reduced-motion — native scrolling only.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis(LENIS_OPTIONS);

    // Keep ScrollTrigger's cached positions in step with Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /**
     * Fonts load after first paint, which reflows the page and leaves every
     * ScrollTrigger firing at the wrong position. Recalculate once they land.
     */
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
