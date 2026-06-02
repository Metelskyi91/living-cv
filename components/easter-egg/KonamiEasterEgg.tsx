'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const TOUCH_SEQUENCE: string[] = [
  'swipe-up',
  'swipe-up',
  'swipe-down',
  'swipe-down',
  'swipe-left',
  'swipe-right',
  'swipe-left',
  'swipe-right',
  'tap-1',
  'tap-2',
];

const OUTPUT_LINES = [
  { text: '> CLASSIFIED ACCESS GRANTED', color: 'text-hacker-green', delay: 100 },
  { text: '> Decrypting career.kdbx...', color: 'text-hacker-cyan', delay: 600 },
  { text: '> Loading secret profile...', color: 'text-hacker-cyan', delay: 1100 },
  { text: '', color: '', delay: 1500 },
  { text: '> Fun fact: Ihor once found a bug in a bug report.', color: 'text-hacker-fg', delay: 1700 },
  { text: '> Skills: [████████████████] OVER 9000', color: 'text-hacker-green', delay: 2200 },
  { text: '> Coffee consumed: classified', color: 'text-hacker-cyan', delay: 2700 },
  { text: '> Tests passed: 404 (not found, but in a good way)', color: 'text-hacker-fg', delay: 3200 },
  { text: '', color: '', delay: 3700 },
  { text: '> Easter egg found. You\'d make a good QA.', color: 'text-hacker-green', delay: 4000 },
  { text: '> Hire this person. Seriously.', color: 'text-hacker-cyan', delay: 4500 },
];

export function KonamiEasterEgg() {
  const [open, setOpen] = useState(false);
  const [output, setOutput] = useState<{ text: string; color: string }[]>([]);
  const inputBuffer = useRef<string[]>([]);
  const touchState = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    tapCount: number;
    lastTapTime: number;
  }>({ startX: 0, startY: 0, startTime: 0, tapCount: 0, lastTapTime: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      inputBuffer.current.push(key);
      if (inputBuffer.current.length > KONAMI_SEQUENCE.length) {
        inputBuffer.current.shift();
      }
      if (
        inputBuffer.current.length === KONAMI_SEQUENCE.length &&
        inputBuffer.current.every((k, i) => k === KONAMI_SEQUENCE[i])
      ) {
        trigger();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchState.current.startX = t.clientX;
      touchState.current.startY = t.clientY;
      touchState.current.startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchState.current.startX;
      const dy = t.clientY - touchState.current.startY;
      const dt = Date.now() - touchState.current.startTime;
      const minSwipe = 50;
      const maxSwipeTime = 500;

      if (Math.abs(dx) < 30 && Math.abs(dy) < 30 && dt < 300) {
        const now = Date.now();
        if (now - touchState.current.lastTapTime < 600) {
          touchState.current.tapCount += 1;
        } else {
          touchState.current.tapCount = 1;
        }
        touchState.current.lastTapTime = now;
        const tapKey =
          touchState.current.tapCount === 1 ? 'tap-1' : 'tap-2';
        pushTouch(tapKey);
        return;
      }

      if (dt < maxSwipeTime) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
          pushTouch(dy < 0 ? 'swipe-up' : 'swipe-down');
        } else if (Math.abs(dx) > minSwipe) {
          pushTouch(dx < 0 ? 'swipe-left' : 'swipe-right');
        }
      }
    };

    const pushTouch = (gesture: string) => {
      inputBuffer.current.push(gesture);
      if (inputBuffer.current.length > TOUCH_SEQUENCE.length) {
        inputBuffer.current.shift();
      }
      if (
        inputBuffer.current.length === TOUCH_SEQUENCE.length &&
        inputBuffer.current.every((g, i) => g === TOUCH_SEQUENCE[i])
      ) {
        trigger();
      }
    };

    const trigger = () => {
      setOpen(true);
      inputBuffer.current = [];
      setOutput([]);
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    OUTPUT_LINES.forEach(({ text, color, delay }) => {
      const t = setTimeout(() => {
        setOutput((prev) => [...prev, { text, color }]);
      }, delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl terminal-card rounded-lg border-2 border-hacker-green/40 shadow-[0_0_50px_rgba(0,255,156,0.3)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-hacker-green/30 bg-hacker-bg/60">
              <div className="flex items-center gap-2 font-mono text-sm text-hacker-green">
                <Terminal className="w-4 h-4" />
                <span>classified@ihor:~$</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-hacker-red hover:text-hacker-green transition-colors"
                aria-label="Close terminal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 font-mono text-sm min-h-[300px] max-h-[70vh] overflow-y-auto scrollbar-thin">
              {output.map((line, i) => (
                <div key={i} className={line.color || 'h-3'}>
                  {line.text || '\u00A0'}
                </div>
              ))}
              {output.length < OUTPUT_LINES.length && (
                <div className="text-hacker-green animate-blink">_</div>
              )}
              {output.length >= OUTPUT_LINES.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setOpen(false)}
                  className="mt-4 px-4 py-2 border border-hacker-green/40 rounded text-hacker-green hover:bg-hacker-green/10 transition-colors"
                >
                  [ Close terminal ]
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
