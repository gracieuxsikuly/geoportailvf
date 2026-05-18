import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createApiResponse } from '../common/api/api-response';
import { ApiErrorResponseDto } from '../common/api/api-response.dto';
import { CatalogService } from '../common/catalog/catalog.service';
import { LayerResponseDto, LayersResponseDto } from '../common/catalog/dto/catalog.dto';
import { LayersService } from './layers.service';

@ApiTags('layers')
@Controller({ path: 'layers', version: '1' })
export class LayersController {
  constructor(
    private readonly layersService: LayersService,
    private readonly catalog: CatalogService,
  ) {}

  @Get()
  @ApiOkResponse({ type: LayersResponseDto, description: 'Liste des couches publiques disponibles.' })
  findAll() {
    const data = this.layersService.findAllPublic();
    return createApiResponse(data, 'Layers retrieved successfully', this.catalog.getMeta(data.length));
  }

  @Get(':slug')
  @ApiOkResponse({ type: LayerResponseDto, description: 'Detail public d une couche par slug.' })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto, description: 'Couche inconnue ou non publique.' })
  findOne(@Param('slug') slug: string) {
    return createApiResponse(
      this.layersService.findBySlug(slug),
      'Layer retrieved successfully',
      this.catalog.getMeta(1),
    );
  }
}
