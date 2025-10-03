# Step 3 : Intégration PostgreSQL + Prisma

## Objectifs

Dans ce step, nous intégrons une vraie base de données PostgreSQL avec Prisma ORM pour remplacer les données mockées en mémoire.

## Nouveautés de ce Step

- **Docker Compose** : PostgreSQL et Adminer pour la gestion de la base
- **Prisma ORM** : Gestion type-safe de la base de données
- **Migrations** : Versioning du schéma de base de données
- **Seed** : Script d'initialisation des données
- **Resolvers asynchrones** : Connexion réelle à PostgreSQL

## Architecture

```
graphql-formation/
├── docker-compose.yml          # Configuration PostgreSQL + Adminer
├── .env                        # Variables d'environnement
├── prisma/
│   ├── schema.prisma          # Schéma Prisma (modèles User, Post, Comment)
│   └── seed.ts                # Script de seed pour données initiales
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Client Prisma singleton
│   ├── resolvers/
│   │   ├── index.prisma.ts           # Resolvers principaux avec Prisma
│   │   ├── queryResolvers.prisma.ts  # Queries avec Prisma
│   │   ├── mutationResolvers.prisma.ts # Mutations avec Prisma
│   │   └── typeResolvers.prisma.ts    # Relations avec Prisma
│   ├── schema/
│   │   └── typeDefs.ts        # Schéma GraphQL (inchangé)
│   └── index.prisma.ts        # Serveur avec Prisma
└── package.json
```

## Installation

### 1. Installer les dépendances Prisma

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Démarrer PostgreSQL avec Docker

```bash
# Démarrer les conteneurs
docker-compose up -d

# Vérifier que les conteneurs sont lancés
docker-compose ps
```

Services démarrés :
- **PostgreSQL** : `localhost:5432`
- **Adminer** : `http://localhost:8080`

### 3. Configuration de la base de données

Le fichier `.env` contient la configuration :
```
DATABASE_URL="postgresql://graphql_user:graphql_password@localhost:5432/graphql_formation?schema=public"
```

### 4. Initialiser Prisma

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npm run prisma:migrate

# Initialiser les données avec le seed
npm run prisma:seed
```

Ou tout en une commande :
```bash
npm run db:setup
```

## Démarrage

### Mode développement avec Prisma
```bash
npm run dev:prisma
```

### Mode production avec Prisma
```bash
npm run start:prisma
```

## Accès aux interfaces

- **GraphQL Playground** : http://localhost:4000
- **Adminer** : http://localhost:8080
  - Système : PostgreSQL
  - Serveur : postgres
  - Utilisateur : graphql_user
  - Mot de passe : graphql_password
  - Base de données : graphql_formation

## Schéma Prisma

### Modèles

**User**
- `id` : String (CUID)
- `name` : String
- `email` : String (unique)
- `createdAt` : DateTime
- `updatedAt` : DateTime
- Relations : `posts[]`, `comments[]`

**Post**
- `id` : String (CUID)
- `title` : String
- `content` : String
- `authorId` : String
- `createdAt` : DateTime
- `updatedAt` : DateTime
- Relations : `author` (User), `comments[]`

**Comment**
- `id` : String (CUID)
- `text` : String
- `postId` : String
- `authorId` : String
- `createdAt` : DateTime
- `updatedAt` : DateTime
- Relations : `post` (Post), `author` (User)

## Exemples de Queries

### Récupérer tous les utilisateurs avec leurs posts

```graphql
query GetUsersWithPosts {
  users {
    id
    name
    email
    posts {
      id
      title
      content
      createdAt
    }
  }
}
```

### Récupérer un post avec auteur et commentaires

```graphql
query GetPostDetails {
  posts {
    id
    title
    content
    createdAt
    author {
      id
      name
      email
    }
    comments {
      id
      text
      createdAt
      author {
        name
      }
    }
  }
}
```

### Récupérer les posts d'un auteur

```graphql
query GetPostsByAuthor {
  postsByAuthor(authorId: "REMPLACER_PAR_UN_ID") {
    id
    title
    content
  }
}
```

## Exemples de Mutations

### Créer un utilisateur

```graphql
mutation CreateUser {
  createUser(
    name: "David"
    email: "david@example.com"
  ) {
    id
    name
    email
    createdAt
  }
}
```

### Créer un post

```graphql
mutation CreatePost {
  createPost(
    title: "Mon nouveau post avec Prisma"
    content: "Prisma rend le travail avec PostgreSQL très agréable!"
    authorId: "REMPLACER_PAR_UN_ID_UTILISATEUR"
  ) {
    id
    title
    content
    author {
      name
    }
  }
}
```

### Créer un commentaire

```graphql
mutation CreateComment {
  createComment(
    text: "Super article!"
    postId: "REMPLACER_PAR_UN_ID_POST"
    authorId: "REMPLACER_PAR_UN_ID_UTILISATEUR"
  ) {
    id
    text
    author {
      name
    }
    post {
      title
    }
  }
}
```

### Mettre à jour un utilisateur

```graphql
mutation UpdateUser {
  updateUser(
    id: "REMPLACER_PAR_UN_ID"
    name: "Nouveau nom"
  ) {
    id
    name
    email
    updatedAt
  }
}
```

## Scripts NPM disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev:prisma` | Démarrer en mode développement avec Prisma |
| `npm run start:prisma` | Démarrer en mode production avec Prisma |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Créer et appliquer une migration |
| `npm run prisma:seed` | Initialiser les données |
| `npm run prisma:studio` | Ouvrir Prisma Studio (GUI) |
| `npm run db:setup` | Configuration complète de la DB |

## Commandes Docker utiles

```bash
# Démarrer les conteneurs
docker-compose up -d

# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

## Gestion des migrations

### Créer une nouvelle migration

```bash
npm run prisma:migrate
# Vous serez invité à nommer la migration
```

### Réinitialiser la base de données

```bash
# Supprimer et recréer la base
npx prisma migrate reset

# Puis réappliquer le seed
npm run prisma:seed
```

## Prisma Studio

Interface graphique pour explorer et modifier les données :

```bash
npm run prisma:studio
```

Ouvre automatiquement http://localhost:5555

## Différences avec le Step 2

### Avant (Step 2)
- Données en mémoire (tableaux JavaScript)
- Données perdues au redémarrage
- Resolvers synchrones
- Pas de persistance

### Maintenant (Step 3)
- Base de données PostgreSQL
- Données persistantes
- Resolvers asynchrones
- ORM type-safe avec Prisma
- Migrations versionnées
- Seed automatique

## Points techniques importants

### Client Prisma Singleton

Le fichier `src/lib/prisma.ts` utilise un pattern singleton pour éviter de créer plusieurs connexions :

```typescript
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### Resolvers asynchrones

Tous les resolvers deviennent asynchrones avec Prisma :

```typescript
// Avant
users: () => users,

// Maintenant
users: async () => {
  return await prisma.user.findMany();
},
```

### Relations Prisma

Les relations sont définies dans le schéma et gérées automatiquement :

```prisma
model Post {
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
}
```

## Résolution de problèmes

### Erreur de connexion PostgreSQL

```bash
# Vérifier que Docker est lancé
docker ps

# Redémarrer les conteneurs
docker-compose restart
```

### Prisma Client non généré

```bash
npm run prisma:generate
```

### Migration échouée

```bash
# Réinitialiser complètement
npx prisma migrate reset
npm run prisma:seed
```

## Prochaines étapes

Step 4 pourrait inclure :
- Authentification et autorisation
- DataLoader pour optimiser les N+1 queries
- Pagination
- Filtres et tri avancés
- Subscriptions en temps réel

## Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
