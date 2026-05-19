import type { StyleSpecification } from 'maplibre-gl';
import type { BasemapId } from '@/types/catalog';

export interface BasemapConfig {
  id: BasemapId;
  labelFr: string;
  labelEn: string;
}

export const BASEMAPS: BasemapConfig[] = [
  { id: 'terrain', labelFr: 'Relief / MNT', labelEn: 'Terrain / DEM' },
  { id: 'satellite', labelFr: 'Satellite', labelEn: 'Satellite' },
  { id: 'light', labelFr: 'Fond clair', labelEn: 'Light base' },
  { id: 'relief', labelFr: 'Relief ombré', labelEn: 'Hillshade' },
  { id: 'print', labelFr: 'Impression', labelEn: 'Print' },
];

export const DEFAULT_BASEMAP: BasemapId = 'terrain';

function rasterSource(tiles: string[], attribution?: string) {
  return {
    type: 'raster' as const,
    tiles,
    tileSize: 256,
    attribution,
  };
}

export function buildBasemapStyle(basemapId: BasemapId): StyleSpecification {
  const sources: StyleSpecification['sources'] = {};
  const layers: StyleSpecification['layers'] = [];

  const addRaster = (id: string, tiles: string[], attribution?: string) => {
    sources[id] = rasterSource(tiles, attribution);
    layers.push({ id, type: 'raster', source: id });
  };

  switch (basemapId) {
    case 'terrain':
      // ArcGIS World Topo : compatible MapLibre (pas de blocage CORS comme OpenTopoMap)
      addRaster(
        'basemap-terrain',
        [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        ],
        '© Esri',
      );
      break;
    case 'satellite':
      addRaster(
        'basemap-satellite',
        [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        '© Esri',
      );
      break;
    case 'relief':
      addRaster(
        'basemap-hillshade',
        [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
        ],
        '© Esri',
      );
      layers.push({
        id: 'basemap-light-overlay',
        type: 'raster',
        source: 'basemap-light-overlay',
        paint: { 'raster-opacity': 0.35 },
      });
      sources['basemap-light-overlay'] = rasterSource(
        ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
        '© CARTO',
      );
      break;
    case 'print':
      layers.push({
        id: 'basemap-print-bg',
        type: 'background',
        paint: { 'background-color': '#f5f5f0' },
      });
      break;
    case 'light':
    default:
      addRaster(
        'basemap-light',
        [
          'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        ],
        '© CARTO',
      );
      break;
  }

  return { version: 8, sources, layers };
}
