import type { BasemapId } from '@/types/catalog';

export interface MapThematicGroup {
  id: string;
  code: string;
  titleFr: string;
  titleEn: string;
  subtitleFr?: string;
  subtitleEn?: string;
  themeIds: string[];
  pageSlug?: string;
  defaultExpanded?: boolean;
  basemapOptions?: Array<{ id: BasemapId; labelFr: string; labelEn: string }>;
}

/** Thématiques cartographiques du portail (structure geo.be) */
export const MAP_THEMATIC_GROUPS: MapThematicGroup[] = [
  {
    id: 'basemap',
    code: '01',
    titleFr: 'Fonds de carte',
    titleEn: 'Base maps',
    subtitleFr: 'Relief, satellite, fond institutionnel',
    themeIds: [],
    defaultExpanded: true,
    basemapOptions: [
      { id: 'terrain', labelFr: 'Relief / MNT (défaut)', labelEn: 'Terrain / DEM (default)' },
      { id: 'satellite', labelFr: 'Imagerie satellite', labelEn: 'Satellite imagery' },
      { id: 'light', labelFr: 'Fond clair institutionnel', labelEn: 'Light institutional' },
      { id: 'relief', labelFr: 'Relief ombré', labelEn: 'Hillshade relief' },
      { id: 'print', labelFr: 'Fond impression', labelEn: 'Print base' },
    ],
  },
  {
    id: 'limites',
    code: '02',
    titleFr: 'Limites et localisation',
    titleEn: 'Boundaries & location',
    themeIds: ['limites-administratives'],
    pageSlug: 'localisation-limites',
    defaultExpanded: true,
  },
  {
    id: 'milieu-physique',
    code: '03',
    titleFr: 'Milieu physique',
    titleEn: 'Physical environment',
    themeIds: ['relief', 'hydrographie'],
    pageSlug: 'milieu-physique',
  },
  {
    id: 'biodiversite',
    code: '04',
    titleFr: 'Biodiversité',
    titleEn: 'Biodiversity',
    themeIds: ['biodiversite'],
    pageSlug: 'biodiversite',
  },
  {
    id: 'population',
    code: '05',
    titleFr: 'Population et activités humaines',
    titleEn: 'Population & human activities',
    themeIds: [],
    pageSlug: 'population-activites',
  },
  {
    id: 'tourisme',
    code: '06',
    titleFr: 'Tourisme et patrimoine',
    titleEn: 'Tourism & heritage',
    themeIds: ['tourisme'],
    pageSlug: 'tourisme-patrimoine',
  },
  {
    id: 'conservation',
    code: '07',
    titleFr: 'Conservation et enjeux',
    titleEn: 'Conservation & challenges',
    themeIds: [],
    pageSlug: 'conservation-enjeux',
  },
  {
    id: 'infrastructures',
    code: '08',
    titleFr: 'Infrastructures et accessibilité',
    titleEn: 'Infrastructure & accessibility',
    themeIds: [],
    pageSlug: 'infrastructures',
  },
];

export function layersForThematicGroup(
  group: MapThematicGroup,
  catalog: Array<{ id: string; themeId: string }>,
): string[] {
  if (group.themeIds.length === 0) return [];
  return catalog.filter((l) => group.themeIds.includes(l.themeId)).map((l) => l.id);
}
