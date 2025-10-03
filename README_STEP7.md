# Step 7 : Unions GraphQL et Types Polymorphes

## 🎯 Objectifs de ce step

Ce step introduit les **Unions GraphQL** pour gérer des types de contenu polymorphes, comme dans un feed de réseau social où différents types de posts coexistent.

### Nouveautés du Step 7 :
- ✅ **Union PostContent** pour différents types de posts
- ✅ **4 types de posts** : Article, Video, Poll, Image
- ✅ **Resolver __resolveType** pour déterminer le type concret
- ✅ **Metadata JSON** dans Prisma pour stocker des données spécifiques
- ✅ **Field resolvers** spécifiques à chaque type
- ✅ **Feed unifié** avec contenu polymorphe

## 🔀 Qu'est-ce qu'une Union GraphQL ?

Une **Union** permet à un champ de retourner différents types d'objets. Contrairement aux interfaces, les types d'une union n'ont pas besoin de partager des champs communs.

### Union vs Interface

| Aspect | Union | Interface |
|--------|--------|-----------|
| Champs communs | Non requis | Obligatoires |
| Cas d'usage | Types complètement différents | Types avec propriétés partagées |
| Flexibilité | Maximale | Structurée |
| Exemple | Feed multi-contenu | Animal → Chat, Chien |

## 📊 Architecture

### Types de Posts

```graphql
union PostContent = ArticlePost | VideoPost | PollPost | ImagePost

type Feed {
  id: ID!
  author: User!
  content: PostContent!
  createdAt: String!
  updatedAt: String!
}
```

### Types concrets

**ArticlePost** - Articles classiques
```graphql
type ArticlePost {
  id: ID!
  title: String!
  content: String!
  readingTime: Int!
  tags: [String!]!
  author: User!
  comments: [Comment!]!
}
```

**VideoPost** - Contenu vidéo
```graphql
type VideoPost {
  id: ID!
  title: String!
  videoUrl: String!
  duration: Int!
  thumbnail: String
  views: Int!
  author: User!
  comments: [Comment!]!
}
```

**PollPost** - Sondages
```graphql
type PollPost {
  id: ID!
  question: String!
  options: [PollOption!]!
  totalVotes: Int!
  multipleChoice: Boolean!
  expiresAt: String
  author: User!
  comments: [Comment!]!
}
```

**ImagePost** - Galeries d'images
```graphql
type ImagePost {
  id: ID!
  title: String!
  images: [ImageItem!]!
  description: String
  author: User!
  comments: [Comment!]!
}
```

## 🗄️ Base de données

### Schema Prisma

```prisma
enum PostType {
  ARTICLE
  VIDEO
  POLL
  IMAGE
}

model Post {
  type      PostType @default(ARTICLE)
  metadata  Json?    // Stockage des données spécifiques
  // ... autres champs
}
```

### Metadata JSON

Chaque type stocke ses données spécifiques dans le champ `metadata` :

```javascript
// ArticlePost
{
  tags: ["GraphQL", "API"],
  readingTime: 5
}

// VideoPost
{
  videoUrl: "https://...",
  duration: 600,
  thumbnail: "https://...",
  views: 1250
}

// PollPost
{
  options: [
    { id: "1", text: "Option A", votes: 42 }
  ],
  multipleChoice: false,
  expiresAt: "2024-12-31"
}

// ImagePost
{
  images: [
    {
      url: "https://...",
      caption: "...",
      altText: "..."
    }
  ]
}
```

## 🔧 Résolution du Type

### Resolver __resolveType

```typescript
PostContent: {
  __resolveType(obj: any) {
    switch (obj.type) {
      case 'ARTICLE': return 'ArticlePost';
      case 'VIDEO': return 'VideoPost';
      case 'POLL': return 'PollPost';
      case 'IMAGE': return 'ImagePost';
      default: return 'ArticlePost';
    }
  }
}
```

## 📝 Exemples de Queries

### Query avec fragments inline

```graphql
query GetFeed {
  feed {
    id
    author {
      name
    }
    content {
      ... on ArticlePost {
        title
        content
        readingTime
        tags
      }
      ... on VideoPost {
        title
        videoUrl
        duration
        views
      }
      ... on PollPost {
        question
        options {
          text
          votes
        }
        totalVotes
      }
      ... on ImagePost {
        title
        images {
          url
          caption
        }
      }
    }
    createdAt
  }
}
```

### Query avec fragments nommés

```graphql
fragment ArticleFields on ArticlePost {
  title
  content
  readingTime
  tags
}

fragment VideoFields on VideoPost {
  title
  videoUrl
  duration
  thumbnail
  views
}

query GetFeedWithFragments {
  feed {
    id
    author { name }
    content {
      ...ArticleFields
      ...VideoFields
      # etc.
    }
  }
}
```

### Query avec __typename

```graphql
query GetFeedWithType {
  feed {
    id
    content {
      __typename
      ... on ArticlePost { title }
      ... on VideoPost { title videoUrl }
      ... on PollPost { question }
      ... on ImagePost { title images { url } }
    }
  }
}
```

## 🎨 Cas d'usage Frontend

### React avec Apollo Client

```typescript
const FEED_QUERY = gql`
  query GetFeed {
    feed {
      id
      content {
        __typename
        ... on ArticlePost {
          title
          content
          readingTime
        }
        ... on VideoPost {
          title
          videoUrl
          duration
        }
        # etc.
      }
    }
  }
`;

function FeedItem({ item }) {
  const { content } = item;

  switch (content.__typename) {
    case 'ArticlePost':
      return <ArticleCard {...content} />;
    case 'VideoPost':
      return <VideoPlayer {...content} />;
    case 'PollPost':
      return <PollWidget {...content} />;
    case 'ImagePost':
      return <ImageGallery {...content} />;
    default:
      return null;
  }
}
```

## 🚀 Avantages des Unions

### ✅ Flexibilité
- Types complètement différents dans un même champ
- Pas de contrainte de champs communs
- Évolution facile du schéma

### ✅ Performance
- Une seule requête pour tous les types
- Optimisation avec DataLoader
- Cache unifié

### ✅ Developer Experience
- Type safety avec TypeScript
- Auto-complétion dans GraphQL Playground
- Documentation auto-générée

## 🔄 Différences avec le Step 6

| Aspect | Step 6 | Step 7 |
|--------|--------|--------|
| **Types de posts** | Un seul type Post | 4 types via Union |
| **Schéma** | Simple | Polymorphe |
| **Base de données** | Champs fixes | Metadata JSON |
| **Resolvers** | Standards | __resolveType |
| **Queries** | Directes | Avec fragments |

## 🧪 Tester le Step 7

### 1. Lancer le serveur
```bash
npm run dev
```

### 2. Query de test
```graphql
query TestUnion {
  feed {
    id
    author { name }
    content {
      __typename
      ... on ArticlePost {
        title
        tags
        readingTime
      }
      ... on VideoPost {
        title
        videoUrl
        duration
        views
      }
    }
  }
}
```

### 3. Vérifier les types
Dans GraphQL Playground, l'auto-complétion montrera les différents types disponibles dans l'union.

## 📚 Ressources

- [GraphQL Unions Documentation](https://graphql.org/learn/schema/#union-types)
- [Apollo Client - Working with Unions](https://www.apollographql.com/docs/react/data/fragments/#using-fragments-with-unions-and-interfaces)
- [Prisma JSON Fields](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#json)