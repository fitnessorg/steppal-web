import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isPlausibleEmail,
  normaliseEmail,
  rateLimit,
  resetRateLimits,
  submit,
  type WaitlistStore,
} from '@/lib/waitlist';

function fakeStore(): WaitlistStore & { added: string[] } {
  const added: string[] = [];
  return {
    name: 'fake',
    added,
    async add(email) {
      if (added.includes(email)) return 'already_on_list';
      added.push(email);
      return 'added';
    },
  };
}

describe('isPlausibleEmail', () => {
  it('accepts the shapes real addresses come in', () => {
    for (const email of [
      'ada@example.com',
      'ada.o@mail.co.uk',
      'ada+steppal@example.com',
      "o'brien@example.com",
      'ADA@EXAMPLE.COM',
    ]) {
      expect(isPlausibleEmail(email), email).toBe(true);
    }
  });

  it('rejects what is clearly not an address', () => {
    for (const email of [
      '',
      'ada',
      'ada@',
      '@example.com',
      'ada@example',
      'ada @example.com',
      'ada@.com',
      'ada@example.',
      `${'a'.repeat(250)}@example.com`,
    ]) {
      expect(isPlausibleEmail(email), email).toBe(false);
    }
  });
});

describe('normaliseEmail', () => {
  it('lowercases and trims so one person is one signup', () => {
    expect(normaliseEmail('  Ada@Example.COM ')).toBe('ada@example.com');
  });
});

describe('submit', () => {
  it('stores a valid address', async () => {
    const store = fakeStore();
    const result = await submit({ email: 'ada@example.com' }, store);

    expect(result).toEqual({ ok: true, status: 'added' });
    expect(store.added).toEqual(['ada@example.com']);
  });

  it('reports a repeat signup rather than pretending it is new', async () => {
    const store = fakeStore();
    await submit({ email: 'ada@example.com' }, store);
    const second = await submit({ email: 'ADA@example.com ' }, store);

    expect(second).toEqual({ ok: true, status: 'already_on_list' });
    expect(store.added).toHaveLength(1);
  });

  it('rejects an invalid address without touching the store', async () => {
    const store = fakeStore();
    const result = await submit({ email: 'nope' }, store);

    expect(result).toEqual({ ok: false, reason: 'invalid_email' });
    expect(store.added).toEqual([]);
  });

  it('rejects a missing address', async () => {
    const store = fakeStore();
    expect(await submit({}, store)).toEqual({ ok: false, reason: 'invalid_email' });
  });

  it('tells a honeypot-filling bot it succeeded, and stores nothing', async () => {
    const store = fakeStore();
    const result = await submit({ email: 'bot@example.com', company: 'Acme' }, store);

    // Same answer a real signup gets — telling a bot it was caught only
    // teaches whoever wrote it.
    expect(result).toEqual({ ok: true, status: 'added' });
    expect(store.added).toEqual([]);
  });

  it('surfaces a storage failure instead of claiming success', async () => {
    const broken: WaitlistStore = {
      name: 'broken',
      add: vi.fn(async () => {
        throw new Error('provider down');
      }),
    };

    expect(await submit({ email: 'ada@example.com' }, broken)).toEqual({
      ok: false,
      reason: 'storage_failed',
    });
  });
});

describe('rateLimit', () => {
  beforeEach(resetRateLimits);

  it('allows a handful then refuses', () => {
    const results = Array.from({ length: 6 }, () => rateLimit('1.2.3.4'));
    expect(results).toEqual([true, true, true, true, true, false]);
  });

  it('counts each client separately', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.2.3.4');

    expect(rateLimit('1.2.3.4')).toBe(false);
    expect(rateLimit('5.6.7.8')).toBe(true);
  });

  it('lets a client back in once the window passes', () => {
    const start = Date.now();
    for (let i = 0; i < 5; i++) rateLimit('1.2.3.4', start);

    expect(rateLimit('1.2.3.4', start)).toBe(false);
    expect(rateLimit('1.2.3.4', start + 61 * 60 * 1000)).toBe(true);
  });
});
