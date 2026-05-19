export const VIRUNGA_CENTER: [number, number] = [29.45, -0.9];
export const VIRUNGA_ZOOM = 8;
export const VIRUNGA_BOUNDS: [[number, number], [number, number]] = [
  [28.4, -2.0],
  [30.5, 0.2],
];

export const GEOSERVER_URL =
  process.env.NEXT_PUBLIC_GEOSERVER_URL ?? 'https://gis.virunga.org/geoserver';

export const DEMO_LAYERS = [
  {
    id: 'virunga-boundary',
    slug: 'limite-parc-virunga',
    titleFr: 'Limite du Parc National des Virunga',
    titleEn: 'Virunga National Park Boundary',
    themeId: 'limites-administratives',
    serviceType: 'WMS',
    geoserverUrl: `${GEOSERVER_URL}/wms`,
    workspace: 'virunga',
    layerName: 'virunga:virunga_boundary',
    styleName: 'virunga_boundary',
    defaultOpacity: 0.85,
    minZoom: 5,
    maxZoom: 18,
    isVisibleDefault: true,
    isPublic: true,
    sortOrder: 0,
    sensitivityLevel: 'public' as const,
    popupFields: { fields: ['name', 'area_km2'] },
    metadata: {
      id: 'metadata-virunga-boundary',
      layerId: 'virunga-boundary',
      sourceOrg: 'ICCN / Virunga Fondation',
      updateDate: '2023-12-01',
      license: 'CC-BY-NC 4.0',
      qualityLevel: 4,
      keywords: ['limites', 'parc'],
    },
  },
];
