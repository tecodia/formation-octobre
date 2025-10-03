# 🚀 Step 10 Quick Start - Pagination Cursor-based

## Démarrage rapide (2 minutes)

```bash
# 1. Installer les dépendances
npm run install:all

# 2. Setup base de données
npm run db:setup

# 3. Lancer backend + frontend
npm run dev
```

## URLs

- **Backend GraphQL**: http://localhost:4000/graphql
- **Frontend React**: http://localhost:3000

## Test rapide Backend

```bash
# Tester la pagination (2 premiers posts)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ feedPaginated(first: 2) { edges { node { id content { __typename } } } pageInfo { hasNextPage endCursor } totalCount } }"}'
```

## Test rapide Frontend

1. Ouvrir http://localhost:3000
2. Voir 2 posts affichés
3. Cliquer "Voir plus" pour charger 2 de plus
4. Le bouton disparaît après avoir tout chargé

## 🎯 Ce que fait cette step

- **Pagination performante** avec cursors encodés en base64
- **DataSource pattern** pour séparer la logique métier
- **Frontend avec "Voir plus"** qui accumule les résultats
- **Support des unions GraphQL** pour différents types de posts

## 📝 Commandes utiles

```bash
# Re-seeder la base si besoin
cd backend && npx prisma db seed

# Voir les logs backend
npm run dev:backend

# Voir les logs frontend
npm run dev:frontend
```