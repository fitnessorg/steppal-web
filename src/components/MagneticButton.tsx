'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { CSS_EASE_OUT, DURATION, prefersReducedMotion } from '@/lib/motion';

type Props = {
  children: React.ReactNode;
  href: string;
  className?: string;
  /** Maximum pull toward the cursor, in px. Subtle by design. */
  strength?: number;
};

/**
 * Primary CTA. Drifts toward the cursor within its own bounds and settles back
 * on leave.
 *
 * Pointer-fine devices only — there is no cursor to be magnetic toward on a
 * phone, and the listeners would just cost battery.
 */
export function MagneticButton({ children, href, className, strength = 8 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;

      const move = gsap.quickTo(el, 'x', { duration: DURATION.micro, ease: 'power3.out' });
      const moveY = gsap.quickTo(el, 'y', { duration: DURATION.micro, ease: 'power3.out' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        move(gsap.utils.clamp(-1, 1, dx) * strength);
        moveY(gsap.utils.clamp(-1, 1, dy) * strength);
      };

      const onLeave = () => {
        move(0);
        moveY(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{ transition: `background-color ${DURATION.micro}s ${CSS_EASE_OUT}` }}
    >
      {children}
    </a>
  );
}
