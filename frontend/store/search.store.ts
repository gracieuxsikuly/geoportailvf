import { create } from 'zustand';

export interface SearchResult {
  id: string;
  type: 'layer' | 'theme' | 'place';
  labelFr: string;
  labelEn: string;
  href?: string;
  center?: [number, number];
  zoom?: number;
}

interface SearchStore {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  results: [],
  isOpen: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setOpen: (isOpen) => set({ isOpen }),
  clear: () => set({ query: '', results: [], isOpen: false }),
}));
