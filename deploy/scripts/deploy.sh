#!/usr/bin/env bash
# Déploiement / mise à jour Virunga WebGIS
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/opt/virunga-webgis}"
USE_PM2="${USE_PM2:-true}"

cd "$PROJECT_DIR"

echo "==> git pull"
git pull --ff-only

echo "==> Backend build"
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

echo "==> Frontend build"
cd ../frontend
npm ci
npm run build

cd "$PROJECT_DIR"
if [[ "$USE_PM2" == "true" ]]; then
  echo "==> Reload PM2"
  pm2 reload deploy/pm2/ecosystem.config.cjs
else
  echo "==> Restart systemd"
  sudo systemctl restart virunga-backend.service
  sudo systemctl restart virunga-frontend.service
fi

echo "==> OK"
