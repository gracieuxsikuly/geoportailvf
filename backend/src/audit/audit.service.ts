import { Injectable, Logger } from '@nestjs/common';
import { AuditRecord } from '../common/catalog/catalog.types';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  async record(input: AuditRecord): Promise<void> {
    this.logger.debug(`Audit event captured in memory: ${input.action} on ${input.resourceType}`);
  }
}
