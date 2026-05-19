import type { CatalogResponse } from '@/types/catalog';
import { themesService } from './themes.service';
import { healthService } from './health.service';

export const catalogService = {
  getCatalog: async (): Promise<CatalogResponse> => {
    const [themes, health] = await Promise.all([
      themesService.list(),
      healthService.check().catch(() => null),
    ]);

    const layers = themes.flatMap((theme) =>
      theme.layers.map((layer) => ({
        ...layer,
        theme: {
          id: theme.id,
          code: theme.code,
          labelFr: theme.labelFr,
          labelEn: theme.labelEn,
          sortOrder: theme.sortOrder,
          isVisible: theme.isVisible,
        },
      })),
    );

    return {
      themes,
      layers,
      layerCount: layers.length,
      refreshedAt: health?.timestamp,
    };
  },
};
