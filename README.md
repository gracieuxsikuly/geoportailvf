# Virunga WebGIS

Portail WebGIS public dédié au **Parc National des Virunga** pour **Virunga Fondation**.

## Vue d'ensemble

Plateforme cartographique grand public qui consomme une instance **GeoServer** existante sur **https://gis.virunga.org/**.

Dans la phase actuelle, le portail charge ses couches depuis **GeoServer** et les manipule côté application via les manifests du dossier `geoserver/layer-manifests/`. La couche base de données applicative est reportée à une phase ultérieure.

La fondation est volontairement **sans conteneurisation** : exécution native Node.js, supervision **PM2** ou **systemd**, exposition via **Nginx**.

## État actuel

Le projet est prêt jusqu'au niveau suivant :

- backend NestJS public opérationnel sur `http://localhost:3001` ;
- frontend Next.js opérationnel sur `http://localhost:3000` ;
- catalogue des couches lu depuis les fichiers JSON de `geoserver/layer-manifests/`, normalisé et rafraîchi automatiquement en mémoire ;
- aucune base de données requise pour démarrer ;
- aucun Redis requis pour démarrer ;
- un premier manifest d'exemple est déjà présent : `geoserver/layer-manifests/virunga_boundary.json`.

## Stack

- **Backend** : Node.js, TypeScript, NestJS, catalogue GeoServer/manifests, OpenAPI/Swagger, synchronisation planifiée
- **Frontend** : TypeScript, Next.js (App Router), MapLibre GL JS, Zustand, TanStack Query, Tailwind CSS, shadcn/ui
- **Infra** : Nginx (reverse proxy), PM2 ou systemd (supervision)

## Structure

```text
virunga-webgis/
├── backend/        API NestJS
├── frontend/       Application Next.js
├── geoserver/      Styles SLD, manifests et scripts de publication GeoServer
├── database/       Réservé aux évolutions futures
├── docs/           Documentation projet
└── deploy/         Nginx, PM2, systemd, scripts d'installation
```

## Prérequis

- Node.js >= 20 LTS
- npm >= 10
- Accès réseau à https://gis.virunga.org/
- Nginx uniquement pour la production

## Installation locale

### 1. Cloner le dépôt

```bash
git clone <repo>
cd virunga-webgis
```

### 2. Installer les dépendances

Le projet utilise les **npm workspaces**. Une seule installation à la racine suffit.

```bash
npm install
```

### 3. Préparer les variables d'environnement

Backend :

```bash
cp .env.example backend/.env
```

Frontend :

```bash
cp frontend/.env.local.example frontend/.env.local
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example backend/.env
Copy-Item frontend/.env.local.example frontend/.env.local
```

### 4. Adapter les variables pour le développement local

Dans `backend/.env`, utiliser au minimum :

```env
GEOSERVER_URL=https://gis.virunga.org/geoserver
CATALOG_SOURCE=hybrid
CATALOG_REFRESH_CRON=*/15 * * * *
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

Notes :

- `GEOSERVER_ADMIN_USER` et `GEOSERVER_ADMIN_PASSWORD` sont optionnels à ce stade ;
- aucune variable base de données n'est requise ;
- aucune variable Redis n'est requise.

Le frontend peut conserver :

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_GEOSERVER_URL=https://gis.virunga.org/geoserver
NEXT_PUBLIC_SITE_NAME=Virunga WebGIS
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

## Démarrage local

### Option A : depuis la racine du projet

Terminal 1 :

```bash
npm run dev:backend
```

Terminal 2 :

```bash
npm run dev:frontend
```

### Option B : lancer chaque application séparément

```bash
# Backend
cd backend
npm run start:dev

# Frontend (autre terminal)
cd ../frontend
npm run dev
```

## Vérification

- Frontend : `http://localhost:3000`
- Backend : `http://localhost:3001`
- Swagger : `http://localhost:3001/api/docs`
- Healthcheck : `http://localhost:3001/api/v1/health`

Réponse attendue du healthcheck :

```json
{
  "status": "ok",
  "mode": "geoserver-catalog",
  "geoserver": "https://gis.virunga.org/geoserver",
  "layerCount": 1
}
```

## Ajouter une couche

Pour exposer une nouvelle couche dans le portail à ce stade :

1. ajouter un fichier JSON dans `geoserver/layer-manifests/` ;
2. pointer ce manifest vers la couche GeoServer voulue ;
3. recharger le frontend ou rappeler l'API backend.

Le backend lit les manifests depuis le système de fichiers. Il n'y a pas encore de persistance en base de données.

## Dépannage

- `EADDRINUSE: address already in use :::3000` ou `:::3001` : un serveur tourne déjà sur ce port ;
- si GeoServer est inaccessible, l'application démarre quand même, mais les couches distantes ne seront pas consultables correctement ;
- si vous ajoutez un nouveau manifest, vérifiez d'abord sa structure JSON puis attendez le prochain rafraîchissement ou lancez `npm --workspace backend run sync:catalog` ;
- si vous modifiez les variables d'environnement, redémarrez le backend et le frontend.

## Production sans conteneurisation

Le dossier `deploy/` contient toujours les bases Nginx / PM2 / systemd pour la suite.

Pour la phase actuelle, la documentation de production doit être lue en tenant compte du fait que **la base de données et Redis ne sont pas encore utilisés par le runtime**.

## Documentation

- [docs/architecture.md](docs/architecture.md)
- [docs/installation.md](docs/installation.md)
- [docs/geoserver-setup.md](docs/geoserver-setup.md)
- [docs/data-security.md](docs/data-security.md)
- [docs/api-reference.md](docs/api-reference.md)
- [docs/user-guide.md](docs/user-guide.md)
