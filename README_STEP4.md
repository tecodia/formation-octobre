# Step 4 : Plugin Apollo Server pour le Tracking SQL

## 🎯 Objectifs de ce step

Ce step ajoute un plugin Apollo Server qui capture et trace toutes les requêtes SQL PostgreSQL exécutées par Prisma, et les retourne dans la réponse GraphQL sous `extensions.sql`. Ceci permet de :
- Déboguer et optimiser les performances
- Détecter les problèmes N+1
- Analyser les requêtes SQL générées
- Comprendre l'impact de chaque query GraphQL sur la base de données

### Nouveautés du Step 4 :
- ✅ **Plugin Apollo SQL Tracking** pour capturer automatiquement les queries SQL
- ✅ **Contexte GraphQL** pour isoler les queries par requête
- ✅ **Extensions GraphQL** avec statistiques SQL détaillées
- ✅ **Événements Prisma** pour logger chaque query
- ✅ **Métriques de performance** (durée, nombre de queries)

## 🏗️ Architecture

```
graphql-formation/
├── src/
│   ├── plugins/                    # 🆕 Plugins Apollo
│   │   └── sqlTrackingPlugin.ts   # Plugin de tracking SQL
│   ├── context/                    # 🆕 Contexte GraphQL
│   │   └── index.ts               # Définition du contexte avec sqlQueries[]
│   ├── lib/
│   │   └── prisma.ts              # ✏️ Modifié : capture des événements query
│   ├── datasources/
│   ├── resolvers/
│   ├── schema/
│   └── index.ts                    # ✏️ Modifié : plugin et context
└── README_STEP4.md
```

## 📦 Installation

Aucune dépendance supplémentaire n'est nécessaire. Le tracking SQL utilise :
- Les événements Prisma natifs (`$on('query')`)
- Les plugins Apollo Server (intégrés dans `@apollo/server`)
- Les extensions GraphQL (standard GraphQL)

## 🔧 Implémentation

### 1. Contexte GraphQL (`src/context/index.ts`)

Le contexte stocke toutes les queries SQL exécutées durant une requête GraphQL :

```typescript
export interface SQLQuery {
  query: string;      // La requête SQL brute
  params: string;     // Les paramètres de la query
  duration: number;   // Durée d'exécution en ms
  timestamp: number;  // Timestamp d'exécution
}

export interface GraphQLContext {
  sqlQueries: SQLQuery[];
}

export function createContext(): GraphQLContext {
  return {
    sqlQueries: [],
  };
}
```

### 2. Client Prisma modifié (`src/lib/prisma.ts`)

Le client Prisma est configuré pour :
- Émettre des événements pour chaque query
- Capturer ces événements et les stocker dans le contexte
- Utiliser une variable globale pour le contexte courant

```typescript
// Configuration du logging
export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

// Écoute des événements query
prisma.$on('query' as any, (e: any) => {
  if (currentContext) {
    currentContext.sqlQueries.push({
      query: e.query,
      params: e.params,
      duration: e.duration,
      timestamp: Date.now(),
    });
  }
});
```

### 3. Plugin SQL Tracking (`src/plugins/sqlTrackingPlugin.ts`)

Le plugin Apollo ajoute les queries SQL dans les extensions de chaque réponse :

```typescript
export const sqlTrackingPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    return {
      async willSendResponse({ response, contextValue }) {
        const queries = contextValue.sqlQueries;
        const totalQueries = queries.length;
        const totalDuration = queries.reduce((sum, q) => sum + q.duration, 0);

        response.body.singleResult.extensions.sql = {
          queries: queries.map((q) => ({
            query: q.query,
            params: q.params,
            duration: q.duration,
            timestamp: q.timestamp,
          })),
          totalQueries,
          totalDuration: Math.round(totalDuration * 100) / 100,
        };
      },
    };
  },
};
```

### 4. Serveur Apollo mis à jour (`src/index.ts`)

Le serveur intègre le plugin et crée un contexte pour chaque requête :

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [sqlTrackingPlugin],  // ← Plugin activé
});

await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const context = createContext();
    setCurrentContext(context);
    return context;
  },
});
```

## 🚀 Démarrage

```bash
# Assurez-vous que PostgreSQL est lancé
docker-compose up -d

