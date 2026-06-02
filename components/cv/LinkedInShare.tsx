'use client';

import { motion } from 'framer-motion';
import { Share2, Copy, Check, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const SHARE_TEXT =
  "Just discovered a 'Living CV' for a QA Engineer — a working portfolio instead of a boring PDF. Skills, release notes, even a contact form styled as a Pull Request. Take a look → ";

type CopyState = 'idle' | 'copied' | 'error';

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to legacy */
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function LinkedInShare() {
  const [origin, setOrigin] = useState('');
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl = origin || 'https://ihor-metelskyi.vercel.app';
  const fullText = SHARE_TEXT + shareUrl;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}&summary=${encodeURIComponent(SHARE_TEXT)}`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(fullText);
    setState(ok ? 'copied' : 'error');
    setTimeout(() => setState('idle'), 2200);
  };

  return (
    <section className="py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-mono mb-3">
          <span className="text-hacker-cyan">$</span> share{' '}
          <span className="text-hacker-green">--network linkedin</span>
        </h2>
        <p className="text-hacker-cyan/60 font-mono text-sm mb-6">
          {'// recruiters love this. spread the word.'}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/40 text-[#0a66c2] dark:text-[#4d9ee0] font-mono text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share on LinkedIn
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-hacker-green/10 hover:bg-hacker-green/20 border border-hacker-green/30 text-hacker-green font-mono text-sm transition-colors"
          >
            {state === 'copied' ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : state === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Copy failed
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy post
              </>
            )}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
