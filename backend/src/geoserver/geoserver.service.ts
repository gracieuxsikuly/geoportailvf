import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class GeoserverService {
  private readonly logger = new Logger(GeoserverService.name);
  private readonly http: AxiosInstance;

  constructor(private readonly config: AppConfigService) {
    this.http = axios.create({
      baseURL: this.config.geoserverUrl,
      timeout: 10_000,
    });
  }

  async getCapabilities(): Promise<{ url: string; reachable: boolean }> {
    try {
      const res = await this.http.get('/ows', {
        params: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' },
      });
      return { url: this.config.geoserverUrl, reachable: res.status === 200 };
    } catch (err) {
      this.logger.warn(`GeoServer unreachable: ${(err as Error).message}`);
      return { url: this.config.geoserverUrl, reachable: false };
    }
  }
}
