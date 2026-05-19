import Link from 'next/link';
import type { Route } from 'next';
import { Map, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroCarousel } from '@/components/content/hero-carousel';
import { HERO_ANIMAL_SLIDES } from '@/lib/media/virunga-images';
import { asRoute } from '@/lib/navigation';

export function HeroSection({
  title,
  subtitle,
  ctaHref = '/map' as Route,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  ctaHref?: Route;
  ctaLabel: string;
}) {
  return (
    <section className="relative min-h-[min(88vh,720px)] overflow-hidden bg-virunga-forest text-white">
      <HeroCarousel slides={HERO_ANIMAL_SLIDES} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(26,120,194,0.25),transparent)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(14,122,62,0.3),transparent)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-white/5" />

      <div className="relative z-10 mx-auto flex min-h-[min(88vh,720px)] max-w-7xl flex-col justify-center px-4 py-24 lg:px-8">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 backdrop-blur-sm">
          Parc National des Virunga
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-emerald-50/90 sm:text-xl">{subtitle}</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            size="lg"
            className="h-12 bg-white px-8 text-base font-semibold text-virunga-green shadow-lg shadow-black/20 hover:bg-emerald-50"
          >
            <Link href={ctaHref}>
              <Map className="h-5 w-5" />
              {ctaLabel}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-2 border-white/50 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/15"
          >
            <Link href={asRoute('/catalog')}>
              <Layers className="h-5 w-5" />
              Explorer le catalogue
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
