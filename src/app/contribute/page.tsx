import type { Metadata } from 'next';
import { Prose } from '@/components/Prose';

export const metadata: Metadata = {
  title: 'Contribute — StepPal',
  description:
    'How to pick up work on StepPal: three repos, what runs without a server, and where the open tasks are.',
};

const REPOS = [
  {
    name: 'steppal-core',
    what: 'API, settlement rules, the Soroban escrow contract, and the TypeScript SDK.',
    stack: 'TypeScript, Fastify, Postgres, Rust',
    needs: 'Node 20, pnpm, a Postgres. Rust only for the contract.',
  },
  {
    name: 'steppal-mobile',
    what: 'The Android app. Reads steps from Health Connect and renders pots, feed and wallet.',
    stack: 'React Native, Expo, NativeWind',
    needs: 'Node 20 and a phone or emulator. No server required.',
  },
  {
    name: 'steppal-web',
    what: 'This site.',
    stack: 'Next.js, GSAP, Lenis, Tailwind',
    needs: 'Node 20. Nothing else.',
  },
];

export default function Contribute() {
  return (
    <Prose
      eyebrow="Contribute"
      title="Three repos, and none of them need the others to run."
      lede="StepPal is built to about 65% on purpose. The rest is scoped, labelled and waiting — this page is how you find the piece that fits you."
    >
      <h2>Start where your language is</h2>

      <table>
        <thead>
          <tr>
            <th>Repo</th>
            <th>What it is</th>
            <th>To run it</th>
          </tr>
        </thead>
        <tbody>
          {REPOS.map((r) => (
            <tr key={r.name}>
              <td>
                <a href={`https://github.com/fitnessorg/${r.name}`}>
                  <code>{r.name}</code>
                </a>
                <br />
                <span className="text-sm text-ink-faint">{r.stack}</span>
              </td>
              <td>{r.what}</td>
              <td>{r.needs}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Nothing requires an account anywhere</h2>

      <p>
        This is the rule we hold ourselves to, because a project you cannot run
        is a project you will not contribute to.
      </p>

      <ul>
        <li>
          <strong>The API sends login codes to your terminal.</strong> Set{' '}
          <code>SMS_PROVIDER=console</code> — the default — and the whole phone
          sign-in flow works with no SMS provider and no credentials.
        </li>
        <li>
          <strong>The app runs with no server.</strong> Leave{' '}
          <code>EXPO_PUBLIC_API_URL</code> unset and it runs on mock data. Clone
          it and you are looking at every screen in ninety seconds.
        </li>
        <li>
          <strong>Payments are a mock provider</strong> that credits instantly.
          The wallet can be built end to end without a payment account.
        </li>
        <li>
          <strong>The contract tests need no network.</strong>{' '}
          <code>cargo test</code> runs the whole suite in Soroban&apos;s test
          environment.
        </li>
      </ul>

      <h2>Finding something to do</h2>

      <p>
        Every open task is a <code>TODO(contributor)</code> comment in the code,
        carrying a difficulty label and a description of what done looks like.
        They are collected per repo in <code>CONTRIBUTING-TASKS.md</code>, so
        nothing on those lists was invented to pad them.
      </p>

      <p>Grep for them directly:</p>

      <p>
        <code>grep -rn &quot;TODO(contributor)&quot; .</code>
      </p>

      <h3>If you have an evening</h3>

      <p>
        Persisting the app&apos;s theme choice and onboarding state, pruning
        expired login codes, paginating the pot list, or empty states for a new
        account&apos;s pot list. All marked <code>easy</code>.
      </p>

      <h3>If you have a weekend</h3>

      <p>
        The Termii SMS provider, an offline queue for step uploads, websocket
        standings so a pot stops feeling dead between refreshes, or the first
        tests in the mobile repo — it has none, and the logic worth testing is
        the mapping from server pots to screen pots.
      </p>

      <h3>If you want the hard part</h3>

      <p>
        The oracle service. The escrow contract&apos;s <code>attest</code> call
        is oracle-only and nothing signs those attestations yet. It reads
        settled step history, applies the anti-cheat rules that need full
        history rather than a single write, and submits a signed attestation —
        and it has to be able to stay silent, which is exactly why the contract
        has a deadline that lets funders withdraw when it does.
      </p>

      <h2>What we care about in a pull request</h2>

      <ul>
        <li>
          <strong>Say why, not what.</strong> The diff shows what changed. The
          comment and the commit message should explain the reasoning that is
          not visible in the code.
        </li>
        <li>
          <strong>Tests where a bug would be silent.</strong> Settlement, step
          validation and anything touching money. Not screen snapshots.
        </li>
        <li>
          <strong>Keep the no-account rule.</strong> If your change makes a
          credential necessary to run something that used to run without one,
          it needs a fallback.
        </li>
        <li>
          <strong>Small is fine.</strong> A fixed typo in a comment that was
          wrong is worth more than a refactor nobody asked for.
        </li>
      </ul>

      <h2>Licence</h2>

      <p>
        MIT, across all three repos. Contributions are accepted under the same
        terms.
      </p>
    </Prose>
  );
}
