import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Virunga WebGIS — Parc National des Virunga',
  description:
    'Portail cartographique du Parc National des Virunga — Virunga Fondation. Données géospatiales, biodiversité, conservation.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Virunga WebGIS',
    description: 'Portail cartographique du Parc National des Virunga',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
