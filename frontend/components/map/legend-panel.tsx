'use client';

import { useMemo } from 'react';
import { useLayerStore } from '@/store/layer.store';
import { buildLegendUrl } from '@/lib/map/wms';
import { useUiStore } from '@/store/ui.store';

export function LegendPanel() {
  const locale = useUiStore((s) => s.locale);
  const catalog = useLayerStore((s) => s.catalog);
  const layers = useLayerStore((s) => s.layers);

  const visible = useMemo(
    () => catalog.filter((l) => layers[l.id]?.visible),
    [catalog, layers],
  );

  if (visible.length === 0) return null;

  return (
    <aside
      className="absolute bottom-4 right-4 z-10 max-h-[40vh] w-56 overflow-y-auto rounded-xl border border-stone-200 bg-white/95 p-3 shadow-lg backdrop-blur"
      aria-label="Légende"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Légende</p>
      <ul className="space-y-3">
        {visible.map((layer) => {
          const url = buildLegendUrl(layer);
          const title = locale === 'fr' ? layer.titleFr : layer.titleEn;
          return (
            <li key={layer.id}>
              <p className="text-xs font-medium text-stone-800">{title}</p>
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={`Légende ${title}`}
                  className="mt-1 max-w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <p className="mt-1 text-xs text-stone-400">Légende indisponible</p>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
