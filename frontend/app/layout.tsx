import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { AppProviders } from '@/components/providers/app-providers';
import { BRAND } from '@/lib/branding';
import { LOCALE_COOKIE, parseLocale } from '@/lib/i18n/locale';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Virunga WebGIS — Parc National des Virunga',
    template: '%s | Virunga WebGIS',
  },
  description:
    'Portail cartographique public du Parc National des Virunga — Virunga Fondation.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Virunga WebGIS',
    description: 'Portail cartographique du Parc National des Virunga',
    type: 'website',
  },
  icons: {
    icon: BRAND.logo,
    apple: BRAND.logo,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html lang={initialLocale} className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <AppProviders initialLocale={initialLocale}>{children}</AppProviders>
      </body>
    </html>
  );
}
