import { StaticPage } from '@/components/content/static-page';

export default function PrivacyPage() {
  return (
    <StaticPage title="Politique de confidentialité">
      <p>
        Ce portail public ne propose pas de compte utilisateur. Aucune donnée personnelle n’est
        collectée à des fins de profilage. Les journaux techniques du serveur peuvent enregistrer
        des adresses IP à des fins de sécurité et de maintenance.
      </p>
    </StaticPage>
  );
}
