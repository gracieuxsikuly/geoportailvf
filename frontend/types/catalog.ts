export interface LayerMetadata {
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

export interface ThemeSummary {
  id: string;
  code: string;
  labelFr: string;
  labelEn: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface Layer {
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
  popupFields?: { fields: string[] } | null;
  metadata?: LayerMetadata | null;
  theme?: ThemeSummary;
}

export interface Theme extends ThemeSummary {
  layers: Layer[];
}

export interface CatalogResponse {
  themes: Theme[];
  layers: Layer[];
  layerCount: number;
  refreshedAt?: string;
}

export interface HealthResponse {
  status: string;
  mode: string;
  geoserver: string;
  layerCount: number;
  timestamp: string;
}

export type BasemapId = 'terrain' | 'satellite' | 'light' | 'relief' | 'print';
