import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-virunga-green to-virunga-earth text-white">
      <div className="max-w-2xl px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Virunga WebGIS</h1>
        <p className="mt-4 text-lg opacity-90">
          Portail cartographique du Parc National des Virunga — Virunga Fondation.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/map"
            className="rounded-md bg-white px-6 py-3 font-medium text-virunga-green shadow hover:bg-gray-100"
          >
            Ouvrir la carte
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-white px-6 py-3 font-medium hover:bg-white/10"
          >
            En savoir plus
          </Link>
        </div>
        <p className="mt-12 text-sm opacity-75">
          Données : <span className="font-mono">gis.virunga.org</span>
        </p>
      </div>
    </main>
  );
}
