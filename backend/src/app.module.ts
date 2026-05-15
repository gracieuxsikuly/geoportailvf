import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { CatalogModule } from './common/catalog/catalog.module';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './users/users.module';
import { ThemesModule } from './themes/themes.module';
import { LayersModule } from './layers/layers.module';
import { MetadataModule } from './metadata/metadata.module';
import { GeoserverModule } from './geoserver/geoserver.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AuditModule } from './audit/audit.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AppConfigModule,
    CatalogModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => [
        {
          ttl: config.rateLimitTtl * 1000,
          limit: config.rateLimitMax,
        },
      ],
    }),
    UsersModule,
    ThemesModule,
    LayersModule,
    MetadataModule,
    GeoserverModule,
    RealtimeModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
