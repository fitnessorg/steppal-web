import { NextResponse } from 'next/server';
import { rateLimit, submit, type Submission } from '@/lib/waitlist';

/**
 * Always dynamic: it writes, and a cached POST would be a strange bug to hunt.
 */
export const dynamic = 'force-dynamic';

function clientKey(request: Request): string {
  // Vercel and most proxies set x-forwarded-for; the first entry is the client.
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request))) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  let body: Submission;
  try {
    body = (await request.json()) as Submission;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const result = await submit(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason },
      { status: result.reason === 'storage_failed' ? 502 : 400 },
    );
  }

  return NextResponse.json({ status: result.status });
}
