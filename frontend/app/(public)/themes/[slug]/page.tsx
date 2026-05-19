'use client';

import Link from 'next/link';
import { asRoute } from '@/lib/navigation';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell } from '@/components/layout/app-shell';
import { getThemePageBySlug } from '@/lib/themes/config';
import { useUiStore } from '@/store/ui.store';
import { useLayers } from '@/hooks/use-catalog';
import { LayerCard } from '@/components/content/layer-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const MiniMap = dynamic(() => import('@/components/map/theme-mini-map').then((m) => m.ThemeMiniMap), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video w-full rounded-xl" />,
});

export default function ThemePage() {
  const params = useParams<{ slug: string }>();
  const config = getThemePageBySlug(params.slug);
  const locale = useUiStore((s) => s.locale);
  const { data: layers } = useLayers();

  if (!config) {
    return (
      <AppShell>
        <p className="p-12 text-center text-stone-600">Thématique introuvable.</p>
      </AppShell>
    );
  }

  const title = locale === 'fr' ? config.titleFr : config.titleEn;
  const intro = locale === 'fr' ? config.introFr : config.introEn;
  const reading = locale === 'fr' ? config.readingFr : config.readingEn;

  const related =
    layers?.filter(
      (l) =>
        config.themeIds.includes(l.themeId) ||
        config.defaultLayerSlugs?.includes(l.slug),
    ) ?? [];

  const slugs = config.defaultLayerSlugs?.length
    ? config.defaultLayerSlugs
    : related.map((l) => l.slug);

  return (
    <AppShell>
      <article className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-virunga-green">{config.code}</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">{title}</h1>
        <p className="mt-4 text-lg text-stone-600">{intro}</p>

        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200">
          <MiniMap layerSlugs={slugs} zoom={config.mapZoom} className="aspect-[21/9] w-full" />
        </div>

        <section className="mt-8 rounded-xl bg-emerald-50 p-6">
          <h2 className="font-semibold text-emerald-900">
            {locale === 'fr' ? 'Lire la carte' : 'Reading the map'}
          </h2>
          <p className="mt-2 text-stone-700">{reading}</p>
        </section>

        {related.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">{locale === 'fr' ? 'Couches liées' : 'Related layers'}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((layer) => (
                <LayerCard key={layer.id} layer={layer} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}

        <Button asChild className="mt-10">
          <Link href={asRoute(`/map?layers=${related.map((l) => l.id).join(',')}`)}>
            {locale === 'fr' ? 'Explorer en détail sur la carte' : 'Explore in detail on the map'}
          </Link>
        </Button>
      </article>
    </AppShell>
  );
}
