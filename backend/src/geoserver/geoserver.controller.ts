import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createApiResponse } from '../common/api/api-response';
import { CatalogService } from '../common/catalog/catalog.service';
import {
  GeoserverCapabilitiesQueryDto,
  GeoserverCapabilitiesResponseDto,
  GeoserverHealthResponseDto,
} from './dto/geoserver.dto';
import { GeoserverService } from './geoserver.service';

@ApiTags('geoserver')
@Controller({ path: 'geoserver', version: '1' })
export class GeoserverController {
  constructor(
    private readonly geoserverService: GeoserverService,
    private readonly catalog: CatalogService,
  ) {}

  @Get('health')
  @ApiOkResponse({ type: GeoserverHealthResponseDto, description: 'Etat technique public de GeoServer.' })
  async getHealth() {
    return createApiResponse(
      await this.geoserverService.checkHealth(),
      'GeoServer health retrieved successfully',
      this.catalog.getMeta(this.catalog.countLayers()),
    );
  }

  @Get('capabilities')
  @ApiQuery({ name: 'service', enum: ['WMS', 'WFS', 'WMTS'], required: false })
  @ApiOkResponse({ type: GeoserverCapabilitiesResponseDto, description: 'Controle GetCapabilities OGC.' })
  async getCapabilities(@Query() query: GeoserverCapabilitiesQueryDto) {
    return createApiResponse(
      await this.geoserverService.getCapabilities(query.service ?? 'WMS'),
      'GeoServer capabilities checked successfully',
      this.catalog.getMeta(this.catalog.countLayers()),
    );
  }
}
