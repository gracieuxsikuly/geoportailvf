import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createApiResponse } from '../common/api/api-response';
import { ApiErrorResponseDto } from '../common/api/api-response.dto';
import { CatalogService } from '../common/catalog/catalog.service';
import { MetadataResponseDto } from '../common/catalog/dto/catalog.dto';
import { MetadataService } from './metadata.service';

@ApiTags('metadata')
@Controller({ path: 'metadata', version: '1' })
export class MetadataController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly catalog: CatalogService,
  ) {}

  @Get(':layerId')
  @ApiOkResponse({ type: MetadataResponseDto, description: 'Metadonnees publiques simplifiees d une couche.' })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto, description: 'Metadonnees inconnues ou couche non publique.' })
  findByLayer(@Param('layerId') layerId: string) {
    return createApiResponse(
      this.metadataService.findByLayer(layerId),
      'Metadata retrieved successfully',
      this.catalog.getMeta(1),
    );
  }
}
