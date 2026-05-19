'use client';

import { useTranslation } from 'react-i18next';

/** Bandeau institutionnel type geo.be */
export function PortalHero() {
  const { t } = useTranslation('common');

  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-virunga-lake">
          Virunga Fondation
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {t('portal.title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">{t('portal.subtitle')}</p>
      </div>
    </section>
  );
}
