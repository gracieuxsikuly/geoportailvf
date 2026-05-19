const STATS = [
  { value: '7 800', labelFr: 'km² de superficie', labelEn: 'km² area' },
  { value: '196', labelFr: 'mammifères recensés', labelEn: 'recorded mammals' },
  { value: '706', labelFr: 'espèces d’oiseaux', labelEn: 'bird species' },
  { value: '2', labelFr: 'volcans actifs', labelEn: 'active volcanoes' },
];

export function StatsSection({ locale }: { locale: 'fr' | 'en' }) {
  return (
    <section className="border-y border-stone-200/80 bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <article
            key={stat.value}
            className="rounded-2xl border border-stone-100 bg-gradient-to-b from-white to-stone-50/80 p-6 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-virunga-green">{stat.value}</p>
            <p className="mt-2 text-sm text-stone-600">{locale === 'fr' ? stat.labelFr : stat.labelEn}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
