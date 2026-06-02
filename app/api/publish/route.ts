import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOOK = process.env.VERCEL_DEPLOY_HOOK;
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`publish:${ip}`, RATE_LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!HOOK) {
    return NextResponse.json(
      {
        deployed: false,
        message:
          'VERCEL_DEPLOY_HOOK is not configured. Save cv.json and push to git, or set the env var in Vercel.',
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(HOOK, { method: 'POST' });
    return NextResponse.json({
      deployed: res.ok,
      status: res.status,
      message: res.ok ? 'Deployment triggered' : 'Deploy hook returned non-OK',
    });
  } catch (e) {
    return NextResponse.json(
      { deployed: false, error: e instanceof Error ? e.message : 'Deploy failed' },
      { status: 500 }
    );
  }
}
