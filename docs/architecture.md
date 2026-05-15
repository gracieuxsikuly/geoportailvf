# Architecture — Virunga WebGIS

## Vue d'ensemble

Portail WebGIS public à 3 couches logiques :

1. **Frontend** Next.js (App Router) — interface cartographique grand public.
2. **Backend** NestJS — orchestration, catalogue des couches, métadonnées, proxy léger, WebSocket temps réel.
3. **Infrastructure existante** : GeoServer (`https://gis.virunga.org/`).

```
┌──────────────┐   HTTPS   ┌─────────────┐   HTTP    ┌─────────────┐
│  Navigateur  │ ────────► │   Nginx     │ ────────► │  Backend    │
│ (MapLibre)   │           │ (TLS, gzip) │           │  NestJS     │
└──────┬───────┘           └──────┬──────┘           └──────┬──────┘
       │                          │                         │
       │ WMS/WFS/WMTS             │                         │ lit les manifests
       └─────────────────────────►│                         │ `geoserver/layer-manifests`
                                  └────────────────────────► GeoServer (https://gis.virunga.org/)
```

## État de l'implémentation

- les couches publiques sont décrites par des manifests JSON versionnés ;
- le backend expose ces manifests via `/api/v1/layers` ;
- le frontend `/map` consomme cet endpoint et instancie des couches WMS GeoServer dans MapLibre ;
- aucune connexion PostGIS n'est nécessaire pour lancer le projet dans cette phase ;
- Redis n'est pas nécessaire pour lancer le projet dans cette phase.

## Principes

- **Pas de conteneurisation** : binaires natifs, supervisés par PM2 ou systemd.
- **Nginx** : seul point d'entrée TLS, proxy `/` → frontend (3000), `/api/` → backend (3001).
- **Backend stateless** ; le catalogue courant provient du système de fichiers et de GeoServer.
- **GeoServer non remplacé** : seules les couches et styles sont gérés via son API REST.
- **Base de données applicative reportée** : le schéma `portal_app` reste une étape future.

## Sécurité

- Helmet, CORS strict, rate limiting (`@nestjs/throttler`).
- Validation d'entrée Zod / class-validator.
- Audit minimal applicatif, à renforcer quand la couche persistante sera ajoutée.
- HTTPS obligatoire en production (Let's Encrypt via certbot).

## Performance

- Cache WMS côté GeoServer.
- Tuiles vecteur préférées quand pertinent.
- Code splitting Next.js, lazy-loading des couches.

## Observabilité

- Logs JSON Winston côté backend.
- Healthcheck `/api/v1/health` (mode courant + GeoServer + nombre de couches).
- PM2 / journalctl pour les logs runtime.
