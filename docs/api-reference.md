# API Reference

Base URL : `https://virunga.example.org/api/v1`

Documentation interactive : `/api/docs` (Swagger UI).

Important : dans l'état actuel du projet, l'API retourne un catalogue construit à partir des manifests du dossier `geoserver/layer-manifests/`. Elle ne dépend pas encore d'une base de données applicative.

## Endpoints principaux

| Méthode | Chemin                          | Description                          |
|---------|---------------------------------|--------------------------------------|
| GET     | `/api/v1/health`                | État du service courant              |
| GET     | `/api/v1/themes`                | Liste des groupes thématiques        |
| GET     | `/api/v1/layers`                | Liste des couches publiques          |
| GET     | `/api/v1/layers/:slug`          | Détail d'une couche                  |
| GET     | `/api/v1/metadata/layer/:id`    | Métadonnées ISO d'une couche         |
| GET     | `/api/v1/geoserver/capabilities`| Statut GeoServer + URL canonique     |

## Exemple : healthcheck

```json
{
  "status": "ok",
  "mode": "geoserver-catalog",
  "geoserver": "https://gis.virunga.org/geoserver",
  "layerCount": 1,
  "timestamp": "2026-05-15T09:25:30.149Z"
}
```

## Exemple : couche publique

```json
{
  "id": "virunga-boundary",
  "slug": "limite-parc-virunga",
  "titleFr": "Limite du Parc National des Virunga",
  "titleEn": "Virunga National Park Boundary",
  "themeId": "limites-administratives",
  "serviceType": "WMS",
  "geoserverUrl": "https://gis.virunga.org/geoserver/wms",
  "workspace": "virunga",
  "layerName": "virunga:virunga_boundary",
  "styleName": "virunga_boundary",
  "defaultOpacity": 0.8,
  "minZoom": 5,
  "maxZoom": 18,
  "isVisibleDefault": true,
  "isPublic": true,
  "sortOrder": 0,
  "sensitivityLevel": "public"
}
```

## Contrat actuel avec le frontend

- la page `/map` du frontend appelle `/api/v1/layers` ;
- chaque couche WMS retournée est injectée dans MapLibre comme raster source ;
- l'opacité et la visibilité sont pilotées côté frontend.

## WebSocket

- Namespace : `/realtime`
- Événements : à définir (Dev A) — notifications, mises à jour de couches, etc.

## Format réponse erreur

```json
{
  "statusCode": 404,
  "message": "Layer not found",
  "error": "Not Found"
}
```
