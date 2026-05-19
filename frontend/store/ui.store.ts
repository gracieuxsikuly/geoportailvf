import { create } from 'zustand';
import type { AppLocale } from '@/lib/i18n/locale';
import { DEFAULT_LOCALE, setLocaleCookie } from '@/lib/i18n/locale';

type Panel = 'layers' | 'legend' | 'search' | 'share' | null;

interface UiStore {
  sidebarOpen: boolean;
  mobileDrawerOpen: boolean;
  activePanel: Panel;
  locale: AppLocale;
  setSidebarOpen: (open: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setActivePanel: (panel: Panel) => void;
  togglePanel: (panel: Panel) => void;
  setLocale: (locale: AppLocale) => void;
}

/** Aligne le store sur la locale lue côté serveur (cookie) avant le rendu des enfants */
export function syncUiStoreLocale(locale: AppLocale): void {
  useUiStore.setState({ locale });
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  mobileDrawerOpen: false,
  activePanel: 'layers',
  locale: DEFAULT_LOCALE,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setMobileDrawerOpen: (mobileDrawerOpen) => set({ mobileDrawerOpen }),
  setActivePanel: (activePanel) => set({ activePanel }),
  togglePanel: (panel) =>
    set((s) => ({ activePanel: s.activePanel === panel ? null : panel })),
  setLocale: (locale) => {
    setLocaleCookie(locale);
    set({ locale });
  },
}));
