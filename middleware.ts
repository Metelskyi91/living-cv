import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const FALLBACK = 'ihor.metelskyi@gmail.com';

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

    const email = (token.email as string | undefined)?.toLowerCase();
    const allowed =
      ALLOWED_EMAILS.length === 0 ? email === FALLBACK : ALLOWED_EMAILS.includes(email || '');
    if (!allowed) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
