import { create } from 'zustand';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { BasemapId } from '@/types/catalog';
import { DEFAULT_BASEMAP } from '@/lib/map/basemaps';
import { VIRUNGA_CENTER, VIRUNGA_ZOOM } from '@/lib/constants';

export type MeasureMode = 'line' | 'area';

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
  mapInstance: MapLibreMap | null;
  measureMode: MeasureMode | null;
  measurePoints: [number, number][];
  measureFinished: boolean;
  userLocation: [number, number] | null;
  setMapInstance: (map: MapLibreMap | null) => void;
  setUserLocation: (location: [number, number] | null) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setView: (center: [number, number], zoom: number) => void;
  setBasemap: (basemap: BasemapId) => void;
  setCursorLngLat: (coords: [number, number] | null) => void;
  setPopup: (popup: PopupState | null) => void;
  setMeasureMode: (mode: MeasureMode | null) => void;
  addMeasurePoint: (point: [number, number]) => void;
  clearMeasure: () => void;
  finishMeasure: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: VIRUNGA_CENTER,
  zoom: VIRUNGA_ZOOM,
  basemap: DEFAULT_BASEMAP,
  cursorLngLat: null,
  popup: null,
  mapInstance: null,
  measureMode: null,
  measurePoints: [],
  measureFinished: false,
  userLocation: null,
  setMapInstance: (mapInstance) => set({ mapInstance }),
  setUserLocation: (userLocation) => set({ userLocation }),
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setView: (center, zoom) => set({ center, zoom }),
  setBasemap: (basemap) => set({ basemap }),
  setCursorLngLat: (cursorLngLat) => set({ cursorLngLat }),
  setPopup: (popup) => set({ popup }),
  setMeasureMode: (measureMode) =>
    set({ measureMode, measurePoints: [], measureFinished: false }),
  addMeasurePoint: (point) =>
    set((s) => {
      if (s.measureFinished) {
        return { measurePoints: [point], measureFinished: false };
      }
      return { measurePoints: [...s.measurePoints, point] };
    }),
  clearMeasure: () => set({ measurePoints: [], measureFinished: false }),
  finishMeasure: () => set({ measureFinished: true }),
}));
