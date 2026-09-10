'use client';

import { RevealText } from '@/components/RevealText';
import { Reveal } from '@/components/Reveal';

const REPOS = [
  {
    name: 'steppal-core',
    desc: 'API, SDK and the Soroban escrow contract. TypeScript and Rust.',
    tags: ['TypeScript', 'Rust', 'Postgres'],
  },
  {
    name: 'steppal-mobile',
    desc: 'The app itself. Expo, React Native, Health Connect.',
    tags: ['Expo', 'React Native'],
  },
  {
    name: 'steppal-web',
    desc: 'This site. Next.js, GSAP, Lenis.',
    tags: ['Next.js', 'GSAP'],
  },
];

/**
 * A different visual register from the rest of the page — quieter, more
 * technical, mono-heavy. This section is for developers, and it should look
 * like it knows that.
 */
export function OpenSource() {
  return (
    <section id="contribute" className="px-(--spacing-gutter) py-(--spacing-section)">
      <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="t-label mb-8">Open source</p>
          <RevealText as="h2" className="t-section max-w-[12ch]">
            Built in the open. Come and break it.
          </RevealText>
          <p className="mt-6 max-w-[38ch] text-ink-soft">
            StepPal is Apache-2.0 and built to be contributed to. Issues are scoped
            small and labelled honestly — if it says{' '}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-(family-name:--font-mono) text-[0.85em] text-ink">
              good first issue
            </code>
            , you can finish it in an evening.
          </p>
          <a
            href="https://github.com/steppal"
            className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-1 text-accent"
          >
            Browse the issues
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="flex flex-col">
          {REPOS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <a
                href={`https://github.com/steppal/${r.name}`}
                className="group grid gap-2 border-t border-surface-2 py-7 transition-colors hover:bg-surface"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-(family-name:--font-mono) text-ink">
                    {r.name}
                  </span>
                  <span
                    aria-hidden
                    className="text-ink-faint transition-transform group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </div>
                <p className="max-w-[46ch] text-sm text-ink-soft">{r.desc}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-surface-2 px-2.5 py-0.5 font-(family-name:--font-mono) text-[0.65rem] tracking-wide text-ink-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
