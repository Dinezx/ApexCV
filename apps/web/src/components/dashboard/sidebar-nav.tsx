'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analysis Workspace', href: '/analysis', icon: FileSearch },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#030303] px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-display text-white text-sm font-bold">
            A
          </div>
          <span className="font-display font-semibold tracking-tight text-white">Resume AI</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 text-white/50 hover:text-white"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-[#030303] transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-20 items-center gap-2.5 border-b border-white/[0.06] px-6">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-display text-white text-base font-bold shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight leading-none text-white">Resume AI</h2>
            <span className="text-[10px] uppercase tracking-widest text-white/25 font-medium">Enterprise SaaS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-blue-600/10 text-white border border-indigo-500/20'
                    : 'text-white/40 hover:bg-white/[0.03] hover:text-white/70'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} className={cn('transition-all', isActive ? 'text-indigo-400' : 'text-white/25 group-hover:text-indigo-400/60')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate leading-none text-white/80">John Doe</p>
              <span className="text-xs text-white/25 truncate block mt-0.5">john@example.com</span>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 text-xs font-medium text-white/35 hover:text-red-400/80 hover:border-red-500/15 hover:bg-red-500/5 transition-colors w-full"
          >
            <LogOut size={14} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
