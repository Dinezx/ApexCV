import * as React from 'react';
import { cn } from '@/lib/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  asChild?: boolean;
};

const variants = {
  primary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]',
  secondary: 'border border-white/[0.12] bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.18]',
  ghost: 'text-white/70 hover:bg-white/[0.06] hover:text-white',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
};

export function Button({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    sizes[size],
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;

    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
      ...props,
    });
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}