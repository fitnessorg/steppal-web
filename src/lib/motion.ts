/**
 * StepPal motion system.
 *
 * One place to tune the feel of the entire site. Every animation pulls its
 * easing and duration from here — never inline a raw cubic-bezier or a magic
 * number in a component.
 *
 * Register: heavy and smooth. Weighted easing, generous durations, nothing
 * bouncy, springy or snappy.
 */

/* ------------------------------------------------------------------ easing */

/** The workhorse. Fast start, hard deceleration. Use for reveals. */
export const EASE_OUT = 'expo.out' as const;

/** Symmetrical. Use for moves, transitions, things that travel. */
export const EASE_IN_OUT = 'power3.inOut' as const;

/** CSS equivalents, for anything animated outside GSAP. */
export const CSS_EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const CSS_EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';

/* --------------------------------------------------------------- durations */

export const DURATION = {
  /** Micro-interactions: hovers, button states. */
  micro: 0.35,
  /** Text reveals. Longer than feels natural — that is the point. */
  text: 1.1,
  /** Media and large elements. */
  media: 1.4,
  /** Full-screen transitions. Keep under 600ms. */
  transition: 0.55,
} as const;

/* ----------------------------------------------------------------- stagger */

export const STAGGER = {
  /** Between lines of a headline. */
  lines: 0.08,
  /** Between sibling elements in a group. */
  items: 0.12,
} as const;

/* ---------------------------------------------------------------- triggers */

/** Default ScrollTrigger start — fires when the element is 80% down the viewport. */
export const TRIGGER_START = 'top 80%';

/* ------------------------------------------------------------------- lenis */

export const LENIS_OPTIONS = {
  lerp: 0.09,
  smoothWheel: true,
  /**
   * Touch devices get native scrolling. Smoothed touch scroll feels laggy on
   * mid-range Android, which is our actual audience.
   */
  syncTouch: false,
} as const;

/* --------------------------------------------------------- reduced motion */

/**
 * Read once, at call time — not module scope. `window` does not exist during
 * SSR, and a user can change the setting without reloading.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
