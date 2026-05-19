'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Header } from './header';
import { Footer } from './footer';
import { BackendBanner } from './backend-banner';
import { MobileNav } from './mobile-nav';
import { useUiStore } from '@/store/ui.store';
import { Sheet } from '@/components/ui/sheet';
import { ThematicLayerPanel } from '@/components/map/thematic-layer-panel';
import { cn } from '@/lib/utils';

export function AppShell({
  children,
  fullBleed = false,
  hideFooter = false,
}: {
  children: React.ReactNode;
  fullBleed?: boolean;
  hideFooter?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const isMap = pathname.startsWith('/map');
  const { mobileDrawerOpen, setMobileDrawerOpen } = useUiStore();

  return (
    <div className={cn('flex min-h-screen flex-col', isMap && 'h-screen overflow-hidden')}>
      <BackendBanner />
      <Header onMenuClick={() => setMobileDrawerOpen(true)} />
      <main className={cn('flex-1', fullBleed && 'min-h-0')}>{children}</main>
      {!hideFooter && !isMap ? <Footer /> : null}
      <Sheet
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
        title={isMap ? t('mapPanel.themesTitle') : t('nav.menu')}
        side="left"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <MobileNav onNavigate={() => setMobileDrawerOpen(false)} />
          {isMap ? (
            <div className="min-h-0 flex-1 overflow-hidden border-t border-stone-200">
              <ThematicLayerPanel />
            </div>
          ) : null}
        </div>
      </Sheet>
    </div>
  );
}
