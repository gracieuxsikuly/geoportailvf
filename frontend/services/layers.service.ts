import { apiClient } from './api.client';

export interface LayerMetadataDto {
  id: string;
  layerId: string;
  sourceOrg?: string;
  updateDate?: string;
  license?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  qualityLevel?: number;
  contactEmail?: string;
  legendUrl?: string;
  keywords: string[];
  inspireTheme?: string;
  isoTopicCategory?: string;
}

export interface LayerThemeDto {
  id: string;
  code: string;
  labelFr: string;
  labelEn: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface LayerDto {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  themeId: string;
  serviceType: string;
  geoserverUrl: string;
  workspace: string;
  layerName: string;
  styleName?: string;
  defaultOpacity: number;
  minZoom: number;
  maxZoom: number;
  isVisibleDefault: boolean;
  isPublic: boolean;
  sortOrder: number;
  sensitivityLevel: 'public' | 'restricted' | 'confidential';
  popupFields?: Record<string, unknown> | null;
  metadata?: LayerMetadataDto | null;
  theme?: LayerThemeDto;
}

export const layersService = {
  list: async (): Promise<LayerDto[]> => {
    const { data } = await apiClient.get<LayerDto[]>('/api/v1/layers');
    return data;
  },
  bySlug: async (slug: string): Promise<LayerDto> => {
    const { data } = await apiClient.get<LayerDto>(`/api/v1/layers/${slug}`);
    return data;
  },
};
