import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogService } from '../common/catalog/catalog.service';

@Injectable()
export class LayersService {
  constructor(private readonly catalog: CatalogService) {}

  findAllPublic() {
    return this.catalog.listLayers().filter((layer) => layer.isPublic);
  }

  async findBySlug(slug: string) {
    const layer = this.catalog.findLayerBySlug(slug);
    if (!layer) throw new NotFoundException(`Layer ${slug} not found`);
    return layer;
  }
}
