import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ALLOWED_GITHUB_LOGINS = (process.env.ALLOWED_GITHUB_LOGINS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const FALLBACK_EMAIL = 'ihor.metelskyi@gmail.com';
const FALLBACK_GITHUB_LOGIN = 'metelskyi';

function isAllowed(input: {
  email?: string | null;
  githubLogin?: string | null;
}): boolean {
  if (input.githubLogin) {
    const normalized = input.githubLogin.toLowerCase();
    if (ALLOWED_GITHUB_LOGINS.length === 0) {
      if (normalized === FALLBACK_GITHUB_LOGIN) return true;
    } else if (ALLOWED_GITHUB_LOGINS.includes(normalized)) {
      return true;
    }
  }
  if (input.email) {
    const normalized = input.email.toLowerCase();
    if (ALLOWED_EMAILS.length === 0) {
      if (normalized === FALLBACK_EMAIL) return true;
    } else if (ALLOWED_EMAILS.includes(normalized)) {
      return true;
    }
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/signin') {
    const token = await getToken({
      req,
      secret:
        process.env.NEXTAUTH_SECRET || 'dev-only-secret-change-in-production',
    });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/signin';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    const email = (token.email as string | undefined) || null;
    const githubLogin =
      (token as { githubLogin?: string }).githubLogin || null;
    if (!isAllowed({ email, githubLogin })) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
