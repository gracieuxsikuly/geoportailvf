'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapLibreMap, RasterSourceSpecification, StyleSpecification } from 'maplibre-gl';
import { layersService, type LayerDto } from '@/services/layers.service';

const VIRUNGA_CENTER: [number, number] = [29.45, -0.9];
const VIRUNGA_ZOOM = 8;

interface LayerViewState {
  visible: boolean;
  opacity: number;
}

type LayerStateMap = Record<string, LayerViewState>;

const BASE_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'virunga-background',
      type: 'background',
      paint: {
        'background-color': '#e8efe5',
      },
    },
  ],
};

function layerSourceId(layer: LayerDto): string {
  return `wms-source-${layer.slug}`;
}

function layerMapId(layer: LayerDto): string {
  return `wms-layer-${layer.slug}`;
}

function buildWmsUrl(layer: LayerDto): string {
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    layers: layer.layerName,
    styles: layer.styleName ?? '',
    format: 'image/png',
    transparent: 'true',
    srs: 'EPSG:3857',
    width: '256',
    height: '256',
    bbox: '{bbox-epsg-3857}',
  });

  return `${layer.geoserverUrl}?${params.toString()}`;
}

export function MapExplorer() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [layers, setLayers] = useState<LayerDto[]>([]);
  const [layerState, setLayerState] = useState<LayerStateMap>({});
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLayers() {
      try {
        setIsLoading(true);
        const data = await layersService.list();
        if (cancelled) {
          return;
        }

        setLayers(data);
        setLayerState((current) => {
          if (Object.keys(current).length > 0) {
            return current;
          }

          return data.reduce<LayerStateMap>((accumulator, layer) => {
            accumulator[layer.id] = {
              visible: layer.isVisibleDefault,
              opacity: layer.defaultOpacity,
            };
            return accumulator;
          }, {});
        });
        setErrorMessage(null);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage('Impossible de charger le catalogue des couches.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLayers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function initMap() {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      const maplibregl = await import('maplibre-gl');
      if (!active || !mapContainerRef.current) {
        return;
      }

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: BASE_STYLE,
        center: VIRUNGA_CENTER,
        zoom: VIRUNGA_ZOOM,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.on('load', () => {
        setIsMapReady(true);
      });

      mapRef.current = map;
    }

    void initMap();

    return () => {
      active = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) {
      return;
    }

    for (const layer of layers) {
      const sourceId = layerSourceId(layer);
      const mapLayerId = layerMapId(layer);

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'raster',
          tiles: [buildWmsUrl(layer)],
          tileSize: 256,
        } satisfies RasterSourceSpecification);
      }

      if (!map.getLayer(mapLayerId)) {
        map.addLayer({
          id: mapLayerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': layerState[layer.id]?.opacity ?? layer.defaultOpacity,
          },
          layout: {
            visibility: layerState[layer.id]?.visible ? 'visible' : 'none',
          },
        });
      }
    }
  }, [isMapReady, layerState, layers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) {
      return;
    }

    for (const layer of layers) {
      const mapLayerId = layerMapId(layer);
      const state = layerState[layer.id];
      if (!state || !map.getLayer(mapLayerId)) {
        continue;
      }

      map.setLayoutProperty(mapLayerId, 'visibility', state.visible ? 'visible' : 'none');
      map.setPaintProperty(mapLayerId, 'raster-opacity', state.opacity);
    }
  }, [isMapReady, layerState, layers]);

  const sortedLayers = useMemo(
    () => [...layers].sort((left, right) => left.sortOrder - right.sortOrder),
    [layers],
  );

  function setLayerVisibility(layerId: string, visible: boolean) {
    setLayerState((current) => ({
      ...current,
      [layerId]: {
        ...(current[layerId] ?? { visible: false, opacity: 1 }),
        visible,
      },
    }));
  }

  function setLayerOpacity(layerId: string, opacity: number) {
    setLayerState((current) => ({
      ...current,
      [layerId]: {
        ...(current[layerId] ?? { visible: true, opacity: 1 }),
        opacity,
      },
    }));
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-stone-100 lg:grid-cols-[360px_1fr]">
      <aside className="border-b border-stone-200 bg-white p-6 lg:border-b-0 lg:border-r">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Virunga WebGIS
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">Carte interactive</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Les couches sont chargées via GeoServer et pilotées par le backend NestJS à partir des
            manifests du portail.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
          <p>
            Endpoint catalogue : <span className="font-mono">/api/v1/layers</span>
          </p>
          <p className="mt-2">
            GeoServer : <span className="font-mono">https://gis.virunga.org/geoserver</span>
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Couches disponibles
          </h2>

          {isLoading ? (
            <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500">
              Chargement du catalogue...
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {!isLoading && !errorMessage && sortedLayers.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500">
              Aucun manifest disponible.
            </div>
          ) : null}

          <div className="mt-4 space-y-4">
            {sortedLayers.map((layer) => {
              const state = layerState[layer.id] ?? {
                visible: layer.isVisibleDefault,
                opacity: layer.defaultOpacity,
              };

              return (
                <article key={layer.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-stone-900">{layer.titleFr}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">
                        {layer.serviceType} · {layer.workspace}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={state.visible}
                        onChange={(event) => setLayerVisibility(layer.id, event.target.checked)}
                      />
                      Visible
                    </label>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Opacité</span>
                      <span>{Math.round(state.opacity * 100)}%</span>
                    </div>
                    <input
                      className="mt-2 w-full accent-emerald-700"
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={state.opacity}
                      onChange={(event) => setLayerOpacity(layer.id, Number(event.target.value))}
                    />
                  </div>

                  <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-stone-600">
                    <div>
                      <dt className="font-medium text-stone-800">Couche GeoServer</dt>
                      <dd className="font-mono text-xs">{layer.layerName}</dd>
                    </div>
                    {layer.metadata?.sourceOrg ? (
                      <div>
                        <dt className="font-medium text-stone-800">Source</dt>
                        <dd>{layer.metadata.sourceOrg}</dd>
                      </div>
                    ) : null}
                    {layer.metadata?.license ? (
                      <div>
                        <dt className="font-medium text-stone-800">Licence</dt>
                        <dd>{layer.metadata.license}</dd>
                      </div>
                    ) : null}
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="relative min-h-[65vh] bg-stone-200 lg:min-h-screen">
        <div ref={mapContainerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-white/90 px-4 py-3 text-xs text-stone-700 shadow-sm backdrop-blur">
          Centre initial : Virunga · WMS GeoServer
        </div>
      </section>
    </main>
  );
}