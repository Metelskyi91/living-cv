import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

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

function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  if (ALLOWED_EMAILS.length === 0) {
    return normalized === FALLBACK_EMAIL;
  }
  return ALLOWED_EMAILS.includes(normalized);
}

function isGitHubLoginAllowed(login: string | null | undefined): boolean {
  if (!login) return false;
  const normalized = login.toLowerCase();
  if (ALLOWED_GITHUB_LOGINS.length === 0) {
    return normalized === FALLBACK_GITHUB_LOGIN;
  }
  return ALLOWED_GITHUB_LOGINS.includes(normalized);
}

function isAllowed(input: {
  email?: string | null;
  githubLogin?: string | null;
}): boolean {
  return (
    isGitHubLoginAllowed(input.githubLogin) ||
    isEmailAllowed(input.email)
  );
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
    async signIn({ user, profile }) {
      const githubLogin =
        (profile as { login?: string } | undefined)?.login ??
        (user as { login?: string } | undefined)?.login ??
        null;
      return isAllowed({ email: user.email, githubLogin });
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as {
          id?: string;
          githubLogin?: string;
        };
        u.id = token.sub;
        u.githubLogin = token.githubLogin as string | undefined;
      }
      return session;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.email = user.email;
        const githubLogin =
          (profile as { login?: string } | undefined)?.login ??
          (user as { login?: string } | undefined)?.login ??
          null;
        if (githubLogin) {
          (token as { githubLogin?: string }).githubLogin =
            githubLogin.toLowerCase();
        }
      }
      return token;
    },
  },
  session: { strategy: 'jwt' },
};

export function isGitHubUserAllowed(input: {
  email?: string | null;
  githubLogin?: string | null;
}): boolean {
  return isAllowed(input);
}
