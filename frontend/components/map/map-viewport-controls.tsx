'use client';

import { LocateFixed, Minus, Mountain, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { boundsFromRing, circleRing } from '@/lib/map/buffer-circle';
import { USER_LOCATION_BUFFER_KM, VIRUNGA_BOUNDS } from '@/lib/constants';
import { useMapStore } from '@/store/map.store';
import { cn } from '@/lib/utils';

export function MapViewportControls() {
  const { t } = useTranslation('common');
  const map = useMapStore((s) => s.mapInstance);
  const userLocation = useMapStore((s) => s.userLocation);
  const setUserLocation = useMapStore((s) => s.setUserLocation);

  const zoomIn = () => map?.zoomIn({ duration: 200 });
  const zoomOut = () => map?.zoomOut({ duration: 200 });

  const centerOnPark = () => {
    if (!map) return;
    setUserLocation(null);
    map.fitBounds(
      [
        [VIRUNGA_BOUNDS[0][0], VIRUNGA_BOUNDS[0][1]],
        [VIRUNGA_BOUNDS[1][0], VIRUNGA_BOUNDS[1][1]],
      ],
      { padding: 48, duration: 800 },
    );
  };

  const locateUser = () => {
    if (!map) return;

    if (userLocation) {
      setUserLocation(null);
      return;
    }

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(center);
        const ring = circleRing(center, USER_LOCATION_BUFFER_KM);
        map.fitBounds(boundsFromRing(ring), { padding: 56, duration: 800, maxZoom: 13 });
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
        className={cn(
          'h-10 w-10 rounded-none hover:bg-stone-50',
          userLocation && 'bg-blue-50 text-blue-700 hover:bg-blue-100',
        )}
        onClick={locateUser}
        disabled={!map}
        aria-label={t('mapControls.locate')}
        aria-pressed={Boolean(userLocation)}
      >
        <LocateFixed className="h-4 w-4" />
      </Button>
    </div>
  );
}
