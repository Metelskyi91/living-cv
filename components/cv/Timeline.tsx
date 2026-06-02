'use client';

import { motion } from 'framer-motion';
import { GitCommit, Tag } from 'lucide-react';
import type { Experience } from '@/types/cv';

export function Timeline({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="py-20 px-6" id="experience">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
          <span className="text-hacker-cyan">$</span> git log{' '}
          <span className="text-hacker-green">--graph --oneline</span>
        </h2>
        <p className="text-hacker-cyan/60 font-mono text-sm mb-10">
          {'// work experience as release notes'}
        </p>

        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <ReleaseCard key={exp.id} exp={exp} index={idx} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ReleaseCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="terminal-card rounded-lg overflow-hidden hover:glow-border transition-all"
    >
      <header className="px-5 py-3 border-b border-hacker-green/20 flex flex-wrap items-center gap-3 bg-hacker-bg/40">
        <div className="flex items-center gap-2 font-mono text-sm">
          <GitCommit className="w-4 h-4 text-hacker-green" />
          <span className="text-hacker-green font-semibold">
            release: {exp.id}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Tag className="w-3 h-3 text-hacker-cyan" />
          <span className="px-2 py-0.5 rounded bg-hacker-green/10 text-hacker-green border border-hacker-green/30">
            {exp.version}
          </span>
        </div>
        <div className="ml-auto font-mono text-xs text-hacker-cyan/60">
          {exp.periodShort}
        </div>
      </header>

      <div className="p-5">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <h3 className="font-mono text-xl font-bold text-hacker-fg">
            {exp.position}
          </h3>
          <span className="font-mono text-sm text-hacker-cyan">@</span>
          <span className="font-mono text-lg text-hacker-green">
            {exp.company}
          </span>
        </div>
        <p className="font-mono text-sm text-hacker-cyan/80 mb-4">
          project: {exp.project} • domain: {exp.domain}
        </p>

        <div className="font-mono text-sm space-y-1.5 mb-4">
          <p className="text-hacker-green mb-2">{'// changelog:'}</p>
          {exp.responsibilities.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-hacker-fg/90">
              <span className="text-hacker-cyan flex-shrink-0">+</span>
              <span>{r}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-hacker-green/10">
          {exp.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-xs font-mono rounded bg-hacker-cyan/10 text-hacker-cyan border border-hacker-cyan/30"
            >
              #{t.toLowerCase().replace(/\s+/g, '-')}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
