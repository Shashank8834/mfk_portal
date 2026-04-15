'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary cursor-pointer select-none';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-glow hover:shadow-[0_0_30px_rgba(91,77,177,0.3)] active:scale-[0.98]',
    secondary:
      'bg-bg-elevated text-text-primary border border-border hover:border-primary hover:text-primary active:scale-[0.98]',
    ghost:
      'bg-transparent text-text-muted hover:text-primary hover:bg-bg-elevated/50 active:scale-[0.98]',
    outline:
      'bg-transparent text-primary border border-primary/40 hover:bg-primary/10 hover:border-primary active:scale-[0.98]',
    gold:
      'bg-gold text-white hover:bg-orange hover:shadow-[0_0_30px_rgba(255,183,3,0.3)] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className, {
        'opacity-50 cursor-not-allowed': disabled || isLoading,
      })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
