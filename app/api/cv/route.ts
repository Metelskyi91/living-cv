import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/utils';
import {
  getGitHubConfig,
  readCVFromGitHub,
  writeCVToGitHub,
} from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CV_PATH = path.join(process.cwd(), 'data', 'cv.json');
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 1000;

export async function GET() {
  try {
    const github = getGitHubConfig();
    if (github) {
      const file = await readCVFromGitHub();
      if (file) {
        return new NextResponse(file.content, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Source': 'github',
          },
        });
      }
    }

    const content = await fs.readFile(CV_PATH, 'utf-8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Source': 'local',
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: 'Failed to read cv.json',
        details: e instanceof Error ? e.message : '',
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`cv-write:${ip}`, RATE_LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('personal' in body) ||
    !(body as { personal?: { name?: unknown } }).personal?.name
  ) {
    return NextResponse.json({ error: 'Invalid CV data' }, { status: 400 });
  }

  const newContent = JSON.stringify(body, null, 2) + '\n';
  const github = getGitHubConfig();

  if (github) {
    try {
      const current = await readCVFromGitHub();
      if (!current) {
        return NextResponse.json(
          {
            error:
              'cv.json not found in repo. Make sure data/cv.json exists on branch.',
          },
          { status: 404 }
        );
      }
      const result = await writeCVToGitHub(
        newContent,
        current.sha,
        'chore(cv): update from admin panel'
      );
      return NextResponse.json({
        ok: true,
        source: 'github',
        commitUrl: result.url,
        savedAt: new Date().toISOString(),
      });
    } catch (e) {
      return NextResponse.json(
        {
          error: 'Failed to commit to GitHub',
          details: e instanceof Error ? e.message : '',
        },
        { status: 500 }
      );
    }
  }

  try {
    await fs.writeFile(CV_PATH, newContent, 'utf-8');
    return NextResponse.json({
      ok: true,
      source: 'local',
      savedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: 'Failed to write cv.json (local)',
        details: e instanceof Error ? e.message : '',
      },
      { status: 500 }
    );
  }
}
