import { ApiProperty } from '@nestjs/swagger';
import { ApiMetaDto } from '../../common/api/api-response.dto';

export class HealthDto {
  @ApiProperty({ enum: ['ok', 'degraded'], example: 'ok' })
  status!: 'ok' | 'degraded';

  @ApiProperty({ example: 'geoserver-catalog' })
  mode!: string;

  @ApiProperty({ example: 'https://gis.virunga.org/geoserver' })
  geoserver!: string;

  @ApiProperty({ example: true })
  geoserverReachable!: boolean;

  @ApiProperty({ example: 120 })
  layerCount!: number;

  @ApiProperty({ example: '2026-05-15T08:45:00Z' })
  catalogRefreshedAt!: string;

  @ApiProperty({ example: '2026-05-15T08:45:00Z' })
  timestamp!: string;
}

export class HealthResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Healthcheck retrieved successfully' })
  message!: string;

  @ApiProperty({ type: HealthDto })
  data!: HealthDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}
