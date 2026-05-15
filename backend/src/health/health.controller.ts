import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from '../common/catalog/catalog.service';
import { AppConfigService } from '../config/config.service';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly catalog: CatalogService,
    private readonly config: AppConfigService,
  ) {}

  @Get()
  check() {
    return {
      status: 'ok',
      mode: 'geoserver-catalog',
      geoserver: this.config.geoserverUrl,
      layerCount: this.catalog.countLayers(),
      timestamp: new Date().toISOString(),
    };
  }
}
