import type { Layer, LayerMetadata } from '@/types/catalog';
import { Badge } from '@/components/ui/badge';

export function MetadataPanel({
  layer,
  metadata,
  locale,
}: {
  layer: Layer;
  metadata?: LayerMetadata | null;
  locale: 'fr' | 'en';
}) {
  const title = locale === 'fr' ? layer.titleFr : layer.titleEn;
  const meta = metadata ?? layer.metadata;

  const rows = [
    { label: locale === 'fr' ? 'Source' : 'Source', value: meta?.sourceOrg },
    { label: locale === 'fr' ? 'Mise à jour' : 'Updated', value: meta?.updateDate },
    { label: 'Licence', value: meta?.license },
    {
      label: locale === 'fr' ? 'Qualité' : 'Quality',
      value: meta?.qualityLevel ? `${meta.qualityLevel}/5` : undefined,
    },
    { label: locale === 'fr' ? 'Thématique' : 'Theme', value: layer.themeId },
    { label: 'Service', value: `${layer.serviceType} · ${layer.layerName}` },
  ].filter((r) => r.value);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
        <Badge className="mt-2">{layer.serviceType}</Badge>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{row.label}</dt>
            <dd className="mt-1 text-sm text-stone-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
