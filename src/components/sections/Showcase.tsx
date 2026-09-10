'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const SCREENS = [
  {
    label: 'Today',
    title: 'Your steps, without logging anything',
    body: 'Read straight from Health Connect the moment you open the app.',
    render: () => (
      <div className="flex h-full flex-col gap-5 p-6">
        <p className="t-label">Wednesday · Lagos Walkers</p>
        <div>
          <p className="t-num text-5xl leading-none">8,412</p>
          <p className="t-label mt-2">steps · goal 10,000</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-[84%] rounded-full bg-accent" />
          </div>
          <p className="mt-3 text-sm text-ink-soft">1,588 to go. You&apos;re 2nd.</p>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {[1, 1, 1, 1, 0, 0, 0].map((hit, i) => (
            <div
              key={i}
              className={`aspect-square rounded ${hit ? 'bg-accent' : 'bg-surface-2'}`}
            />
          ))}
        </div>
        <p className="t-label">4 of 7 days hit</p>
        <div className="mt-auto rounded-lg bg-surface-2 p-3">
          <p className="t-label">Pot</p>
          <p className="t-num mt-1 text-xl text-money">₦30,000</p>
        </div>
      </div>
    ),
  },
  {
    label: 'Leaderboard',
    title: 'Live standings all week',
    body: 'Everyone sees the same board, updating as people walk.',
    render: () => (
      <div className="flex h-full flex-col gap-3 p-6">
        <p className="t-label">Lagos Walkers · day 5</p>
        {[
          ['Tunde', '61,204'],
          ['You', '58,890'],
          ['Ada', '52,117'],
          ['Chidi', '44,003'],
        ].map(([n, v], i) => (
          <div
            key={n}
            className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm ${
              n === 'You' ? 'bg-accent text-accent-ink' : 'bg-surface-2'
            }`}
          >
            <span>
              {i + 1}. {n}
            </span>
            <span className="t-num">{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Settlement',
    title: 'It pays out on its own',
    body: 'No treasurer, no chasing anyone, no arguments about who owes what.',
    render: () => (
      <div className="flex h-full flex-col justify-center gap-4 p-6 text-center">
        <p className="t-label">Week closed</p>
        <p className="t-num text-5xl leading-none text-money">+₦18,000</p>
        <p className="text-sm text-ink-soft">
          Split between you and Ada. Paid to your wallet.
        </p>
        <div className="mt-3 rounded-md bg-surface-2 px-3 py-2 text-xs text-ink-faint">
          Settled by contract · 24h dispute window closed
        </div>
      </div>
    ),
  },
];

/**
 * The one pinned section on the page. The phone holds still while its screen
 * and the copy beside it advance with scroll progress.
 *
 * One pin is enough — a page full of them is exhausting to scroll.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: `+=${SCREENS.length * 100}%`,
        pin: '[data-pin]',
        scrub: true,
        onUpdate: (self) => {
          const i = Math.min(
            SCREENS.length - 1,
            Math.floor(self.progress * SCREENS.length),
          );
          setActive(i);
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-(--spacing-gutter) py-(--spacing-section)">
      <div
        data-pin
        className="grid items-center gap-16 md:min-h-[80svh] md:grid-cols-2"
      >
        {/* Copy column */}
        <div className="order-2 md:order-1">
          <p className="t-label mb-8">Inside the app</p>
          <div className="relative">
            {SCREENS.map((s, i) => (
              <div
                key={s.label}
                className="transition-opacity duration-500"
                style={{
                  opacity: i === active ? 1 : 0.18,
                }}
              >
                <div className="border-l-2 py-3 pl-6" style={{
                  borderColor: i === active ? 'var(--color-accent)' : 'var(--color-surface-2)',
                }}>
                  <h3 className="font-(family-name:--font-display) text-2xl leading-tight tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-ink-soft">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone column */}
        <div className="order-1 flex justify-center md:order-2">
          <div className="relative aspect-[9/19] w-full max-w-[290px] overflow-hidden rounded-[2.25rem] border border-surface-2 bg-surface">
            {SCREENS.map((s, i) => (
              <div
                key={s.label}
                className="absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `translateY(${(i - active) * 12}px)`,
                  pointerEvents: i === active ? 'auto' : 'none',
                }}
              >
                {s.render()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
