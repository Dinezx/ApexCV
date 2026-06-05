import * as React from 'react';
import { cn } from '@/lib/cn';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/60',
        className
      )}
      {...props}
    />
  );
}