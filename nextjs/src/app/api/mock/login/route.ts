import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (!password || String(password).length < 6) {
    return NextResponse.json({ error: 'Password too short' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, token: 'demo-token' });
}
