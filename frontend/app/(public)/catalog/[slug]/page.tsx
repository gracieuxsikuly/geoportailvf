'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell } from '@/components/layout/app-shell';
import { MetadataPanel } from '@/components/content/metadata-panel';
import { ErrorState } from '@/components/content/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useLayer } from '@/hooks/use-catalog';
import { useUiStore } from '@/store/ui.store';
import { buildLegendUrl } from '@/lib/map/wms';

const MiniMap = dynamic(() => import('@/components/map/theme-mini-map').then((m) => m.ThemeMiniMap), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video w-full rounded-xl" />,
});

export default function LayerDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const locale = useUiStore((s) => s.locale);
  const { data: layer, isLoading, isError } = useLayer(slug);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
        {isLoading ? <Skeleton className="h-8 w-64" /> : null}
        {isError || (!isLoading && !layer) ? (
          <ErrorState message="Couche introuvable." />
        ) : null}
        {layer ? (
          <>
            <MetadataPanel layer={layer} locale={locale} />
            <div className="mt-8 overflow-hidden rounded-xl border border-stone-200">
              <MiniMap
                layerSlugs={[layer.slug]}
                zoom={10}
                className="aspect-video w-full"
              />
            </div>
            {buildLegendUrl(layer) ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-stone-700">Légende</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={buildLegendUrl(layer)!} alt="Légende" className="mt-2 max-h-48" />
              </div>
            ) : null}
            <Button asChild className="mt-8">
              <Link href={`/map?layers=${layer.id}`}>Explorer sur la carte</Link>
            </Button>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
