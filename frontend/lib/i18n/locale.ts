export type AppLocale = 'fr' | 'en';

export const LOCALE_COOKIE = 'virunga-locale';
export const DEFAULT_LOCALE: AppLocale = 'fr';

export function parseLocale(value?: string | null): AppLocale {
  return value === 'en' ? 'en' : 'fr';
}

export function setLocaleCookie(locale: AppLocale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}
