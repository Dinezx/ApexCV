'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

type PaletteAction = {
  id: string;
  label: string;
  shortcut: string;
  action: () => void;
};

export function CommandPalette({ onToggleTheme }: { onToggleTheme: () => void }) {
  const { paletteOpen, setPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paletteOpen, setPaletteOpen]);

  const actions = useMemo<PaletteAction[]>(
    () => [
      { id: 'theme', label: 'Toggle theme', shortcut: 'T', action: onToggleTheme },
      { id: 'upload', label: 'Jump to upload area', shortcut: 'U', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { id: 'insights', label: 'Go to AI insights', shortcut: 'I', action: () => window.scrollTo({ top: 640, behavior: 'smooth' }) },
    ],
    [onToggleTheme]
  );

  const filtered = actions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  if (!paletteOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/45 px-4 pt-24 backdrop-blur-sm" onClick={() => setPaletteOpen(false)}>
      <div className="w-full max-w-2xl rounded-[28px] border border-border bg-surface shadow-glow" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={16} className="text-text-tertiary" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a command"
            className="h-9 w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
          />
          <button type="button" className="rounded-lg p-1 text-text-tertiary hover:bg-surface-muted" onClick={() => setPaletteOpen(false)}>
            <X size={16} />
          </button>
        </div>
        <div className="grid gap-2 p-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex items-center justify-between rounded-2xl border border-transparent bg-surface-muted px-3 py-3 text-left text-sm text-text-secondary transition hover:border-border hover:text-text-primary"
              onClick={() => {
                item.action();
                setPaletteOpen(false);
              }}
            >
              <span>{item.label}</span>
              <span className="rounded-md border border-border px-2 py-0.5 text-xs text-text-tertiary">{item.shortcut}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
