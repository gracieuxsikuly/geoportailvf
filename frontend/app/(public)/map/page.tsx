'use client';

import { Suspense } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { MapView } from '@/components/map/map-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function MapPage() {
  return (
    <AppShell fullBleed hideFooter>
      <Suspense fallback={<Skeleton className="h-[calc(100vh-4rem)] w-full" />}>
        <MapView />
      </Suspense>
    </AppShell>
  );
}
