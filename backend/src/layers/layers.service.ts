import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogService } from '../common/catalog/catalog.service';
import { CatalogLayer } from '../common/catalog/catalog.types';

@Injectable()
export class LayersService {
  constructor(private readonly catalog: CatalogService) {}

  findAllPublic(): CatalogLayer[] {
    return this.catalog.listLayers();
  }

  findBySlug(slug: string): CatalogLayer {
    const layer = this.catalog.findLayerBySlug(slug);
    if (!layer) {
      throw new NotFoundException(`Layer ${slug} not found`);
    }
    return layer;
  }
}
