#!/usr/bin/env bash
# Installation initiale Virunga WebGIS sur Ubuntu 22.04+
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/opt/virunga-webgis}"

echo "==> Installation Virunga WebGIS dans $PROJECT_DIR"

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Cloner d'abord le dépôt dans $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

echo "==> Backend"
cd backend
[[ -f .env ]] || cp ../.env.example .env
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

echo "==> Frontend"
cd ../frontend
[[ -f .env.local ]] || cp .env.local.example .env.local
npm ci
npm run build

echo "==> Terminé. Lancer ensuite avec PM2 ou systemd."
