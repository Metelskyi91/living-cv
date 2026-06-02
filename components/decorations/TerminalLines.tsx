'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function TerminalLines() {
  const [lines, setLines] = useState<{ text: string; color: string }[]>([]);

  useEffect(() => {
    const initial: { text: string; color: string }[] = [
      { text: '> connecting to ihor.dev...', color: 'text-hacker-cyan' },
      { text: '> auth: success', color: 'text-hacker-green' },
      { text: '> loading profile...', color: 'text-hacker-cyan' },
      { text: '> status: online', color: 'text-hacker-green' },
    ];
    setLines(initial);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
      <div className="font-mono text-xs leading-5 whitespace-pre p-4">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: i * 0.02, duration: 0.5 }}
            className="text-hacker-green"
          >
            {Math.random() > 0.5 ? '1' : '0'}
            {Math.random() > 0.5 ? '0' : '1'}{' '}
            {Math.random().toString(2).slice(2, 10)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
