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
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition-all hover:border-white/[0.15] hover:text-white hover:bg-white/[0.06]',
        className
      )}
      {...props}
    >
      {pressed ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}