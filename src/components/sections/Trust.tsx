'use client';

import { RevealText } from '@/components/RevealText';
import { Reveal } from '@/components/Reveal';

const POINTS = [
  {
    k: 'The pot isn’t ours',
    v: 'Stakes are held in a smart contract on Stellar with a public payout rule. We can’t touch the money, move it, or decide who gets it. Neither can anyone else.',
  },
  {
    k: 'Steps come from your phone',
    v: 'Read from Apple Health and Android Health Connect — the same data your phone already trusts. We cap and flag impossible days, and any member can dispute a result before it settles.',
  },
  {
    k: 'You can read every line',
    v: 'The whole thing is open source. The settlement logic, the contract, the step validation — all of it public, all of it auditable by anyone who cares to look.',
  },
];

/**
 * Where scepticism gets answered. Deliberately the plainest section on the
 * page: no accent, no motion flourish, nothing that could read as salesmanship.
 */
export function Trust() {
  return (
    <section className="border-y border-surface-2 bg-surface px-(--spacing-gutter) py-(--spacing-section)">
      <p className="t-label mb-8">Why you can put money in it</p>

      <RevealText as="h2" className="t-section mb-20 max-w-[15ch]">
        Money between friends is a good way to lose friends.
      </RevealText>

      <div className="grid gap-12 md:grid-cols-3">
        {POINTS.map((p, i) => (
          <Reveal key={p.k} delay={i * 0.08}>
            <h3 className="mb-3 font-(family-name:--font-display) text-lg tracking-tight">
              {p.k}
            </h3>
            <p className="text-ink-soft">{p.v}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
