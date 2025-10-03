# Step 9: Frontend React avec Apollo Client

## Objectif
Créer une application full-stack complète avec un backend GraphQL et un frontend React utilisant Apollo Client.

## Architecture du projet

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
│   ├── package.json
│   └── vite.config.ts
└── package.json          # Scripts pour gérer les deux apps
```

## Nouveautés de cette étape

### 1. Organisation Full-Stack
- Séparation claire entre backend et frontend
- Scripts centralisés pour gérer les deux applications
- Configuration de proxy pour le développement

### 2. Frontend React + TypeScript
- Application créée avec Vite pour des performances optimales
- TypeScript pour la sécurité des types
- Hot Module Replacement (HMR) pour le développement

### 3. Apollo Client
- Configuration du client GraphQL
- Gestion du cache automatique
- Hooks React pour les requêtes GraphQL

### 4. Composant Feed
- Affichage des posts depuis le backend GraphQL
- Gestion des états de chargement et d'erreur
- Interface utilisateur moderne et responsive

## Installation

### Installation de toutes les dépendances
```bash
npm run install:all
```

Cette commande installe les dépendances pour :
- Le projet root (concurrently)
- Le backend (Apollo Server, Prisma, etc.)
- Le frontend (React, Apollo Client, Vite)

### Configuration de la base de données
```bash
npm run db:setup
```

Cette commande :
1. Génère le client Prisma
2. Exécute les migrations
3. Seed la base de données avec des données de test

## Démarrage

### Développement (Backend + Frontend simultanément)
```bash
npm run dev
```

Cette commande lance :
- Backend sur http://localhost:4000
- Frontend sur http://localhost:3000

### Backend uniquement
```bash
npm run dev:backend
```

### Frontend uniquement
```bash
npm run dev:frontend
```

## Technologies utilisées

### Backend
- **Apollo Server 5.x** : Serveur GraphQL moderne
- **Prisma** : ORM pour PostgreSQL
- **TypeScript** : Typage statique
- **Express** : Framework web
- **DataLoader** : Optimisation des requêtes (Step 5)
- **GraphQL Subscriptions** : Temps réel avec WebSocket (Step 8)

### Frontend
- **React 19** : Bibliothèque UI moderne
- **TypeScript** : Typage statique
- **Vite 7** : Build tool ultra-rapide
- **Apollo Client 4** : Client GraphQL complet
- **GraphQL** : Langage de requête

## Structure du Frontend

### Apollo Client Configuration (`apollo-client.ts`)
```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### Composant Feed (`Feed.tsx`)
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

## Configuration Vite

Le fichier `vite.config.ts` configure :
- Le port du serveur de développement (3000)
- Le proxy vers le backend GraphQL (4000)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
})
```

## Scripts disponibles

### Root
- `npm run dev` : Lance backend + frontend
- `npm run install:all` : Installe toutes les dépendances
- `npm run build:backend` : Build le backend
- `npm run build:frontend` : Build le frontend

### Backend
- `npm run dev:backend` : Lance le serveur GraphQL en mode dev
- `npm run prisma:generate` : Génère le client Prisma
- `npm run prisma:migrate` : Exécute les migrations
- `npm run prisma:seed` : Seed la base de données
- `npm run prisma:studio` : Ouvre Prisma Studio
- `npm run db:setup` : Configuration complète de la DB

### Frontend
- `npm run dev:frontend` : Lance l'app React en mode dev
- `npm run build:frontend` : Build l'app pour la production

## Points clés de l'implémentation

### 1. Apollo Provider
Le composant racine est enveloppé dans `ApolloProvider` pour donner accès au client GraphQL à toute l'application :

```typescript
<ApolloProvider client={client}>
  <App />
</ApolloProvider>
```

### 2. Hook useQuery
Utilisation du hook `useQuery` pour récupérer les données :
- Gestion automatique du loading
- Gestion automatique des erreurs
- Cache automatique des résultats

### 3. TypeScript
Types définis pour :
- Les données de la requête GraphQL
- Les props des composants
- La configuration Apollo

### 4. Styling moderne
- CSS personnalisé pour les composants
- Effet hover sur les cartes
- Design responsive
- Thème sombre par défaut

## Tests

### Tester le Feed
1. Assurez-vous que le backend tourne sur le port 4000
2. Assurez-vous que la base de données contient des données (seed)
3. Lancez le frontend sur le port 3000
4. Ouvrez http://localhost:3000 dans votre navigateur
5. Vous devriez voir la liste des posts

### Tester avec Apollo Studio
1. Ouvrez http://localhost:4000/graphql
2. Exécutez la requête :
```graphql
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
```

## Évolutions possibles

### Fonctionnalités à ajouter
1. **Mutations** : Créer/Modifier/Supprimer des posts
2. **Authentification** : Login/Signup avec JWT
3. **Subscriptions** : Mises à jour en temps réel
4. **Pagination** : Charger les posts par pages
5. **Recherche** : Filtrer les posts
6. **Votes** : Système de like/upvote
7. **Commentaires** : Ajouter des commentaires aux posts

### Améliorations techniques
1. **React Router** : Navigation entre pages
2. **Formulaires** : Utiliser React Hook Form
3. **State Management** : Context API ou Zustand
4. **Tests** : Jest + React Testing Library
5. **Optimistic UI** : Mise à jour optimiste avec Apollo
6. **Error Boundaries** : Gestion centralisée des erreurs
7. **Loading Skeletons** : Meilleure UX pendant le chargement

## Prochaines étapes

La Step 9 pose les fondations d'une application full-stack moderne. Vous pouvez maintenant :
- Ajouter des mutations pour créer des posts
- Implémenter l'authentification
- Ajouter des subscriptions pour le temps réel
- Améliorer l'UI/UX
- Déployer l'application

## Ressources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
