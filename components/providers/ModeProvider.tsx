'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ViewMode } from '@/types/cv';

interface ModeContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  toggle: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = 'cv-view-mode';

function getInitialMode(): ViewMode {
  if (typeof window === 'undefined') return 'hacker';
  const stored = window.localStorage.getItem(STORAGE_KEY) as ViewMode | null;
  if (stored === 'classic' || stored === 'hacker') return stored;
  return 'hacker';
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>('hacker');

  useEffect(() => {
    setModeState(getInitialMode());
  }, []);

  const setMode = useCallback((m: ViewMode) => {
    setModeState(m);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, m);
    }
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'hacker' ? 'classic' : 'hacker';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
