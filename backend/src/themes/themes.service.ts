import { Injectable } from '@nestjs/common';
import { CatalogService } from '../common/catalog/catalog.service';

@Injectable()
export class ThemesService {
  constructor(private readonly catalog: CatalogService) {}

  findAll() {
    return this.catalog.listThemes().filter((theme) => theme.isVisible);
  }
}
