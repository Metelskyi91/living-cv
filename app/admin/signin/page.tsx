'use client';

import { signIn } from 'next-auth/react';
import { Github, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInForm() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/admin';
  const error = params.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-hacker-bg px-4">
      <div className="terminal-card rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-hacker-green" />
          <div>
            <h1 className="font-mono text-2xl font-bold text-hacker-green">
              Admin Access
            </h1>
            <p className="font-mono text-sm text-hacker-cyan/60">
              {'// restricted area'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-sm">
            <p>{`// error: ${error}`}</p>
            <p className="text-xs mt-1">
              Your GitHub email is not on the allow-list.
            </p>
          </div>
        )}

        <button
          onClick={() => signIn('github', { callbackUrl })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#24292e] hover:bg-[#1b1f23] text-white font-mono text-sm transition-colors"
        >
          <Github className="w-4 h-4" />
          Sign in with GitHub
        </button>

        <p className="mt-6 text-xs font-mono text-hacker-cyan/60 text-center">
          access is limited to whitelisted GitHub accounts
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-hacker-bg">
        <div className="font-mono text-hacker-green animate-pulse">loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
