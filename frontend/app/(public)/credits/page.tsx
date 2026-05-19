import { StaticPage } from '@/components/content/static-page';

export default function CreditsPage() {
  return (
    <StaticPage title="Sources et crédits">
      <ul>
        <li>Données géospatiales : GeoServer Virunga — gis.virunga.org</li>
        <li>Fonds de carte : OpenTopoMap, CARTO, Esri (selon le fond sélectionné)</li>
        <li>Moteur cartographique : MapLibre GL JS</li>
        <li>Portail : Virunga Fondation / ICCN (selon couche)</li>
      </ul>
    </StaticPage>
  );
}
