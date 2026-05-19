'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BackendBanner } from './backend-banner';
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
  const isMap = pathname.startsWith('/map');
  const { mobileDrawerOpen, setMobileDrawerOpen } = useUiStore();

  return (
    <div className={cn('flex min-h-screen flex-col', isMap && 'h-screen overflow-hidden')}>
      <BackendBanner />
      <Header onMenuClick={isMap ? () => setMobileDrawerOpen(true) : undefined} />
      <main className={cn('flex-1', fullBleed && 'min-h-0')}>{children}</main>
      {!hideFooter && !isMap ? <Footer /> : null}
      {isMap ? (
        <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen} title="Thématiques" side="left">
          <ThematicLayerPanel />
        </Sheet>
      ) : null}
    </div>
  );
}
