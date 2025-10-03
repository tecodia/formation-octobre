# Step 8 - Quick Start - Subscriptions temps réel

## 🚀 Démarrage rapide

### 1. Démarrer les services
```bash
# PostgreSQL et Redis
docker-compose up -d

# Serveur avec WebSocket
npm run dev
```

### 2. Test rapide des subscriptions

Ouvrir `http://localhost:4000/graphql` dans **2 onglets** différents.

### Onglet 1 : Lancer la subscription

```graphql
subscription ListenComments {
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

Cliquer sur "Subscribe" - La connexion WebSocket s'établit.

### Onglet 2 : Créer un commentaire

D'abord, récupérer des IDs valides :

```graphql
query GetIDs {
  users { id name }
  posts { id title }
}
```

Puis créer un commentaire :

```graphql
mutation AddComment {
  createComment(
    text: "Wow, ça marche en temps réel!"
    postId: "COPIER_UN_ID_POST"
    authorId: "COPIER_UN_ID_USER"
  ) {
    id
    text
  }
}
```

### 🎉 Résultat

Le commentaire apparaît **instantanément** dans l'onglet 1 !

## 📡 Subscriptions disponibles

```graphql
# Tous les commentaires
subscription {
  commentAdded {
    comment { text }
  }
}

# Commentaires d'un post
subscription($postId: ID!) {
  commentAddedToPost(postId: $postId) {
    comment { text }
  }
}

# Nouveaux posts
subscription {
  postCreated {
    post { title }
  }
}
```

## 🔌 Connexion WebSocket

- **URL** : `ws://localhost:4000/graphql`
- **Protocol** : `graphql-ws`
- **Auto-reconnect** : Oui

## 🎯 Points clés

- **Temps réel** : Pas de polling, connexion persistante
- **PubSub** : Communication événementielle
- **Filtres** : Écouter uniquement ce qui vous intéresse
- **Performance** : Une seule connexion pour toutes les subscriptions

## 📚 Ressources

- README_STEP8.md pour les détails techniques
- Apollo Studio pour tester facilement