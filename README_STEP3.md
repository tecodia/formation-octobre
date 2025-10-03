# Step 3 : Base de données PostgreSQL avec Prisma ORM et Architecture DataSources

## 🎯 Objectifs de ce step

Ce step introduit une vraie base de données PostgreSQL avec Prisma comme ORM, organisée avec une architecture professionnelle utilisant le pattern DataSources pour encapsuler les accès aux données.

### Nouveautés du Step 3 :
- ✅ Base de données PostgreSQL via Docker
- ✅ Prisma ORM pour la gestion de la base de données
- ✅ **Architecture DataSources** pour encapsuler les appels Prisma
- ✅ **Organisation modulaire** des resolvers et typeDefs
- ✅ Migrations de schéma versionnées
- ✅ Types TypeScript générés automatiquement
- ✅ Relations bidirectionnelles dans la base de données
- ✅ Seed automatique pour les données de test
- ✅ Interface d'administration Adminer

## 🏗️ Architecture

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
│   ├── datasources/           # 🆕 DataSources pour encapsuler Prisma
│   │   ├── UserDataSource.ts
│   │   ├── PostDataSource.ts
│   │   └── CommentDataSource.ts
│   ├── resolvers/             # 🆕 Organisation modulaire
│   │   ├── Query/             # Un fichier par domaine de query
│   │   │   ├── users.ts
│   │   │   ├── posts.ts
│   │   │   └── comments.ts
│   │   ├── Mutation/          # Un fichier par domaine de mutation
│   │   │   ├── userMutations.ts
│   │   │   ├── postMutations.ts
│   │   │   └── commentMutations.ts
│   │   ├── User/              # Field resolvers par type
│   │   │   └── index.ts
│   │   ├── Post/
│   │   │   └── index.ts
│   │   ├── Comment/
│   │   │   └── index.ts
│   │   └── index.ts           # Combine tous les resolvers
│   ├── schema/                # 🆕 TypeDefs modulaires
│   │   ├── types/
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   └── Comment.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── index.ts           # Combine tous les typeDefs
│   └── index.ts               # Serveur Apollo
└── package.json
```

## 📋 Installation

### 1. Installer les dépendances Prisma

```bash
npm install prisma @prisma/client
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
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init

# Initialiser les données avec le seed
npm run prisma:seed
```

Ou tout en une commande :
```bash
npm run db:setup
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run start
```

## 🔗 Accès aux interfaces

- **GraphQL Playground** : http://localhost:4000
- **Adminer** : http://localhost:8080
  - Système : PostgreSQL
  - Serveur : postgres
  - Utilisateur : graphql_user
  - Mot de passe : graphql_password
  - Base de données : graphql_formation
- **Prisma Studio** : `npm run prisma:studio` → http://localhost:5555

## 🏛️ Architecture DataSources

### Principe

Les DataSources encapsulent **tous** les appels à Prisma, offrant une couche d'abstraction entre les resolvers GraphQL et la base de données :

```typescript
// Resolver (src/resolvers/Query/users.ts)
export const usersQueryResolvers = {
  users: async () => {
    const dataSource = new UserDataSource();
    return dataSource.getAllUsers();
  },
  user: async (_: any, args: { id: string }) => {
    const dataSource = new UserDataSource();
    return dataSource.getUserById(args.id);
  }
};

