'use client';

import { Terminal, FileText } from 'lucide-react';
import { useMode } from '@/components/providers/ModeProvider';
import { motion } from 'framer-motion';

export function ModeToggle() {
  const { mode, toggle } = useMode();
  const isHacker = mode === 'hacker';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={`h-12 w-12 rounded-full backdrop-blur border flex items-center justify-center transition-all ${
        isHacker
          ? 'bg-hacker-bg/80 border-hacker-green/30 text-hacker-green hover:border-hacker-green hover:shadow-[0_0_20px_rgba(0,255,156,0.4)]'
          : 'bg-white/80 border-slate-300 text-slate-700 hover:border-slate-500 hover:shadow-lg'
      }`}
      aria-label={`Switch to ${isHacker ? 'Classic' : 'Hacker'} view`}
      title={`Switch to ${isHacker ? 'Classic' : 'Hacker'} view`}
    >
      {isHacker ? <Terminal size={18} /> : <FileText size={18} />}
    </motion.button>
  );
}
