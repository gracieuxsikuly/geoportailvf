import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { CatalogLayerManifest } from '../common/catalog/catalog.types';
import { AppConfigService } from '../config/config.service';
import { GeoserverCapabilitiesDto, GeoserverHealthDto } from './dto/geoserver.dto';

type OgcService = 'WMS' | 'WFS' | 'WMTS';

interface WmsLayerNode {
  Name?: string;
  Title?: string;
  Abstract?: string;
  KeywordList?: {
    Keyword?: string | string[] | { '#text'?: string } | Array<string | { '#text'?: string }>;
  };
  Style?: WmsStyleNode | WmsStyleNode[];
  Layer?: WmsLayerNode | WmsLayerNode[];
}

interface WmsStyleNode {
  Name?: string;
}

interface WmsCapabilitiesDocument {
  WMS_Capabilities?: {
    Capability?: {
      Layer?: WmsLayerNode;
    };
  };
  WMT_MS_Capabilities?: {
    Capability?: {
      Layer?: WmsLayerNode;
    };
  };
}

interface DiscoveredLayer {
  layerName: string;
  title: string;
  abstractText?: string;
  workspace: string;
  styleNames: string[];
  keywords: string[];
}

@Injectable()
export class GeoserverService {
  private readonly logger = new Logger(GeoserverService.name);
  private readonly http: AxiosInstance;
  private readonly xmlParser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  constructor(private readonly config: AppConfigService) {
    this.http = axios.create({
      baseURL: this.config.geoserverUrl,
      timeout: 10_000,
      validateStatus: (status) => status >= 200 && status < 500,
    });
  }

  async checkHealth(): Promise<GeoserverHealthDto> {
    const [wms, wfs, wmts] = await Promise.all([
      this.getCapabilities('WMS'),
      this.getCapabilities('WFS'),
      this.getCapabilities('WMTS'),
    ]);

    return {
      status: wms.reachable || wfs.reachable || wmts.reachable ? 'ok' : 'degraded',
      url: this.config.geoserverUrl,
      wms: { reachable: wms.reachable, url: wms.url },
      wfs: { reachable: wfs.reachable, url: wfs.url },
      wmts: { reachable: wmts.reachable, url: wmts.url },
      checkedAt: new Date().toISOString(),
    };
  }

  async getCapabilities(service: OgcService = 'WMS'): Promise<GeoserverCapabilitiesDto> {
    const url = this.buildCapabilitiesUrl(service);

    try {
      const response = await this.http.get(this.pathFor(service), {
        params: this.paramsFor(service),
        responseType: 'text',
      });

      const contentType = this.resolveHeader(response.headers['content-type']);
      return {
        service,
        url,
        reachable: response.status >= 200 && response.status < 300,
        statusCode: response.status,
        contentType,
      };
    } catch (err) {
      this.logger.warn(`GeoServer ${service} capabilities unreachable: ${(err as Error).message}`);
      return {
        service,
        url,
        reachable: false,
        statusCode: null,
        contentType: null,
      };
    }
  }

  async discoverLayerManifests(): Promise<CatalogLayerManifest[]> {
    const xml = await this.getCapabilitiesDocument('WMS');
    const parsed = this.xmlParser.parse(xml) as WmsCapabilitiesDocument;
    const rootLayer = parsed.WMS_Capabilities?.Capability?.Layer
      ?? parsed.WMT_MS_Capabilities?.Capability?.Layer;

    if (!rootLayer) {
      this.logger.warn('No WMS layer tree found in GeoServer capabilities response.');
      return [];
    }

    const discoveredLayers = this.collectNamedLayers(rootLayer);
    const manifests = discoveredLayers.map((layer) => this.toCatalogLayerManifest(layer));

    this.logger.log(`Discovered ${manifests.length} layer(s) from GeoServer WMS capabilities.`);
    return manifests;
  }

  private async getCapabilitiesDocument(service: OgcService): Promise<string> {
    const response = await this.http.get<string>(this.pathFor(service), {
      params: this.paramsFor(service),
      responseType: 'text',
    });

    if (response.status < 200 || response.status >= 300 || typeof response.data !== 'string') {
      throw new Error(`GeoServer ${service} GetCapabilities returned status ${response.status}`);
    }

    return response.data;
  }

