import { Global, Module } from '@nestjs/common';
import { GeoserverModule } from '../../geoserver/geoserver.module';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Global()
@Module({
  imports: [GeoserverModule],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}