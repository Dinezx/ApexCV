import * as React from 'react';
import { cn } from '@/lib/cn';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}