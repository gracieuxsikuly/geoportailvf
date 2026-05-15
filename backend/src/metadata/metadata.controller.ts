import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from './metadata.service';

@ApiTags('metadata')
@Controller({ path: 'metadata', version: '1' })
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('layer/:layerId')
  findByLayer(@Param('layerId') layerId: string) {
    return this.metadataService.findByLayer(layerId);
  }
}
