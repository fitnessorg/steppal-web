'use client';

import { useState } from 'react';
import { RevealText } from '@/components/RevealText';

/**
 * The form is real and validates. Submission is deliberately unwired —
 * see the TODO below.
 */
export function Waitlist() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  // TODO(contributor): wire up waitlist submission
  // The form validates and manages its own state but nothing is persisted.
  // Add a POST to a route handler at src/app/api/waitlist/route.ts that stores
  // the address (Resend audience, or a table in steppal-core). Handle duplicate
  // signups gracefully and surface real errors in the UI.
  // difficulty: easy
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <section
      id="waitlist"
      className="flex min-h-[80svh] flex-col justify-center px-(--spacing-gutter) py-(--spacing-section)"
    >
      <RevealText as="h2" className="t-display max-w-[11ch]">
        Get it when it drops.
      </RevealText>

      <p className="t-lead mt-8 max-w-[40ch]">
        Android first, Nigeria first. We&apos;ll email you once, when it&apos;s ready.
      </p>

      {done ? (
        <p className="mt-12 text-accent">
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-12 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-surface-2 bg-surface px-6 py-4 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-8 py-4 font-medium text-accent-ink transition-opacity hover:opacity-90"
          >
            Join the waitlist
          </button>
        </form>
      )}
    </section>
  );
}
