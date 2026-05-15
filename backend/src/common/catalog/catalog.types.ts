export interface CatalogLayerManifest {
  id: string;
  slug: string;
  title?: {
    fr?: string;
    en?: string;
  };
  theme?: string;
  service: {
    type: string;
    url?: string;
    workspace: string;
    layer: string;
    style?: string;
  };
  display?: {
    defaultOpacity?: number;
    minZoom?: number;
    maxZoom?: number;
    visibleByDefault?: boolean;
  };
  metadata?: {
    source?: string;
    updateDate?: string;
    license?: string;
    descriptionFr?: string;
    descriptionEn?: string;
    qualityLevel?: number;
    contactEmail?: string;
    legendUrl?: string;
    keywords?: string[];
    inspireTheme?: string;
    isoTopicCategory?: string;
  };
  sensitivity?: 'public' | 'restricted' | 'confidential';
  popup?: {
    fields?: string[];
  };
}

export interface CatalogLayerMetadata {
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

export interface CatalogThemeSummary {
  id: string;
  code: string;
  labelFr: string;
  labelEn: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface CatalogLayer {
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
  popupFields: { fields: string[] } | null;
  metadata: CatalogLayerMetadata | null;
  theme?: CatalogThemeSummary;
}

export interface CatalogTheme extends CatalogThemeSummary {
  layers: CatalogLayer[];
}

export interface AuditRecord {
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}