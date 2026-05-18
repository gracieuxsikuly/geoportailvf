import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppConfigService } from '../config/config.service';
import { GeoserverCapabilitiesDto, GeoserverHealthDto } from './dto/geoserver.dto';

type OgcService = 'WMS' | 'WFS' | 'WMTS';

@Injectable()
export class GeoserverService {
  private readonly logger = new Logger(GeoserverService.name);
  private readonly http: AxiosInstance;

  constructor(private readonly config: AppConfigService) {
    this.http = axios.create({
      baseURL: this.config.geoserverUrl,
      timeout: 10_000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  }

  async checkHealth(): Promise<GeoserverHealthDto> {
    const [wms, wfs, wmts] = await Promise.all([
      this.getCapabilities('WMS'),
      this.getCapabilities('WFS'),
      this.getCapabilities('WMTS'),
    ]);

    return {
      status: wms.reachable || wfs.reachable || wmts.reachable ? 'ok' : 'degraded',
      url: this.config.geoserverUrl,
      wms: { reachable: wms.reachable, url: wms.url },
      wfs: { reachable: wfs.reachable, url: wfs.url },
      wmts: { reachable: wmts.reachable, url: wmts.url },
      checkedAt: new Date().toISOString(),
    };
  }

  async getCapabilities(service: OgcService = 'WMS'): Promise<GeoserverCapabilitiesDto> {
    const url = this.buildCapabilitiesUrl(service);

    try {
      const response = await this.http.get(this.pathFor(service), {
        params: this.paramsFor(service),
        responseType: 'text',
      });

      const contentType = this.resolveHeader(response.headers['content-type']);
      return {
        service,
        url,
        reachable: response.status >= 200 && response.status < 300,
        statusCode: response.status,
        contentType,
      };
    } catch (err) {
      this.logger.warn(`GeoServer ${service} capabilities unreachable: ${(err as Error).message}`);
      return {
        service,
        url,
        reachable: false,
        statusCode: null,
        contentType: null,
      };
    }
  }

  private buildCapabilitiesUrl(service: OgcService): string {
    const base = this.config.geoserverUrl.replace(/\/$/, '');
    const path = this.pathFor(service).replace(/^\//, '');
    const params = new URLSearchParams(this.paramsFor(service));
    return `${base}/${path}?${params.toString()}`;
  }

  private pathFor(service: OgcService): string {
    return service === 'WMTS' ? '/gwc/service/wmts' : '/ows';
  }

  private paramsFor(service: OgcService): Record<string, string> {
    if (service === 'WMTS') {
      return { SERVICE: 'WMTS', REQUEST: 'GetCapabilities', VERSION: '1.0.0' };
    }

    return {
      service,
      version: service === 'WMS' ? '1.3.0' : '2.0.0',
      request: 'GetCapabilities',
    };
  }

  private resolveHeader(value: unknown): string | null {
    if (Array.isArray(value)) {
      return value[0] === undefined ? null : String(value[0]);
    }

    return value === undefined || value === null ? null : String(value);
  }
}
