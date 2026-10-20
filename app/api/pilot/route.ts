import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
const roles = new Set(['new', 'tried', 'growing', 'host', 'other']);
const times = new Set(['under-30m', '30-60m', '1-2h', 'over-2h']);

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Please submit the signup form as JSON.' }, { status: 415 });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Please submit the form from the Furrow website.' }, { status: 403 });
  }

  let input: Record<string, unknown>;
  try {
    // Bound the body before parsing; a content-length header alone is not reliable.
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Empty body');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return NextResponse.json({ error: 'Your submission is too large.' }, { status: 413 });
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
    input = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'We couldn’t read your details. Please try again.' }, { status: 400 });
  }

  if (input.website) return NextResponse.json({ error: 'Unable to accept this submission.' }, { status: 400 });
  const field = (key: string, max: number) => typeof input[key] === 'string' && (input[key] as string).trim().length <= max ? (input[key] as string).trim() : '';
  const name = field('name', 100);
  const email = field('email', 254).toLowerCase();
  const location = field('location', 160);
  const role = field('role', 30);
  const time = field('time', 30);
  const crops = field('crops', 240);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !location || !roles.has(role) || !times.has(time) || input.consent !== true || (input.crops && !crops)) {
    return NextResponse.json({ error: 'Please enter your name, a valid email, your location, experience and weekly time, and agree to pilot updates.' }, { status: 400 });
  }

  const webhook = process.env.PILOT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: 'Pilot signups aren’t open just yet. Please check back soon.' }, { status: 503 });
  }
  try {
    const destination = new URL(webhook);
    if (destination.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && destination.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(destination.hostname))) throw new Error('Invalid webhook URL');
    const response = await fetch(destination, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(process.env.PILOT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.PILOT_WEBHOOK_TOKEN}` } : {}) },
      body: JSON.stringify({ name, email, location, role, time, crops, consent: true, source: 'furrow-landing', submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
      redirect: 'error',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Delivery failed');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'We couldn’t save your request right now. Please try again shortly.' }, { status: 502 });
  }
}
