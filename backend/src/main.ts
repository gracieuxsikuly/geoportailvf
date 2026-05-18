import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { AppConfigService } from './config/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(AppConfigService);

  app.use(helmet());
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Virunga WebGIS API')
    .setDescription('API publique de catalogue WebGIS, lecture GeoServer et manifests versionnes')
    .setVersion('1.0')
    .addTag('catalog', 'Catalogue public normalise des couches GeoServer')
    .addTag('themes', 'Thematiques visibles du portail')
    .addTag('layers', 'Couches publiques exploitables par le frontend')
    .addTag('metadata', 'Metadonnees publiques simplifiees des couches')
    .addTag('geoserver', 'Controle technique des services GeoServer existants')
    .addTag('health', 'Etat de fonctionnement du backend public')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port);
  // eslint-disable-next-line no-console
  console.log(`Virunga backend listening on http://localhost:${config.port}`);
}

void bootstrap();
