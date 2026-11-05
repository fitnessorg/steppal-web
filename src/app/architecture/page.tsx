import type { Metadata } from 'next';
import { Prose } from '@/components/Prose';

export const metadata: Metadata = {
  title: 'Architecture — StepPal',
  description:
    'How StepPal is built: three repos, where the money is held, how step counts are validated, and why settlement works the way it does.',
  alternates: {
    canonical: '/architecture',
  },
  openGraph: {
    title: 'Architecture — StepPal',
    description:
      'Where the money sits, and who is allowed to move it. Escrow, validation rules, and settlement on Stellar.',
    url: '/architecture',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture — StepPal',
    description:
      'Where the money sits, and who is allowed to move it. Escrow, validation rules, and settlement on Stellar.',
  },
};

const CONTRACT = 'CCEMDKD4POJ4H2EF3JSY73W33OVB34X7KWV7UM6VRESTPNTHJ4OG37TT';

export default function Architecture() {
  return (
    <Prose
      eyebrow="Architecture"
      title="Where the money sits, and who is allowed to move it."
      lede="StepPal is a commitment app: you put money behind a step goal and something that is not a person holds it until you have earned it back or lost it. Almost every design decision below follows from that one sentence."
    >
      <h2>Three repos, one seam</h2>

      <p>
        <code>steppal-core</code> owns every rule about money — who staked, who
        walked, who gets paid. <code>steppal-mobile</code> renders and reports;
        it holds no business logic about payouts. <code>steppal-web</code> is
        this site and ships no product features.
      </p>

      <p>
        The seam that makes the split work is <code>@steppal/sdk</code>,
        published from core and consumed by the app. It is why a Rust
        contributor and a React Native contributor never touch the same file,
        and it is the only reason these are separate repos rather than one.
      </p>

      <h2>A step count is a claim, not a fact</h2>

      <p>
        The phone reports; the server decides. Step rows record what a device
        claimed and where it came from, and validation lives in the write path
        rather than in the column type.
      </p>

      <ul>
        <li>
          <strong>Future days are rejected.</strong> Nobody has walked tomorrow,
          and accepting it would let a wrong clock bank a week ahead.
        </li>
        <li>
          <strong>Backfill older than the settlement window is rejected.</strong>{' '}
          Catching up after a day offline is legitimate. Topping up a pot that
          is about to settle is not.
        </li>
        <li>
          <strong>Implausible counts are clamped, not refused</strong>, and the
          original is kept. Clamping keeps an honest person with a pedometer
          glitch in the game while removing the benefit of shaking a phone for
          an hour, and the raw figure means a dispute can be examined.
        </li>
        <li>
          <strong>Writes are idempotent per day.</strong> Phones retry, often.
          A submission endpoint that is not idempotent is a settlement bug
          waiting for a bad week of network.
        </li>
      </ul>

      <h3>Why not GPS</h3>

      <p>
        Location tracking was the obvious way to count steps and it is wrong for
        an app with money in it: a car ride reads as a twenty-five kilometre
        walk, a phone on a desk drifts, indoor coverage is poor and the battery
        cost is real. Reading the operating system&apos;s health store instead
        is what makes a count defensible when someone disputes it.
      </p>

      <h2>Settlement is not a leaderboard</h2>

      <p>
        &quot;Most steps wins&quot; rewards whoever has the most free time,
        which in any group of friends is the same person every week, and the
        rest stop playing by the third. Every member is judged against the same
        daily goal instead: hit it every day of the window and you win.
        Everyone can win. Everyone can lose.
      </p>

      <p>
        Forfeited stakes split evenly among the winners, in integer kobo. The
        remainder from an uneven split goes to whoever walked the most, because
        it has to go somewhere and money that silently disappears is how a
        settlement loses trust.
      </p>

      <p>
        <strong>When nobody wins, stakes are returned.</strong> StepPal never
        profits from a member failing — which matters ethically, and keeps the
        product from looking like a house taking a rake, a distinction that
        matters a great deal in Nigeria.
      </p>

      <p>
        A pot settles the day after it ends, so the final day&apos;s steps have
        a full night to sync from a phone that was asleep. Settling an already
        settled pot does nothing and returns the stored result: the job will be
        retried, and double-paying is unforgivable.
      </p>

      <h2>The contract</h2>

      <p>
        One Soroban contract on Stellar, <code>goal-escrow</code>, deployed to
        testnet at{' '}
        <a
          href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT}`}
          target="_blank"
          rel="noreferrer"
        >
          <code>{CONTRACT.slice(0, 8)}…</code>
        </a>
        . Group pots, public pledge tips and sponsored goals all use it, because
        on chain they are the same shape: money goes in against a step target,
        and one of two things happens.
      </p>

      <p>
        The interesting problem is not holding money — it is what happens when
        the oracle reporting step counts is wrong or absent. Three guards:
      </p>

      <ul>
        <li>
          <strong>A 24-hour challenge window.</strong> Attesting does not pay
          anyone; it opens a window in which anyone can dispute, which sends the
          goal to refund. A bad reading costs nothing.
        </li>
        <li>
          <strong>A deadline.</strong> If the oracle goes silent, the deadline
          passes and every funder can withdraw. A dead oracle cannot trap your
          money.
        </li>
        <li>
          <strong>Exact per-funder refunds.</strong> Each contribution is
          recorded individually, so a refund returns precisely what went in — no
          pro-rata division, no rounding dust left behind.
        </li>
      </ul>

      <p>
        Twelve tests cover these, including one proving the contract&apos;s
        balance is conserved: money in always equals money out.
      </p>

      <h3>Why Stellar</h3>

      <p>
        Fees. This app moves tips of a few hundred naira. On most chains the fee
        eats a visible fraction of that; on Stellar it is a rounding error.
        Stellar also has real on and off ramps in Africa, which matters for a
        Lagos-first app — holding value is only useful if someone can actually
        cash out at the end of the week.
      </p>

      <h2>What is not built</h2>

      <p>
        Being specific about this is more useful than a roadmap.
      </p>

      <ul>
        <li>
          <strong>The oracle does not exist.</strong> Nothing signs attestations
          yet, so the contract is deployed but not yet driven by the API.
        </li>
        <li>
          <strong>No payment provider is wired.</strong> The interface and a
          mock exist. The hard half is disbursement — paying a winner who is not
          the merchant — not collection.
        </li>
        <li>
          <strong>Stakes are zero everywhere.</strong> The money-free version
          ships first, because whether people walk more when their friends are
          watching has to be true before money makes any sense. Every money path
          exists in the schema and the contract, so enabling it is a value
          change rather than a migration.
        </li>
        <li>
          <strong>Pot chat has no server.</strong> Messages live on the device
          that sent them.
        </li>
      </ul>

      <h2>Reading further</h2>

      <p>
        The endpoint-by-endpoint reasoning is in <code>docs/API.md</code> in{' '}
        <a href="https://github.com/fitnessorg/steppal-core">steppal-core</a>,
        and the contract&apos;s guards are documented in{' '}
        <code>contracts/goal-escrow/src/lib.rs</code> beside the code they
        protect.
      </p>
    </Prose>
  );
}
