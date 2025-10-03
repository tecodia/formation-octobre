# Step 9: Quick Start Guide

## Démarrage rapide en 3 étapes

### 1. Installation
```bash
# Installer toutes les dépendances (root, backend, frontend)
npm run install:all
```

### 2. Configuration de la base de données
```bash
# Setup complet de PostgreSQL avec Prisma
npm run db:setup
```

### 3. Lancer l'application
```bash
# Lance backend (4000) + frontend (3000) simultanément
npm run dev
```

## Accès

- **Frontend** : http://localhost:3000
- **Backend GraphQL** : http://localhost:4000/graphql
- **Prisma Studio** : `npm run prisma:studio`

## Structure

```
graphql-formation/
├── backend/          # Apollo Server GraphQL
├── frontend/         # React + Apollo Client
└── package.json      # Scripts centralisés
```

## Commandes utiles

```bash
# Développement
npm run dev              # Backend + Frontend
npm run dev:backend      # Backend uniquement
npm run dev:frontend     # Frontend uniquement

# Base de données
npm run db:setup         # Setup complet
npm run prisma:studio    # Interface graphique DB
npm run prisma:seed      # Réinitialiser les données

# Build
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend
```

## Technologies

- **Backend** : Apollo Server, Prisma, PostgreSQL, TypeScript
- **Frontend** : React 19, Apollo Client, Vite, TypeScript

## Fonctionnalités implémentées

1. Backend GraphQL avec Apollo Server
2. Frontend React avec Apollo Client
3. Affichage du feed de posts
4. Gestion des états (loading, error)
5. Interface moderne et responsive

## Prochaines étapes

- Ajouter des mutations (créer/modifier/supprimer des posts)
- Implémenter l'authentification
- Ajouter des subscriptions temps réel
- Améliorer l'UI/UX
