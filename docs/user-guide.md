# Guide utilisateur

Guide rapide de l'interface actuellement disponible.

## Accès

- page d'accueil : `/`
- carte interactive : `/map`
- page de présentation : `/about`

## Carte interactive

La page `/map` propose :

- une carte MapLibre centrée sur la zone des Virunga ;
- une liste des couches publiques exposées par le backend ;
- un interrupteur de visibilité pour chaque couche ;
- un curseur d'opacité pour chaque couche ;
- l'affichage des couches WMS provenant de GeoServer.

## Utilisation

1. ouvrir la page `/map` ;
2. cocher ou décocher une couche pour l'afficher ou la masquer ;
3. ajuster le curseur d'opacité pour mieux comparer les couches ;
4. utiliser les contrôles de navigation de la carte pour zoomer et se déplacer.

## Source des couches

- les couches ne viennent pas encore d'une base de données applicative ;
- elles sont décrites dans les manifests JSON du dossier `geoserver/layer-manifests/` ;
- le backend transforme ces manifests en catalogue API.

## Évolutions prévues

- enrichissement des pages thématiques ;
- recherche d'emplacements ;
- téléchargement de données ouvertes ;
- changement de langue complet FR/EN ;
- mode 3D ;
- intégration future de la couche de persistance applicative.
