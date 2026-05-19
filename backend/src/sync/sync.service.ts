import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CatalogService } from '../common/catalog/catalog.service';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class SyncService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(SyncService.name);
  private readonly jobName = 'catalog-refresh';

  constructor(
    private readonly catalog: CatalogService,
    private readonly config: AppConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.catalog.refreshCatalog('startup');
    this.registerCatalogRefreshJob();
  }

  onApplicationShutdown(): void {
    try {
      this.schedulerRegistry.deleteCronJob(this.jobName);
    } catch {
      return;
    }
  }

  private registerCatalogRefreshJob(): void {
    const job = new CronJob(this.config.catalogRefreshCron, async () => {
      await this.catalog.refreshCatalog('scheduled');
    });

    this.schedulerRegistry.addCronJob(this.jobName, job);
    job.start();
    this.logger.log(`Catalog refresh scheduled with cron: ${this.config.catalogRefreshCron}`);
  }
}
