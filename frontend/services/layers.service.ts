import { apiClient } from './api.client';
import { API_PREFIX } from '@/lib/api-config';
import type { Layer } from '@/types/catalog';
import { DEMO_LAYERS } from '@/lib/constants';

export type LayerDto = Layer;

export const layersService = {
  list: async (): Promise<Layer[]> => {
    try {
      const { data } = await apiClient.get<Layer[]>(`${API_PREFIX}/layers`);
      return data;
    } catch {
      return DEMO_LAYERS;
    }
  },

  bySlug: async (slug: string): Promise<Layer | null> => {
    try {
      const { data } = await apiClient.get<Layer>(`${API_PREFIX}/layers/${slug}`);
      return data;
    } catch {
      return DEMO_LAYERS.find((l) => l.slug === slug) ?? null;
    }
  },
};
