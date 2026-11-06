import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '@/app/api/waitlist/route';
import { resetRateLimits, setWaitlistStore, type WaitlistStore } from '@/lib/waitlist';

describe('/api/waitlist Route Handler', () => {
  beforeEach(() => {
    resetRateLimits();
    setWaitlistStore(null);
  });

  afterEach(() => {
    resetRateLimits();
    setWaitlistStore(null);
  });

  it('accepts and records a valid waitlist submission', async () => {
    const mockStore: WaitlistStore = {
      name: 'mock',
      add: vi.fn(async () => 'added'),
    };
    setWaitlistStore(mockStore);

    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.1, 10.0.0.1',
      },
      body: JSON.stringify({ email: 'runner@example.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ status: 'added' });
    expect(mockStore.add).toHaveBeenCalledWith('runner@example.com');
  });

  it('returns already_on_list status when email is already registered', async () => {
    const mockStore: WaitlistStore = {
      name: 'mock',
      add: vi.fn(async () => 'already_on_list'),
    };
    setWaitlistStore(mockStore);

    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-real-ip': '198.51.100.2',
      },
      body: JSON.stringify({ email: 'existing@example.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({ status: 'already_on_list' });
  });

  it('catches honeypot submission and reports success without persisting', async () => {
    const mockStore: WaitlistStore = {
      name: 'mock',
      add: vi.fn(async () => 'added'),
    };
    setWaitlistStore(mockStore);

    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'spammer@example.com', company: 'BotNet Inc' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ status: 'added' });
    expect(mockStore.add).not.toHaveBeenCalled();
  });

  it('rejects invalid email with 400 Bad Request', async () => {
    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: 'invalid_email' });
  });

  it('rejects malformed non-JSON body with 400 Bad Request', async () => {
    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not a json',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: 'invalid_body' });
  });

  it('surfaces 502 Bad Gateway when underlying store fails', async () => {
    const brokenStore: WaitlistStore = {
      name: 'broken',
      add: vi.fn(async () => {
        throw new Error('Database connection failed');
      }),
    };
    setWaitlistStore(brokenStore);

    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'valid@example.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data).toEqual({ error: 'storage_failed' });
  });

  it('throttles rapid requests exceeding rate limits with 429 Too Many Requests', async () => {
    const ip = '203.0.113.42';

    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({ email: `user${i}@example.com` }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 6th request from same IP within the window must be rate limited
    const excessiveReq = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({ email: 'blocked@example.com' }),
    });

    const blockedRes = await POST(excessiveReq);
    expect(blockedRes.status).toBe(429);
    const data = await blockedRes.json();
    expect(data).toEqual({ error: 'too_many_requests' });
  });
});
