'use client';

import { useState } from 'react';
import { RevealText } from '@/components/RevealText';
import { isPlausibleEmail } from '@/lib/waitlist';

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; already: boolean }
  | { kind: 'error'; message: string };

/**
 * The form posts to /api/waitlist and reports what actually happened.
 *
 * Three things this does that an unwired form cannot: it tells you when your
 * address is already on the list, it tells you when the server failed rather
 * than silently congratulating you, and it keeps what you typed when it fails,
 * so a retry is one tap and not a retype.
 */
export function Waitlist() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validated here as well as on the server, with the same function, so a
    // typo never costs a round trip.
    if (!isPlausibleEmail(email)) {
      return setState({ kind: 'error', message: 'That does not look like an email address.' });
    }

    setState({ kind: 'sending' });

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, company }),
      });

      if (res.status === 429) {
        return setState({ kind: 'error', message: 'Too many tries. Give it an hour.' });
      }

      if (!res.ok) {
        return setState({
          kind: 'error',
          message: 'Could not save that. Try again in a moment.',
        });
      }

      const body = (await res.json()) as { status: 'added' | 'already_on_list' };
      setState({ kind: 'done', already: body.status === 'already_on_list' });
    } catch {
      setState({ kind: 'error', message: 'Could not reach the server. Check your connection.' });
    }
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

      {state.kind === 'done' ? (
        <p className="mt-12 text-accent" role="status">
          {state.already
            ? "You're already on the list. We'll be in touch."
            : "You're on the list. We'll be in touch."}
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-12 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={state.kind === 'error'}
            aria-describedby={state.kind === 'error' ? 'waitlist-error' : undefined}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-surface-2 bg-surface px-6 py-4 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />

          {/*
            Honeypot. Hidden from people and from screen readers, left in the
            DOM for the bots that fill every field they find.
          */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="pointer-events-none absolute left-[-9999px] h-px w-px opacity-0"
          />

          <button
            type="submit"
            disabled={state.kind === 'sending'}
            className="rounded-full bg-accent px-8 py-4 font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {state.kind === 'sending' ? 'Adding you…' : 'Join the waitlist'}
          </button>
        </form>
      )}

      {state.kind === 'error' ? (
        <p id="waitlist-error" role="alert" className="mt-4 text-sm text-danger">
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
