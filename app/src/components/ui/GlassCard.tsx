'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  elevated = false,
  hover = true,
  glow = false,
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        elevated ? 'glass-elevated' : 'glass',
        hover && 'card-hover-glow glass-hover-border',
        glow && 'primary-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
