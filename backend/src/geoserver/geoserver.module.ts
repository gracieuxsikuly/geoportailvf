import { Module } from '@nestjs/common';
import { GeoserverController } from './geoserver.controller';
import { GeoserverService } from './geoserver.service';

@Module({
  controllers: [GeoserverController],
  providers: [GeoserverService],
  exports: [GeoserverService],
})
export class GeoserverModule {}
