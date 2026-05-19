'use client';

import Link from 'next/link';
import { asRoute } from '@/lib/navigation';
import { X } from 'lucide-react';
import { useMapStore } from '@/store/map.store';

export function MapPopup() {
  const popup = useMapStore((s) => s.popup);
  const setPopup = useMapStore((s) => s.setPopup);

  if (!popup) return null;

  return (
    <div className="absolute left-4 top-20 z-20 w-72 max-w-[calc(100%-2rem)] rounded-xl border border-stone-200 bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          {popup.category ? (
            <p className="text-xs uppercase tracking-wide text-virunga-green">{popup.category}</p>
          ) : null}
          <h3 className="font-semibold text-stone-900">{popup.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => setPopup(null)}
          className="rounded p-1 hover:bg-stone-100"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <dl className="mt-3 space-y-2">
        {popup.fields.map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-stone-500">{f.label}</dt>
            <dd className="text-sm text-stone-800">{f.value}</dd>
          </div>
        ))}
      </dl>
      {popup.layerSlug ? (
        <Link href={asRoute(`/catalog/${popup.layerSlug}`)} className="mt-3 inline-block text-sm text-virunga-green hover:underline">
          Fiche couche →
        </Link>
      ) : null}
    </div>
  );
}
