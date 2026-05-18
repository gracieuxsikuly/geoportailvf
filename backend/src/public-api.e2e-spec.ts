import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { GeoserverService } from './geoserver/geoserver.service';

describe('Public API contract', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.GEOSERVER_URL = 'https://gis.virunga.org/geoserver';
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGINS = 'http://localhost:3000';
    process.env.CATALOG_SOURCE = 'hybrid';
    process.env.CATALOG_REFRESH_CRON = '*/15 * * * *';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GeoserverService)
      .useValue({
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
        checkHealth: jest.fn().mockResolvedValue({
          status: 'ok',
          url: 'https://gis.virunga.org/geoserver',
          wms: { reachable: true, url: 'https://gis.virunga.org/geoserver/ows?service=WMS' },
          wfs: { reachable: true, url: 'https://gis.virunga.org/geoserver/ows?service=WFS' },
          wmts: { reachable: true, url: 'https://gis.virunga.org/geoserver/gwc/service/wmts' },
          checkedAt: '2026-05-15T08:45:00.000Z',
        }),
        getCapabilities: jest.fn().mockImplementation((service = 'WMS') => ({
          service,
          url: `https://gis.virunga.org/geoserver/ows?service=${service}`,
          reachable: true,
          statusCode: 200,
          contentType: 'text/xml',
        })),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/catalog returns the full normalized catalog', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/catalog').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.layers[0]).toHaveProperty('services.legend');
    expect(response.body.data.themes[0]).toHaveProperty('layerCount');
    expect(response.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/layers returns public layers only', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/layers').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.every((layer: { sensitivityLevel: string }) => layer.sensitivityLevel === 'public')).toBe(true);
  });

  it('GET /api/v1/geoserver/capabilities validates OGC service query values', async () => {
    const ok = await request(app.getHttpServer())
      .get('/api/v1/geoserver/capabilities?service=WFS')
      .expect(200);
    expect(ok.body.data.service).toBe('WFS');

    const bad = await request(app.getHttpServer())
      .get('/api/v1/geoserver/capabilities?service=BAD')
      .expect(400);
    expect(bad.body.success).toBe(false);
    expect(bad.body.errors[0].code).toBe('BAD_REQUEST');
  });

  it('GET /api/v1/health includes catalog and GeoServer status', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.layerCount).toBeGreaterThanOrEqual(1);
    expect(response.body.data.geoserverReachable).toBe(true);
  });
});
