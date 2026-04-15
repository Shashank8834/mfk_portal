'use client';

import { create } from 'zustand';
import { type Locale, getSavedLocale, saveLocale } from '@/lib/i18n';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en',
  setLocale: (locale) => {
    saveLocale(locale);
    set({ locale });
  },
}));

// Hydrate from localStorage on client
if (typeof window !== 'undefined') {
  useLocaleStore.setState({ locale: getSavedLocale() });
}
