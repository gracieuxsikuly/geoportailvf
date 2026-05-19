'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLayers } from '@/hooks/use-catalog';
import { useLayerStore } from '@/store/layer.store';
import { useMapStore } from '@/store/map.store';
import { parseMapUrlState } from '@/lib/map/url-state';
import { VIRUNGA_CENTER, VIRUNGA_ZOOM } from '@/lib/constants';
import { ThematicLayerPanel } from './thematic-layer-panel';
import { MapControls } from './map-controls';
import { MapViewportControls } from './map-viewport-controls';
import { LegendPanel } from './legend-panel';
import { MapPopup } from './map-popup';
import { MapSearch } from './map-search';
import { MapSharePanel } from './map-share-panel';
import { MapErrorState } from './map-error-state';
import { Skeleton } from '@/components/ui/skeleton';

const MapCanvas = dynamic(() => import('./map-canvas').then((m) => m.MapCanvas), {
  ssr: false,
  loading: () => <Skeleton className="absolute inset-0" />,
});

export function MapView() {
  const searchParams = useSearchParams();
  const { data: layers, isLoading, isError, refetch } = useLayers();
  const initFromCatalog = useLayerStore((s) => s.initFromCatalog);
  const setView = useMapStore((s) => s.setView);
  const setBasemap = useMapStore((s) => s.setBasemap);
  const applyPreset = useLayerStore((s) => s.applyPreset);

  useEffect(() => {
    if (!layers?.length) return;
    initFromCatalog(layers);

    const url = parseMapUrlState(searchParams);
    if (url.lng != null && url.lat != null) {
      setView([url.lng, url.lat], url.zoom ?? VIRUNGA_ZOOM);
    }
    if (url.basemap) setBasemap(url.basemap);
    if (url.layers?.length) applyPreset(url.layers, true);
  }, [layers, searchParams, initFromCatalog, setView, setBasemap, applyPreset]);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] min-h-0">
      <aside className="hidden w-[min(100%,400px)] shrink-0 flex-col border-r border-stone-200/90 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.12)] lg:flex">
        <ThematicLayerPanel />
      </aside>

      <div className="relative min-h-0 flex-1">
        {isLoading ? <Skeleton className="absolute inset-0" /> : null}
        {isError ? (
          <div className="absolute inset-4 z-10">
            <MapErrorState onRetry={() => void refetch()} />
          </div>
        ) : null}
        <MapCanvas />
        <MapControls />
        <MapViewportControls />
        <LegendPanel />
        <MapPopup />
        <MapSearch />
        <MapSharePanel />
      </div>
    </div>
  );
}
