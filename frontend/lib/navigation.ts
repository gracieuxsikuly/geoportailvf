import type { Route } from 'next';

/** Cast dynamique pour Next.js typed routes */
export function asRoute(path: string): Route {
  return path as Route;
}
