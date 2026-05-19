'use client';

import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/app-shell';
import { HeroSection } from '@/components/content/hero-section';
import { PortalEntryCards } from '@/components/content/portal-entry-cards';
import { StatsSection } from '@/components/content/stats-section';
import { ThemeCard } from '@/components/content/theme-card';
import { THEME_PAGES } from '@/lib/themes/config';
import { useUiStore } from '@/store/ui.store';

export default function HomePage() {
  const { t } = useTranslation('common');
  const locale = useUiStore((s) => s.locale);

  return (
    <AppShell>
      <HeroSection title={t('home.title')} subtitle={t('home.subtitle')} ctaLabel={t('home.cta')} />
      <div className="relative z-10 -mt-6 pb-4">
        <PortalEntryCards />
      </div>
      <StatsSection locale={locale} />
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">{t('home.themesTitle')}</h2>
          <p className="mt-3 text-lg text-stone-600">{t('home.themesSubtitle')}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_PAGES.map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} locale={locale} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
