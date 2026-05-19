'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { buildBasemapStyle } from '@/lib/map/basemaps';
import { buildWmsTileUrl, layerMapId, layerSourceId } from '@/lib/map/wms';
import { useLayers } from '@/hooks/use-catalog';
import { VIRUNGA_CENTER, VIRUNGA_ZOOM } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Layer } from '@/types/catalog';

function addLayersToMap(map: MapLibreMap, selected: Layer[]) {
  if (!map.isStyleLoaded()) return;
  for (const layer of selected) {
    const sid = layerSourceId(layer.slug);
    const lid = layerMapId(layer.slug);
    try {
      if (!map.getSource(sid)) {
        map.addSource(sid, {
          type: 'raster',
          tiles: [buildWmsTileUrl(layer)],
          tileSize: 256,
        });
      }
      if (!map.getLayer(lid)) {
        map.addLayer({
          id: lid,
          type: 'raster',
          source: sid,
          paint: { 'raster-opacity': layer.defaultOpacity },
        });
      }
    } catch {
      /* carte détruite entre-temps */
    }
  }
}

export function ThemeMiniMap({
  layerSlugs,
  zoom = VIRUNGA_ZOOM,
  className,
}: {
  layerSlugs: string[];
  zoom?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const { data: catalogLayers } = useLayers();

  const selected =
    catalogLayers?.filter((l) => layerSlugs.includes(l.slug)) ?? [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function init() {
      const maplibregl = await import('maplibre-gl');
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: buildBasemapStyle('terrain'),
        center: VIRUNGA_CENTER,
        zoom,
        interactive: false,
        attributionControl: false,
      });

      mapRef.current = map;

      map.once('load', () => {
        if (cancelled || mapRef.current !== map) return;
      });
    }

    void init();

    return () => {
      cancelled = true;
      const map = mapRef.current;
      if (map) {
        mapRef.current = null;
        map.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || selected.length === 0) return;

    if (map.isStyleLoaded()) {
      addLayersToMap(map, selected);
    } else {
      map.once('load', () => addLayersToMap(map, selected));
    }
  }, [selected]);

  return <div ref={containerRef} className={cn('min-h-[200px] bg-stone-100', className)} />;
}
