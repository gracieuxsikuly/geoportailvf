import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createApiResponse } from '../common/api/api-response';
import { ApiErrorResponseDto } from '../common/api/api-response.dto';
import { CatalogService } from '../common/catalog/catalog.service';
import { ThemeResponseDto, ThemesResponseDto } from '../common/catalog/dto/catalog.dto';
import { ThemesService } from './themes.service';

@ApiTags('themes')
@Controller({ path: 'themes', version: '1' })
export class ThemesController {
  constructor(
    private readonly themesService: ThemesService,
    private readonly catalog: CatalogService,
  ) {}

  @Get()
  @ApiOkResponse({ type: ThemesResponseDto, description: 'Liste des thematiques visibles du portail.' })
  findAll() {
    const data = this.themesService.findAll();
    return createApiResponse(data, 'Themes retrieved successfully', this.catalog.getMeta(data.length));
  }

  @Get(':slug')
  @ApiOkResponse({ type: ThemeResponseDto, description: 'Detail d une thematique visible.' })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto, description: 'Thematique inconnue.' })
  findOne(@Param('slug') slug: string) {
    return createApiResponse(
      this.themesService.findBySlug(slug),
      'Theme retrieved successfully',
      this.catalog.getMeta(1),
    );
  }
}
