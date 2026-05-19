'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { healthService } from '@/services/health.service';
import { useTranslation } from 'react-i18next';

export function BackendBanner() {
  const { t } = useTranslation('common');
  const { isError, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => healthService.check(),
    retry: false,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  if (isLoading || !isError) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900"
    >
      <span className="inline-flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
        {t('portal.backendOffline')}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">npm run dev:backend</code>
      </span>
    </div>
  );
}
