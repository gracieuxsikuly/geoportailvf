import { create } from 'zustand';
import type { BasemapId } from '@/types/catalog';
import { DEFAULT_BASEMAP } from '@/lib/map/basemaps';
import { VIRUNGA_CENTER, VIRUNGA_ZOOM } from '@/lib/constants';

export interface PopupState {
  lng: number;
  lat: number;
  title: string;
  category?: string;
  fields: Array<{ label: string; value: string }>;
  layerSlug?: string;
}

interface MapStore {
  center: [number, number];
  zoom: number;
  basemap: BasemapId;
  cursorLngLat: [number, number] | null;
  popup: PopupState | null;
  measureActive: boolean;
  measurePoints: [number, number][];
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setView: (center: [number, number], zoom: number) => void;
  setBasemap: (basemap: BasemapId) => void;
  setCursorLngLat: (coords: [number, number] | null) => void;
  setPopup: (popup: PopupState | null) => void;
  setMeasureActive: (active: boolean) => void;
  addMeasurePoint: (point: [number, number]) => void;
  clearMeasure: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: VIRUNGA_CENTER,
  zoom: VIRUNGA_ZOOM,
  basemap: DEFAULT_BASEMAP,
  cursorLngLat: null,
  popup: null,
  measureActive: false,
  measurePoints: [],
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setView: (center, zoom) => set({ center, zoom }),
  setBasemap: (basemap) => set({ basemap }),
  setCursorLngLat: (cursorLngLat) => set({ cursorLngLat }),
  setPopup: (popup) => set({ popup }),
  setMeasureActive: (measureActive) => set({ measureActive, measurePoints: [] }),
  addMeasurePoint: (point) =>
    set((s) => ({ measurePoints: [...s.measurePoints, point] })),
  clearMeasure: () => set({ measurePoints: [] }),
}));
