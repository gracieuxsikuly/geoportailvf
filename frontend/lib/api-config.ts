/**
 * En navigateur : proxy Next.js same-origin (/api/backend → backend NestJS).
 * Évite les erreurs CORS et "Network Error" quand le front tourne sur :3000.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/backend';
  }
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
  return `${backend.replace(/\/$/, '')}/api`;
}

export const API_PREFIX = '/v1';
