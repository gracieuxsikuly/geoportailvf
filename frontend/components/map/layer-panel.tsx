'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { useLayerStore } from '@/store/layer.store';
import { useUiStore } from '@/store/ui.store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLayers } from '@/hooks/use-catalog';

export function LayerPanel() {
  const { t } = useTranslation('common');
  const locale = useUiStore((s) => s.locale);
  const { isLoading } = useLayers();
  const catalog = useLayerStore((s) => s.catalog);
  const layers = useLayerStore((s) => s.layers);
  const searchQuery = useLayerStore((s) => s.searchQuery);
  const themeFilter = useLayerStore((s) => s.themeFilter);
  const setSearchQuery = useLayerStore((s) => s.setSearchQuery);
  const setThemeFilter = useLayerStore((s) => s.setThemeFilter);
  const setVisible = useLayerStore((s) => s.setVisible);
  const setOpacity = useLayerStore((s) => s.setOpacity);

  const themes = useMemo(() => {
    const ids = new Set(catalog.map((l) => l.themeId));
    return [...ids];
  }, [catalog]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...catalog]
      .filter((l) => !themeFilter || l.themeId === themeFilter)
      .filter((l) => {
        const title = locale === 'fr' ? l.titleFr : l.titleEn;
        return !q || title.toLowerCase().includes(q) || l.slug.includes(q);
      })
      .sort((a, b) => (layers[a.id]?.order ?? 0) - (layers[b.id]?.order ?? 0));
  }, [catalog, themeFilter, searchQuery, locale, layers]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-stone-200 p-4">
        <h2 className="text-lg font-semibold text-stone-900">{t('layers')}</h2>
        <Input
          className="mt-3"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label={t('search')}
        />
        <div className="mt-3 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setThemeFilter(null)}
            className={`rounded-full px-2.5 py-1 text-xs ${!themeFilter ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}
          >
            {t('layersPanel.all')}
          </button>
          {themes.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setThemeFilter(id)}
              className={`rounded-full px-2.5 py-1 text-xs ${themeFilter === id ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : null}

        {!isLoading && filtered.length === 0 ? (
          <p className="text-sm text-stone-500">{t('layersPanel.empty')}</p>
        ) : null}

        <ul className="space-y-3">
          {filtered.map((layer) => {
            const state = layers[layer.id] ?? { visible: false, opacity: 1, order: 0 };
            const title = locale === 'fr' ? layer.titleFr : layer.titleEn;
            return (
              <li key={layer.id} className="rounded-xl border border-stone-200 bg-stone-50/50 p-3">
                <div className="flex items-start gap-2">
                  <GripVertical className="mt-1 h-4 w-4 shrink-0 text-stone-300" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-stone-900">{title}</p>
                      <button
                        type="button"
                        onClick={() => setVisible(layer.id, !state.visible)}
                        aria-label={state.visible ? t('layersPanel.hide') : t('layersPanel.show')}
                        className="rounded p-1 hover:bg-stone-200"
                      >
                        {state.visible ? (
                          <Eye className="h-4 w-4 text-virunga-green" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-stone-400" />
                        )}
                      </button>
                    </div>
                    <Badge variant="muted" className="mt-1">
                      {layer.serviceType}
                    </Badge>
                    <label className="mt-3 block text-xs text-stone-500">
                      {t('layersPanel.opacity')} {Math.round(state.opacity * 100)}%
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={state.opacity}
                        onChange={(e) => setOpacity(layer.id, Number(e.target.value))}
                        className="mt-1 w-full accent-virunga-green"
                      />
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
