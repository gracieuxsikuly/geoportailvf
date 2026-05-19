'use client';

import { Crosshair, Ruler, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/store/map.store';
import { useUiStore } from '@/store/ui.store';
import { BasemapSwitcher } from './basemap-switcher';

export function MapControls() {
  const cursorLngLat = useMapStore((s) => s.cursorLngLat);
  const measureActive = useMapStore((s) => s.measureActive);
  const setMeasureActive = useMapStore((s) => s.setMeasureActive);
  const clearMeasure = useMapStore((s) => s.clearMeasure);
  const togglePanel = useUiStore((s) => s.togglePanel);

  return (
    <>
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <BasemapSwitcher />
        <Button
          type="button"
          size="icon"
          variant={measureActive ? 'default' : 'outline'}
          className="bg-white shadow"
          onClick={() => {
            if (measureActive) clearMeasure();
            setMeasureActive(!measureActive);
          }}
          aria-label="Mesurer une distance"
        >
          <Ruler className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="bg-white shadow"
          onClick={() => togglePanel('share')}
          aria-label="Partager la carte"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {cursorLngLat ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-white/95 px-3 py-1.5 font-mono text-xs text-stone-700 shadow">
          <Crosshair className="h-3.5 w-3.5 text-virunga-green" aria-hidden />
          {cursorLngLat[1].toFixed(5)}°, {cursorLngLat[0].toFixed(5)}°
        </div>
      ) : null}
    </>
  );
}
