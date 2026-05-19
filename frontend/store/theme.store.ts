import { create } from 'zustand';

interface ThemeStore {
  activeThemeCode: string | null;
  setActiveThemeCode: (code: string | null) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  activeThemeCode: null,
  setActiveThemeCode: (activeThemeCode) => set({ activeThemeCode }),
}));
