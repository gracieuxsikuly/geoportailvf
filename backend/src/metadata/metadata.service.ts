import { Injectable } from '@nestjs/common';
import { CatalogService } from '../common/catalog/catalog.service';

@Injectable()
export class MetadataService {
  constructor(private readonly catalog: CatalogService) {}

  findByLayer(layerId: string) {
    return this.catalog.findMetadataByLayer(layerId);
  }
}