  private buildCapabilitiesUrl(service: OgcService): string {
    const base = this.config.geoserverUrl.replace(/\/$/, '');
    const path = this.pathFor(service).replace(/^\//, '');
    const params = new URLSearchParams(this.paramsFor(service));
    return `${base}/${path}?${params.toString()}`;
  }

  private pathFor(service: OgcService): string {
    return service === 'WMTS' ? '/gwc/service/wmts' : '/ows';
  }

  private paramsFor(service: OgcService): Record<string, string> {
    if (service === 'WMTS') {
      return { SERVICE: 'WMTS', REQUEST: 'GetCapabilities', VERSION: '1.0.0' };
    }

    return {
      service,
      version: service === 'WMS' ? '1.3.0' : '2.0.0',
      request: 'GetCapabilities',
    };
  }

  private resolveHeader(value: unknown): string | null {
    if (Array.isArray(value)) {
      return value[0] === undefined ? null : String(value[0]);
    }

    return value === undefined || value === null ? null : String(value);
  }

  private collectNamedLayers(layerNode: WmsLayerNode, inheritedStyles: string[] = []): DiscoveredLayer[] {
    const ownStyles = this.toArray(layerNode.Style)
      .map((style) => style.Name)
      .filter((styleName): styleName is string => Boolean(styleName));
    const styles = [...new Set([...inheritedStyles, ...ownStyles])];
    const children = this.toArray(layerNode.Layer);
    const layers: DiscoveredLayer[] = [];

    if (layerNode.Name) {
      layers.push({
        layerName: layerNode.Name,
        title: layerNode.Title ?? this.humanize(this.localName(layerNode.Name)),
        abstractText: layerNode.Abstract,
        workspace: this.workspaceName(layerNode.Name),
        styleNames: styles,
        keywords: this.extractKeywords(layerNode.KeywordList?.Keyword),
      });
    }

    for (const child of children) {
      layers.push(...this.collectNamedLayers(child, styles));
    }

    return this.deduplicateLayers(layers);
  }

  private toCatalogLayerManifest(layer: DiscoveredLayer): CatalogLayerManifest {
    const base = this.config.geoserverUrl.replace(/\/$/, '');
    const workspace = layer.workspace || 'general';
    const slug = this.slugify(this.localName(layer.layerName));
    const id = this.slugify(layer.layerName.replace(':', '-'));
    const style = layer.styleNames[0];

    return {
      id,
      slug,
      title: {
        fr: layer.title,
        en: layer.title,
      },
      theme: this.slugify(workspace),
      themeLabel: {
        fr: this.humanize(workspace),
        en: this.humanize(workspace),
      },
      service: {
        type: 'WMS',
        url: `${base}/${encodeURIComponent(workspace)}/wms`,
        wmsUrl: `${base}/${encodeURIComponent(workspace)}/wms`,
        wfsUrl: `${base}/${encodeURIComponent(workspace)}/ows?service=WFS`,
        wmtsUrl: `${base}/gwc/service/wmts`,
        legendUrl: this.buildLegendUrl(base, layer.layerName, style),
        workspace,
        layer: layer.layerName,
        style,
      },
      display: {
        defaultOpacity: 1,
        minZoom: 0,
        maxZoom: 22,
        visibleByDefault: false,
      },
      metadata: {
        descriptionFr: layer.abstractText,
        descriptionEn: layer.abstractText,
        keywords: layer.keywords,
      },
      sensitivity: 'public',
      popup: {
        enabled: false,
        fields: [],
      },
    };
  }

  private buildLegendUrl(base: string, layerName: string, style?: string): string {
    const params = new URLSearchParams({
      SERVICE: 'WMS',
      REQUEST: 'GetLegendGraphic',
      FORMAT: 'image/png',
      LAYER: layerName,
    });

    if (style) {
      params.set('STYLE', style);
    }

    return `${base}/wms?${params.toString()}`;
  }

  private extractKeywords(
    input: string | string[] | { '#text'?: string } | Array<string | { '#text'?: string }> | undefined,
  ): string[] {
    return this.toArray(input)
      .map((value) => (typeof value === 'string' ? value : value['#text']))
      .filter((keyword): keyword is string => Boolean(keyword))
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  private deduplicateLayers(layers: DiscoveredLayer[]): DiscoveredLayer[] {
    return [...new Map(layers.map((layer) => [layer.layerName, layer])).values()];
  }

  private workspaceName(layerName: string): string {
    return layerName.includes(':') ? layerName.split(':', 1)[0] : 'general';
  }

  private localName(layerName: string): string {
    return layerName.includes(':') ? layerName.split(':').slice(1).join(':') : layerName;
  }

  private slugify(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/-+/g, '-');
  }

  private humanize(code: string): string {
    return code
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private toArray<T>(value: T | T[] | undefined): T[] {
    if (value === undefined) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }
}
