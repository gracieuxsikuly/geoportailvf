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

const MEASURE_LINE_ID = 'measure-line';
const MEASURE_FILL_ID = 'measure-fill';
const MEASURE_POINTS_ID = 'measure-points';

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const basemapReadyRef = useRef(false);
  const catalog = useLayerStore((s) => s.catalog);
  const layerState = useLayerStore((s) => s.layers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const basemap = useMapStore((s) => s.basemap);
  const measureMode = useMapStore((s) => s.measureMode);
  const measurePoints = useMapStore((s) => s.measurePoints);
  const measureFinished = useMapStore((s) => s.measureFinished);
  const setMapInstance = useMapStore((s) => s.setMapInstance);
  const setView = useMapStore((s) => s.setView);
  const setCursorLngLat = useMapStore((s) => s.setCursorLngLat);
  const setPopup = useMapStore((s) => s.setPopup);
  const addMeasurePoint = useMapStore((s) => s.addMeasurePoint);

  const catalogRef = useRef(catalog);
  const layerStateRef = useRef(layerState);
  const measureModeRef = useRef(measureMode);
  const measureFinishedRef = useRef(false);
  catalogRef.current = catalog;
  layerStateRef.current = layerState;
  measureModeRef.current = measureMode;
  measureFinishedRef.current = measureFinished;

  const runSyncLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    syncMapLayers(map, catalogRef.current, layerStateRef.current);
  }, []);

  const syncMeasureLayers = useCallback((map: MapLibreMap, points: [number, number][]) => {
    const removeLayer = (id: string) => {
      if (map.getLayer(id)) map.removeLayer(id);
    };
    const removeSource = (id: string) => {
      if (map.getSource(id)) map.removeSource(id);
    };

    removeLayer(MEASURE_LINE_ID);
    removeLayer(MEASURE_FILL_ID);
    removeLayer(MEASURE_POINTS_ID);
    removeSource(MEASURE_LINE_ID);
    removeSource(MEASURE_FILL_ID);
    removeSource(MEASURE_POINTS_ID);

    if (points.length === 0) return;

    const pointFeatures = points.map((p, i) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: p },
      properties: { index: i + 1 },
    }));

    map.addSource(MEASURE_POINTS_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: pointFeatures },
    });
    map.addLayer({
      id: MEASURE_POINTS_ID,
      type: 'circle',
      source: MEASURE_POINTS_ID,
      paint: {
        'circle-radius': 6,
        'circle-color': '#0e7a3e',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    });

    if (points.length >= 2) {
      map.addSource(MEASURE_LINE_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: points },
          properties: {},
        },
      });
      map.addLayer({
        id: MEASURE_LINE_ID,
        type: 'line',
        source: MEASURE_LINE_ID,
        paint: { 'line-color': '#0e7a3e', 'line-width': 3 },
      });
    }

    const mode = measureModeRef.current;
    if (mode === 'area' && points.length >= 3) {
      const ring = [...points, points[0]];
      map.addSource(MEASURE_FILL_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [ring] },
          properties: {},
        },
      });
      map.addLayer(
        {
          id: MEASURE_FILL_ID,
          type: 'fill',
          source: MEASURE_FILL_ID,
          paint: { 'fill-color': '#0e7a3e', 'fill-opacity': 0.2 },
        },
        MEASURE_LINE_ID,
      );
    }
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

      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

      map.getCanvas().style.cursor = '';

      map.on('error', () => undefined);

      map.on('moveend', () => {
        const c = map.getCenter();
        setView([c.lng, c.lat], map.getZoom());
      });

      map.on('mousemove', (e) => setCursorLngLat([e.lngLat.lng, e.lngLat.lat]));
      map.on('mouseleave', () => setCursorLngLat(null));

      map.on('click', async (e) => {
        if (measureModeRef.current) {
          if (measureFinishedRef.current) return;
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
      setMapInstance(map);
    }

    void init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      basemapReadyRef.current = false;
      setMapInstance(null);
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
    if (!map) return;

    map.getCanvas().style.cursor = measureMode ? 'crosshair' : '';

    if (!measureMode) {
      try {
        syncMeasureLayers(map, []);
      } catch {
        /* style may be loading */
      }
      return;
    }

    const draw = () => {
      try {
        syncMeasureLayers(map, measurePoints);
      } catch {
        map.once('idle', () => syncMeasureLayers(map, measurePoints));
      }
    };

    if (map.isStyleLoaded()) draw();
    else map.once('load', draw);
  }, [measureMode, measurePoints, syncMeasureLayers]);

  return (
    <div ref={containerRef} className="absolute inset-0" role="application" aria-label="Carte interactive" />
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
