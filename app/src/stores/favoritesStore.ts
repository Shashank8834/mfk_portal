'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoriteItem } from '@/types';

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (id: string, type: 'student' | 'school') => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteCount: () => number;
  getFavoritesByType: (type: 'student' | 'school') => FavoriteItem[];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id, type) => {
        const existing = get().favorites.find((f) => f.id === id);
        if (!existing) {
          set((state) => ({
            favorites: [
              ...state.favorites,
              { id, type, savedAt: new Date().toISOString() },
            ],
          }));
        }
      },
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },
      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },
      getFavoriteCount: () => {
        return get().favorites.length;
      },
      getFavoritesByType: (type) => {
        return get().favorites.filter((f) => f.type === type);
      },
    }),
    {
      name: 'mfk-favorites',
    }
  )
);
