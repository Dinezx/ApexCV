import React, { useId } from 'react';

export function ApexCVLogo({ className = '', iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  const uniqueId = useId().replace(/:/g, '-');
  const wavePurpleId = `wave-purple-${uniqueId}`;
  const waveBlueId = `wave-blue-${uniqueId}`;
  const barGradientId = `bar-gradient-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={wavePurpleId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={waveBlueId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id={barGradientId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          {/* Shadow/Glow filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Vertical Bars */}
        <rect x="30" y="22" width="4" height="12" rx="1.5" fill={`url(#${barGradientId})`} />
        <rect x="37" y="15" width="4" height="19" rx="1.5" fill={`url(#${barGradientId})`} />
        <rect x="44" y="7" width="4" height="27" rx="1.5" fill={`url(#${barGradientId})`} />

        {/* Wavy Ribbon Curves */}
        <path
          d="M 8 42 C 18 24, 28 50, 38 34 C 44 26, 50 20, 54 22"
          stroke={`url(#${wavePurpleId})`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${glowId})`}
        />
        <path
          d="M 12 38 C 21 27, 31 23, 40 37 C 47 44, 52 34, 56 30"
          stroke={`url(#${waveBlueId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-display text-lg font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400">
            ApexCV
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-text-tertiary font-bold mt-1.5">
            AI Resume Analyzer
          </span>
        </div>
      )}
    </div>
  );
}
