import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import {
  CatalogLayer,
  CatalogLayerManifest,
  CatalogLayerMetadata,
  CatalogTheme,
  CatalogThemeSummary,
} from './catalog.types';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private readonly config: AppConfigService) {}

  listLayers(): CatalogLayer[] {
    return this.loadManifests().map((manifest, index) => {
      const themeId = manifest.theme ?? 'general';

      return {
        id: manifest.id,
        slug: manifest.slug,
        titleFr: manifest.title?.fr ?? manifest.slug,
        titleEn: manifest.title?.en ?? manifest.slug,
        themeId,
        serviceType: manifest.service.type,
        geoserverUrl: manifest.service.url ?? `${this.config.geoserverUrl}/wms`,
        workspace: manifest.service.workspace,
        layerName: manifest.service.layer,
        styleName: manifest.service.style,
        defaultOpacity: manifest.display?.defaultOpacity ?? 1,
        minZoom: manifest.display?.minZoom ?? 0,
        maxZoom: manifest.display?.maxZoom ?? 22,
        isVisibleDefault: manifest.display?.visibleByDefault ?? false,
        isPublic: manifest.sensitivity !== 'confidential',
        sortOrder: index,
        sensitivityLevel: manifest.sensitivity ?? 'public',
        popupFields: manifest.popup?.fields ? { fields: manifest.popup.fields } : null,
        metadata: this.buildMetadata(manifest),
      };
    });
  }

  listThemes(): CatalogTheme[] {
    const themeMap = new Map<string, CatalogTheme>();

    for (const layer of this.listLayers()) {
      const existing = themeMap.get(layer.themeId);

      if (existing) {
        existing.layers.push(layer);
        continue;
      }

      const label = this.humanize(layer.themeId);
      themeMap.set(layer.themeId, {
        id: layer.themeId,
        code: layer.themeId,
        labelFr: label,
        labelEn: label,
        sortOrder: layer.sortOrder,
        isVisible: true,
        layers: [layer],
      });
    }

    return [...themeMap.values()].sort((left, right) => left.sortOrder - right.sortOrder);
  }

  findLayerBySlug(slug: string): CatalogLayer | undefined {
    const layer = this.listLayers().find((item) => item.slug === slug);
    if (!layer) {
      return undefined;
    }

    return {
      ...layer,
      theme: this.findThemeSummary(layer.themeId),
      metadata: this.findMetadataByLayer(layer.id),
    };
  }

  findMetadataByLayer(layerId: string): CatalogLayerMetadata | null {
    const manifest = this.loadManifests().find(
      (item) => item.id === layerId || item.slug === layerId,
    );

    return manifest ? this.buildMetadata(manifest) : null;
  }

  countLayers(): number {
    return this.loadManifests().length;
  }

  private findThemeSummary(themeId: string): CatalogThemeSummary | undefined {
    const theme = this.listThemes().find((item) => item.id === themeId);
    if (!theme) {
      return undefined;
    }

    const { layers: _layers, ...summary } = theme;
    return summary;
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

  private buildMetadata(manifest: CatalogLayerManifest): CatalogLayerMetadata | null {
    if (!manifest.metadata) {
      return null;
    }

    return {
      id: `metadata-${manifest.id}`,
      layerId: manifest.id,
      sourceOrg: manifest.metadata.source,
      updateDate: manifest.metadata.updateDate,
      license: manifest.metadata.license,
      descriptionFr: manifest.metadata.descriptionFr,
      descriptionEn: manifest.metadata.descriptionEn,
      qualityLevel: manifest.metadata.qualityLevel,
      contactEmail: manifest.metadata.contactEmail,
      legendUrl: manifest.metadata.legendUrl,
      keywords: manifest.metadata.keywords ?? [],
      inspireTheme: manifest.metadata.inspireTheme,
      isoTopicCategory: manifest.metadata.isoTopicCategory,
    };
  }

  private humanize(code: string): string {
    return code
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}