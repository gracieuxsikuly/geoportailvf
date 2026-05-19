/** Calculs géographiques pour l’outil de mesure */

export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLon = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function lineLengthKm(points: [number, number][]): number {
  if (points.length < 2) return 0;
  return points.slice(1).reduce((sum, pt, i) => sum + haversineKm(points[i], pt), 0);
}

/** Aire d’un polygone (lon/lat) — approximation locale en km² */
export function polygonAreaKm2(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const latMid = points.reduce((s, p) => s + p[1], 0) / points.length;
  const latScale = 111.32;
  const lonScale = 111.32 * Math.cos((latMid * Math.PI) / 180);
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const x1 = points[i][0] * lonScale;
    const y1 = points[i][1] * latScale;
    const x2 = points[j][0] * lonScale;
    const y2 = points[j][1] * latScale;
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum / 2);
}
