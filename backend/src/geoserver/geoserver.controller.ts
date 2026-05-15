import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GeoserverService } from './geoserver.service';

@ApiTags('geoserver')
@Controller({ path: 'geoserver', version: '1' })
export class GeoserverController {
  constructor(private readonly geoserverService: GeoserverService) {}

  @Get('capabilities')
  getCapabilities() {
    return this.geoserverService.getCapabilities();
  }
}
