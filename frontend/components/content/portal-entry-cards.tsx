'use client';

import Link from 'next/link';
import { BookOpen, Map, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { asRoute } from '@/lib/navigation';

export function PortalEntryCards() {
  const { t } = useTranslation('common');

  const entries = [
    {
      href: '/map',
      icon: Map,
      title: t('portal.mapTitle'),
      description: t('portal.mapDesc'),
      cta: t('portal.mapCta'),
      gradient: 'from-virunga-green/10 to-emerald-50',
      iconBg: 'bg-emerald-100 text-virunga-green',
    },
    {
      href: '/catalog',
      icon: BookOpen,
      title: t('portal.catalogTitle'),
      description: t('portal.catalogDesc'),
      cta: t('portal.catalogCta'),
      gradient: 'from-sky-50 to-blue-50/80',
      iconBg: 'bg-sky-100 text-virunga-lake',
    },
  ] as const;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-2 lg:px-8">
      {entries.map((entry) => {
        const Icon = entry.icon;
        return (
          <Link
            key={entry.href}
            href={asRoute(entry.href)}
            className={`group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-br ${entry.gradient} p-8 shadow-lg shadow-stone-900/5 transition duration-300 hover:-translate-y-1 hover:border-virunga-green/25 hover:shadow-xl`}
          >
            <div className="relative flex flex-col">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${entry.iconBg} shadow-sm transition group-hover:scale-105`}
              >
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-stone-900">{entry.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{entry.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-virunga-green">
                {entry.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
