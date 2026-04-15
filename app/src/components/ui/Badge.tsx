'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'primary' | 'mint' | 'gold' | 'orange' | 'muted';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', size = 'sm', children, className }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/15 text-primary border-primary/25',
    mint: 'bg-mint/15 text-mint border-mint/25',
    gold: 'bg-gold/15 text-gold border-gold/25',
    orange: 'bg-orange/15 text-orange border-orange/25',
    muted: 'bg-bg-elevated text-text-muted border-border',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
