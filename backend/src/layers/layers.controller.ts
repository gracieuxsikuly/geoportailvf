import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LayersService } from './layers.service';

@ApiTags('layers')
@Controller({ path: 'layers', version: '1' })
export class LayersController {
  constructor(private readonly layersService: LayersService) {}

  @Get()
  findAll() {
    return this.layersService.findAllPublic();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.layersService.findBySlug(slug);
  }
}
