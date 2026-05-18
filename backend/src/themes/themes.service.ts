import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogService } from '../common/catalog/catalog.service';
import { CatalogTheme } from '../common/catalog/catalog.types';

@Injectable()
export class ThemesService {
  constructor(private readonly catalog: CatalogService) {}

  findAll(): CatalogTheme[] {
    return this.catalog.listThemes().filter((theme) => theme.visible);
  }

  findBySlug(slug: string): CatalogTheme {
    const theme = this.catalog.findThemeBySlug(slug);
    if (!theme) {
      throw new NotFoundException(`Theme ${slug} not found`);
    }
    return theme;
  }
}
