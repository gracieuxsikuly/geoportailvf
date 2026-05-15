-- Seed : groupes de couches initiaux (à adapter selon thèmes métier)
INSERT INTO portal_app.layer_groups (id, code, "labelFr", "labelEn", "sortOrder", "isVisible", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'limites-administratives', 'Limites administratives', 'Administrative boundaries', 1, true, now(), now()),
  (gen_random_uuid(), 'biodiversite',            'Biodiversité',            'Biodiversity',              2, true, now(), now()),
  (gen_random_uuid(), 'relief',                  'Relief & MNT',            'Relief & DEM',              3, true, now(), now()),
  (gen_random_uuid(), 'hydrographie',            'Hydrographie',            'Hydrography',               4, true, now(), now()),
  (gen_random_uuid(), 'tourisme',                'Tourisme',                'Tourism',                   5, true, now(), now())
ON CONFLICT (code) DO NOTHING;
