# Architecture — Virunga WebGIS

## Vue d'ensemble

Portail WebGIS public à 3 couches logiques :

1. **Frontend** Next.js (App Router) — interface cartographique grand public.
2. **Backend** NestJS — API publique REST, catalogue des couches, métadonnées, validation des services GeoServer.
3. **Infrastructure existante** : GeoServer (`https://gis.virunga.org/`).

```
┌──────────────┐   HTTPS   ┌─────────────┐   HTTP    ┌─────────────┐
│  Navigateur  │ ────────► │   Nginx     │ ────────► │  Backend    │
│ (MapLibre)   │           │ (TLS, gzip) │           │  NestJS     │
└──────┬───────┘           └──────┬──────┘           └──────┬──────┘
       │                          │                         │
       │ WMS/WFS/WMTS             │                         │ importe GeoServer
       └─────────────────────────►│                         │ + applique les overrides
                                  └────────────────────────► GeoServer (https://gis.virunga.org/)
```

## État de l'implémentation

- les couches publiques sont importées automatiquement depuis GeoServer ;
- des manifests JSON versionnés peuvent surcharger localement une couche importée ;
- le backend expose ces manifests via `/api/v1/catalog`, `/api/v1/themes`, `/api/v1/layers`, `/api/v1/metadata/:layerId` ;
- le backend charge le catalogue au démarrage et le rafraîchit selon `CATALOG_REFRESH_CRON` ;
- le frontend `/map` consomme cet endpoint et instancie des couches WMS GeoServer dans MapLibre ;
- aucune connexion PostGIS n'est nécessaire pour lancer le projet dans cette phase ;
- Redis n'est pas nécessaire pour lancer le projet dans cette phase.

## Principes

- **Pas de conteneurisation** : binaires natifs, supervisés par PM2 ou systemd.
- **Nginx** : seul point d'entrée TLS, proxy `/` → frontend (3000), `/api/` → backend (3001).
- **Backend stateless** ; le catalogue courant provient de GeoServer et d'overrides fichiers optionnels.
- **GeoServer non remplacé** : le backend vérifie et normalise les URLs de services déjà publiés.
- **Base de données applicative reportée** : le schéma `portal_app` reste une étape future.

## Sécurité

- Helmet, CORS strict, rate limiting (`@nestjs/throttler`).
- Validation d'entrée Zod / class-validator.
- Aucune exposition de secrets GeoServer ni de couches non publiques dans les réponses API.
- HTTPS obligatoire en production (Let's Encrypt via certbot).

## Performance

- Cache WMS côté GeoServer.
- Tuiles vecteur préférées quand pertinent.
- Code splitting Next.js, lazy-loading des couches.

## Observabilité

- Logs JSON Winston côté backend.
- Healthcheck `/api/v1/health` (mode courant + GeoServer + nombre de couches).
- Swagger `/api/docs` documente les enveloppes de réponse et les DTO publics.
- PM2 / journalctl pour les logs runtime.
