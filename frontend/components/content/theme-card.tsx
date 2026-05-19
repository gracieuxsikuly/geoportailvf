'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { asRoute } from '@/lib/navigation';
import { THEME_CARD_IMAGES } from '@/lib/media/virunga-images';
import type { ThemePageConfig } from '@/lib/themes/config';
import { cn } from '@/lib/utils';

export function ThemeCard({ theme, locale }: { theme: ThemePageConfig; locale: 'fr' | 'en' }) {
  const title = locale === 'fr' ? theme.titleFr : theme.titleEn;
  const intro = locale === 'fr' ? theme.introFr : theme.introEn;
  const imageSrc = THEME_CARD_IMAGES[theme.slug] ?? '/images/themes/biodiversite.jpg';
  const exploreLabel = locale === 'fr' ? 'Explorer' : 'Explore';

  return (
    <Link
      href={asRoute(`/themes/${theme.slug}`)}
      className="group block overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-virunga-green"
    >
      <article>
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <div
            className={cn(
              'absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4',
              'transition-opacity duration-300 group-hover:opacity-0',
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/90">
              {locale === 'fr' ? 'Thématique' : 'Theme'} · {theme.code}
            </p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-white">{title}</h3>
          </div>

          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-virunga-forest/92 p-5 backdrop-blur-[2px]',
              'opacity-0 transition-all duration-300 ease-out',
              'group-hover:opacity-100',
            )}
            aria-hidden
          >
            <p
              className={cn(
                'max-w-sm text-center text-sm leading-relaxed text-emerald-50/95',
                'translate-y-3 opacity-0 transition-all duration-300 delay-75',
                'group-hover:translate-y-0 group-hover:opacity-100',
              )}
            >
              {intro}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-4 py-3">
          <span className="text-sm font-semibold text-stone-900 line-clamp-1">{title}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-virunga-green">
            {exploreLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
