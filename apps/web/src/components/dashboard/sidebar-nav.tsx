'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useThemeStore } from '@/store/theme-store';

export function SidebarNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analysis Workspace', href: '/analysis', icon: FileSearch },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[var(--accent)] flex items-center justify-center font-display text-white text-sm font-bold shadow-sm shadow-[var(--accent)]/30">
            A
          </div>
          <span className="font-display font-bold tracking-tight text-text-primary">Resume AI</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-border bg-surface-elevated p-2 text-text-secondary hover:text-text-primary"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-20 items-center gap-2 border-b border-border px-6">
          <div className="h-9 w-9 rounded-xl bg-[var(--accent)] flex items-center justify-center font-display text-white text-base font-bold shadow-md shadow-[var(--accent)]/45">
            A
          </div>
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight leading-none text-text-primary">Resume AI</h2>
            <span className="text-[10px] uppercase tracking-widest text-text-tertiary font-medium">Enterprise SaaS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-[var(--accent)]/20'
                    : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} className={cn('transition-transform duration-200 group-hover:scale-105', isActive ? 'text-white' : 'text-text-tertiary group-hover:text-[var(--accent)]')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-muted/50 p-3">
            <div className="h-9 w-9 rounded-full bg-border/25 flex items-center justify-center text-text-primary font-bold text-sm">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate leading-none text-text-primary">John Doe</p>
              <span className="text-xs text-text-tertiary truncate block mt-0.5">john@example.com</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex-1 rounded-xl border border-border bg-surface-elevated py-2.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link
              href="/login"
              className="rounded-xl border border-border bg-surface-elevated p-2.5 text-text-secondary hover:text-text-primary hover:border-red-500/20 hover:bg-red-500/5 transition-colors flex items-center justify-center"
            >
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
