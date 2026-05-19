import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createApiResponse } from '../common/api/api-response';
import { CatalogService } from '../common/catalog/catalog.service';
import { AppConfigService } from '../config/config.service';
import { GeoserverService } from '../geoserver/geoserver.service';
import { HealthResponseDto } from './dto/health.dto';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly catalog: CatalogService,
    private readonly config: AppConfigService,
    private readonly geoserver: GeoserverService,
  ) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto, description: 'Etat de fonctionnement du backend public.' })
  async check() {
    const geoserverHealth = await this.geoserver.checkHealth();
    const snapshot = this.catalog.getSnapshot();
    const data = {
      status: geoserverHealth.status,
      mode: 'geoserver-catalog',
      geoserver: this.config.geoserverUrl,
      geoserverReachable: geoserverHealth.status === 'ok',
      layerCount: snapshot.total,
      catalogRefreshedAt: snapshot.refreshedAt,
      timestamp: new Date().toISOString(),
    };

    return createApiResponse(data, 'Healthcheck retrieved successfully', this.catalog.getMeta(snapshot.total));
  }
}
