import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Mock backend for the assumed-name edit screen. In production this work
 * would be a server mutation; here we persist the child's chosen pseudonym
 * to localStorage so the change survives a reload during a design review.
 *
 * TODO(server): replace with an authenticated PATCH /students/<pnr>/alias
 * once the API exists. The server is the source of truth for both real and
 * assumed names — the client should never trust either field locally.
 */
export type AssumedNameOverride = {
  assumedFirstName: string;
  assumedLastInitial: string;
  updatedAt: string;
};

type Store = {
  byPnr: Record<string, AssumedNameOverride>;
  setOverride: (pnr: string, value: { assumedFirstName: string; assumedLastInitial: string }) => void;
  clear: (pnr: string) => void;
};

export const useStudentOverridesStore = create<Store>()(
  persist(
    (set) => ({
      byPnr: {},
      setOverride: (pnr, value) =>
        set((s) => ({
          byPnr: {
            ...s.byPnr,
            [pnr.toUpperCase()]: { ...value, updatedAt: new Date().toISOString() },
          },
        })),
      clear: (pnr) =>
        set((s) => {
          const next = { ...s.byPnr };
          delete next[pnr.toUpperCase()];
          return { byPnr: next };
        }),
    }),
    { name: 'mfk-student-overrides' },
  ),
);
