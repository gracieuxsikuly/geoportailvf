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
 * Cartes « Explorer par thématique » — une image distincte par thème.
 */
export const THEME_CARD_IMAGES: Record<string, string> = {
  'localisation-limites': '/images/themes/localisation-limites.jpg',
  'milieu-physique': '/images/themes/milieu-physique.jpg',
  biodiversite: '/images/themes/biodiversite.jpg',
  'population-activites': '/images/themes/population-activites.jpg',
  'tourisme-patrimoine': '/images/themes/tourisme-patrimoine.jpg',
  'conservation-enjeux': '/images/themes/conservation-enjeux.jpg',
  infrastructures: '/images/themes/infrastructures.jpg',
};
