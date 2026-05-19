'use client';

import Link from 'next/link';
import { asRoute } from '@/lib/navigation';
import { PartnerLogos } from '@/components/layout/partner-logos';
import { useTranslation } from 'react-i18next';

const LINKS = [
  { href: '/about', key: 'footer.about' },
  { href: '/parc', key: 'footer.park' },
  { href: '/legal', key: 'footer.legal' },
  { href: '/privacy', key: 'footer.privacy' },
  { href: '/credits', key: 'footer.credits' },
] as const;

export function Footer() {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 text-white">
      <div className="absolute inset-0 bg-virunga-forest" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_0%,rgba(26,120,194,0.28),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_100%,rgba(14,122,62,0.35),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-white/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="flex flex-col items-center border-b border-white/15 pb-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">
            {t('footer.partners')}
          </p>
          <div className="mt-6 w-full">
            <PartnerLogos />
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-emerald-100">Virunga Fondation</p>
            <p className="mt-2 max-w-sm text-sm text-emerald-50/85">{t('footer.tagline')}</p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="Liens institutionnels">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={asRoute(link.href)}
                className="text-emerald-50/85 transition-colors hover:text-white"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="text-sm text-emerald-50/75">
            <p>{t('footer.dataSource')}</p>
            <p className="mt-1 font-mono text-xs text-emerald-100/70">gis.virunga.org</p>
          </div>
        </div>
        <p className="mt-8 border-t border-white/15 pt-6 text-xs text-emerald-100/70">
          © {year} Virunga Fondation — {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
