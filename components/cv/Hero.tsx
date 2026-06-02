import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  tagline: string[];
  subtitle: string;
  stats: {
    yearsInIT: number;
    companies: number;
    projects: number;
    platforms: number;
    testCasesAuthored: number;
  };
}

export function Hero({ tagline, subtitle, stats }: HeroProps) {
  const [text, setText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>(
    'typing'
  );

  useEffect(() => {
    const currentLine = tagline[lineIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (charIndex < currentLine.length) {
        timeout = setTimeout(() => {
          setText(currentLine.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, 45);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1500);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('erasing'), 1000);
    } else if (phase === 'erasing') {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setCharIndex((c) => c - 1);
          setText(currentLine.slice(0, charIndex - 1));
        }, 25);
      } else {
        setLineIndex((i) => (i + 1) % tagline.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex, phase, tagline]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,156,0.08),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl"
      >
        <div className="font-mono text-hacker-cyan text-sm md:text-base mb-6 opacity-80">
          <span className="text-hacker-green">$</span> init career.profile --json
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="gradient-text">{text}</span>
          <span className="inline-block w-0.5 h-12 md:h-16 lg:h-20 bg-hacker-green ml-1 align-middle animate-blink" />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-mono text-hacker-cyan/80 text-base md:text-lg mb-8"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto"
        >
          <StatCard label="years" value={stats.yearsInIT} suffix="+" />
          <StatCard label="companies" value={stats.companies} />
          <StatCard label="projects" value={stats.projects} />
          <StatCard label="platforms" value={stats.platforms} />
          <StatCard
            label="test cases"
            value={stats.testCasesAuthored}
            suffix="+"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-10 font-mono text-xs text-hacker-green/60"
        >
          [ scroll to explore release history ↓ ]
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="terminal-card rounded-lg p-4 hover:glow-border transition-all">
      <div className="text-2xl md:text-3xl font-bold font-mono text-hacker-green">
        {value}
        {suffix}
      </div>
      <div className="text-xs font-mono text-hacker-cyan/60 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}
