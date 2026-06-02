'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="h-12 w-12 rounded-full bg-hacker-bg/80 backdrop-blur border border-hacker-green/30 flex items-center justify-center text-hacker-green hover:border-hacker-green hover:shadow-[0_0_20px_rgba(0,255,156,0.4)] transition-all"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}
