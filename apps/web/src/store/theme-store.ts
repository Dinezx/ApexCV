import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/lib/types';

type ThemeState = {
  theme: ThemeMode;
  hydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      hydrated: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'resume-analyser-theme',
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);