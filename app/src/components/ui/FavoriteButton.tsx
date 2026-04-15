'use client';

import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  id: string;
  type: 'student' | 'school';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({ id, type, size = 'md', className }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorited = isFavorite(id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(id);
    } else {
      addFavorite(id, type);
    }
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.8 }}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer',
        'hover:bg-bg-elevated/80 backdrop-blur-sm',
        sizes[size],
        className
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.svg
        animate={favorited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 24 24"
        fill={favorited ? '#FB8500' : 'none'}
        stroke={favorited ? '#FB8500' : '#6B6590'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
    </motion.button>
  );
}
