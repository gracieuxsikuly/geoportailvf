# API Reference

Base URL : `https://virunga.example.org/api/v1`

Documentation interactive : `/api/docs` (Swagger UI).

Le backend public expose uniquement des endpoints en lecture. Les reponses suivent toujours l'enveloppe commune :

```json
{
  "success": true,
  "message": "Layers retrieved successfully",
  "data": [],
  "meta": {
    "source": "geoserver-catalog",
    "refreshedAt": "2026-05-15T08:45:00.000Z",
    "total": 120
  }
}
```

## Endpoints publics

| Methode | Chemin | Description |
|---------|--------|-------------|
| GET | `/api/v1/catalog` | Catalogue complet normalise : couches + thematiques |
| GET | `/api/v1/themes` | Liste des thematiques visibles |
| GET | `/api/v1/themes/:slug` | Detail d'une thematique visible |
| GET | `/api/v1/layers` | Liste des couches publiques |
| GET | `/api/v1/layers/:slug` | Detail d'une couche publique |
| GET | `/api/v1/metadata/:layerId` | Metadonnees publiques simplifiees d'une couche |
| GET | `/api/v1/geoserver/health` | Etat technique simplifie de GeoServer |
| GET | `/api/v1/geoserver/capabilities?service=WMS` | Controle GetCapabilities `WMS`, `WFS` ou `WMTS` |
| GET | `/api/v1/health` | Healthcheck global backend + catalogue + GeoServer |

## Catalogue

`GET /api/v1/catalog`

```json
{
  "success": true,
  "message": "Catalog retrieved successfully",
  "data": {
    "layers": [
      {
        "id": "virunga-boundary",
        "slug": "limite-parc-virunga",
        "title": {
          "fr": "Limite du Parc National des Virunga",
          "en": "Virunga National Park Boundary"
        },
        "themeId": "limites-administratives",
        "themeLabel": {
          "fr": "Limites Administratives",
          "en": "Limites Administratives"
        },
        "serviceType": "WMS",
        "workspace": "virunga",
        "layerName": "virunga:virunga_boundary",
        "styleName": "virunga_boundary",
        "services": {
          "wms": "https://gis.virunga.org/geoserver/wms",
          "wfs": "https://gis.virunga.org/geoserver/virunga/ows?service=WFS",
          "wmts": null,
          "legend": "https://gis.virunga.org/geoserver/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=virunga%3Avirunga_boundary&STYLE=virunga_boundary"
        },
        "visible": true,
        "opacity": 0.8,
        "minZoom": 5,
        "maxZoom": 18,
        "sortOrder": 1,
        "sensitivityLevel": "public",
        "metadata": {
          "source": "Institut Congolais pour la Conservation de la Nature (ICCN)",
          "updatedAt": "2023-12-01",
          "license": "CC-BY-NC 4.0",
          "qualityLevel": 4,
          "keywords": []
        },
        "popup": {
          "enabled": true,
          "fields": ["name", "iucn_category", "area_km2", "creation_year"]
        }
      }
    ],
    "themes": [
      {
        "id": "limites-administratives",
        "slug": "limites-administratives",
        "label": {
          "fr": "Limites Administratives",
          "en": "Limites Administratives"
        },
        "sortOrder": 1,
        "visible": true,
        "layerCount": 1
      }
    ]
  },
  "meta": {
    "source": "geoserver-catalog",
    "refreshedAt": "2026-05-15T08:45:00.000Z",
    "total": 1
  }
}
```

## Metadata

`GET /api/v1/metadata/:layerId` accepte l'identifiant technique ou le slug de la couche. Les champs sensibles de manifests, comme les contacts internes, ne sont pas exposes.

## GeoServer

`GET /api/v1/geoserver/health` controle les capabilities WMS, WFS et WMTS de l'instance existante `https://gis.virunga.org/geoserver`.

`GET /api/v1/geoserver/capabilities?service=WMS` accepte uniquement `WMS`, `WFS` ou `WMTS`. Le backend retourne le statut technique et l'URL controlee, pas le XML complet.

## Healthcheck

```json
{
  "success": true,
  "message": "Healthcheck retrieved successfully",
  "data": {
    "status": "ok",
    "mode": "geoserver-catalog",
    "geoserver": "https://gis.virunga.org/geoserver",
    "geoserverReachable": true,
    "layerCount": 1,
    "catalogRefreshedAt": "2026-05-15T08:45:00.000Z",
    "timestamp": "2026-05-15T08:45:05.000Z"
  },
  "meta": {
    "source": "geoserver-catalog",
    "refreshedAt": "2026-05-15T08:45:00.000Z",
    "total": 1
  }
}
```

## Format d'erreur

```json
{
  "success": false,
  "message": "Layer limite-inconnue not found",
  "errors": [
    {
      "field": "request",
      "code": "NOT_FOUND",
      "detail": "Layer limite-inconnue not found"
    }
  ]
}
```

Codes standards : `BAD_REQUEST`, `NOT_FOUND`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_SERVER_ERROR`, `INVALID_SERVICE_URL`, `INVALID_SERVICE_TYPE`.

## Rafraichissement catalogue

- Chargement initial au demarrage du backend.
- Rechargement planifie via `CATALOG_REFRESH_CRON` (par defaut `*/15 * * * *`).
- Conservation en memoire du dernier snapshot valide si une synchronisation echoue.
- Script manuel disponible : `npm --workspace backend run sync:catalog`.

## Contrat frontend

- Le frontend consomme `/api/v1/catalog` s'il a besoin des thematiques et couches en une seule requete.
- Pour une carte simple, `/api/v1/layers` suffit et retourne uniquement les couches publiques.
- Les URLs `services.wms`, `services.wfs`, `services.wmts` et `services.legend` sont deja normalisees.
- Les couches non publiques (`restricted`, `confidential`) ne sont pas retournees par l'API publique.
