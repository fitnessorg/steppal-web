import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Waitlist, resolveWaitlistSubmission } from '@/components/sections/Waitlist';

describe('Waitlist Component & State Machine', () => {
  describe('SSR Markup', () => {
    it('renders a section container with waitlist anchor id', () => {
      const html = renderToStaticMarkup(<Waitlist />);
      expect(html).toContain('id="waitlist"');
    });

    it('renders the email input, honeypot, and submit button in initial idle state', () => {
      const html = renderToStaticMarkup(<Waitlist />);

      expect(html).toContain('type="email"');
      expect(html).toContain('placeholder="you@example.com"');
      expect(html).toContain('name="company"');
      expect(html).toContain('Join the waitlist');
    });
  });

  describe('resolveWaitlistSubmission State Transitions', () => {
    it('transitions immediately to error on invalid email without invoking network fetch', async () => {
      const mockFetch = vi.fn();
      const state = await resolveWaitlistSubmission('not-an-email', '', mockFetch as unknown as typeof fetch);

      expect(state).toEqual({
        kind: 'error',
        message: 'That does not look like an email address.',
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('transitions to done (already: false) when server returns added', async () => {
      const mockFetch = vi.fn(async () =>
        new Response(JSON.stringify({ status: 'added' }), { status: 200 }),
      );

      const state = await resolveWaitlistSubmission(
        'walker@example.com',
        '',
        mockFetch as unknown as typeof fetch,
      );

      expect(state).toEqual({ kind: 'done', already: false });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('transitions to done (already: true) when server reports duplicate signup', async () => {
      const mockFetch = vi.fn(async () =>
        new Response(JSON.stringify({ status: 'already_on_list' }), { status: 200 }),
      );

      const state = await resolveWaitlistSubmission(
        'walker@example.com',
        '',
        mockFetch as unknown as typeof fetch,
      );

      expect(state).toEqual({ kind: 'done', already: true });
    });

    it('transitions to rate limit error message on HTTP 429', async () => {
      const mockFetch = vi.fn(async () =>
        new Response(JSON.stringify({ error: 'too_many_requests' }), { status: 429 }),
      );

      const state = await resolveWaitlistSubmission(
        'walker@example.com',
        '',
        mockFetch as unknown as typeof fetch,
      );

      expect(state).toEqual({
        kind: 'error',
        message: 'Too many tries. Give it an hour.',
      });
    });

    it('transitions to server failure message on non-OK HTTP 500/502 response', async () => {
      const mockFetch = vi.fn(async () =>
        new Response(JSON.stringify({ error: 'storage_failed' }), { status: 502 }),
      );

      const state = await resolveWaitlistSubmission(
        'walker@example.com',
        '',
        mockFetch as unknown as typeof fetch,
      );

      expect(state).toEqual({
        kind: 'error',
        message: 'Could not save that. Try again in a moment.',
      });
    });

    it('transitions to connection error message when fetch rejects offline', async () => {
      const mockFetch = vi.fn(async () => {
        throw new Error('Failed to fetch');
      });

      const state = await resolveWaitlistSubmission(
        'walker@example.com',
        '',
        mockFetch as unknown as typeof fetch,
      );

      expect(state).toEqual({
        kind: 'error',
        message: 'Could not reach the server. Check your connection.',
      });
    });
  });
});
