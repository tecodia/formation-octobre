# Formation GraphQL avec Apollo Server 🚀

Formation pratique pour apprendre GraphQL étape par étape avec Apollo Server et Apollo Client.

## 📚 Structure de la formation

Chaque étape est sur une branche différente. Si vous êtes bloqués, vous pouvez checkout la branche suivante.

### Branches disponibles

#### Backend
- **main** (Step 0) : Apollo Server basique monofichier ✅
- **step1** : Séparation typeDefs/resolvers en modules ✅
- **step2** : Schema complet Blog (User, Post, Comment) ✅
- **step3** : PostgreSQL + Prisma + Docker ✅
- **step4** : Plugin monitoring SQL ✅
- **step5** : DataLoader (résolution N+1) ✅
- **step6** : Cache avec Redis ✅
- **step7** : Validation et erreurs personnalisées ✅
- **step8** : Subscriptions GraphQL temps réel ✅

#### Full-Stack
- **step9** : Frontend React + Apollo Client ✅
- **step10** : Queries & Mutations
- **step11** : Persisted Queries
- **step12** : Optimistic UI
- **step13** : Authentication JWT
- **step14** : Error Handling avancé
- **step15** : Federation (bonus)

## 🚀 Démarrage rapide

### Step 9 (Full-Stack: Backend + Frontend)

```bash
# Installation complète (root, backend, frontend)
npm run install:all

# Configuration de la base de données
npm run db:setup

# Lancer backend + frontend simultanément
npm run dev
```

- **Backend GraphQL** : http://localhost:4000/graphql
- **Frontend React** : http://localhost:3000

### Steps précédents (Backend uniquement)

```bash
# Installation
cd backend && npm install

# Lancer en développement (avec hot-reload)
npm run dev

# Lancer en production
npm start
```

## 📝 Step 9 - Full-Stack: Frontend React + Apollo Client (branche actuelle)

### Ce que vous apprenez :
- Architecture full-stack avec backend/frontend séparés
- Configuration Apollo Client dans React
- Utilisation du hook `useQuery` pour récupérer des données
- Gestion des états de chargement et d'erreur
- Affichage de données GraphQL dans des composants React
- Configuration Vite avec proxy pour le développement

### Structure actuelle :
```
graphql-formation/
├── backend/              # Serveur GraphQL Apollo
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # Application React + Apollo Client
│   ├── src/
│   │   ├── components/
│   │   │   └── Feed.tsx
│   │   ├── apollo-client.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
└── package.json          # Scripts pour gérer les deux apps
```

### Technologies utilisées :

#### Backend
- Apollo Server 5.x
- Prisma + PostgreSQL
- TypeScript
- GraphQL Subscriptions (WebSocket)
- DataLoader (optimisation N+1)

#### Frontend
- React 19
- TypeScript
- Vite 7
- Apollo Client 4
- GraphQL

### Composant Feed exemple :

```typescript
const GET_FEED = gql`
  query GetFeed {
    feed {
      id
      description
      url
      postedBy {
        id
        name
      }
    }
  }
`;

const { loading, error, data } = useQuery<FeedData>(GET_FEED);
```

## 🎯 Objectif du Step 9

1. Créer une architecture full-stack moderne
2. Configurer Apollo Client dans React
3. Utiliser les hooks GraphQL (useQuery)
4. Afficher des données temps réel depuis le backend
5. Gérer les états de chargement et d'erreur
6. Créer une interface utilisateur moderne et responsive

## 📚 Documentation complète

- [README_STEP9.md](./README_STEP9.md) - Documentation détaillée
- [STEP9_QUICKSTART.md](./STEP9_QUICKSTART.md) - Guide de démarrage rapide

## ⏭️ Passer au Step 10

```bash
git checkout step10
```

Le Step 10 va ajouter des mutations pour créer, modifier et supprimer des posts.

## 📖 Ressources

- [Documentation Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Spec](https://graphql.org/)
- [Slides de la formation](../formation-graphql.md)

## 👨‍🏫 Formateur

Jonathan Jalouzot - [GitHub](https://github.com/captainjojo)