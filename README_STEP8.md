# Step 8 : Subscriptions GraphQL en temps réel

## 🎯 Objectifs de ce step

Ce step introduit les **Subscriptions GraphQL** pour permettre la communication en temps réel via WebSocket, particulièrement pour recevoir les nouveaux commentaires instantanément.

### Nouveautés du Step 8 :
- ✅ **WebSocket Server** pour les connexions temps réel
- ✅ **Subscriptions GraphQL** pour les événements
- ✅ **PubSub** pour la communication événementielle
- ✅ **commentAdded** : Écouter tous les nouveaux commentaires
- ✅ **commentAddedToPost** : Écouter les commentaires d'un post spécifique
- ✅ **Express + Apollo** pour support HTTP et WebSocket

## 🔌 Architecture WebSocket

### Stack technique

```
Client (Apollo Studio / App)
    ↓ WebSocket
GraphQL WS Server (port 4000)
    ↓ PubSub
Resolvers
    ↓ Publish events
Mutations
```

### Configuration

- **HTTP** : `http://localhost:4000/graphql`
- **WebSocket** : `ws://localhost:4000/graphql`
- **Protocol** : `graphql-ws`

## 📡 Subscriptions disponibles

### commentAdded
Écoute tous les nouveaux commentaires ajoutés

```graphql
subscription WatchAllComments {
  commentAdded {
    comment {
      id
      text
      createdAt
      author {
        name
        email
      }
    }
    post {
      id
      title
    }
    action
  }
}
```

### commentAddedToPost
Écoute les commentaires d'un post spécifique

```graphql
subscription WatchPostComments($postId: ID!) {
  commentAddedToPost(postId: $postId) {
    comment {
      id
      text
      author {
        name
      }
    }
    post {
      title
    }
    action
  }
}
```

### postCreated
Écoute la création de nouveaux posts

```graphql
subscription WatchNewPosts {
  postCreated {
    post {
      id
      title
      content
      type
      author {
        name
      }
    }
    action
  }
}
```

## 🔧 Implementation technique

### PubSub

```typescript
// src/lib/pubsub.ts
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const SUBSCRIPTION_EVENTS = {
  COMMENT_ADDED: 'COMMENT_ADDED',
  POST_CREATED: 'POST_CREATED',
  POST_UPDATED: 'POST_UPDATED',
};
```

### Publier un événement

```typescript
// Dans une mutation
await pubsub.publish(SUBSCRIPTION_EVENTS.COMMENT_ADDED, {
  commentAdded: {
    comment: newComment,
    post: relatedPost,
    action: 'CREATED'
  }
});
```

### Subscription Resolver

```typescript
// src/resolvers/Subscription/commentSubscriptions.ts
export const commentSubscriptionResolvers = {
  commentAdded: {
    subscribe: () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]),
  },

  commentAddedToPost: {
    subscribe: withFilter(
      () => pubsub.asyncIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]),
      (payload, variables) => {
        return payload.comment.postId === variables.postId;
      }
    ),
  },
};
```

## 🧪 Tester les subscriptions

### 1. Démarrer le serveur

```bash
# Démarrer Redis et PostgreSQL
docker-compose up -d

# Démarrer le serveur
npm run dev
```

### 2. Ouvrir Apollo Studio

Naviguer vers `http://localhost:4000/graphql`

### 3. Lancer une subscription

Dans l'onglet 1, exécuter :

```graphql
subscription {
  commentAdded {
    comment {
      id
      text
      author {
        name
      }
    }
    post {
      title
    }
    action
  }
}
```

### 4. Créer un commentaire

Dans l'onglet 2, exécuter :

```graphql
mutation {
  createComment(
    text: "Ceci est un test en temps réel!"
    postId: "ID_DU_POST"
    authorId: "ID_DU_USER"
  ) {
    id
    text
  }
}
```

### 5. Observer le résultat

Le nouveau commentaire apparaît instantanément dans l'onglet 1 ! 🎉

## 📊 Cas d'usage

### Chat en temps réel

```graphql
subscription ChatMessages {
  commentAddedToPost(postId: "chat-room-1") {
    comment {
      text
      author { name }
      createdAt
    }
  }
}
```

### Notifications

```graphql
subscription MyNotifications($userId: ID!) {
  commentAdded {
    comment {
      text
      post {
        title
        author {
          id
        }
      }
    }
  }
}
```

### Feed temps réel

```graphql
subscription LiveFeed {
  postCreated {
    post {
      ... on ArticlePost {
        title
        content
      }
      ... on VideoPost {
        title
        videoUrl
      }
    }
  }
}
```

## 🎨 Frontend Integration

### Apollo Client (React)

```typescript
import { useSubscription, gql } from '@apollo/client';

const COMMENT_SUBSCRIPTION = gql`
  subscription OnCommentAdded {
    commentAdded {
      comment {
        id
        text
        author { name }
      }
    }
  }
`;

function CommentsLive() {
  const { data, loading } = useSubscription(COMMENT_SUBSCRIPTION);

  if (loading) return <p>En attente de commentaires...</p>;

  return (
    <div>
      {data?.commentAdded && (
        <div className="new-comment">
          <strong>{data.commentAdded.comment.author.name}:</strong>
          {data.commentAdded.comment.text}
        </div>
      )}
    </div>
  );
}
```

### Configuration WebSocket Client

```typescript
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
```

## 🚀 Avantages des Subscriptions

### ✅ Temps réel
- Notifications instantanées
- Pas de polling
- Connexion persistante

### ✅ Performance
- Une seule connexion WebSocket
- Événements push du serveur
- Économie de bande passante

### ✅ Expérience utilisateur
- Mises à jour live
- Collaboration temps réel
- Interactivité accrue

## 🔄 Différences avec le Step 7

| Aspect | Step 7 | Step 8 |
|--------|--------|--------|
| **Communication** | HTTP only | HTTP + WebSocket |
| **Temps réel** | Non | Oui |
| **Serveur** | Standalone | Express + Apollo |
| **Events** | Non | PubSub |
| **Protocol** | HTTP | HTTP + WS |

## 🐛 Troubleshooting

### WebSocket ne se connecte pas

```bash
# Vérifier que le port est libre
lsof -i :4000

# Vérifier les logs du serveur
npm run dev
```

### Subscription ne reçoit rien

- Vérifier que la mutation publie bien l'événement
- Vérifier le nom de l'événement dans PubSub
- Vérifier les filtres withFilter

### Erreur CORS

```typescript
// Dans index.ts
app.use(
  '/graphql',
  cors({
    origin: '*', // ou votre domaine spécifique
    credentials: true
  }),
  // ...
);
```

## 📚 Ressources

- [GraphQL Subscriptions](https://www.apollographql.com/docs/apollo-server/data/subscriptions/)
- [graphql-ws](https://github.com/enisdenjo/graphql-ws)
- [PubSub Documentation](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-pubsub-class)