'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/app-shell';
import { LayerCard } from '@/components/content/layer-card';
import { EmptyState } from '@/components/content/empty-state';
import { ErrorState } from '@/components/content/error-state';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCatalog } from '@/hooks/use-catalog';
import { useUiStore } from '@/store/ui.store';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export default function CatalogPage() {
  const { t } = useTranslation('common');
  const locale = useUiStore((s) => s.locale);
  const { data, isLoading, isError, refetch } = useCatalog();
  const [query, setQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const debounced = useDebouncedValue(query, 300);

  const themes = useMemo(() => {
    if (!data?.layers) return [];
    return [...new Set(data.layers.map((l) => l.themeId))];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data?.layers) return [];
    const q = debounced.toLowerCase();
    return data.layers.filter((l) => {
      if (themeFilter && l.themeId !== themeFilter) return false;
      const title = locale === 'fr' ? l.titleFr : l.titleEn;
      return !q || title.toLowerCase().includes(q) || l.slug.includes(q);
    });
  }, [data, debounced, themeFilter, locale]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <h1 className="text-3xl font-bold text-stone-900">{t('catalog.title')}</h1>
        <p className="mt-2 max-w-2xl text-stone-600">{t('catalog.subtitle')}</p>
        {data?.refreshedAt ? (
          <p className="mt-1 text-xs text-stone-400">
            Dernière mise à jour catalogue : {new Date(data.refreshedAt).toLocaleString(locale)}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Input
            className="max-w-md"
            placeholder={t('search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setThemeFilter(null)}
              className={`rounded-full px-3 py-1 text-sm ${!themeFilter ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100'}`}
            >
              Toutes
            </button>
            {themes.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setThemeFilter(id)}
                className={`rounded-full px-3 py-1 text-sm ${themeFilter === id ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100'}`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="mt-8">
            <ErrorState message="Impossible de charger le catalogue." onRetry={() => void refetch()} />
          </div>
        ) : null}

        {!isLoading && !isError && filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucune couche publique trouvée." />
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((layer) => (
            <LayerCard key={layer.id} layer={layer} locale={locale} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
