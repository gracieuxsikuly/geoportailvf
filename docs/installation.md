# Installation — sans conteneurisation

Cible : serveur Linux (Ubuntu 22.04 LTS recommandé).

Important : à ce stade du projet, le runtime repose sur **GeoServer + manifests fichiers**. La base de données applicative et Redis sont reportés à une phase ultérieure et ne sont pas nécessaires pour démarrer le projet.

## 1. Prérequis système

```bash
sudo apt update
sudo apt install -y curl git build-essential nginx
# Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. Cloner et configurer

```bash
git clone <repo> /opt/virunga-webgis
cd /opt/virunga-webgis
cp .env.example backend/.env       # adapter
cp frontend/.env.local.example frontend/.env.local
```

Pour le développement local, ajuster ensuite `backend/.env` comme suit :

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

## 3. Installation des dépendances

```bash
npm install
cd backend && npm run build
cd ../frontend && npm run build
```

## 4. Démarrage avec PM2

```bash
cd /opt/virunga-webgis
pm2 start backend/ecosystem.config.cjs
pm2 start frontend/ecosystem.config.cjs
pm2 save
pm2 startup        # suivre l'instruction sudo affichée
```

Alternative : services **systemd** (voir [deploy/systemd/](../deploy/systemd/)).

## 5. Reverse proxy Nginx

Copier la conf depuis [deploy/nginx/virunga-webgis.conf](../deploy/nginx/virunga-webgis.conf) :

```bash
sudo cp deploy/nginx/virunga-webgis.conf /etc/nginx/sites-available/virunga-webgis
sudo ln -s /etc/nginx/sites-available/virunga-webgis /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. TLS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d virunga.example.org
```

## 7. Vérifications

- https://virunga.example.org/ — frontend
- https://virunga.example.org/api/v1/health — enveloppe `success/data/meta`
- https://virunga.example.org/api/docs — Swagger

## 8. Remarque importante

À ce stade :

- les couches affichées par le portail proviennent de GeoServer ;
- le catalogue applicatif est lu depuis `geoserver/layer-manifests/` ;
- le catalogue est chargé au démarrage puis rafraîchi selon `CATALOG_REFRESH_CRON` ;
- aucune migration Prisma ni connexion PostGIS n'est requise pour lancer l'application ;
- Redis n'est pas requis pour lancer l'application.
