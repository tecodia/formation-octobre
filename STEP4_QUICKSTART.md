# Step 4 - Quick Start : SQL Tracking Plugin

## 🚀 Démarrage rapide (5 minutes)

### 1. Vérifier que PostgreSQL est lancé

```bash
docker-compose ps
```

Si pas lancé :
```bash
docker-compose up -d
```

### 2. Démarrer le serveur

```bash
npm run dev
```

### 3. Ouvrir GraphQL Playground

Aller sur : http://localhost:4000

### 4. Tester une query simple

```graphql
query TestSQLTracking {
  users {
    id
    name
    email
  }
}
```

**Résultat attendu** :
```json
{
  "data": {
    "users": [ ... ]
  },
  "extensions": {
    "sql": {
      "queries": [
        {
          "query": "SELECT ... FROM User ...",
          "params": "[]",
          "duration": 2.5
        }
      ],
      "totalQueries": 1,
      "totalDuration": 2.5
    }
  }
}
```

### 5. Tester le problème N+1

```graphql
query DetectN1Problem {
  users {
    id
    name
    posts {
      id
      title
    }
  }
}
```

**Observer** :
- `totalQueries` : Si vous avez 3 users, vous verrez 4 queries (1 + 3)
- C'est un problème N+1 ! (sera résolu au Step 5 avec DataLoader)

## 📊 Exemples de queries à tester

### Query 1 : Users seulement (1 query SQL)

```graphql
{
  users {
    id
    name
  }
}
```

### Query 2 : Users avec posts (N+1 queries)

```graphql
{
  users {
    id
    posts {
      title
    }
  }
}
```

### Query 3 : Mutation avec tracking

```graphql
mutation CreateUser {
  createUser(
    name: "TestUser"
    email: "test@example.com"
  ) {
    id
    name
  }
}
```

### Query 4 : Relations complètes (beaucoup de queries!)

```graphql
{
  users {
    name
    posts {
      title
      comments {
        text
        author {
          name
        }
      }
    }
  }
}
```

## 🎯 Ce qu'il faut observer

### 1. Dans les extensions

Chaque réponse GraphQL contient maintenant une section `extensions.sql` :

```json
{
  "data": { ... },
  "extensions": {
    "sql": {
      "queries": [ ... ],        // Toutes les queries SQL
      "totalQueries": 5,         // Nombre total
      "totalDuration": 12.34     // Temps total en ms
    }
  }
}
```

### 2. Les queries SQL

Chaque query contient :
- `query` : La requête SQL brute
- `params` : Les paramètres
- `duration` : Durée en millisecondes
- `timestamp` : Horodatage

### 3. Les statistiques

- **totalQueries** : Nombre de requêtes exécutées
- **totalDuration** : Temps total passé en base de données

## 🔍 Détection des problèmes

### Problème N+1 détecté

**Symptôme** :
```json
{
  "extensions": {
    "sql": {
      "totalQueries": 11  // 1 query + 10 queries
    }
  }
}
```

**Explication** :
- 1 query pour récupérer les users
- 10 queries pour récupérer les posts de chaque user
- Total : 11 queries au lieu de 2 possibles

**Solution** : Utiliser DataLoader (Step 5)

### Query lente détectée

**Symptôme** :
```json
{
  "queries": [
    {
      "query": "SELECT ...",
      "duration": 156.7  // > 100ms
    }
  ]
}
```

**Action** : Optimiser la query ou ajouter un index

## 🛠️ Modifications apportées

### Fichiers créés

1. **src/plugins/sqlTrackingPlugin.ts**
   - Plugin Apollo pour ajouter les extensions SQL

2. **src/context/index.ts**
   - Contexte GraphQL avec `sqlQueries[]`

### Fichiers modifiés

1. **src/lib/prisma.ts**
   - Ajout de `$on('query')` pour capturer les SQL
   - Ajout de `setCurrentContext()`

2. **src/index.ts**
   - Ajout du plugin
   - Création du contexte pour chaque requête

## 💡 Astuces

### Désactiver temporairement le tracking

Commentez le plugin dans `src/index.ts` :

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [sqlTrackingPlugin],  // ← Commenté
});
```

### Voir uniquement le nombre de queries

Regardez seulement `extensions.sql.totalQueries`

### Copier une query SQL pour tester

Copiez une query depuis `extensions.sql.queries[0].query` et exécutez-la dans Adminer pour la tester directement.

## 🎓 Concepts appris

1. **Plugins Apollo Server** : Intercepter le cycle de vie des requêtes
2. **Extensions GraphQL** : Ajouter des métadonnées aux réponses
3. **Événements Prisma** : Écouter les queries SQL
4. **Contexte GraphQL** : Partager des données entre resolvers
5. **Problème N+1** : Détecter et comprendre ce problème de performance

## ⏭️ Prochaine étape

Le **Step 5** introduira **DataLoader** pour résoudre les problèmes N+1 détectés ici !

Vous verrez comment passer de :
```
totalQueries: 11  (1 + 10 N+1)
```

À :
```
totalQueries: 2   (1 + 1 batched)
```

## 📝 Exercices

1. Trouvez une query qui génère exactement 5 queries SQL
2. Créez une mutation qui génère 2 INSERT queries
3. Identifiez la query la plus lente dans votre schéma
4. Comparez la durée des queries avec/sans relations

## ✅ Validation

Vous avez réussi le Step 4 si :

- [ ] Vous voyez `extensions.sql` dans chaque réponse
- [ ] Vous pouvez identifier un problème N+1
- [ ] Vous comprenez le contenu de chaque query SQL
- [ ] Vous savez interpréter `totalQueries` et `totalDuration`
