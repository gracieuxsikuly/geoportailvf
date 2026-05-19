'use client';

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { asRoute } from '@/lib/navigation';
import { Input } from '@/components/ui/input';
import { useLayerStore } from '@/store/layer.store';
import { useSearchStore } from '@/store/search.store';
import { useUiStore } from '@/store/ui.store';
import { VIRUNGA_CENTER } from '@/lib/constants';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const PLACES = [
  { id: 'goma', labelFr: 'Goma', labelEn: 'Goma', center: [29.22, -1.68] as [number, number], zoom: 10 },
  { id: 'rukoko', labelFr: 'Rutshuru', labelEn: 'Rutshuru', center: [29.35, -1.2] as [number, number], zoom: 10 },
  { id: 'virunga', labelFr: 'Parc des Virunga', labelEn: 'Virunga Park', center: VIRUNGA_CENTER, zoom: 8 },
];

export function MapSearch() {
  const router = useRouter();
  const locale = useUiStore((s) => s.locale);
  const catalog = useLayerStore((s) => s.catalog);
  const { query, setQuery, isOpen, setOpen } = useSearchStore();
  const debounced = useDebouncedValue(query, 300);

  const results = useMemo(() => {
    const q = debounced.toLowerCase().trim();
    if (!q) return [];
    const layerHits = catalog
      .filter((l) => {
        const t = locale === 'fr' ? l.titleFr : l.titleEn;
        return t.toLowerCase().includes(q) || l.slug.includes(q);
      })
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        type: 'layer' as const,
        labelFr: l.titleFr,
        labelEn: l.titleEn,
        href: `/catalog/${l.slug}`,
      }));
    const placeHits = PLACES.filter((p) => {
      const label = locale === 'fr' ? p.labelFr : p.labelEn;
      return label.toLowerCase().includes(q);
    }).map((p) => ({
      id: p.id,
      type: 'place' as const,
      labelFr: p.labelFr,
      labelEn: p.labelEn,
      center: p.center,
      zoom: p.zoom,
    }));
    return [...placeHits, ...layerHits];
  }, [debounced, catalog, locale]);

  return (
    <div className="absolute left-4 top-4 z-10 w-72 max-w-[calc(100%-8rem)]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
        <Input
          className="bg-white/95 pl-9 shadow"
          placeholder={locale === 'fr' ? 'Rechercher un lieu ou une couche…' : 'Search place or layer…'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="Recherche"
        />
      </div>
      {isOpen && results.length > 0 ? (
        <ul className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-stone-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50"
                onClick={() => {
                  if (r.type === 'place' && 'center' in r && r.center) {
                    const [lng, lat] = r.center;
                    router.push(asRoute(`/map?lng=${lng}&lat=${lat}&z=${r.zoom ?? 10}`));
                  } else if ('href' in r && r.href) {
                    router.push(asRoute(r.href));
                  }
                  setOpen(false);
                  setQuery('');
                }}
              >
                {locale === 'fr' ? r.labelFr : r.labelEn}
                <span className="ml-2 text-xs text-stone-400">{r.type}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
