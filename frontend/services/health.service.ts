import { apiClient } from './api.client';
import { API_PREFIX } from '@/lib/api-config';
import type { HealthResponse } from '@/types/catalog';

export const healthService = {
  check: async (): Promise<HealthResponse> => {
    const { data } = await apiClient.get<HealthResponse>(`${API_PREFIX}/health`);
    return data;
  },
};
