import type { Map as MapLibreMap } from 'maplibre-gl';
import { circleRing } from '@/lib/map/buffer-circle';
import { USER_LOCATION_BUFFER_KM } from '@/lib/constants';

const POINT_SOURCE = 'user-location-point';
const POINT_LAYER = 'user-location-point';
const BUFFER_FILL = 'user-location-buffer-fill';
const BUFFER_LINE = 'user-location-buffer-line';

function removeIfExists(map: MapLibreMap, layerId: string, sourceId?: string) {
  if (map.getLayer(layerId)) map.removeLayer(layerId);
  const src = sourceId ?? layerId;
  if (map.getSource(src)) map.removeSource(src);
}

export function syncUserLocationOnMap(
  map: MapLibreMap,
  location: [number, number] | null,
  radiusKm = USER_LOCATION_BUFFER_KM,
) {
  removeIfExists(map, POINT_LAYER, POINT_SOURCE);
  removeIfExists(map, BUFFER_FILL);
  removeIfExists(map, BUFFER_LINE);

  if (!location) return;

  const [lng, lat] = location;
  const ring = circleRing(location, radiusKm);

  map.addSource(POINT_SOURCE, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: {},
    },
  });
  map.addLayer({
    id: POINT_LAYER,
    source: POINT_SOURCE,
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': '#2563eb',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });

  map.addSource(BUFFER_FILL, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [ring] },
      properties: {},
    },
  });
  map.addLayer({
    id: BUFFER_FILL,
    type: 'fill',
    source: BUFFER_FILL,
    paint: {
      'fill-color': '#2563eb',
      'fill-opacity': 0.15,
    },
  });

  map.addLayer({
    id: BUFFER_LINE,
    type: 'line',
    source: BUFFER_FILL,
    paint: {
      'line-color': '#2563eb',
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  });
}

export function clearUserLocationOnMap(map: MapLibreMap) {
  syncUserLocationOnMap(map, null);
}