// DataSource (src/datasources/UserDataSource.ts)
export class UserDataSource {
  async getAllUsers() {
    return prisma.user.findMany();
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
```

### Avantages

- **Séparation des responsabilités** : Les resolvers ne connaissent pas Prisma
- **Testabilité** : Les DataSources peuvent être mockés facilement
- **Réutilisabilité** : Les méthodes des DataSources sont réutilisables
- **Évolutivité** : Facile de changer de base de données ou d'ORM

## 📊 Schéma Prisma

### Modèles

**User**
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  posts     Post[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Post**
```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

**Comment**
```prisma
model Comment {
  id        String   @id @default(cuid())
  text      String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 📝 Exemples de Queries

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
query GetPostDetails($postId: ID!) {
  post(id: $postId) {
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
query GetPostsByAuthor($authorId: ID!) {
  postsByAuthor(authorId: $authorId) {
    id
    title
    content
    comments {
      id
      text
      author {
        name
      }
    }
  }
}
```

## ✏️ Exemples de Mutations

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
    email: "nouveau@email.com"
  ) {
    id
    name
    email
    updatedAt
  }
}
```

## 📚 Organisation du code

### Structure des DataSources

Chaque DataSource gère un domaine spécifique :

```typescript
// src/datasources/UserDataSource.ts
export class UserDataSource {
  async getAllUsers() { /* ... */ }
  async getUserById(id: string) { /* ... */ }
  async createUser(data: CreateUserInput) { /* ... */ }
  async updateUser(id: string, data: UpdateUserInput) { /* ... */ }
  async getPostsByUserId(userId: string) { /* ... */ }
  async getCommentsByUserId(userId: string) { /* ... */ }
}
```

### Structure des Resolvers

**Query Resolvers** (`src/resolvers/Query/`)
- `users.ts` : Queries pour les utilisateurs
- `posts.ts` : Queries pour les posts
- `comments.ts` : Queries pour les commentaires

**Mutation Resolvers** (`src/resolvers/Mutation/`)
- `userMutations.ts` : Mutations pour les utilisateurs
- `postMutations.ts` : Mutations pour les posts
- `commentMutations.ts` : Mutations pour les commentaires

**Field Resolvers** (`src/resolvers/[Type]/`)
- `User/index.ts` : Résout les relations de User (posts, comments)
- `Post/index.ts` : Résout les relations de Post (author, comments)
- `Comment/index.ts` : Résout les relations de Comment (post, author)

### Structure des TypeDefs

**Types** (`src/schema/types/`)
- `User.ts` : Définition du type User
- `Post.ts` : Définition du type Post
- `Comment.ts` : Définition du type Comment

**Queries et Mutations**
- `queries.ts` : Toutes les queries disponibles
- `mutations.ts` : Toutes les mutations disponibles

## 🛠️ Scripts NPM disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer en mode développement |
| `npm run start` | Démarrer en mode production |
| `npm run build` | Compiler TypeScript |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Créer et appliquer une migration |
| `npm run prisma:seed` | Initialiser les données |
| `npm run prisma:studio` | Ouvrir Prisma Studio (GUI) |
| `npm run db:setup` | Configuration complète de la DB |

## 🐳 Commandes Docker utiles

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

## 🔄 Différences avec le Step 2

| Aspect | Step 2 | Step 3 |
|--------|--------|--------|
| **Stockage** | Données en mémoire (arrays) | PostgreSQL |
| **Persistance** | Non | Oui |
| **Architecture** | Resolvers simples | DataSources + Resolvers modulaires |
| **Organisation** | Un fichier par type de resolver | Un fichier par domaine |
| **TypeDefs** | Un seul fichier | Fichiers séparés par type |
| **ORM** | Aucun | Prisma |
| **Migrations** | N/A | Versionnées avec Prisma |
| **Types** | Manuel | Générés automatiquement |

## 🐛 Résolution de problèmes

### Erreur de connexion PostgreSQL

```bash
# Vérifier que Docker est lancé
docker ps

# Redémarrer les conteneurs
docker-compose restart

# Vérifier les logs
docker-compose logs postgres
```

### Prisma Client non généré

```bash
npx prisma generate
```

### Migration échouée

```bash
# Réinitialiser complètement
npx prisma migrate reset
npm run prisma:seed
```

## 🚀 Prochaines étapes (Step 4)

- Authentification et autorisation avec JWT
- DataLoader pour optimiser les requêtes N+1
- Pagination avec curseurs
- Filtres et tri avancés
- Subscriptions en temps réel avec WebSockets
- Tests unitaires et d'intégration

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)