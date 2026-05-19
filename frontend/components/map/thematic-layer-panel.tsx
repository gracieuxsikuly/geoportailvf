'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronRight, Eye, EyeOff, Info, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MAP_THEMATIC_GROUPS, layersForThematicGroup } from '@/lib/themes/map-thematics';
import { useLayerStore } from '@/store/layer.store';
import { useMapStore } from '@/store/map.store';
import { useUiStore } from '@/store/ui.store';
import { useLayers } from '@/hooks/use-catalog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import type { BasemapId } from '@/types/catalog';

export function ThematicLayerPanel() {
  const { t } = useTranslation('common');
  const locale = useUiStore((s) => s.locale);
  const { isLoading } = useLayers();
  const catalog = useLayerStore((s) => s.catalog);
  const layerState = useLayerStore((s) => s.layers);
  const setVisible = useLayerStore((s) => s.setVisible);
  const setOpacity = useLayerStore((s) => s.setOpacity);
  const basemap = useMapStore((s) => s.basemap);
  const setBasemap = useMapStore((s) => s.setBasemap);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      MAP_THEMATIC_GROUPS.map((g) => [g.id, g.defaultExpanded ?? false]),
    ),
  );

  const q = search.toLowerCase().trim();

  const groups = useMemo(() => {
    return MAP_THEMATIC_GROUPS.map((group) => {
      const title = locale === 'fr' ? group.titleFr : group.titleEn;
      if (q && !title.toLowerCase().includes(q) && !group.code.includes(q)) {
        const layers = catalog.filter((l) => group.themeIds.includes(l.themeId));
        const layerMatch = layers.some((l) => {
          const lt = locale === 'fr' ? l.titleFr : l.titleEn;
          return lt.toLowerCase().includes(q);
        });
        if (!layerMatch && group.id !== 'basemap') return null;
      }
      const groupLayers = catalog
        .filter((l) => group.themeIds.includes(l.themeId))
        .filter((l) => {
          if (!q) return true;
          const lt = locale === 'fr' ? l.titleFr : l.titleEn;
          return lt.toLowerCase().includes(q) || l.slug.includes(q);
        });
      return { group, layers: groupLayers };
    }).filter(Boolean) as Array<{
      group: (typeof MAP_THEMATIC_GROUPS)[number];
      layers: typeof catalog;
    }>;
  }, [catalog, locale, q]);

  function toggleGroup(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function activateGroupLayers(groupId: string) {
    const group = MAP_THEMATIC_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const ids = layersForThematicGroup(group, catalog);
    for (const layer of catalog) {
      setVisible(layer.id, ids.includes(layer.id));
    }
  }

  return (
    <div className="flex h-full flex-col bg-stone-50/50">
      {/* En-tête type geo.be */}
      <div className="border-b border-emerald-900/20 bg-gradient-to-br from-virunga-green to-virunga-forest px-5 py-5 text-white shadow-md">
        <h2 className="text-lg font-bold tracking-tight">{t('mapPanel.themesTitle')}</h2>
        <p className="mt-1 text-xs text-emerald-100/90">{t('mapPanel.datasetsTitle')}</p>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
          <Input
            className="rounded-lg border-0 bg-white pl-9 text-stone-900 shadow-sm ring-1 ring-white/20"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('search')}
          />
        </div>
      </div>

      <div className="border-b border-stone-200 bg-stone-50 px-4 py-2">
        <p className="text-xs text-stone-600">{t('mapPanel.classification')}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : null}

        <ul className="divide-y divide-stone-100">
          {groups.map(({ group, layers }) => {
            const title = locale === 'fr' ? group.titleFr : group.titleEn;
            const isOpen = expanded[group.id] ?? false;

            return (
              <li key={group.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-stone-50"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                >
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 text-stone-400 transition-transform',
                      isOpen && 'rotate-90',
                    )}
                  />
                  <span className="text-xs font-mono text-stone-400">{group.code}</span>
                  <span className="flex-1 text-sm font-medium text-stone-900">{title}</span>
                  {layers.length > 0 ? (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                      {layers.length}
                    </span>
                  ) : null}
                </button>

                {isOpen ? (
                  <div className="border-t border-stone-100 bg-stone-50/80 pb-2">
                    {group.basemapOptions ? (
                      <ul className="px-3 py-2">
                        {group.basemapOptions.map((opt) => (
                          <li key={opt.id}>
                            <button
                              type="button"
                              className={cn(
                                'w-full rounded-md px-3 py-2 text-left text-sm',
                                basemap === opt.id
                                  ? 'bg-emerald-100 font-medium text-virunga-green'
                                  : 'text-stone-700 hover:bg-white',
                              )}
                              onClick={() => setBasemap(opt.id as BasemapId)}
                            >
                              {locale === 'fr' ? opt.labelFr : opt.labelEn}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {layers.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between px-4 py-1">
                          <button
                            type="button"
                            className="text-xs font-medium text-virunga-green hover:underline"
                            onClick={() => activateGroupLayers(group.id)}
                          >
                            {t('mapPanel.activateAll')}
                          </button>
                          {group.pageSlug ? (
                            <Link
                              href={asRoute(`/themes/${group.pageSlug}`)}
                              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-virunga-green"
                            >
                              <Info className="h-3 w-3" />
                              {t('mapPanel.learnMore')}
                            </Link>
                          ) : null}
                        </div>
                        <ul>
                          {layers.map((layer) => {
                            const state = layerState[layer.id] ?? {
                              visible: false,
                              opacity: 1,
                              order: 0,
                            };
                            const layerTitle =
                              locale === 'fr' ? layer.titleFr : layer.titleEn;
                            return (
                              <li
                                key={layer.id}
                                className="border-t border-stone-100/80 px-4 py-2 first:border-t-0"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm text-stone-800">{layerTitle}</p>
                                  <button
                                    type="button"
                                    onClick={() => setVisible(layer.id, !state.visible)}
                                    className="shrink-0 rounded p-1 hover:bg-stone-200"
                                    aria-label={
                                      state.visible
                                        ? t('layersPanel.hide')
                                        : t('layersPanel.show')
                                    }
                                  >
                                    {state.visible ? (
                                      <Eye className="h-4 w-4 text-virunga-green" />
                                    ) : (
                                      <EyeOff className="h-4 w-4 text-stone-400" />
                                    )}
                                  </button>
                                </div>
                                {state.visible ? (
                                  <label className="mt-1 block text-xs text-stone-500">
                                    {t('layersPanel.opacity')}{' '}
                                    {Math.round(state.opacity * 100)}%
                                    <input
                                      type="range"
                                      min={0}
                                      max={1}
                                      step={0.05}
                                      value={state.opacity}
                                      onChange={(e) =>
                                        setOpacity(layer.id, Number(e.target.value))
                                      }
                                      className="mt-0.5 w-full accent-virunga-green"
                                    />
                                  </label>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    ) : !group.basemapOptions ? (
                      <p className="px-4 py-2 text-xs text-stone-500">
                        {t('mapPanel.noLayersYet')}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
