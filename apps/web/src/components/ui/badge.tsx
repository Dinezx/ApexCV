import * as React from 'react';
import { cn } from '@/lib/cn';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary',
        className
      )}
      {...props}
    />
  );
}