import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const FALLBACK_EMAIL = 'ihor.metelskyi@gmail.com';

function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  if (ALLOWED_EMAILS.length === 0) {
    return normalized === FALLBACK_EMAIL;
  }
  return ALLOWED_EMAILS.includes(normalized);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || 'placeholder-client-id',
      clientSecret: process.env.GITHUB_SECRET || 'placeholder-client-secret',
      authorization: { params: { scope: 'read:user user:email' } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'dev-only-secret-change-in-production',
  pages: {
    signIn: '/admin/signin',
  },
  callbacks: {
    async signIn({ user }) {
      return isAllowed(user.email);
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  session: { strategy: 'jwt' },
};

export function isEmailAllowed(email: string | null | undefined): boolean {
  return isAllowed(email);
}
