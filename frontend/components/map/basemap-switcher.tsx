'use client';

import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BASEMAPS } from '@/lib/map/basemaps';
import { useMapStore } from '@/store/map.store';
import { useUiStore } from '@/store/ui.store';
import { useState } from 'react';

export function BasemapSwitcher() {
  const [open, setOpen] = useState(false);
  const basemap = useMapStore((s) => s.basemap);
  const setBasemap = useMapStore((s) => s.setBasemap);
  const locale = useUiStore((s) => s.locale);

  return (
    <div className="relative">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="bg-white shadow"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Fond de carte"
      >
        <Layers className="h-4 w-4" />
      </Button>
      {open ? (
        <ul className="absolute right-0 mt-2 w-44 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
          {BASEMAPS.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                className={`w-full px-3 py-2 text-left text-sm hover:bg-stone-50 ${basemap === b.id ? 'font-semibold text-virunga-green' : 'text-stone-700'}`}
                onClick={() => {
                  setBasemap(b.id);
                  setOpen(false);
                }}
              >
                {locale === 'fr' ? b.labelFr : b.labelEn}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
