import { ApiProperty } from '@nestjs/swagger';
import { ApiMetaDto } from '../../api/api-response.dto';

export class LocalizedTextDto {
  @ApiProperty({ example: 'Limite officielle du Parc National des Virunga' })
  fr!: string;

  @ApiProperty({ example: 'Official boundary of Virunga National Park' })
  en!: string;
}

export class LayerServicesDto {
  @ApiProperty({ example: 'https://gis.virunga.org/geoserver/virunga/wms', nullable: true })
  wms!: string | null;

  @ApiProperty({ example: 'https://gis.virunga.org/geoserver/virunga/ows?service=WFS', nullable: true })
  wfs!: string | null;

  @ApiProperty({ example: null, nullable: true })
  wmts!: string | null;

  @ApiProperty({ example: 'https://gis.virunga.org/geoserver/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=virunga%3Avirunga_boundary', nullable: true })
  legend!: string | null;
}

export class LayerMetadataDto {
  @ApiProperty({ example: 'Virunga Fondation / ICCN', required: false })
  source?: string;

  @ApiProperty({ example: '2026-05-14', required: false })
  updatedAt?: string;

  @ApiProperty({ example: 'CC BY-NC 4.0', required: false })
  license?: string;

  @ApiProperty({ example: 'Delimitation officielle du Parc National des Virunga.', required: false })
  descriptionFr?: string;

  @ApiProperty({ example: 'Official delimitation of Virunga National Park.', required: false })
  descriptionEn?: string;

  @ApiProperty({ example: 5, required: false })
  qualityLevel?: number;

  @ApiProperty({ example: ['parc', 'limite', 'protection'] })
  keywords!: string[];
}

export class LayerPopupDto {
  @ApiProperty({ example: true })
  enabled!: boolean;

  @ApiProperty({ example: ['name', 'area_km2', 'status'] })
  fields!: string[];
}

export class CatalogLayerDto {
  @ApiProperty({ example: 'virunga_boundary' })
  id!: string;

  @ApiProperty({ example: 'limite-officielle-parc' })
  slug!: string;

  @ApiProperty({ type: LocalizedTextDto })
  title!: LocalizedTextDto;

  @ApiProperty({ example: 'limites-localisation' })
  themeId!: string;

  @ApiProperty({ type: LocalizedTextDto })
  themeLabel!: LocalizedTextDto;

  @ApiProperty({ enum: ['WMS', 'WFS', 'WMTS'], example: 'WMS' })
  serviceType!: string;

  @ApiProperty({ example: 'virunga' })
  workspace!: string;

  @ApiProperty({ example: 'virunga:park_boundary' })
  layerName!: string;

  @ApiProperty({ example: 'virunga_boundary', nullable: true })
  styleName!: string | null;

  @ApiProperty({ type: LayerServicesDto })
  services!: LayerServicesDto;

  @ApiProperty({ example: true })
  visible!: boolean;

  @ApiProperty({ example: 0.85 })
  opacity!: number;

  @ApiProperty({ example: 5 })
  minZoom!: number;

  @ApiProperty({ example: 18 })
  maxZoom!: number;

  @ApiProperty({ example: 1 })
  sortOrder!: number;

  @ApiProperty({ enum: ['public', 'restricted', 'confidential'], example: 'public' })
  sensitivityLevel!: string;

  @ApiProperty({ type: LayerMetadataDto, nullable: true })
  metadata!: LayerMetadataDto | null;

  @ApiProperty({ type: LayerPopupDto })
  popup!: LayerPopupDto;
}

export class CatalogThemeDto {
  @ApiProperty({ example: 'limites-localisation' })
  id!: string;

  @ApiProperty({ example: 'limites-localisation' })
  slug!: string;

  @ApiProperty({ type: LocalizedTextDto })
  label!: LocalizedTextDto;

  @ApiProperty({ example: 1 })
  sortOrder!: number;

  @ApiProperty({ example: true })
  visible!: boolean;

  @ApiProperty({ example: 12 })
  layerCount!: number;
}

export class CatalogPayloadDto {
  @ApiProperty({ type: [CatalogLayerDto] })
  layers!: CatalogLayerDto[];

  @ApiProperty({ type: [CatalogThemeDto] })
  themes!: CatalogThemeDto[];
}

export class CatalogResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Catalog retrieved successfully' })
  message!: string;

  @ApiProperty({ type: CatalogPayloadDto })
  data!: CatalogPayloadDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}

export class LayersResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Layers retrieved successfully' })
  message!: string;

  @ApiProperty({ type: [CatalogLayerDto] })
  data!: CatalogLayerDto[];

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}

export class LayerResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Layer retrieved successfully' })
  message!: string;

  @ApiProperty({ type: CatalogLayerDto })
  data!: CatalogLayerDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}

export class ThemesResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Themes retrieved successfully' })
  message!: string;

  @ApiProperty({ type: [CatalogThemeDto] })
  data!: CatalogThemeDto[];

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}

export class ThemeResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Theme retrieved successfully' })
  message!: string;

  @ApiProperty({ type: CatalogThemeDto })
  data!: CatalogThemeDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}

export class MetadataResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Metadata retrieved successfully' })
  message!: string;

  @ApiProperty({ type: LayerMetadataDto })
  data!: LayerMetadataDto;

  @ApiProperty({ type: ApiMetaDto })
  meta!: ApiMetaDto;
}
