# Step 7 - Quick Start - Unions GraphQL

## 🚀 Démarrage rapide

### 1. Mise à jour de la base
```bash
# Appliquer la migration
npx prisma migrate dev

# Seed avec les nouveaux types
npx tsx prisma/seed-step7.ts
```

### 2. Démarrer le serveur
```bash
npm run dev
```

## 🧪 Query de test rapide

```graphql
query TestUnionFeed {
  feed {
    id
    author {
      name
    }
    content {
      __typename
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

## 📊 Types de contenu

Le feed contient maintenant 4 types de posts :

- **📝 ArticlePost** : Articles avec tags et temps de lecture
- **🎥 VideoPost** : Vidéos avec URL et durée
- **📊 PollPost** : Sondages avec options et votes
- **🖼️ ImagePost** : Galeries d'images avec légendes

## 🔍 Identifier le type

Utilisez `__typename` pour identifier le type concret :

```graphql
query GetTypesOnly {
  feed {
    id
    content {
      __typename  # Retourne: ArticlePost, VideoPost, etc.
    }
  }
}
```

## 💡 Astuce : Fragments

Pour réutiliser les champs :

```graphql
fragment BasePost on ArticlePost {
  title
  author { name }
}

query WithFragment {
  feed {
    content {
      ... on ArticlePost {
        ...BasePost
        readingTime
      }
    }
  }
}
```

## 🎯 Points clés

- **Union** : Un champ peut retourner différents types
- **Fragments** : Nécessaires pour accéder aux champs spécifiques
- **__typename** : Identifie le type concret retourné
- **Pas de champs communs** : Contrairement aux interfaces

## 📚 Ressources

- README_STEP7.md pour les détails complets
- GraphQL Playground pour explorer le schéma