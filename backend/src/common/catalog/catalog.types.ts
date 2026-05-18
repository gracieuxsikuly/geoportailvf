export type CatalogSource = 'geoserver' | 'manifest' | 'hybrid';

export type CatalogServiceType = 'WMS' | 'WFS' | 'WMTS';

export type SensitivityLevel = 'public' | 'restricted' | 'confidential';

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface CatalogLayerManifest {
  id: string;
  slug: string;
  title?: Partial<LocalizedText>;
  theme?: string;
  themeLabel?: Partial<LocalizedText>;
  service: {
    type: string;
    url?: string;
    wmsUrl?: string;
    wfsUrl?: string;
    wmtsUrl?: string | null;
    legendUrl?: string;
    workspace: string;
    layer: string;
    style?: string;
  };
  display?: {
    defaultOpacity?: number;
    opacity?: number;
    minZoom?: number;
    maxZoom?: number;
    visibleByDefault?: boolean;
    visible?: boolean;
    sortOrder?: number;
  };
  metadata?: {
    source?: string;
    updateDate?: string;
    updatedAt?: string;
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
  sensitivity?: SensitivityLevel;
  popup?: {
    enabled?: boolean;
    fields?: string[];
  };
}

export interface CatalogLayerMetadata {
  source?: string;
  updatedAt?: string;
  license?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  qualityLevel?: number;
  keywords: string[];
}

export interface CatalogLayerServices {
  wms: string | null;
  wfs: string | null;
  wmts: string | null;
  legend: string | null;
}

export interface CatalogPopup {
  enabled: boolean;
  fields: string[];
}

export interface CatalogTheme {
  id: string;
  slug: string;
  label: LocalizedText;
  sortOrder: number;
  visible: boolean;
  layerCount: number;
}

export interface CatalogLayer {
  id: string;
  slug: string;
  title: LocalizedText;
  themeId: string;
  themeLabel: LocalizedText;
  serviceType: CatalogServiceType;
  workspace: string;
  layerName: string;
  styleName: string | null;
  services: CatalogLayerServices;
  visible: boolean;
  opacity: number;
  minZoom: number;
  maxZoom: number;
  sortOrder: number;
  sensitivityLevel: SensitivityLevel;
  metadata: CatalogLayerMetadata | null;
  popup: CatalogPopup;
}

export interface CatalogPayload {
  layers: CatalogLayer[];
  themes: CatalogTheme[];
}

export interface CatalogSyncError {
  field: string;
  code: string;
  detail: string;
}

export interface CatalogSnapshot extends CatalogPayload {
  source: CatalogSource;
  refreshedAt: string;
  total: number;
  errors: CatalogSyncError[];
}

export interface AuditRecord {
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}
