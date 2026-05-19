import type { BasemapId } from '@/types/catalog';

export interface MapUrlState {
  lng?: number;
  lat?: number;
  zoom?: number;
  basemap?: BasemapId;
  layers?: string[];
}

export function parseMapUrlState(searchParams: URLSearchParams): MapUrlState {
  const lng = searchParams.get('lng');
  const lat = searchParams.get('lat');
  const zoom = searchParams.get('z');
  const basemap = searchParams.get('basemap') as BasemapId | null;
  const layers = searchParams.get('layers');

  return {
    lng: lng ? Number(lng) : undefined,
    lat: lat ? Number(lat) : undefined,
    zoom: zoom ? Number(zoom) : undefined,
    basemap: basemap ?? undefined,
    layers: layers ? layers.split(',').filter(Boolean) : undefined,
  };
}

export function buildMapShareUrl(state: {
  lng: number;
  lat: number;
  zoom: number;
  basemap: BasemapId;
  visibleLayerIds: string[];
}): string {
  if (typeof window === 'undefined') return '/map';
  const url = new URL('/map', window.location.origin);
  url.searchParams.set('lng', state.lng.toFixed(5));
  url.searchParams.set('lat', state.lat.toFixed(5));
  url.searchParams.set('z', state.zoom.toFixed(2));
  url.searchParams.set('basemap', state.basemap);
  if (state.visibleLayerIds.length > 0) {
    url.searchParams.set('layers', state.visibleLayerIds.join(','));
  }
  return url.toString();
}
