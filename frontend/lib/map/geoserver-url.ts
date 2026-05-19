import { GEOSERVER_URL } from '@/lib/constants';

const GEOSERVER_PROXY = '/api/geoserver';

/** Réécrit une URL GeoServer absolue vers le proxy Next.js (évite CORS / NetworkError). */
export function toProxiedGeoserverUrl(url: string): string {
  if (typeof window === 'undefined') {
    return url;
  }

  const normalized = url.replace(/\/+$/, '');
  const base = GEOSERVER_URL.replace(/\/+$/, '');

  if (normalized.startsWith(base)) {
    return `${GEOSERVER_PROXY}${normalized.slice(base.length)}`;
  }

  // Fallback : remplace le host connu
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('virunga.org')) {
      return `${GEOSERVER_PROXY}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    /* ignore */
  }

  return url;
}

export function wmsProxyBase(): string {
  if (typeof window !== 'undefined') {
    return `${GEOSERVER_PROXY}/wms`;
  }
  return `${GEOSERVER_URL.replace(/\/$/, '')}/wms`;
}
