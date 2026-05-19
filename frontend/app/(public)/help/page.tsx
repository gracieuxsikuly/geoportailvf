import { StaticPage } from '@/components/content/static-page';

export default function HelpPage() {
  return (
    <StaticPage title="Aide utilisateur">
      <h2>Navigation</h2>
      <p>
        Utilisez la carte interactive pour activer les couches, changer le fond de carte, mesurer
        des distances et partager une vue via l’URL.
      </p>
      <h2>Catalogue</h2>
      <p>
        Le catalogue liste toutes les couches publiques avec leurs métadonnées. Chaque fiche couche
        propose un aperçu cartographique et un lien vers la carte.
      </p>
      <h2>Accessibilité</h2>
      <p>
        Le portail vise la conformité WCAG 2.2 : contrastes suffisants, navigation clavier et
        libellés explicites sur les contrôles.
      </p>
    </StaticPage>
  );
}
