import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const targets = [
  {
    target: resolve(root, 'backend', '.env'),
    sources: [
      resolve(root, 'backend', '.env.example'),
      resolve(root, '.env.example'),
    ],
  },
  {
    target: resolve(root, 'frontend', '.env.local'),
    sources: [resolve(root, 'frontend', '.env.local.example')],
  },
];

let created = 0;

for (const { target, sources } of targets) {
  if (existsSync(target)) {
    continue;
  }

  const source = sources.find((candidate) => existsSync(candidate));
  if (!source) {
    console.warn(`[setup] Aucun fichier modèle pour ${target}`);
    continue;
  }

  copyFileSync(source, target);
  created += 1;
  console.log(`[setup] Créé ${target.replace(root + '\\', '').replace(root + '/', '')}`);
}

if (created === 0) {
  console.log('[setup] Fichiers .env déjà présents — rien à faire.');
} else {
  console.log(`[setup] ${created} fichier(s) créé(s). Adaptez-les si nécessaire.`);
}
