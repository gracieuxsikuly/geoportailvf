'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MediaSlide } from '@/lib/media/virunga-images';
import { useUiStore } from '@/store/ui.store';

const INTERVAL_MS = 3000;

export function HeroCarousel({ slides }: { slides: MediaSlide[] }) {
  const locale = useUiStore((s) => s.locale);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={slide.src}
            alt={locale === 'fr' ? slide.altFr : slide.altEn}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover motion-reduce:animate-none animate-[hero-zoom_12s_ease-out_infinite_alternate]"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-virunga-forest/90 via-virunga-forest/55 to-virunga-forest/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      <div className="absolute bottom-6 right-6 flex gap-2 lg:bottom-8 lg:right-8">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80',
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

