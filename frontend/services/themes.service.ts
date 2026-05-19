import { apiClient } from './api.client';
import { API_PREFIX } from '@/lib/api-config';
import type { Theme } from '@/types/catalog';
import { DEMO_LAYERS } from '@/lib/constants';

export const themesService = {
  list: async (): Promise<Theme[]> => {
    try {
      const { data } = await apiClient.get<Theme[]>(`${API_PREFIX}/themes`);
      return data;
    } catch {
      return [
        {
          id: 'limites-administratives',
          code: 'limites-administratives',
          labelFr: 'Limites administratives',
          labelEn: 'Administrative boundaries',
          sortOrder: 0,
          isVisible: true,
          layers: DEMO_LAYERS,
        },
      ];
    }
  },

  byCode: async (code: string): Promise<Theme | null> => {
    const themes = await themesService.list();
    return themes.find((t) => t.code === code || t.id === code) ?? null;
  },
};
