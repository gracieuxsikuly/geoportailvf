# Sécurité des données

## Classification

| Niveau         | Exemple                              | Diffusion grand public |
|----------------|--------------------------------------|------------------------|
| `public`       | Limite du parc, MNT, hydrographie    | Oui                    |
| `restricted`   | Habitats d'espèces protégées         | Agrégé / flou          |
| `confidential` | Localisations précises gorilles      | Non                    |

## Anonymisation spatiale

- Buffer aléatoire 1–5 km pour les points sensibles.
- Agrégation sur grille (1 km, 5 km) pour distribution.
- Suppression des attributs identifiants (date précise, observateur, etc.).

## Conformité

- **RGPD** : aucune donnée personnelle sans base légale.
- **Convention Aarhus** : information environnementale ouverte par défaut, sauf
  exceptions justifiées (espèces menacées, sites sensibles).
- **ISO 19115** : métadonnées documentées (source, qualité, licence, contact).

## Sécurité applicative

- HTTPS obligatoire.
- Helmet (CSP, HSTS, X-Frame-Options).
- Rate limiting global et par route sensible.
- Audit log de toutes les écritures et accès aux couches `restricted`/`confidential`.
- Secrets gérés via `.env` (chmod 600, jamais committés).
