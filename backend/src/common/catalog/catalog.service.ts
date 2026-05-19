import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { GeoserverService } from '../../geoserver/geoserver.service';
import {
  CatalogLayer,
  CatalogLayerManifest,
  CatalogLayerMetadata,
  CatalogPayload,
  CatalogServiceType,
  CatalogSnapshot,
  CatalogSyncError,
  CatalogTheme,
  LocalizedText,
} from './catalog.types';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  private snapshot: CatalogSnapshot = this.createEmptySnapshot();

  constructor(
    private readonly config: AppConfigService,
    private readonly geoserver: GeoserverService,
  ) {}

  getCatalog(): CatalogPayload {
    return {
      layers: [...this.snapshot.layers],
      themes: [...this.snapshot.themes],
    };
  }

  getSnapshot(): CatalogSnapshot {
    return {
      ...this.snapshot,
      layers: [...this.snapshot.layers],
      themes: [...this.snapshot.themes],
      errors: [...this.snapshot.errors],
    };
  }

  getMeta(total = this.snapshot.total) {
    return {
      source: 'geoserver-catalog',
      refreshedAt: this.snapshot.refreshedAt,
      total,
    };
  }

  listLayers(): CatalogLayer[] {
    return [...this.snapshot.layers];
  }

  listThemes(): CatalogTheme[] {
    return [...this.snapshot.themes];
  }

  findThemeBySlug(slug: string): CatalogTheme | undefined {
    return this.snapshot.themes.find((theme) => theme.slug === slug || theme.id === slug);
  }

  findLayerBySlug(slug: string): CatalogLayer | undefined {
    return this.snapshot.layers.find((layer) => layer.slug === slug);
  }

  findMetadataByLayer(layerId: string): CatalogLayerMetadata | null {
    const layer = this.snapshot.layers.find((item) => item.id === layerId || item.slug === layerId);
    return layer?.metadata ?? null;
  }

  countLayers(): number {
    return this.snapshot.layers.length;
  }

  async refreshCatalog(trigger: 'startup' | 'scheduled' | 'manual' = 'manual'): Promise<CatalogSnapshot> {
    try {
      const localOverrides = this.loadManifests();
      const errors: CatalogSyncError[] = [];
      const manifests = await this.resolveCatalogManifests(localOverrides, errors);
      const layers = manifests
        .filter((manifest) => this.isPublic(manifest))
        .map((manifest, index) => this.normalizeLayer(manifest, index, errors))
        .sort((left, right) => left.sortOrder - right.sortOrder || left.title.fr.localeCompare(right.title.fr));
      const themes = this.buildThemes(layers);

      this.snapshot = {
        source: this.config.catalogSource,
        refreshedAt: new Date().toISOString(),
        total: layers.length,
        layers,
        themes,
        errors,
      };

      this.logger.log(
        `Catalog refresh completed (${trigger}): ${layers.length} public layer(s), ${errors.length} validation warning(s)`,
      );
      return this.getSnapshot();
    } catch (error) {
      this.logger.error(
        `Catalog refresh failed (${trigger}). Keeping last valid snapshot: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return this.getSnapshot();
    }
  }

  private async resolveCatalogManifests(
    localOverrides: CatalogLayerManifest[],
    errors: CatalogSyncError[],
  ): Promise<CatalogLayerManifest[]> {
    if (this.config.catalogSource === 'manifest') {
      return localOverrides;
    }

    const geoserverManifests = await this.loadGeoserverManifests(errors);

    if (this.config.catalogSource === 'geoserver') {
      return this.mergeImportedWithOverrides(geoserverManifests, localOverrides);
    }

    if (geoserverManifests.length === 0) {
      return localOverrides;
    }

    const merged = this.mergeImportedWithOverrides(geoserverManifests, localOverrides);
    const manifestOnlyLayers = localOverrides.filter(
      (override) => !geoserverManifests.some((manifest) => this.isSameLayer(manifest, override)),
    );

    return [...merged, ...manifestOnlyLayers];
  }

  private async loadGeoserverManifests(errors: CatalogSyncError[]): Promise<CatalogLayerManifest[]> {
    try {
      return await this.geoserver.discoverLayerManifests();
    } catch (error) {
      const message = (error as Error).message;
      errors.push({
        field: 'catalog.source',
        code: 'GEOSERVER_IMPORT_FAILED',
        detail: message,
      });

      this.logger.warn(`GeoServer catalog import failed: ${message}`);
      if (this.config.catalogSource === 'geoserver') {
        throw error;
      }

      return [];
    }
  }

  private mergeImportedWithOverrides(
    imported: CatalogLayerManifest[],
    overrides: CatalogLayerManifest[],
  ): CatalogLayerManifest[] {
    return imported.map((manifest) => {
      const override = overrides.find((candidate) => this.isSameLayer(manifest, candidate));
      return override ? this.mergeManifest(manifest, override) : manifest;
    });
  }

  private mergeManifest(base: CatalogLayerManifest, override: CatalogLayerManifest): CatalogLayerManifest {
    return {
      ...base,
      ...override,
      title: {
        ...base.title,
        ...override.title,
      },
      theme: override.theme ?? base.theme,
      themeLabel: {
        ...base.themeLabel,
        ...override.themeLabel,
      },
      service: {
        ...base.service,
        ...override.service,
      },
      display: {
        ...base.display,
        ...override.display,
      },
      metadata: {
        ...base.metadata,
        ...override.metadata,
      },
      popup: {
        ...base.popup,
        ...override.popup,
        fields: override.popup?.fields ?? base.popup?.fields,
      },
      sensitivity: override.sensitivity ?? base.sensitivity,
    };
  }

  private isSameLayer(left: CatalogLayerManifest, right: CatalogLayerManifest): boolean {
    return left.service.layer === right.service.layer
      || left.id === right.id
      || left.slug === right.slug;
  }

  private loadManifests(): CatalogLayerManifest[] {
    const manifestsDir = this.resolveManifestsDir();

    if (!existsSync(manifestsDir)) {
      return [];
    }

    return readdirSync(manifestsDir)
      .filter((fileName) => fileName.endsWith('.json'))
      .sort()
      .map((fileName) => {
        const fullPath = resolve(manifestsDir, fileName);
        return JSON.parse(readFileSync(fullPath, 'utf8')) as CatalogLayerManifest;
      });
  }

  private normalizeLayer(
    manifest: CatalogLayerManifest,
    index: number,
    errors: CatalogSyncError[],
  ): CatalogLayer {
    const themeId = manifest.theme ?? 'general';
    const themeLabel = this.localized(manifest.themeLabel, this.humanize(themeId));
    const serviceType = this.normalizeServiceType(manifest.service.type, manifest.id, errors);
    const services = this.buildServices(manifest, serviceType, errors);

    return {
      id: manifest.id,
      slug: manifest.slug,
      title: this.localized(manifest.title, manifest.slug),
      themeId,
      themeLabel,
      serviceType,
      workspace: manifest.service.workspace,
      layerName: manifest.service.layer,
      styleName: manifest.service.style ?? null,
      services,
      visible: manifest.display?.visible ?? manifest.display?.visibleByDefault ?? false,
      opacity: manifest.display?.opacity ?? manifest.display?.defaultOpacity ?? 1,
      minZoom: manifest.display?.minZoom ?? 0,
      maxZoom: manifest.display?.maxZoom ?? 22,
      sortOrder: manifest.display?.sortOrder ?? index + 1,
      sensitivityLevel: manifest.sensitivity ?? 'public',
      metadata: this.buildMetadata(manifest),
      popup: {
        enabled: manifest.popup?.enabled ?? Boolean(manifest.popup?.fields?.length),
        fields: manifest.popup?.fields ?? [],
      },
    };
  }

  private buildThemes(layers: CatalogLayer[]): CatalogTheme[] {
    const themeMap = new Map<string, CatalogTheme>();

    for (const layer of layers) {
      const existing = themeMap.get(layer.themeId);
      if (existing) {
        existing.layerCount += 1;
        existing.sortOrder = Math.min(existing.sortOrder, layer.sortOrder);
        continue;
      }

      themeMap.set(layer.themeId, {
        id: layer.themeId,
        slug: layer.themeId,
        label: layer.themeLabel,
        sortOrder: layer.sortOrder,
        visible: true,
        layerCount: 1,
      });
    }

    return [...themeMap.values()].sort(
      (left, right) => left.sortOrder - right.sortOrder || left.label.fr.localeCompare(right.label.fr),
    );
  }

  private buildServices(
    manifest: CatalogLayerManifest,
    serviceType: CatalogServiceType,
    errors: CatalogSyncError[],
  ) {
    const base = this.config.geoserverUrl.replace(/\/$/, '');
    const workspace = encodeURIComponent(manifest.service.workspace);
    const layer = manifest.service.layer;
    const style = manifest.service.style;
    const wms = manifest.service.wmsUrl ?? manifest.service.url ?? `${base}/${workspace}/wms`;
    const wfs = manifest.service.wfsUrl ?? `${base}/${workspace}/ows?service=WFS`;
    const wmts = manifest.service.wmtsUrl ?? (serviceType === 'WMTS' ? `${base}/gwc/service/wmts` : null);
    const legend = manifest.metadata?.legendUrl
      ?? manifest.service.legendUrl
      ?? this.buildLegendUrl(base, layer, style);
    const services = { wms, wfs, wmts, legend };

    for (const [key, value] of Object.entries(services)) {
      if (value !== null && !this.isValidPublicUrl(value)) {
        errors.push({
          field: `${manifest.id}.services.${key}`,
          code: 'INVALID_SERVICE_URL',
          detail: `Invalid ${key.toUpperCase()} URL for layer ${manifest.id}`,
        });
      }
    }

    return services;
  }

  private buildLegendUrl(base: string, layer: string, style?: string): string {
    const params = new URLSearchParams({
      SERVICE: 'WMS',
      REQUEST: 'GetLegendGraphic',
      FORMAT: 'image/png',
      LAYER: layer,
    });

    if (style) {
      params.set('STYLE', style);
    }

    return `${base}/wms?${params.toString()}`;
  }

  private buildMetadata(manifest: CatalogLayerManifest): CatalogLayerMetadata | null {
    if (!manifest.metadata) {
      return null;
    }

    return {
      source: manifest.metadata.source,
      updatedAt: manifest.metadata.updatedAt ?? manifest.metadata.updateDate,
      license: manifest.metadata.license,
      descriptionFr: manifest.metadata.descriptionFr,
      descriptionEn: manifest.metadata.descriptionEn,
      qualityLevel: manifest.metadata.qualityLevel,
      keywords: manifest.metadata.keywords ?? [],
    };
  }

  private resolveManifestsDir(): string {
    const candidates = [
      resolve(process.cwd(), 'geoserver', 'layer-manifests'),
      resolve(process.cwd(), '..', 'geoserver', 'layer-manifests'),
      resolve(__dirname, '..', '..', '..', '..', 'geoserver', 'layer-manifests'),
    ];

    const found = candidates.find((candidate) => existsSync(candidate));
    if (found) {
      return found;
    }

    this.logger.warn('GeoServer layer manifests directory not found. Returning an empty catalog.');
    return candidates[0];
  }

  private createEmptySnapshot(): CatalogSnapshot {
    return {
      source: 'hybrid',
      refreshedAt: new Date(0).toISOString(),
      total: 0,
      layers: [],
      themes: [],
      errors: [],
    };
  }

  private isPublic(manifest: CatalogLayerManifest): boolean {
    return (manifest.sensitivity ?? 'public') === 'public';
  }

  private normalizeServiceType(
    serviceType: string,
    layerId: string,
    errors: CatalogSyncError[],
  ): CatalogServiceType {
    const normalized = serviceType.toUpperCase();
    if (normalized === 'WMS' || normalized === 'WFS' || normalized === 'WMTS') {
      return normalized;
    }

    errors.push({
      field: `${layerId}.service.type`,
      code: 'INVALID_SERVICE_TYPE',
      detail: `Unsupported service type ${serviceType}; WMS is used as fallback`,
    });
    return 'WMS';
  }

  private localized(input: Partial<LocalizedText> | undefined, fallback: string): LocalizedText {
    return {
      fr: input?.fr ?? fallback,
      en: input?.en ?? input?.fr ?? fallback,
    };
  }

  private isValidPublicUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private humanize(code: string): string {
    return code
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
