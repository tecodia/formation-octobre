# Step 5 : Optimisation avec DataLoader

## 🎯 Objectifs de ce step

Ce step introduit DataLoader pour optimiser les requêtes N+1 et réduire drastiquement le nombre de requêtes SQL.

### Nouveautés du Step 5 :
- ✅ DataLoader pour batching et caching des requêtes
- ✅ Élimination du problème N+1
- ✅ Réduction significative des requêtes SQL
- ✅ Performance améliorée pour les requêtes imbriquées

## 🚀 Le problème N+1

### Sans DataLoader (Step 4)

```graphql
query GetPosts {
  posts {           # 1 requête SQL
    author {        # N requêtes SQL (1 par post)
      name
    }
  }
}
```
**Résultat** : 1 + N requêtes SQL (si 10 posts = 11 requêtes)

### Avec DataLoader (Step 5)

```graphql
query GetPosts {
  posts {           # 1 requête SQL
    author {        # 1 requête SQL (batchée)
      name
    }
  }
}
```
**Résultat** : 2 requêtes SQL au total (peu importe le nombre de posts)

## 📊 Architecture DataLoader

```
src/loaders/
├── userLoader.ts         # Batch loading des Users
├── postLoader.ts         # Batch loading des Posts
├── commentLoader.ts      # Batch loading des Comments
└── index.ts             # Factory pour créer les loaders
```

## 🔧 Comment ça marche

### 1. Batching
DataLoader collecte tous les IDs demandés dans un même tick et fait une seule requête :

```typescript
// Au lieu de :
SELECT * FROM users WHERE id = '1';
SELECT * FROM users WHERE id = '2';
SELECT * FROM users WHERE id = '3';

// DataLoader fait :
SELECT * FROM users WHERE id IN ('1', '2', '3');
```

### 2. Caching par requête
Les données sont cachées pendant la durée de la requête GraphQL :

```typescript
// Premier appel
await userLoader.load('1'); // Requête SQL

// Deuxième appel (même requête GraphQL)
await userLoader.load('1'); // Depuis le cache, pas de SQL
```

## 📝 Exemple de requête complexe

```graphql
query ComplexQuery {
  posts {
    id
    title
    author {            # DataLoader batch les users
      id
      name
      posts {          # DataLoader batch les posts par auteur
        id
        title
      }
    }
    comments {         # DataLoader batch les comments
      id
      text
      author {        # Réutilise le cache des users
        name
      }
    }
  }
}
```

**Sans DataLoader** : ~50+ requêtes SQL
**Avec DataLoader** : ~5 requêtes SQL

## 🔍 Vérification avec le plugin SQL

Grâce au plugin du Step 4, vous pouvez voir la différence dans `extensions.sql` :

```json
{
  "data": { ... },
  "extensions": {
    "sql": {
      "queries": [
        {
          "query": "SELECT * FROM \"Post\"",
          "duration": 2.1
        },
        {
          "query": "SELECT * FROM \"User\" WHERE id IN ($1, $2, $3)",
          "duration": 1.5
        },
        {
          "query": "SELECT * FROM \"Comment\" WHERE \"postId\" IN ($1, $2, $3)",
          "duration": 1.8
        }
      ],
      "totalQueries": 3,
      "totalDuration": 5.4
    }
  }
}
```

## 💻 Implementation

### DataLoader pour User

```typescript
// src/loaders/userLoader.ts
async function batchUsers(ids: readonly string[]): Promise<(User | null)[]> {
  const users = await prisma.user.findMany({
    where: { id: { in: ids as string[] } }
  });

  // Retourner dans l'ordre des IDs demandés
  const userMap = new Map(users.map(user => [user.id, user]));
  return ids.map(id => userMap.get(id) || null);
}

export function createUserLoader() {
  return new DataLoader<string, User | null>(batchUsers);
}
```

### Utilisation dans les resolvers

```typescript
// Avant (Step 4)
export const postFieldResolvers = {
  author: async (parent: { authorId: string }) => {
    return await userDataSource.getUserById(parent.authorId);
  }
};

// Après (Step 5)
export const postFieldResolvers = {
  author: async (parent: { authorId: string }, _: any, context: GraphQLContext) => {
    return context.loaders.userLoader.load(parent.authorId);
  }
};
```

## 📈 Performances

### Comparaison des performances

| Query | Sans DataLoader | Avec DataLoader | Amélioration |
|-------|-----------------|-----------------|--------------|
| 10 posts avec auteurs | 11 requêtes | 2 requêtes | -82% |
| 10 posts avec auteurs et commentaires | 31+ requêtes | 4 requêtes | -87% |
| Query complexe imbriquée | 100+ requêtes | 5-10 requêtes | -90%+ |

## 🛠️ Scripts disponibles

```bash
# Démarrer le serveur avec DataLoader
npm run dev

# Voir les requêtes SQL optimisées
# Ouvrir http://localhost:4000 et regarder extensions.sql
```

## 🔄 Différences avec le Step 4

| Aspect | Step 4 | Step 5 |
|--------|--------|--------|
| **Requêtes N+1** | Présentes | Éliminées |
| **Batching** | Non | Oui |
| **Caching** | Non | Par requête |
| **Performance** | Standard | Optimisée |
| **Complexité** | Simple | Légèrement plus complexe |

## 🎯 Cas d'usage recommandés

### ✅ Utiliser DataLoader pour :
- Relations one-to-many (posts d'un user)
- Relations many-to-one (auteur d'un post)
- Chargement par IDs multiples
- Requêtes avec beaucoup de relations imbriquées

### ⚠️ Ne pas utiliser DataLoader pour :
- Queries simples sans relations
- Mutations (pas de cache nécessaire)
- Requêtes avec filtres complexes

## 🚀 Prochaines étapes

- Step 6 : Authentification et autorisation
- Step 7 : Pagination et filtres
- Step 8 : Subscriptions temps réel

## 📚 Ressources

- [DataLoader Documentation](https://github.com/graphql/dataloader)
- [N+1 Problem Explained](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)