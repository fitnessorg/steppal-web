import type { Metadata } from 'next';
import { Prose } from '@/components/Prose';

export const metadata: Metadata = {
  title: 'Terms — StepPal',
  description: 'The terms that will apply to StepPal, written plainly.',
};

export default function Terms() {
  return (
    <Prose
      eyebrow="Terms"
      title="The deal, in plain words."
      lede="StepPal is not released. Nothing below is in force yet, and it will be revised before it is. It is published now because a product that handles money should say what it intends before it asks anyone to trust it."
    >
      <h2>What StepPal is</h2>

      <p>
        A commitment device. You set a step goal, you put money behind it, and
        software holds that money until the week is over. Hit your goal and you
        get your stake back plus a share of what the people who missed forfeited.
        Miss it and your stake goes to the people who did not.
      </p>

      <h2>What StepPal is not</h2>

      <p>
        <strong>It is not gambling.</strong> You are not betting on an uncertain
        outcome you do not control; you are committing to your own behaviour,
        which you fully control. There is no house, no odds and no bookmaker.
      </p>

      <p>
        <strong>It is not an investment,</strong> and money placed in a pot does
        not earn a return. The most you can receive is your own stake plus the
        stakes forfeited by the people in your pot.
      </p>

      <p>
        <strong>We do not take a cut of a pot.</strong> When nobody in a pot
        meets the goal, every stake is returned rather than kept. StepPal does
        not profit from you failing.
      </p>

      <h2>Your money</h2>

      <p>
        Stakes are held by a smart contract, not on our balance sheet. We
        instruct movements; we do not take custody of your funds and cannot
        spend them.
      </p>

      <p>
        Payouts are determined by the settlement rules, which are public and can
        be read in the source. If you think a settlement is wrong, the inputs —
        every daily step total that fed it — are visible to you and to everyone
        else in that pot.
      </p>

      <h2>Honest counting</h2>

      <p>
        Your step counts come from your phone&apos;s health store. Submitting
        counts you did not walk — by any means, including another device, an
        app that generates them, or mechanical shaking — is cheating other
        people out of money, and it is grounds for removing your account and
        returning the affected pot&apos;s stakes.
      </p>

      <p>
        Counts above a daily plausibility limit are reduced rather than refused,
        and the original is retained. An honest person with a faulty sensor
        stays in the game; a dishonest one gains nothing.
      </p>

      <h2>Pots</h2>

      <ul>
        <li>
          A pot cannot be joined once it has started. Joining late would mean
          competing over fewer days.
        </li>
        <li>
          A pot cannot be left once it has started. Otherwise anyone who was
          losing could walk away, and the commitment would be worthless.
        </li>
        <li>
          Pots are private to their members. Being sent a link is not enough to
          see the standings.
        </li>
      </ul>

      <h2>Your account</h2>

      <p>
        One account per phone number. You are responsible for the device that
        receives your sign-in codes.
      </p>

      <h2>No warranty</h2>

      <p>
        StepPal is open-source software provided as is, under the MIT licence,
        with no warranty. It is not medical advice, and it is not a reason to
        exercise in a way that is unsafe for you.
      </p>

      <h2>Changes</h2>

      <p>
        These terms will change before release. Material changes will be
        announced in the repositories rather than quietly edited in — the
        history of this page is public, in{' '}
        <a href="https://github.com/fitnessorg/steppal-web">steppal-web</a>.
      </p>
    </Prose>
  );
}
