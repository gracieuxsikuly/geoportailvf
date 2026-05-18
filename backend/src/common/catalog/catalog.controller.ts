import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createApiResponse } from '../api/api-response';
import { CatalogResponseDto } from './dto/catalog.dto';
import { CatalogService } from './catalog.service';

@ApiTags('catalog')
@Controller({ path: 'catalog', version: '1' })
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOkResponse({ type: CatalogResponseDto, description: 'Catalogue public complet des couches et thematiques.' })
  findCatalog() {
    const data = this.catalog.getCatalog();
    return createApiResponse(data, 'Catalog retrieved successfully', this.catalog.getMeta(data.layers.length));
  }
}
