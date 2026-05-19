import { create } from 'zustand';
import type { Layer } from '@/types/catalog';

export interface LayerRuntimeState {
  visible: boolean;
  opacity: number;
  order: number;
}

interface LayerStore {
  layers: Record<string, LayerRuntimeState>;
  catalog: Layer[];
  themeFilter: string | null;
  searchQuery: string;
  initFromCatalog: (catalog: Layer[]) => void;
  setVisible: (id: string, visible: boolean) => void;
  setOpacity: (id: string, opacity: number) => void;
  toggleVisible: (id: string) => void;
  setThemeFilter: (themeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setOrder: (orderedIds: string[]) => void;
  applyPreset: (layerIds: string[], visible: boolean) => void;
}

export const useLayerStore = create<LayerStore>((set, get) => ({
  layers: {},
  catalog: [],
  themeFilter: null,
  searchQuery: '',

  initFromCatalog: (catalog) => {
    const current = get().layers;
    const layers: Record<string, LayerRuntimeState> = {};
    catalog.forEach((layer, index) => {
      layers[layer.id] = current[layer.id] ?? {
        visible: layer.isVisibleDefault,
        opacity: layer.defaultOpacity,
        order: layer.sortOrder ?? index,
      };
    });
    set({ catalog, layers });
  },

  setVisible: (id, visible) =>
    set((s) => ({
      layers: {
        ...s.layers,
        [id]: {
          visible,
          opacity: s.layers[id]?.opacity ?? 1,
          order: s.layers[id]?.order ?? 0,
        },
      },
    })),

  setOpacity: (id, opacity) =>
    set((s) => ({
      layers: {
        ...s.layers,
        [id]: {
          visible: s.layers[id]?.visible ?? true,
          opacity,
          order: s.layers[id]?.order ?? 0,
        },
      },
    })),

  toggleVisible: (id) =>
    set((s) => ({
      layers: {
        ...s.layers,
        [id]: { ...s.layers[id], visible: !s.layers[id]?.visible },
      },
    })),

  setThemeFilter: (themeFilter) => set({ themeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setOrder: (orderedIds) =>
    set((s) => {
      const layers = { ...s.layers };
      orderedIds.forEach((id, index) => {
        if (layers[id]) layers[id] = { ...layers[id], order: index };
      });
      return { layers };
    }),

  applyPreset: (layerIds, visible) =>
    set((s) => {
      const layers = { ...s.layers };
      for (const id of Object.keys(layers)) {
        layers[id] = { ...layers[id], visible: layerIds.includes(id) ? visible : false };
      }
      for (const id of layerIds) {
        if (layers[id]) layers[id] = { ...layers[id], visible: true };
      }
      return { layers };
    }),
}));
