import * as React from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-border bg-surface-elevated p-6 shadow-[0_20px_60px_rgba(3,10,31,0.25)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_24px_70px_rgba(59,130,246,0.15)]',
        className
      )}
      {...props}
    />
  );
}