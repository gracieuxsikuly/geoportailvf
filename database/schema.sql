-- =====================================================
-- Virunga WebGIS — Schéma applicatif complémentaire
-- =====================================================
-- IMPORTANT : Les tables métier SIG existent déjà dans PostGIS.
-- Ce script crée UNIQUEMENT le schéma applicatif du portail
-- (utilisateurs, groupes de couches, métadonnées, audit, etc.).
-- Il ne touche en aucune façon aux données existantes.

CREATE SCHEMA IF NOT EXISTS portal_app;

-- Les tables ci-dessous sont générées par Prisma (voir backend/prisma/schema.prisma).
-- Ce fichier sert de référence et de point d'entrée pour les DBA.
-- Exécution recommandée : npx prisma migrate deploy (depuis backend/).

-- Extensions nécessaires (PostGIS supposé déjà installé) :
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

COMMENT ON SCHEMA portal_app IS
  'Schéma applicatif du portail Virunga WebGIS. Ne contient pas les tables métier SIG.';
