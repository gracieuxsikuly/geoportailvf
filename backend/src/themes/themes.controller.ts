import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThemesService } from './themes.service';

@ApiTags('themes')
@Controller({ path: 'themes', version: '1' })
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  findAll() {
    return this.themesService.findAll();
  }
}
