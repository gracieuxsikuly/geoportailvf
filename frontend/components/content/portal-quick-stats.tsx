'use client';

import { Database, Layers, Map, Tags } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '@/hooks/use-catalog';

export function PortalQuickStats() {
  const { t } = useTranslation('common');
  const { data } = useCatalog();

  const stats = [
    {
      icon: Layers,
      value: data?.layerCount ?? '—',
      label: t('portal.statLayers'),
    },
    {
      icon: Tags,
      value: data?.themes.length ?? '—',
      label: t('portal.statThemes'),
    },
    {
      icon: Map,
      value: 'WMS',
      label: t('portal.statServices'),
    },
    {
      icon: Database,
      value: 'GeoServer',
      label: t('portal.statSource'),
    },
  ];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:px-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-virunga-lake">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              <p className="text-xs text-stone-500">{stat.label}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
