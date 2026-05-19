import type { Layer } from '@/types/catalog';
import { toProxiedGeoserverUrl, wmsProxyBase } from './geoserver-url';

export function layerSourceId(slug: string): string {
  return `wms-source-${slug}`;
}

export function layerMapId(slug: string): string {
  return `wms-layer-${slug}`;
}

export function buildWmsTileUrl(layer: Layer): string {
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
  const base = toProxiedGeoserverUrl(layer.geoserverUrl || wmsProxyBase());
  return `${base}?${params.toString()}`;
}

export function buildLegendUrl(layer: Layer): string | null {
  if (layer.metadata?.legendUrl) return layer.metadata.legendUrl;
  const base = toProxiedGeoserverUrl(
    layer.geoserverUrl.replace(/\/wms\/?$/i, '/wms'),
  );
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetLegendGraphic',
    format: 'image/png',
    layer: layer.layerName,
    style: layer.styleName ?? '',
  });
  return `${base}?${params.toString()}`;
}

export async function fetchWmsFeatureInfo(
  layer: Layer,
  lng: number,
  lat: number,
  mapWidth: number,
  mapHeight: number,
): Promise<Record<string, unknown> | null> {
  const half = 0.0005;
  const bbox = [lng - half, lat - half, lng + half, lat + half].join(',');
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetFeatureInfo',
    layers: layer.layerName,
    query_layers: layer.layerName,
    styles: layer.styleName ?? '',
    bbox,
    width: String(mapWidth),
    height: String(mapHeight),
    srs: 'EPSG:4326',
    x: String(Math.floor(mapWidth / 2)),
    y: String(Math.floor(mapHeight / 2)),
    info_format: 'application/json',
    feature_count: '5',
  });

  try {
    const base = toProxiedGeoserverUrl(layer.geoserverUrl || wmsProxyBase());
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { features?: Array<{ properties?: Record<string, unknown> }> };
    const props = data.features?.[0]?.properties;
    return props ?? null;
  } catch {
    return null;
  }
}
