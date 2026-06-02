'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function PrintButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/export-pdf', { method: 'GET' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV_Ihor_Metelskyi.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Download failed';
      setError(msg);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleDownload}
      disabled={loading}
      className="h-12 w-12 rounded-full bg-hacker-bg/80 backdrop-blur border border-hacker-cyan/30 flex items-center justify-center text-hacker-cyan hover:border-hacker-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
      aria-label="Download CV as PDF"
      title={error || 'Download CV as PDF'}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
    </motion.button>
  );
}
