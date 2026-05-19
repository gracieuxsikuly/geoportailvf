/** Visuels locaux — /public/images/ */

export interface MediaSlide {
  src: string;
  altFr: string;
  altEn: string;
}

/** Faune & flore — carrousel hero */
export const VIRUNGA_WILDLIFE = {
  gorillaNdeki: '/images/hero/gorilla-ndeki.jpg',
  gorillaTaggart: '/images/hero/gorilla-taggart.jpg',
  hippo: '/images/hero/hippo-virunga.jpg',
  forest: '/images/hero/forest.jpg',
} as const;

export const HERO_ANIMAL_SLIDES: MediaSlide[] = [
  {
    src: VIRUNGA_WILDLIFE.gorillaNdeki,
    altFr: 'Bébé gorille Ndeki — Parc National des Virunga',
    altEn: 'Baby gorilla Ndeki — Virunga National Park',
  },
  {
    src: VIRUNGA_WILDLIFE.gorillaTaggart,
    altFr: 'Gorille de montagne dans la forêt du Virunga',
    altEn: 'Mountain gorilla in Virunga forest',
  },
  {
    src: VIRUNGA_WILDLIFE.hippo,
    altFr: 'Hippopotames du Parc National des Virunga',
    altEn: 'Hippos of Virunga National Park',
  },
  {
    src: VIRUNGA_WILDLIFE.forest,
    altFr: 'Forêt tropicale du Parc National des Virunga',
    altEn: 'Tropical forest of Virunga National Park',
  },
];

/**
 * Vignettes cartographiques « Explorer par thématique » — une carte distincte par thème.
 * Régénération : `python scripts/fetch-theme-map-previews.py`
 *
 * Crédits : Wikimedia Commons (écorégions WWF, cartes admin.) ;
 * fonds © OpenStreetMap (ODbL) via Carto.
 */
export const THEME_CARD_IMAGES: Record<string, string> = {
  'localisation-limites': '/images/themes/localisation-limites-carte.jpg',
  'milieu-physique': '/images/themes/milieu-physique-carte.jpg',
  biodiversite: '/images/themes/biodiversite-carte.jpg',
  'population-activites': '/images/themes/population-activites-carte.jpg',
  'tourisme-patrimoine': '/images/themes/tourisme-patrimoine-carte.jpg',
  'conservation-enjeux': '/images/themes/conservation-enjeux-carte.jpg',
  infrastructures: '/images/themes/infrastructures-carte.jpg',
};

/** Point focal du cadrage (object-position) — adapté à chaque carte. */
export const THEME_CARD_IMAGE_FOCUS: Record<string, string> = {
  'localisation-limites': '50% 48%',
  'milieu-physique': '52% 42%',
  biodiversite: '48% 45%',
  'population-activites': '58% 50%',
  'tourisme-patrimoine': '45% 55%',
  'conservation-enjeux': '50% 50%',
  infrastructures: '50% 52%',
};
