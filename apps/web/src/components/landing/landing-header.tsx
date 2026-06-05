'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Toggle } from '../ui/toggle';
import { useThemeStore } from '@/store/theme-store';

export function LandingHeader() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[var(--accent)] flex items-center justify-center font-display text-white text-base font-bold shadow-md shadow-[var(--accent)]/30">
              A
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">Resume AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link href="/dashboard" className="hover:text-text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/analysis" className="hover:text-text-primary transition-colors">
              Analysis Workspace
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Toggle pressed={theme === 'light'} onClick={toggleTheme} aria-label="Toggle theme" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup" className="flex items-center gap-1.5">
              Get Started <Sparkles size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
