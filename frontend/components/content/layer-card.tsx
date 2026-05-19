import Link from 'next/link';
import { asRoute } from '@/lib/navigation';
import { Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Layer } from '@/types/catalog';

export function LayerCard({ layer, locale }: { layer: Layer; locale: 'fr' | 'en' }) {
  const title = locale === 'fr' ? layer.titleFr : layer.titleEn;
  const desc =
    locale === 'fr'
      ? layer.metadata?.descriptionFr
      : layer.metadata?.descriptionEn;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            <Link href={asRoute(`/catalog/${layer.slug}`)} className="hover:text-virunga-green">
              {title}
            </Link>
          </CardTitle>
          <Badge variant="outline">{layer.serviceType}</Badge>
        </div>
        {desc ? <CardDescription className="line-clamp-2">{desc}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex items-center justify-between text-xs text-stone-500">
        <span className="inline-flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          {layer.themeId}
        </span>
        <Link href={`/map?layers=${layer.id}`} className="font-medium text-virunga-green hover:underline">
          Voir sur la carte
        </Link>
      </CardContent>
    </Card>
  );
}
