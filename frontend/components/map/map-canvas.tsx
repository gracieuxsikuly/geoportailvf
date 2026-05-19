'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { useLayerStore } from '@/store/layer.store';
import { useMapStore } from '@/store/map.store';
import { buildBasemapStyle } from '@/lib/map/basemaps';
import { syncMapLayers } from '@/lib/map/sync-map-layers';
import { fetchWmsFeatureInfo } from '@/lib/map/wms';
import type { Layer } from '@/types/catalog';
import { VIRUNGA_CENTER, VIRUNGA_ZOOM } from '@/lib/constants';

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLon = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const basemapReadyRef = useRef(false);
  const catalog = useLayerStore((s) => s.catalog);
  const layerState = useLayerStore((s) => s.layers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const basemap = useMapStore((s) => s.basemap);
  const measureActive = useMapStore((s) => s.measureActive);
  const measurePoints = useMapStore((s) => s.measurePoints);
  const setView = useMapStore((s) => s.setView);
  const setCursorLngLat = useMapStore((s) => s.setCursorLngLat);
  const setPopup = useMapStore((s) => s.setPopup);
  const addMeasurePoint = useMapStore((s) => s.addMeasurePoint);

  const catalogRef = useRef(catalog);
  const layerStateRef = useRef(layerState);
  catalogRef.current = catalog;
  layerStateRef.current = layerState;

  const runSyncLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    syncMapLayers(map, catalogRef.current, layerStateRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || mapRef.current) return;
      const maplibregl = await import('maplibre-gl');
      if (cancelled) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: buildBasemapStyle(basemap),
        center,
        zoom,
        attributionControl: {},
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
        }),
        'top-right',
      );
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

      map.on('error', () => undefined);

      map.on('moveend', () => {
        const c = map.getCenter();
        setView([c.lng, c.lat], map.getZoom());
      });

      map.on('mousemove', (e) => setCursorLngLat([e.lngLat.lng, e.lngLat.lat]));
      map.on('mouseleave', () => setCursorLngLat(null));

      map.on('click', async (e) => {
        if (measureActive) {
          addMeasurePoint([e.lngLat.lng, e.lngLat.lat]);
          return;
        }

        const cat = catalogRef.current;
        const states = layerStateRef.current;
        const visible = cat.filter((l) => states[l.id]?.visible);

        for (const layer of [...visible].reverse()) {
          const props = await fetchWmsFeatureInfo(
            layer,
            e.lngLat.lng,
            e.lngLat.lat,
            map.getCanvas().width,
            map.getCanvas().height,
          );
          if (props && Object.keys(props).length > 0) {
            setPopup({
              lng: e.lngLat.lng,
              lat: e.lngLat.lat,
              title: layer.titleFr,
              category: layer.themeId,
              fields: formatPopupFields(layer, props),
              layerSlug: layer.slug,
            });
            return;
          }
        }
        setPopup(null);
      });

      map.once('load', () => {
        if (!cancelled) syncMapLayers(map, catalogRef.current, layerStateRef.current);
      });

      mapRef.current = map;
    }

    void init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      basemapReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || catalog.length === 0) return;

    if (map.isStyleLoaded()) {
      runSyncLayers();
    } else {
      map.once('load', runSyncLayers);
    }
  }, [catalog, layerState, runSyncLayers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!basemapReadyRef.current) {
      basemapReadyRef.current = true;
      return;
    }

    const onStyleLoad = () => runSyncLayers();
    map.setStyle(buildBasemapStyle(basemap));
    map.once('style.load', onStyleLoad);

    return () => {
      map.off('style.load', onStyleLoad);
    };
  }, [basemap, runSyncLayers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || measurePoints.length < 2) return;

    const id = 'measure-line';
    const geojson = {
      type: 'Feature' as const,
      geometry: { type: 'LineString' as const, coordinates: measurePoints },
      properties: {},
    };

    try {
      if (map.getSource(id)) {
        (map.getSource(id) as unknown as { setData: (d: unknown) => void }).setData(geojson);
      } else {
        map.addSource(id, { type: 'geojson', data: geojson });
        map.addLayer({
          id,
          type: 'line',
          source: id,
          paint: { 'line-color': '#0e7a3e', 'line-width': 3 },
        });
      }
    } catch {
      /* ignore */
    }
  }, [measurePoints]);

  const measureDistance =
    measurePoints.length >= 2
      ? measurePoints.slice(1).reduce((sum, pt, i) => sum + haversineKm(measurePoints[i], pt), 0)
      : 0;

  return (
    <>
      <div ref={containerRef} className="absolute inset-0" role="application" aria-label="Carte interactive" />
      {measureActive && measurePoints.length >= 2 ? (
        <div className="absolute bottom-20 left-4 rounded-xl border border-stone-200/80 bg-white/95 px-4 py-2.5 text-sm shadow-lg backdrop-blur">
          Distance : <strong>{measureDistance.toFixed(2)} km</strong>
        </div>
      ) : null}
    </>
  );
}

function formatPopupFields(
  layer: Layer,
  props: Record<string, unknown>,
): Array<{ label: string; value: string }> {
  const keys = layer.popupFields?.fields ?? Object.keys(props).slice(0, 5);
  return keys
    .map((key) => {
      const val = props[key];
      if (val == null || val === '') return null;
      return { label: humanizeKey(key), value: String(val) };
    })
    .filter((f): f is { label: string; value: string } => f !== null)
    .slice(0, 6);
}

function humanizeKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
