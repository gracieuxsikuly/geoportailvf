import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '@/locales/fr/common.json';
import en from '@/locales/en/common.json';
import type { AppLocale } from './locale';
import { DEFAULT_LOCALE } from './locale';

const resources = {
  fr: { common: fr },
  en: { common: en },
};

/** Initialise i18next une seule fois. Les changements de langue passent par `changeLanguage` dans un effet. */
export function initI18n(locale: AppLocale = DEFAULT_LOCALE) {
  if (i18n.isInitialized) {
    return i18n;
  }

  void i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    // Pas de LanguageDetector : évite le mismatch SSR (navigateur/localStorage ≠ serveur)
    react: { useSuspense: false },
  });

  return i18n;
}

export default i18n;
