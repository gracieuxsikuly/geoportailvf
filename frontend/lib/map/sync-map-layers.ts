import type { Map as MapLibreMap, RasterSourceSpecification } from 'maplibre-gl';
import type { Layer } from '@/types/catalog';
import type { LayerRuntimeState } from '@/store/layer.store';
import { buildWmsTileUrl, layerMapId, layerSourceId } from './wms';

export function syncMapLayers(
  map: MapLibreMap,
  catalog: Layer[],
  layerState: Record<string, LayerRuntimeState>,
): void {
  if (!map.isStyleLoaded()) return;

  const sorted = [...catalog].sort(
    (a, b) => (layerState[a.id]?.order ?? 0) - (layerState[b.id]?.order ?? 0),
  );

  for (const layer of sorted) {
    const sourceId = layerSourceId(layer.slug);
    const mapLayerId = layerMapId(layer.slug);
    const state = layerState[layer.id];
    const z = map.getZoom();

    try {
      if (state && (z < layer.minZoom || z > layer.maxZoom)) {
        if (map.getLayer(mapLayerId)) {
          map.setLayoutProperty(mapLayerId, 'visibility', 'none');
        }
        continue;
      }

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'raster',
          tiles: [buildWmsTileUrl(layer)],
          tileSize: 256,
        } satisfies RasterSourceSpecification);
      }

      if (!map.getLayer(mapLayerId)) {
        map.addLayer({
          id: mapLayerId,
          type: 'raster',
          source: sourceId,
          paint: { 'raster-opacity': state?.opacity ?? layer.defaultOpacity },
          layout: { visibility: state?.visible ? 'visible' : 'none' },
        });
      } else {
        map.setLayoutProperty(mapLayerId, 'visibility', state?.visible ? 'visible' : 'none');
        map.setPaintProperty(mapLayerId, 'raster-opacity', state?.opacity ?? layer.defaultOpacity);
      }
    } catch {
      /* style en rechargement */
    }
  }
}
