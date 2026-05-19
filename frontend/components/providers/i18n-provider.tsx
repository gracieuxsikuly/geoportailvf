'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n } from '@/lib/i18n/config';
import type { AppLocale } from '@/lib/i18n/locale';
import { useUiStore } from '@/store/ui.store';

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: AppLocale;
  children: ReactNode;
}) {
  const i18n = useMemo(() => initI18n(initialLocale), [initialLocale]);
  const locale = useUiStore((s) => s.locale);

  useEffect(() => {
    if (i18n.language === locale) return;
    void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
