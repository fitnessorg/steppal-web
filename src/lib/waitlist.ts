/**
 * Waitlist signup — validation and storage, kept out of the route handler so
 * both can be tested without a request.
 */

export type SignupResult =
  | { ok: true; status: 'added' | 'already_on_list' }
  | { ok: false; reason: 'invalid_email' | 'rejected' | 'storage_failed' };

/**
 * Deliberately permissive.
 *
 * Email addresses are far stranger than most regexes allow, and the only
 * authority on whether one works is the mail server. The job here is to catch
 * a typo and a bot, not to adjudicate RFC 5322 — a validator that rejects a
 * real address costs a signup, which is worse than storing one that bounces.
 */
export function isPlausibleEmail(value: string): boolean {
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return false;
  if (/\s/.test(email)) return false;

  const at = email.lastIndexOf('@');
  if (at < 1 || at === email.length - 1) return false;

  const domain = email.slice(at + 1);
  return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
}

export function normaliseEmail(value: string): string {
  return value.trim().toLowerCase();
}

/* ------------------------------------------------------------------- store */

export interface WaitlistStore {
  readonly name: string;
  add(email: string): Promise<'added' | 'already_on_list'>;
}

/**
 * The default. Logs and keeps the address for the life of the process.
 *
 * This is what makes the form genuinely work from a fresh clone with no
 * accounts and no environment variables — a contributor can submit it, see the
 * success state, and watch the address land in the terminal. It is not
 * durable, and says so.
 */
export function createMemoryStore(): WaitlistStore {
  const seen = new Set<string>();

  return {
    name: 'memory',
    async add(email) {
      if (seen.has(email)) return 'already_on_list';
      seen.add(email);
      console.log(`[waitlist:memory] ${email} (${seen.size} this process)`);
      return 'added';
    },
  };
}

/**
 * Resend audiences. One fetch, no SDK — the SDK would be a dependency for a
 * single POST.
 *
 * Resend answers 200 for an address already in the audience, so a duplicate is
 * indistinguishable from a new signup. That is fine: the user sees the same
 * thing either way, and pretending to know the difference would be a lie.
 */
export function createResendStore(apiKey: string, audienceId: string): WaitlistStore {
  return {
    name: 'resend',
    async add(email) {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });

      if (!res.ok) throw new Error(`resend responded ${res.status}`);
      return 'added';
    },
  };
}

/**
 * steppal-core store. Posts directly to the backend API so signups land in the
 * same Postgres database as everything else in the ecosystem.
 *
 * Handles HTTP 409 Conflict or `{ status: 'already_on_list' }` as deduplicated
 * idempotency, surviving redeployments.
 */
export function createCoreStore(apiUrl: string, apiKey?: string): WaitlistStore {
  const normalizedUrl = apiUrl.replace(/\/+$/, '');
  const endpoint = `${normalizedUrl}/api/waitlist`;

  return {
    name: 'steppal-core',
    async add(email) {
      const headers: Record<string, string> = {
        'content-type': 'application/json',
      };
      if (apiKey) {
        headers['authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email }),
      });

      if (res.status === 409) {
        return 'already_on_list';
      }

      if (!res.ok) {
        throw new Error(`steppal-core responded ${res.status}`);
      }

      const body = (await res.json().catch(() => ({}))) as { status?: string };
      if (body.status === 'already_on_list') {
        return 'already_on_list';
      }

      return 'added';
    },
  };
}

let cached: WaitlistStore | null = null;

export function waitlistStore(): WaitlistStore {
  if (cached) return cached;

  const coreUrl = process.env.STEPPAL_CORE_URL;
  const coreKey = process.env.STEPPAL_CORE_API_KEY;
  if (coreUrl) {
    cached = createCoreStore(coreUrl, coreKey);
    return cached;
  }

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (key && audience) {
    cached = createResendStore(key, audience);
    return cached;
  }

  cached = createMemoryStore();
  return cached;
}

/** Test seam. */
export function setWaitlistStore(store: WaitlistStore | null) {
  cached = store;
}

/* ------------------------------------------------------------- rate limit */

/**
 * A fixed window per client, in memory.
 *
 * Good enough for a waitlist on a single instance, and honest about not being
 * good enough for anything else: serverless means several instances, each with
 * its own counter. It raises the cost of a casual script, which is the actual
 * threat to a form like this. Real abuse needs the edge.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, now = Date.now()): boolean {
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_PER_WINDOW) return false;

  entry.count += 1;
  return true;
}

export function resetRateLimits() {
  hits.clear();
}

/* --------------------------------------------------------------- submission */

export type Submission = { email?: unknown; company?: unknown };

/**
 * `company` is a honeypot: hidden from people, irresistible to the bots that
 * fill every field they find. A filled honeypot gets the same answer a real
 * signup does, because telling a bot it was caught only teaches it.
 */
export async function submit(
  body: Submission,
  store: WaitlistStore = waitlistStore(),
): Promise<SignupResult> {
  if (typeof body.company === 'string' && body.company.length > 0) {
    return { ok: true, status: 'added' };
  }

  if (typeof body.email !== 'string' || !isPlausibleEmail(body.email)) {
    return { ok: false, reason: 'invalid_email' };
  }

  try {
    return { ok: true, status: await store.add(normaliseEmail(body.email)) };
  } catch {
    return { ok: false, reason: 'storage_failed' };
  }
}
