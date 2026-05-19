'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import { layersService } from '@/services/layers.service';
import { themesService } from '@/services/themes.service';

const CATALOG_STALE_MS = 5 * 60 * 1000;

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: () => catalogService.getCatalog(),
    staleTime: CATALOG_STALE_MS,
    refetchInterval: CATALOG_STALE_MS,
    refetchOnWindowFocus: true,
  });
}

export function useLayers() {
  return useQuery({
    queryKey: ['layers'],
    queryFn: () => layersService.list(),
    staleTime: CATALOG_STALE_MS,
    refetchInterval: CATALOG_STALE_MS,
  });
}

export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: () => themesService.list(),
    staleTime: CATALOG_STALE_MS,
  });
}

export function useLayer(slug: string) {
  return useQuery({
    queryKey: ['layer', slug],
    queryFn: () => layersService.bySlug(slug),
    enabled: Boolean(slug),
  });
}
