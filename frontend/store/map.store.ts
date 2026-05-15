import { create } from 'zustand';

interface MapLayerState {
  id: string;
  visible: boolean;
  opacity: number;
}

interface MapStore {
  layers: Record<string, MapLayerState>;
  setVisible: (id: string, visible: boolean) => void;
  setOpacity: (id: string, opacity: number) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  layers: {},
  setVisible: (id, visible) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...(s.layers[id] ?? { id, opacity: 1 }), visible } },
    })),
  setOpacity: (id, opacity) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...(s.layers[id] ?? { id, visible: true }), opacity } },
    })),
}));
