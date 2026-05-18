import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { ApiMetaDto } from '../../common/api/api-response.dto';

export class GeoserverCapabilitiesQueryDto {
  @ApiProperty({ enum: ['WMS', 'WFS', 'WMTS'], default: 'WMS', required: false })
  @IsOptional()
  @IsIn(['WMS', 'WFS', 'WMTS'])
  service?: 'WMS' | 'WFS' | 'WMTS' = 'WMS';
}

export class GeoserverServiceStatusDto {
  @ApiProperty({ example: true })
  reachable!: boolean;

  @ApiProperty({ example: 'https://gis.virunga.org/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities' })
  url!: string;
}

export class GeoserverHealthDto {
  @ApiProperty({ enum: ['ok', 'degraded'], example: 'ok' })
  status!: 'ok' | 'degraded';

  @ApiProperty({ example: 'https://gis.virunga.org/geoserver' })
  url!: string;

  @ApiProperty({ type: GeoserverServiceStatusDto })
  wms!: GeoserverServiceStatusDto;

  @ApiProperty({ type: GeoserverServiceStatusDto })
  wfs!: GeoserverServiceStatusDto;

  @ApiProperty({ type: GeoserverServiceStatusDto })
  wmts!: GeoserverServiceStatusDto;

  @ApiProperty({ example: '2026-05-15T08:45:00Z' })
  checkedAt!: string;
}

export class GeoserverCapabilitiesDto {
  @ApiProperty({ enum: ['WMS', 'WFS', 'WMTS'], example: 'WMS' })
  service!: 'WMS' | 'WFS' | 'WMTS';

  @ApiProperty({ example: 'https://gis.virunga.org/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities' })
  url!: string;

  @ApiProperty({ example: true })
  reachable!: boolean;

  @ApiProperty({ example: 200, nullable: true })
  statusCode!: number | null;

  @ApiProperty({ example: 'text/xml', nullable: true })
  contentType!: string | null;
}

export class GeoserverHealthResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'GeoServer health retrieved successfully' })
  message!: string;

  @ApiProperty({ type: GeoserverHealthDto })
  data!: GeoserverHealthDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}

export class GeoserverCapabilitiesResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'GeoServer capabilities checked successfully' })
  message!: string;

  @ApiProperty({ type: GeoserverCapabilitiesDto })
  data!: GeoserverCapabilitiesDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}