# Démarrer le serveur
npm run dev
```

## 📊 Exemples avec SQL Tracking

### Exemple 1 : Query simple

**GraphQL Query :**
```graphql
query GetUsers {
  users {
    id
    name
    email
  }
}
```

**Réponse GraphQL :**
```json
{
  "data": {
    "users": [
      {
        "id": "cm2u5...",
        "name": "Alice",
        "email": "alice@example.com"
      }
    ]
  },
  "extensions": {
    "sql": {
      "queries": [
        {
          "query": "SELECT \"public\".\"User\".\"id\", \"public\".\"User\".\"name\", \"public\".\"User\".\"email\", \"public\".\"User\".\"createdAt\", \"public\".\"User\".\"updatedAt\" FROM \"public\".\"User\" WHERE 1=1 ORDER BY \"public\".\"User\".\"createdAt\" DESC OFFSET $1",
          "params": "[0]",
          "duration": 2.341,
          "timestamp": 1728025834521
        }
      ],
      "totalQueries": 1,
      "totalDuration": 2.34
    }
  }
}
```

### Exemple 2 : Query avec relations (Problème N+1 potentiel)

**GraphQL Query :**
```graphql
query GetUsersWithPosts {
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

**Réponse GraphQL :**
```json
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Alice",
        "posts": [
          { "id": "101", "title": "Post 1" }
        ]
      },
      {
        "id": "2",
        "name": "Bob",
        "posts": [
          { "id": "102", "title": "Post 2" }
        ]
      }
    ]
  },
  "extensions": {
    "sql": {
      "queries": [
        {
          "query": "SELECT ... FROM User ...",
          "params": "[]",
          "duration": 1.5
        },
        {
          "query": "SELECT ... FROM Post WHERE authorId = $1",
          "params": "[\"1\"]",
          "duration": 0.8
        },
        {
          "query": "SELECT ... FROM Post WHERE authorId = $1",
          "params": "[\"2\"]",
          "duration": 0.7
        }
      ],
      "totalQueries": 3,
      "totalDuration": 3.0
    }
  }
}
```

**⚠️ Problème détecté** : 1 query pour les users + N queries pour les posts (une par user)
**💡 Solution** : Utiliser DataLoader (Step 5)

### Exemple 3 : Mutation avec tracking

**GraphQL Mutation :**
```graphql
mutation CreateUserAndPost {
  user: createUser(name: "Charlie", email: "charlie@example.com") {
    id
    name
  }
  post: createPost(
    title: "Mon post"
    content: "Contenu..."
    authorId: "cm2u5..."
  ) {
    id
    title
  }
}
```

**Extensions SQL :**
```json
{
  "extensions": {
    "sql": {
      "queries": [
        {
          "query": "INSERT INTO \"public\".\"User\" (\"id\",\"name\",\"email\",...) VALUES ($1,$2,$3,...)",
          "params": "[\"cm2v...\",\"Charlie\",\"charlie@example.com\",...]",
          "duration": 3.2
        },
        {
          "query": "INSERT INTO \"public\".\"Post\" (\"id\",\"title\",\"content\",...) VALUES ($1,$2,$3,...)",
          "params": "[\"cm2w...\",\"Mon post\",\"Contenu...\",...]",
          "duration": 2.8
        }
      ],
      "totalQueries": 2,
      "totalDuration": 6.0
    }
  }
}
```

## 🔍 Analyse des Performances

### Métriques disponibles

1. **totalQueries** : Nombre total de requêtes SQL exécutées
   - ✅ Idéal : 1-3 queries pour une requête GraphQL simple
   - ⚠️ Attention : 5-10 queries
   - 🚨 Problème : 10+ queries (probable problème N+1)

2. **totalDuration** : Temps total passé en base de données (ms)
   - ✅ Excellent : < 10ms
   - ⚠️ Acceptable : 10-50ms
   - 🚨 Lent : > 50ms

3. **query** : La requête SQL brute
   - Permet de voir les JOINs, WHERE, ORDER BY
   - Utile pour optimiser les index

4. **params** : Les paramètres de la query
   - Permet de voir les valeurs utilisées
   - Utile pour déboguer

### Cas d'usage du tracking

#### 1. Détecter les problèmes N+1

**Symptôme** : `totalQueries` augmente avec le nombre d'items retournés

**Exemple** :
- 10 users → 11 queries (1 pour users + 10 pour leurs posts)
- 100 users → 101 queries
- 1000 users → 1001 queries

**Solution** : Utiliser DataLoader (voir Step 5)

#### 2. Identifier les queries lentes

**Symptôme** : Certaines queries ont une `duration` élevée

**Exemple** :
```json
{
  "query": "SELECT * FROM Post WHERE content LIKE '%keyword%'",
  "duration": 234.5
}
```

**Solution** : Ajouter un index sur la colonne concernée

#### 3. Optimiser les JOINs

**Symptôme** : Queries complexes avec plusieurs JOINs

**Exemple** :
```sql
SELECT ... FROM User
LEFT JOIN Post ON ...
LEFT JOIN Comment ON ...
WHERE ...
```

**Solution** : Revoir l'architecture des resolvers ou utiliser des queries séparées

## 🛠️ Configuration avancée

### Désactiver le tracking en production

```typescript
// src/index.ts
const plugins = process.env.NODE_ENV === 'production'
  ? []
  : [sqlTrackingPlugin];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins,
});
```

### Filtrer les queries sensibles

```typescript
// src/plugins/sqlTrackingPlugin.ts
const sanitizedQueries = queries.map((q) => ({
  ...q,
  params: process.env.NODE_ENV === 'production' ? '[REDACTED]' : q.params,
}));
```

### Ajouter des seuils d'alerte

```typescript
// src/plugins/sqlTrackingPlugin.ts
if (totalQueries > 10) {
  console.warn(`⚠️ N+1 problem detected: ${totalQueries} queries`);
}

if (totalDuration > 100) {
  console.warn(`⚠️ Slow query: ${totalDuration}ms total`);
}
```

## 📈 Avantages du Step 4

| Aspect | Avant (Step 3) | Après (Step 4) |
|--------|----------------|----------------|
| **Visibilité** | Aucune | Toutes les queries SQL visibles |
| **Debugging** | Difficile | Facile (voir les queries exactes) |
| **Performance** | Inconnue | Métriques précises (durée, nombre) |
| **Optimisation** | Au hasard | Basée sur les données |
| **Problèmes N+1** | Non détectables | Immédiatement visibles |

## 🎓 Concepts clés

### 1. Plugin Apollo Server

Un plugin permet d'intercepter le cycle de vie d'une requête GraphQL :
- `requestDidStart` : Au début de la requête
- `willSendResponse` : Avant d'envoyer la réponse
- Peut modifier le contexte, la réponse, logger, etc.

### 2. Extensions GraphQL

Les extensions permettent d'ajouter des métadonnées à une réponse :
```json
{
  "data": { ... },
  "errors": [ ... ],
  "extensions": {  // ← Métadonnées custom
    "sql": { ... },
    "tracing": { ... },
    "custom": { ... }
  }
}
```

### 3. Événements Prisma

Prisma émet des événements qu'on peut écouter :
- `query` : Chaque query SQL exécutée
- `info` : Messages d'information
- `warn` : Avertissements
- `error` : Erreurs

### 4. Contexte GraphQL

Le contexte est partagé entre tous les resolvers d'une même requête :
- Créé au début de la requête
- Passé à chaque resolver
- Permet de partager des données (user, sqlQueries, etc.)

## 🐛 Résolution de problèmes

### Les queries SQL ne s'affichent pas

**Vérifier** :
1. Le plugin est bien activé dans `ApolloServer`
2. Le contexte est bien créé avec `createContext()`
3. `setCurrentContext()` est bien appelé
4. Le client Prisma a `{ emit: 'event', level: 'query' }`

### Queries dupliquées entre requêtes

**Cause** : Le contexte n'est pas réinitialisé entre les requêtes

**Solution** : Vérifier que `createContext()` crée un nouveau contexte à chaque fois

### TypeScript errors

**Si erreur sur `$on('query')`** :
```typescript
// Utiliser 'any' pour le type
prisma.$on('query' as any, (e: any) => { ... });
```

## 🚀 Prochaines étapes (Step 5)

- **DataLoader** : Résoudre les problèmes N+1
- **Batching** : Grouper les queries SQL
- **Caching** : Cache en mémoire des résultats
- **Optimisation** : Réduire le nombre de queries

## 💡 Exemples d'utilisation

### Tester le tracking

```bash
# Démarrer le serveur
npm run dev

# Dans GraphQL Playground (http://localhost:4000)
# Exécuter cette query et observer les extensions
```

**Query à tester** :
```graphql
query TestSQLTracking {
  users {
    id
    name
    email
    posts {
      id
      title
      comments {
        id
        text
      }
    }
  }
}
```

**Observer** :
1. Le nombre de queries exécutées (`totalQueries`)
2. La durée totale (`totalDuration`)
3. Les queries SQL exactes
4. Les paramètres utilisés

### Comparer les performances

**Sans relations** :
```graphql
{ users { id name } }
```
→ 1 query

**Avec posts** :
```graphql
{ users { id name posts { id } } }
```
→ N+1 queries (si N users)

**Avec posts et comments** :
```graphql
{ users { id posts { id comments { id } } } }
```
→ N+M queries (encore pire!)

## 📚 Ressources

- [Apollo Server Plugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/)
- [GraphQL Extensions](https://www.apollographql.com/docs/apollo-server/data/errors/#including-custom-error-details)
- [Prisma Logging](https://www.prisma.io/docs/concepts/components/prisma-client/logging)
- [N+1 Query Problem](https://www.apollographql.com/docs/apollo-server/data/fetching-data/#the-dataloader-pattern)

## ✅ Checklist

- [ ] Plugin `sqlTrackingPlugin` créé
- [ ] Contexte `GraphQLContext` avec `sqlQueries[]`
- [ ] Client Prisma modifié avec `$on('query')`
- [ ] Serveur Apollo avec plugin et contexte
- [ ] Test d'une query simple
- [ ] Test d'une query avec relations
- [ ] Vérification des extensions SQL
- [ ] Analyse des problèmes N+1 potentiels
