export interface ThemePageConfig {
  slug: string;
  code: string;
  icon: string;
  titleFr: string;
  titleEn: string;
  introFr: string;
  introEn: string;
  readingFr: string;
  readingEn: string;
  themeIds: string[];
  defaultLayerSlugs?: string[];
  mapZoom?: number;
}

export const THEME_PAGES: ThemePageConfig[] = [
  {
    slug: 'localisation-limites',
    code: '02-limites',
    icon: 'map-pin',
    titleFr: 'Localisation & limites',
    titleEn: 'Location & boundaries',
    introFr:
      'Découvrez la position du Parc National des Virunga en République Démocratique du Congo, au cœur de la région des Grands Lacs.',
    introEn:
      'Discover the location of Virunga National Park in the Democratic Republic of Congo, at the heart of the Great Lakes region.',
    readingFr:
      'Les limites du parc délimitent une aire protégée d’exception. Zoomez pour comparer l’emprise du parc aux frontières nationales et aux villes proches.',
    readingEn:
      'Park boundaries define an exceptional protected area. Zoom in to compare the park extent with national borders and nearby cities.',
    themeIds: ['limites-administratives'],
    defaultLayerSlugs: ['limite-parc-virunga'],
    mapZoom: 7,
  },
  {
    slug: 'milieu-physique',
    code: '03-milieu',
    icon: 'mountain',
    titleFr: 'Milieu physique',
    titleEn: 'Physical environment',
    introFr:
      'Relief volcanique, lacs, rivières et savanes : le parc réunit des paysages contrastés façonnés par le Rift et les volcans.',
    introEn:
      'Volcanic relief, lakes, rivers and savannas: the park brings together contrasting landscapes shaped by the Rift and volcanoes.',
    readingFr:
      'Observez les dégradés de relief et l’hydrographie pour comprendre les contrastes montagne / lac / plaine.',
    readingEn:
      'Observe relief gradients and hydrography to understand mountain / lake / plain contrasts.',
    themeIds: ['relief', 'hydrographie'],
    mapZoom: 8,
  },
  {
    slug: 'biodiversite',
    code: '04-biodiversite',
    icon: 'leaf',
    titleFr: 'Biodiversité',
    titleEn: 'Biodiversity',
    introFr:
      'Forêts tropicales, gorilles de montagne, éléphants et oiseaux endémiques : le Virunga est l’un des sites les plus riches au monde.',
    introEn:
      'Tropical forests, mountain gorillas, elephants and endemic birds: Virunga is one of the richest sites in the world.',
    readingFr:
      'Les couches d’habitats et de faune emblématique illustrent l’importance mondiale du parc pour la conservation.',
    readingEn:
      'Habitat and flagship species layers illustrate the park’s global conservation importance.',
    themeIds: ['biodiversite'],
    mapZoom: 9,
  },
  {
    slug: 'population-activites',
    code: '05-population',
    icon: 'users',
    titleFr: 'Population & activités humaines',
    titleEn: 'Population & human activities',
    introFr:
      'Des millions de personnes vivent autour du parc. Agriculture, pêche et pressions sur les ressources façonnent les enjeux locaux.',
    introEn:
      'Millions of people live around the park. Agriculture, fishing and resource pressures shape local challenges.',
    readingFr:
      'Repérez villages et zones d’activités pour comprendre la cohabitation entre populations et conservation.',
    readingEn:
      'Locate villages and activity zones to understand coexistence between communities and conservation.',
    themeIds: [],
    mapZoom: 8,
  },
  {
    slug: 'tourisme-patrimoine',
    code: '06-tourisme',
    icon: 'compass',
    titleFr: 'Tourisme & patrimoine',
    titleEn: 'Tourism & heritage',
    introFr:
      'Sites emblématiques, sentiers et infrastructures d’accueil : explorez le patrimoine naturel et culturel du parc.',
    introEn:
      'Landmark sites, trails and visitor facilities: explore the park’s natural and cultural heritage.',
    readingFr:
      'Les points d’intérêt touristiques indiquent les zones d’expérience et d’interprétation disponibles.',
    readingEn:
      'Tourism points of interest indicate areas for experience and interpretation.',
    themeIds: ['tourisme'],
    mapZoom: 9,
  },
  {
    slug: 'conservation-enjeux',
    code: '07-conservation',
    icon: 'shield',
    titleFr: 'Conservation & enjeux',
    titleEn: 'Conservation & challenges',
    introFr:
      'Menaces, zones protégées et actions de Virunga Fondation : comprendre les défis et les réponses de conservation.',
    introEn:
      'Threats, protected zones and Virunga Foundation actions: understand conservation challenges and responses.',
    readingFr:
      'Superposez zones de conservation et pressions pour lire les tensions et les efforts de restauration.',
    readingEn:
      'Overlay conservation zones and pressures to read tensions and restoration efforts.',
    themeIds: [],
    mapZoom: 8,
  },
  {
    slug: 'infrastructures',
    code: '08-infrastructures',
    icon: 'route',
    titleFr: 'Infrastructures & accessibilité',
    titleEn: 'Infrastructure & accessibility',
    introFr:
      'Routes, pistes, ports et aéroports : les réseaux d’accès structurent la mobilité autour du parc.',
    introEn:
      'Roads, tracks, ports and airports: access networks structure mobility around the park.',
    readingFr:
      'Les axes majeurs montrent comment les visiteurs et les communautés rejoignent les entrées du parc.',
    readingEn:
      'Major routes show how visitors and communities reach park entrances.',
    themeIds: [],
    mapZoom: 7,
  },
];

export function getThemePageBySlug(slug: string): ThemePageConfig | undefined {
  return THEME_PAGES.find((t) => t.slug === slug);
}
