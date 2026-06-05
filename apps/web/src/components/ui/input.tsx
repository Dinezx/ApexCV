import * as React from 'react';
import { cn } from '@/lib/cn';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-border bg-surface-elevated px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-[color:var(--accent)] focus:outline-none',
        className
      )}
      {...props}
    />
  );
}