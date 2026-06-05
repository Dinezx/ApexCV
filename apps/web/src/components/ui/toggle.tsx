import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export function Toggle({ className, pressed, ...props }: ToggleProps) {
  return (
    <button
      aria-pressed={pressed}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-primary transition-all hover:border-[color:var(--accent)]',
        className
      )}
      {...props}
    >
      {pressed ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}