import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  const config = {
    geoserverUrl: 'https://gis.virunga.org/geoserver',
    catalogSource: 'hybrid' as const,
  };
  const geoserver = {
    discoverLayerManifests: jest.fn().mockResolvedValue([
      {
        id: 'virunga-virunga-boundary',
        slug: 'virunga-boundary',
        title: { fr: 'Virunga Boundary', en: 'Virunga Boundary' },
        theme: 'virunga',
        service: {
          type: 'WMS',
          url: 'https://gis.virunga.org/geoserver/virunga/wms',
          wmsUrl: 'https://gis.virunga.org/geoserver/virunga/wms',
          wfsUrl: 'https://gis.virunga.org/geoserver/virunga/ows?service=WFS',
          wmtsUrl: 'https://gis.virunga.org/geoserver/gwc/service/wmts',
          workspace: 'virunga',
          layer: 'virunga:virunga_boundary',
          style: 'virunga_boundary',
        },
        metadata: {
          descriptionFr: 'Discovered from GeoServer',
          descriptionEn: 'Discovered from GeoServer',
          keywords: ['boundary'],
        },
        sensitivity: 'public',
      },
      {
        id: 'virunga-roads-network',
        slug: 'roads-network',
        title: { fr: 'Roads Network', en: 'Roads Network' },
        theme: 'transport',
        service: {
          type: 'WMS',
          url: 'https://gis.virunga.org/geoserver/virunga/wms',
          wmsUrl: 'https://gis.virunga.org/geoserver/virunga/wms',
          wfsUrl: 'https://gis.virunga.org/geoserver/virunga/ows?service=WFS',
          wmtsUrl: 'https://gis.virunga.org/geoserver/gwc/service/wmts',
          workspace: 'virunga',
          layer: 'virunga:roads_network',
          style: 'roads_network',
        },
        metadata: {
          keywords: ['roads'],
        },
        sensitivity: 'public',
      },
    ]),
  };

  it('imports layers from GeoServer and applies local overrides into the frontend contract', async () => {
    const service = new CatalogService(config as never, geoserver as never);

    const snapshot = await service.refreshCatalog('manual');

    const overriddenLayer = snapshot.layers.find((layer) => layer.layerName === 'virunga:virunga_boundary');
    const discoveredLayer = snapshot.layers.find((layer) => layer.layerName === 'virunga:roads_network');

    expect(snapshot.total).toBeGreaterThanOrEqual(2);
    expect(overriddenLayer).toMatchObject({
      id: 'virunga-boundary',
      slug: 'limite-parc-virunga',
      serviceType: 'WMS',
      sensitivityLevel: 'public',
      services: {
        wms: expect.stringContaining('https://gis.virunga.org/geoserver'),
        wfs: expect.stringContaining('service=WFS'),
        legend: expect.stringContaining('GetLegendGraphic'),
      },
    });
    expect(overriddenLayer?.metadata).not.toHaveProperty('contactEmail');
    expect(discoveredLayer).toMatchObject({
      id: 'virunga-roads-network',
      slug: 'roads-network',
      themeId: 'transport',
    });
    expect(snapshot.themes[0].layerCount).toBeGreaterThanOrEqual(1);
  });
});
