'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLayoutEffect, useState, type ReactNode } from 'react';
import type { AppLocale } from '@/lib/i18n/locale';
import { syncUiStoreLocale } from '@/store/ui.store';
import { I18nProvider } from './i18n-provider';

export function AppProviders({
  initialLocale,
  children,
}: {
  initialLocale: AppLocale;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    syncUiStoreLocale(initialLocale);
  }, [initialLocale]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 60_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
    </QueryClientProvider>
  );
}
