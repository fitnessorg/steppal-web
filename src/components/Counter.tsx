'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DURATION, EASE_OUT, TRIGGER_START, prefersReducedMotion } from '@/lib/motion';

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

gsap.registerPlugin(ScrollTrigger);

/**
 * Ticks a number up as it enters. Renders the final value server-side, so the
 * figure is correct with JS off and the layout never reflows when it lands.
 *
 * Uses tabular numerals via .t-num so digits don't jitter while counting.
 */
export function Counter({ to, prefix = '', suffix = '', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const obj = { value: 0 };

      gsap.to(obj, {
        value: to,
        duration: DURATION.media,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.value).toLocaleString('en-NG')}${suffix}`;
        },
      });
    },
    { scope: ref, dependencies: [to, prefix, suffix] },
  );

  return (
    <span ref={ref} className={`t-num ${className ?? ''}`}>
      {prefix}
      {to.toLocaleString('en-NG')}
      {suffix}
    </span>
  );
}
