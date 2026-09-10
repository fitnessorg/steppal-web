'use client';

import { RevealText } from '@/components/RevealText';
import { Reveal } from '@/components/Reveal';
import { Counter } from '@/components/Counter';

/**
 * Two modes presented as a real choice with weight, not a feature-comparison
 * table. The forfeit pot is given the accent because it is the one we
 * recommend — everyone can win, and you only lose to your own excuses.
 */
export function Modes() {
  return (
    <section id="modes" className="px-(--spacing-gutter) py-(--spacing-section)">
      <p className="t-label mb-8">Two ways to play</p>

      <RevealText as="h2" className="t-section mb-20 max-w-[14ch]">
        Race your friends, or race yourself.
      </RevealText>

      <div className="grid gap-px overflow-hidden rounded-lg bg-surface-2 md:grid-cols-2">
        <Reveal className="bg-ground">
          <div className="flex h-full flex-col gap-5 p-8 md:p-12">
            <p className="t-label">Mode A</p>
            <h3 className="font-(family-name:--font-display) text-3xl tracking-tight">
              Winner takes all
            </h3>
            <p className="text-ink-soft">
              Most steps at the end of the week takes the whole pot. Simple, brutal, and
              best when everyone in the group walks about the same amount already.
            </p>
            <div className="mt-auto flex items-baseline gap-2 pt-8">
              <span className="t-label">Pot of six</span>
              <Counter to={30000} prefix="₦" className="ml-auto text-2xl text-money" />
            </div>
          </div>
        </Reveal>

        <Reveal className="bg-surface" delay={0.1}>
          <div className="flex h-full flex-col gap-5 p-8 ring-1 ring-inset ring-accent/30 md:p-12">
            <p className="t-label text-accent">Mode B · recommended</p>
            <h3 className="font-(family-name:--font-display) text-3xl tracking-tight">
              The forfeit pot
            </h3>
            <p className="text-ink-soft">
              Everyone sets their own daily goal. Miss a day and you forfeit into the
              pot. At the end of the week, everyone who hit all seven days splits what
              the quitters dropped.{' '}
              <span className="text-ink">Everyone can win.</span> You only lose to your
              own excuses — never to your fitter friend.
            </p>
            <div className="mt-auto flex items-baseline gap-2 pt-8">
              <span className="t-label">Forfeit per missed day</span>
              <Counter to={1000} prefix="₦" className="ml-auto text-2xl text-money" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
