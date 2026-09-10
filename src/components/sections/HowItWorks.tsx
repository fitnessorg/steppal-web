'use client';

import { RevealText } from '@/components/RevealText';
import { Reveal } from '@/components/Reveal';

const STEPS = [
  {
    n: '01',
    title: 'Everyone stakes',
    body: 'One person creates the pot and sets the stake. Everyone who joins puts in the same amount. Nobody can join once the week has started.',
  },
  {
    n: '02',
    title: 'You walk',
    body: 'Steps come straight from your phone’s health data — no logging, no honour system, nothing to remember. The leaderboard updates all day.',
  },
  {
    n: '03',
    title: 'It settles itself',
    body: 'At the end of the week the pot pays out automatically. No arguing, no one chasing anyone for money, no group treasurer.',
  },
];

/**
 * Numbering is legitimate here — this genuinely is a sequence, and the reader
 * needs the order. Rows rather than cards: a card grid would flatten the
 * progression into three equal things.
 */
export function HowItWorks() {
  return (
    <section id="how" className="px-(--spacing-gutter) py-(--spacing-section)">
      <p className="t-label mb-8">How it works</p>

      <RevealText as="h2" className="t-section mb-20 max-w-[13ch]">
        Three steps, then it runs without you.
      </RevealText>

      <div className="flex flex-col">
        {STEPS.map((s) => (
          <Reveal key={s.n}>
            <div className="grid gap-4 border-t border-surface-2 py-10 md:grid-cols-[6rem_1fr_1.2fr] md:gap-10">
              <span className="t-num text-2xl text-accent">{s.n}</span>
              <h3 className="font-(family-name:--font-display) text-2xl leading-tight tracking-tight">
                {s.title}
              </h3>
              <p className="max-w-[46ch] text-ink-soft">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
