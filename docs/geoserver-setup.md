# Configuration GeoServer

L'instance cible est `https://gis.virunga.org/geoserver` — **ne pas redéployer**.

## Workspaces recommandés

| Workspace   | Usage                                     |
|-------------|-------------------------------------------|
| `virunga`   | Limites administratives, zones officielles |
| `biodiv`    | Faune, flore, observations                 |
| `mnt`       | MNT, hillshade, pentes                     |
| `tourisme`  | Pistes, lodges, points d'intérêt           |

## Publication d'un style

```bash
GEOSERVER_URL=https://gis.virunga.org/geoserver \
GEOSERVER_ADMIN_USER=... \
GEOSERVER_ADMIN_PASSWORD=... \
node geoserver/publication-scripts/publish-style.js virunga virunga_boundary geoserver/styles/virunga_boundary.sld
```

## Manifests de couches

Chaque couche exposée dans le portail doit avoir un manifest dans
`geoserver/layer-manifests/`. Le backend (module `layers`) synchronise ces manifests vers la table
`portal_app.layers`.

## Sensibilité des données

- `public` : exposé au grand public.
- `restricted` : projection grossière (1 km grid), buffer aléatoire, accès limité.
- `confidential` : non exposé au portail public.

Toute couche `restricted` ou `confidential` doit faire l'objet d'un workspace ou d'un layer
GeoServer dédié, avec sécurité GeoServer configurée.
