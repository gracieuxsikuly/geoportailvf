'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { asRoute } from '@/lib/navigation';
import { THEME_CARD_IMAGE_FOCUS, THEME_CARD_IMAGES } from '@/lib/media/virunga-images';
import type { ThemePageConfig } from '@/lib/themes/config';
import { cn } from '@/lib/utils';

/** Cartes à fond clair — panneau de survol clair + texte foncé */
const LIGHT_MAP_SLUGS = new Set([
  'localisation-limites',
  'population-activites',
  'infrastructures',
  'tourisme-patrimoine',
]);

function cardTone(slug: string): 'light' | 'conservation' | 'dark' {
  if (slug === 'conservation-enjeux') return 'conservation';
  if (LIGHT_MAP_SLUGS.has(slug)) return 'light';
  return 'dark';
}

export function ThemeCard({ theme, locale }: { theme: ThemePageConfig; locale: 'fr' | 'en' }) {
  const title = locale === 'fr' ? theme.titleFr : theme.titleEn;
  const intro = locale === 'fr' ? theme.introFr : theme.introEn;
  const imageSrc = THEME_CARD_IMAGES[theme.slug] ?? '/images/themes/biodiversite-carte.jpg';
  const imageFocus = THEME_CARD_IMAGE_FOCUS[theme.slug] ?? '50% 50%';
  const exploreLabel = locale === 'fr' ? 'Explorer' : 'Explore';
  const tone = cardTone(theme.slug);
  const useLightHoverPanel = tone === 'light' || tone === 'conservation';

  return (
    <Link
      href={asRoute(`/themes/${theme.slug}`)}
      className="group block overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-virunga-green"
    >
      <article>
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
          <Image
            src={imageSrc}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]',
              tone === 'conservation' ? 'group-hover:brightness-100' : 'group-hover:brightness-[0.88]',
            )}
            style={{ objectPosition: imageFocus }}
          />

          {/* Titre au repos */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:opacity-0',
              tone === 'conservation'
                ? 'bg-gradient-to-t from-black/75 via-black/25 to-transparent'
                : 'bg-gradient-to-t from-black/90 via-black/55 to-black/10',
            )}
          >
            <p
              className={cn(
                'text-[10px] font-semibold uppercase tracking-[0.18em] drop-shadow-md',
                tone === 'light' ? 'text-stone-100' : 'text-emerald-100',
              )}
            >
              {locale === 'fr' ? 'Thématique' : 'Theme'} · {theme.code}
            </p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-white drop-shadow-lg">{title}</h3>
          </div>

          {/* Survol — panneau bas solide (carte visible au-dessus) */}
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 flex max-h-[72%] flex-col gap-2 p-4 pt-5',
              'translate-y-full opacity-0 transition-all duration-300 ease-out',
              'group-hover:translate-y-0 group-hover:opacity-100',
              useLightHoverPanel
                ? cn(
                    'border-t bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.14)] backdrop-blur-md',
                    theme.slug === 'tourisme-patrimoine'
                      ? 'border-teal-600/40 bg-white/[0.98]'
                      : 'border-stone-200/80 bg-white/97',
                  )
                : 'border-t border-stone-700/50 bg-stone-950/97 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm',
            )}
            aria-hidden
          >
            <h3
              className={cn(
                'text-base font-bold leading-snug',
                useLightHoverPanel ? 'text-stone-900' : 'text-white',
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                'line-clamp-4 text-sm leading-relaxed',
                useLightHoverPanel
                  ? theme.slug === 'tourisme-patrimoine'
                    ? 'text-stone-700'
                    : 'text-stone-600'
                  : 'text-stone-200',
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
