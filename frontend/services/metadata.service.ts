import { apiClient } from './api.client';
import { API_PREFIX } from '@/lib/api-config';
import type { LayerMetadata } from '@/types/catalog';

export const metadataService = {
  byLayerId: async (layerId: string): Promise<LayerMetadata | null> => {
    try {
      const { data } = await apiClient.get<LayerMetadata | null>(
        `${API_PREFIX}/metadata/layer/${layerId}`,
      );
      return data;
    } catch {
      return null;
    }
  },
};
