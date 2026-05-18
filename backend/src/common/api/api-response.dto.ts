import { ApiProperty } from '@nestjs/swagger';

export class ApiMetaDto {
  @ApiProperty({ example: 'geoserver-catalog' })
  source!: string;

  @ApiProperty({ example: '2026-05-15T08:45:00Z' })
  refreshedAt!: string;

  @ApiProperty({ example: 120 })
  total!: number;
}

export class ApiErrorItemDto {
  @ApiProperty({ example: 'services.wms' })
  field!: string;

  @ApiProperty({ example: 'INVALID_SERVICE_URL' })
  code!: string;

  @ApiProperty({ example: 'The WMS endpoint is not reachable' })
  detail!: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ example: 'GeoServer service validation failed' })
  message!: string;

  @ApiProperty({ type: [ApiErrorItemDto] })
  errors!: ApiErrorItemDto[];
}
