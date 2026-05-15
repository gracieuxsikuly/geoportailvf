# GeoServer — Virunga WebGIS

L'instance GeoServer est **déjà déployée** et accessible sur :

> **https://gis.virunga.org/geoserver**

Ce dossier ne contient **aucun fichier de déploiement** GeoServer. Il regroupe les artefacts
versionnés que le portail utilise pour configurer / publier des couches sur cette instance.

## Contenu

- `styles/` — Styles SLD versionnés (à publier ou synchroniser via l'API REST GeoServer).
- `layer-manifests/` — Manifests JSON décrivant chaque couche à exposer dans le portail
  (mapping workspace/store/layerName + métadonnées + sensibilité).
- `publication-scripts/` — Scripts Node.js / shell pour pousser styles et publier des couches via
  l'API REST de GeoServer.

## Conventions

- Workspaces recommandés : `virunga`, `biodiv`, `mnt`, `tourisme`.
- Stores : préférer un store PostGIS unique par workspace, pointant sur le schéma métier existant.
- Projection canonique de stockage : **EPSG:4326**. Reprojection vers EPSG:3857 par GeoServer.
- Chaque couche **publique** doit avoir : titre FR/EN, mots-clés, abstract, contact, licence.

## Variables d'environnement nécessaires

- `GEOSERVER_URL`
- `GEOSERVER_ADMIN_USER`
- `GEOSERVER_ADMIN_PASSWORD`

## Voir aussi

- [../docs/geoserver-setup.md](../docs/geoserver-setup.md)
