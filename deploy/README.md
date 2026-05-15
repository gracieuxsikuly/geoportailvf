# Déploiement — sans conteneurisation

Fichiers de configuration prêts à copier :

- `nginx/virunga-webgis.conf` — vhost Nginx (TLS + reverse proxy frontend/backend + WS).
- `pm2/ecosystem.config.cjs` — agrégat PM2 (backend + frontend).
- `systemd/virunga-backend.service` — unité systemd pour le backend.
- `systemd/virunga-frontend.service` — unité systemd pour le frontend.
- `scripts/install.sh` — installation initiale.
- `scripts/deploy.sh` — déploiement / mise à jour.

Choisir **soit PM2, soit systemd** (pas les deux). Voir [docs/installation.md](../docs/installation.md).
