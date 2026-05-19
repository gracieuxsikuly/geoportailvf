'use client';

import { LocateFixed, Minus, Mountain, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { VIRUNGA_BOUNDS } from '@/lib/constants';
import { useMapStore } from '@/store/map.store';
import { cn } from '@/lib/utils';

export function MapViewportControls() {
  const { t } = useTranslation('common');
  const map = useMapStore((s) => s.mapInstance);

  const zoomIn = () => map?.zoomIn({ duration: 200 });
  const zoomOut = () => map?.zoomOut({ duration: 200 });

  const centerOnPark = () => {
    if (!map) return;
    map.fitBounds(
      [
        [VIRUNGA_BOUNDS[0][0], VIRUNGA_BOUNDS[0][1]],
        [VIRUNGA_BOUNDS[1][0], VIRUNGA_BOUNDS[1][1]],
      ],
      { padding: 48, duration: 800 },
    );
  };

  const locateUser = () => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: Math.max(map.getZoom(), 12),
          duration: 800,
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <div
      className="absolute bottom-52 right-3 z-10 flex flex-col overflow-hidden rounded-lg border border-stone-200/90 bg-white shadow-lg sm:bottom-56"
      role="group"
      aria-label={t('mapControls.group')}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none border-b border-stone-100 hover:bg-stone-50"
        onClick={zoomIn}
        disabled={!map}
        aria-label={t('mapControls.zoomIn')}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none border-b border-stone-100 hover:bg-stone-50"
        onClick={zoomOut}
        disabled={!map}
        aria-label={t('mapControls.zoomOut')}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          'h-10 w-10 rounded-none border-b border-stone-100 hover:bg-stone-50',
          'text-virunga-green',
        )}
        onClick={centerOnPark}
        disabled={!map}
        aria-label={t('mapControls.centerPark')}
      >
        <Mountain className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none hover:bg-stone-50"
        onClick={locateUser}
        disabled={!map}
        aria-label={t('mapControls.locate')}
      >
        <LocateFixed className="h-4 w-4" />
      </Button>
    </div>
  );
}
