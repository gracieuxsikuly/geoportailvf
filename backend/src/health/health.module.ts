import { Module } from '@nestjs/common';
import { GeoserverModule } from '../geoserver/geoserver.module';
import { HealthController } from './health.controller';

@Module({
  imports: [GeoserverModule],
  controllers: [HealthController],
})
export class HealthModule {}
