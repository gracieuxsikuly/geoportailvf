import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CatalogService } from '../common/catalog/catalog.service';

async function refreshCatalog(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const catalog = app.get(CatalogService);
  const snapshot = await catalog.refreshCatalog('manual');

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ refreshedAt: snapshot.refreshedAt, total: snapshot.total }, null, 2));
  await app.close();
}

void refreshCatalog();
