'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '@/hooks/use-catalog';
import { useUiStore } from '@/store/ui.store';
import { asRoute } from '@/lib/navigation';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

/** Section « Mises à jour récemment » (inspirée geo.be) */
export function RecentUpdates() {
  const { t } = useTranslation('common');
  const locale = useUiStore((s) => s.locale);
  const { data, isLoading } = useCatalog();

  const layers = [...(data?.layers ?? [])]
    .sort((a, b) => {
      const da = a.metadata?.updateDate ?? '';
      const db = b.metadata?.updateDate ?? '';
      return db.localeCompare(da);
    })
    .slice(0, 6);

  return (
    <section className="border-t border-stone-200 bg-stone-50 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="text-2xl font-bold text-stone-900">{t('portal.recentTitle')}</h2>
        <p className="mt-1 text-sm text-stone-600">{t('portal.recentSubtitle')}</p>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
            {layers.map((layer) => {
              const title = locale === 'fr' ? layer.titleFr : layer.titleEn;
              const date = layer.metadata?.updateDate;
              const source = layer.metadata?.sourceOrg;
              return (
                <li key={layer.id}>
                  <Link
                    href={asRoute(`/catalog/${layer.slug}`)}
                    className="flex flex-col gap-2 px-5 py-4 transition hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{layer.serviceType}</Badge>
                        <span className="text-xs text-stone-400">{layer.themeId}</span>
                      </div>
                      <h3 className="mt-1 font-medium text-stone-900 group-hover:text-virunga-green">
                        {title}
                      </h3>
                      {source ? <p className="mt-0.5 text-xs text-stone-500">{source}</p> : null}
                    </div>
                    {date ? (
                      <time className="shrink-0 text-xs text-stone-400">
                        {new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                          timeZone: 'UTC',
                        })}
                      </time>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
