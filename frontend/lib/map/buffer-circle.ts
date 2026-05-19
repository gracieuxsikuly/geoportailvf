/** Cercle géographique approximatif (km) autour d’un point [lng, lat] */

export function circleRing(
  center: [number, number],
  radiusKm: number,
  steps = 64,
): [number, number][] {
  const [lng, lat] = center;
  const latRad = (lat * Math.PI) / 180;
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * Math.cos(latRad);
  const ring: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dLng = (radiusKm / kmPerDegLng) * Math.cos(angle);
    const dLat = (radiusKm / kmPerDegLat) * Math.sin(angle);
    ring.push([lng + dLng, lat + dLat]);
  }

  return ring;
}

export function boundsFromRing(ring: [number, number][]): [[number, number], [number, number]] {
  const lngs = ring.map((p) => p[0]);
  const lats = ring.map((p) => p[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}
