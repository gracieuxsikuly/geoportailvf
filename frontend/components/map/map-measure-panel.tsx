'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { lineLengthKm, polygonAreaKm2 } from '@/lib/map/measure';
import { useMapStore } from '@/store/map.store';
import { cn } from '@/lib/utils';

export function MapMeasurePanel() {
  const { t } = useTranslation('common');
  const measureMode = useMapStore((s) => s.measureMode);
  const measurePoints = useMapStore((s) => s.measurePoints);
  const setMeasureMode = useMapStore((s) => s.setMeasureMode);
  const clearMeasure = useMapStore((s) => s.clearMeasure);
  const finishMeasure = useMapStore((s) => s.finishMeasure);

  if (!measureMode) return null;

  const distanceKm = lineLengthKm(measurePoints);
  const areaKm2 =
    measureMode === 'area' && measurePoints.length >= 3
      ? polygonAreaKm2(measurePoints)
      : 0;

  return (
    <div className="absolute bottom-24 left-3 z-10 max-w-xs rounded-xl border border-stone-200/90 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:bottom-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {t('mapMeasure.title')}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setMeasureMode('line')}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium',
            measureMode === 'line'
              ? 'bg-virunga-green text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
          )}
        >
          {t('mapMeasure.distance')}
        </button>
        <button
          type="button"
          onClick={() => setMeasureMode('area')}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium',
            measureMode === 'area'
              ? 'bg-virunga-green text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
          )}
        >
          {t('mapMeasure.area')}
        </button>
      </div>
      <p className="mt-3 text-xs text-stone-600">{t('mapMeasure.hint')}</p>
      <dl className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">{t('mapMeasure.points')}</dt>
          <dd className="font-mono font-medium">{measurePoints.length}</dd>
        </div>
        {measurePoints.length >= 2 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">{t('mapMeasure.distanceLabel')}</dt>
            <dd className="font-mono font-medium">{distanceKm.toFixed(2)} km</dd>
          </div>
        ) : null}
        {measureMode === 'area' && measurePoints.length >= 3 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">{t('mapMeasure.areaLabel')}</dt>
            <dd className="font-mono font-medium">{areaKm2.toFixed(2)} km²</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        {measureMode === 'area' && measurePoints.length >= 3 ? (
          <Button type="button" size="sm" variant="outline" onClick={finishMeasure}>
            {t('mapMeasure.finish')}
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="ghost" onClick={clearMeasure}>
          {t('mapMeasure.clear')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setMeasureMode(null)}>
          {t('mapMeasure.close')}
        </Button>
      </div>
    </div>
  );
}
