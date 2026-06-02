'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { SkillGroup } from '@/types/cv';

export function SkillBar({ groups }: { groups: SkillGroup[] }) {
  return (
    <section className="py-20 px-6" id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
          <span className="text-hacker-cyan">$</span> cat{' '}
          <span className="text-hacker-green">skills.json</span>
        </h2>
        <p className="text-hacker-cyan/60 font-mono text-sm mb-10">
          {'// uptime-style metrics — running since 2018'}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((group, idx) => (
            <SkillGroupCard key={group.category} group={group} index={idx} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SkillGroupCard({
  group,
  index,
}: {
  group: SkillGroup;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const avg = Math.round(
    group.skills.reduce((acc, s) => acc + s.level, 0) / group.skills.length
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="terminal-card rounded-lg p-6 hover:glow-border transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-mono text-lg font-bold text-hacker-green">
          {group.category}
        </h3>
        <div className="font-mono text-xs text-right">
          <div className="text-hacker-cyan">UPTIME</div>
          <div className="text-hacker-green font-bold">{avg}%</div>
        </div>
      </div>

      <div className="space-y-3 font-mono text-sm">
        {group.skills.map((skill) => (
          <SkillRow key={skill.name} name={skill.name} level={skill.level} />
        ))}
      </div>
    </motion.div>
  );
}

function SkillRow({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedLevel(Math.round(eased * level));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, level]);

  return (
    <div ref={ref}>
      <div className="flex justify-between mb-1">
        <span className="text-hacker-fg/90">{name}</span>
        <span className="text-hacker-cyan">{animatedLevel}%</span>
      </div>
      <div className="h-2 bg-hacker-bg rounded-full overflow-hidden border border-hacker-green/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${level}%` : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-hacker-green to-hacker-cyan"
        />
      </div>
    </div>
  );
}
