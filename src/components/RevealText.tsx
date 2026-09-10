'use client';

import { useRef, type ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import {
  DURATION,
  EASE_OUT,
  STAGGER,
  TRIGGER_START,
  prefersReducedMotion,
} from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = {
  children: React.ReactNode;
  /** Rendered element. Headlines should pass the real heading level. */
  as?: ElementType;
  className?: string;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  /** Play immediately on mount instead of on scroll. For above-the-fold copy. */
  immediate?: boolean;
};

/**
 * The primitive the rest of the motion system is built on.
 *
 * Splits text into lines, masks each one, and slides the line up from below its
 * own mask. Re-splits on resize, because line breaks move.
 *
 * The text is fully visible before JS runs — the animation sets its own start
 * state. Nothing is ever parked at opacity: 0 waiting on a trigger.
 */
export function RevealText({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DURATION.micro,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start: TRIGGER_START, once: true },
          },
        );
        return;
      }

      const split = SplitText.create(el, {
        type: 'lines',
        linesClass: 'reveal-line',
        // Each line gets its own mask element, so lines slide out from behind
        // their own edge rather than the block's.
        mask: 'lines',
        autoSplit: true,
onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: DURATION.text,
            ease: EASE_OUT,
            stagger: STAGGER.lines,
            delay,
            scrollTrigger: immediate
              ? undefined
              : { trigger: el, start: TRIGGER_START, once: true },
          }),
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [delay, immediate] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
