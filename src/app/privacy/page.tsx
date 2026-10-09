import type { Metadata } from 'next';
import { Prose } from '@/components/Prose';

export const metadata: Metadata = {
  title: 'Privacy — StepPal',
  description: 'What StepPal collects, what it does not, and why.',
};

export default function Privacy() {
  return (
    <Prose
      eyebrow="Privacy"
      title="What we hold, and what we deliberately do not."
      lede="StepPal is not released yet, so nothing described here is collected from anyone today. This page says what the software as built does, and it will be kept honest as that changes."
    >
      <h2>The short version</h2>

      <ul>
        <li>
          A phone number, a display name, and the step counts your pots are
          scored on. That is the whole account.
        </li>
        <li>No location, ever. No contacts. No advertising identifiers.</li>
        <li>Nothing is sold, and nothing is shared for advertising.</li>
      </ul>

      <h2>What the app collects</h2>

      <h3>Your phone number</h3>

      <p>
        It is the only identity in the app — there is no password and no email.
        It is stored normalised, and it is what your friends see when you join
        their pot.
      </p>

      <h3>Daily step totals</h3>

      <p>
        One number per calendar day, plus which source it came from (your
        phone&apos;s health store, its pedometer, or sample data). If a count is
        clamped for being implausible, the original is kept so a dispute can be
        examined.
      </p>

      <p>
        <strong>Only the daily total leaves your phone.</strong> StepPal reads
        step records from your device&apos;s health store and adds them up
        locally. The individual records, the times of day you walked, and
        anything else in that health store are never uploaded.
      </p>

      <h3>What you type</h3>

      <p>Pot names, invite codes, and messages you send in a pot.</p>

      <h2>What the app does not collect</h2>

      <ul>
        <li>
          <strong>Location.</strong> Not once, not in the background. Steps come
          from your health store precisely so that location never has to be
          touched. The app does not request the permission.
        </li>
        <li>
          <strong>Other health data.</strong> Only step records are requested.
          Heart rate, sleep, weight and everything else are left alone.
        </li>
        <li>
          <strong>Contacts.</strong> Pots are joined by a code someone shares
          with you. Your address book is never read.
        </li>
        <li>
          <strong>Advertising identifiers,</strong> and there are no third-party
          analytics or advertising SDKs in the app.
        </li>
      </ul>

      <h2>Who can see your steps</h2>

      <p>
        People in a pot with you see your daily totals and how many days you
        hit, for the days that pot covers. That is the point — a commitment
        nobody can see is not a commitment. Nobody outside a pot sees anything,
        and a pot&apos;s standings are refused to anyone who is not a member,
        even if they have the link.
      </p>

      <h2>On this website</h2>

      <p>
        No cookies, no analytics, no trackers. If you join the waitlist we store
        the email address you typed, so we can email you once when the app is
        released. Nothing else.
      </p>

      <h2>Deleting your data</h2>

      <p>
        Account deletion is not built yet, and saying otherwise would be a lie.
        It is tracked as open work before any public release. When it exists it
        will remove your account, your step history and your messages;
        settlement records of pots you took part in are kept, because other
        people&apos;s money moved on the strength of them.
      </p>

      <h2>Children</h2>

      <p>
        StepPal is not intended for anyone under 18, and accounts are not
        knowingly created for them.
      </p>

      <h2>Open source</h2>

      <p>
        Every claim on this page can be checked. The code that reads steps, the
        code that uploads them and the code that decides who sees what are all
        public at{' '}
        <a href="https://github.com/fitnessorg">github.com/fitnessorg</a>. If
        something here does not match the code, the code is the truth and the
        page is a bug — please open an issue.
      </p>

      <h2>Contact</h2>

      <p>
        Open an issue on any of the repositories, or email the address on the
        GitHub organisation profile.
      </p>
    </Prose>
  );
}
