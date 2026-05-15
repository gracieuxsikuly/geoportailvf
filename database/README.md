# Database

- **PostGIS existant** : la base contient déjà toutes les tables SIG métier. Le portail ne les
  modifie pas. Connexion via `DATABASE_URL`.
- **Schéma applicatif** (`portal_app`) : créé par Prisma (`backend/prisma/schema.prisma`).
  Contient utilisateurs, groupes de couches, métadonnées portail, audit, etc.
- `migrations/` — Migrations Prisma générées (`npx prisma migrate dev` en local).
- `seeds/` — Scripts SQL ou TS pour amorcer thèmes / couches publiques (à rédiger).

## Commandes utiles

```bash
cd backend
npx prisma generate
npx prisma migrate deploy   # production
npx prisma migrate dev      # développement
```
