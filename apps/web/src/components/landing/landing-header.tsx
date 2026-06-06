'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/theme-store';
import { ApexCVLogo } from '@/components/ui/logo';

export function LandingHeader() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <ApexCVLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'How it Works', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/[0.04]"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] transition-all duration-300"
          >
            Get Started <Sparkles size={13} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 text-white/60 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/[0.06] bg-[#030303]/95 backdrop-blur-xl px-4 py-4 space-y-2"
          >
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-3 text-sm text-white/60 hover:text-white rounded-xl hover:bg-white/[0.04] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="border-t border-white/[0.06] pt-3 flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm text-white/60 rounded-xl border border-white/[0.08] hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="flex-1 text-center py-2.5 text-sm text-white font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
