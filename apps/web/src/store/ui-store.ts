import { create } from 'zustand';

type UIState = {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
}));