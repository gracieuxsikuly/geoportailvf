import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  const config = {
    geoserverUrl: 'https://gis.virunga.org/geoserver',
    catalogSource: 'hybrid' as const,
  };

  it('normalizes public layer manifests into the frontend contract', async () => {
    const service = new CatalogService(config as never);

    const snapshot = await service.refreshCatalog('manual');

    expect(snapshot.total).toBeGreaterThanOrEqual(1);
    expect(snapshot.layers[0]).toMatchObject({
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
    expect(snapshot.layers[0].metadata).not.toHaveProperty('contactEmail');
    expect(snapshot.themes[0].layerCount).toBeGreaterThanOrEqual(1);
  });
});
