'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/store/map.store';
import { useLayerStore } from '@/store/layer.store';
import { useUiStore } from '@/store/ui.store';
import { buildMapShareUrl } from '@/lib/map/url-state';

export function MapSharePanel() {
  const activePanel = useUiStore((s) => s.activePanel);
  const setActivePanel = useUiStore((s) => s.setActivePanel);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const basemap = useMapStore((s) => s.basemap);
  const layers = useLayerStore((s) => s.layers);
  const catalog = useLayerStore((s) => s.catalog);
  const [copied, setCopied] = useState(false);

  if (activePanel !== 'share') return null;

  const visibleIds = catalog.filter((l) => layers[l.id]?.visible).map((l) => l.id);
  const url = buildMapShareUrl({
    lng: center[0],
    lat: center[1],
    zoom,
    basemap,
    visibleLayerIds: visibleIds,
  });

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="absolute bottom-4 left-4 z-20 w-80 rounded-xl border border-stone-200 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Partager la carte</h3>
        <Button type="button" variant="ghost" size="sm" onClick={() => setActivePanel(null)}>
          Fermer
        </Button>
      </div>
      <p className="mt-2 text-xs text-stone-500">L’URL conserve la position, le zoom et les couches visibles.</p>
      <p className="mt-2 break-all rounded bg-stone-50 p-2 font-mono text-xs">{url}</p>
      <Button type="button" className="mt-3 w-full" onClick={() => void copyLink()}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copié' : 'Copier le lien'}
      </Button>
    </div>
  );
}
