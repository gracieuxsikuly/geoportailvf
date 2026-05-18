import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogService } from '../common/catalog/catalog.service';
import { CatalogLayerMetadata } from '../common/catalog/catalog.types';

@Injectable()
export class MetadataService {
  constructor(private readonly catalog: CatalogService) {}

  findByLayer(layerId: string): CatalogLayerMetadata {
    const metadata = this.catalog.findMetadataByLayer(layerId);
    if (!metadata) {
      throw new NotFoundException(`Metadata for layer ${layerId} not found`);
    }
    return metadata;
  }
}
