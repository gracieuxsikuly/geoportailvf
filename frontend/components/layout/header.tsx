'use client';

import Image from 'next/image';
import Link from 'next/link';
import { asRoute } from '@/lib/navigation';
import { usePathname } from 'next/navigation';
import { Globe, Map, Menu } from 'lucide-react';
import { BRAND } from '@/lib/branding';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/ui.store';

const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/map', key: 'nav.map' },
  { href: '/catalog', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
] as const;

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const { locale, setLocale } = useUiStore();
  const isMap = pathname.startsWith('/map');

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b transition-shadow',
        isMap
          ? 'border-stone-200/90 bg-white shadow-sm'
          : 'border-stone-200/60 bg-white/90 shadow-sm backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          {onMenuClick ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
              aria-label={t('nav.menu')}
            >
              <Menu className="h-5 w-5" />
            </Button>
          ) : null}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src={BRAND.logo}
              alt={locale === 'fr' ? BRAND.logoAltFr : BRAND.logoAltEn}
              width={120}
              height={48}
              className="h-10 w-auto max-w-[140px] object-contain object-left transition group-hover:opacity-90"
              priority
            />
            <span className="hidden sm:block">
              <span className="block font-semibold leading-tight text-stone-900">{t('appName')}</span>
              <span className="block text-xs text-stone-500">{t('portal.tagline')}</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.key}
                href={asRoute(item.href)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-virunga-green text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-stone-200"
            onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
            aria-label={t('nav.language')}
          >
            <Globe className="h-4 w-4" />
            {locale.toUpperCase()}
          </Button>
          <Button asChild size="sm" className="hidden shadow-sm sm:inline-flex">
            <Link href="/map">
              <Map className="h-4 w-4" />
              {t('map')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
