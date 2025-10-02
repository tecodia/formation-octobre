---
marp: true
theme: default
paginate: true
backgroundColor: #fff
color: #333
style: |
  section {
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 28px;
    padding: 40px;
  }
  h1 {
    color: #E10098;
    border-bottom: 2px solid #E10098;
    padding-bottom: 8px;
    font-size: 42px;
    margin-top: 0;
  }
  h2 {
    color: #666;
    font-size: 28px;
    margin: 10px 0;
  }
  h3 {
    font-size: 24px;
    margin: 8px 0;
  }
  code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
  }
  pre {
    background-color: #282c34;
    color: #abb2bf;
    border-radius: 6px;
    padding: 0.8em;
    font-size: 0.75em;
    line-height: 1.3;
    max-height: 450px;
    overflow-y: auto;
  }
  table {
    margin: 0 auto;
    font-size: 0.85em;
  }
  ul, ol {
    line-height: 1.4;
    margin: 10px 0;
  }
  li {
    margin: 4px 0;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }
  .columns h3 {
    margin-top: 0;
    font-size: 22px;
  }
  .columns pre {
    font-size: 0.7em;
    padding: 0.5em;
  }
  .columns ul {
    margin-top: 8px;
  }
  p {
    margin: 8px 0;
    line-height: 1.4;
  }
---

# FORMATION GRAPHQL + TYPESCRIPT
## Maîtriser Apollo Server & Apollo Client

**Durée :** 2 jours
**Formateur :** Jonathan Jalouzot

---

# JOUR 1 - FONDAMENTAUX & SERVER-SIDE

## Matin (9h-12h30)
- Introduction à GraphQL
- Setup Apollo Server
- Schema et Types
- Resolvers et Context

## Après-midi (14h-17h30)
- DataLoader et N+1 Problem
- Pagination
- Système de Plugins
- Subscriptions

---

# GRAPHQL : UN LANGAGE DE REQUÊTE POUR VOTRE API

Créé par Facebook en 2012, open-source en 2015

## 🎯 Objectifs :
- Demander exactement ce dont vous avez besoin
- Obtenir plusieurs ressources en une seule requête
- Décrire ce qui est possible avec un système de types

---

# GraphQL vs REST

<div class="columns">
<div>

### REST
```
GET /users/1
GET /users/1/posts
GET /posts/1/comments
```
- ❌ Plusieurs endpoints
- ❌ Over/Under-fetching
- ❌ Versioning (v1, v2)

</div>
<div>

### GraphQL
```graphql
query {
  user(id: "1") {
    name
    posts {
      title
      comments { text }
    }
  }
}
```
- ✅ Un seul endpoint
- ✅ Données exactes
- ✅ Pas de versioning

</div>
</div>

---

# LES 3 OPÉRATIONS GRAPHQL

<div class="columns">
<div>

### Query & Mutation
**Query - Lecture (GET)**
```graphql
query {
  users {
    name
  }
}
```

**Mutation - Écriture (POST/PUT)**
```graphql
mutation {
  createUser(name: "...") {
    id
  }
}
```

</div>
<div>

### Subscription
**Temps réel (WebSocket)**
```graphql
subscription {
  userCreated {
    name
    id
    email
  }
}
```

**Use cases :**
- Notifications en temps réel
- Chat / Messagerie
- Updates live de données
- Collaboration

</div>
</div>

---

# LE SCHÉMA : CONTRAT ENTRE CLIENT ET SERVEUR

```graphql
type User {
  id: ID!              # ! = obligatoire
  name: String!
  email: String!
  posts: [Post!]!      # [] = tableau
}

type Query {
  user(id: ID!): User
  users: [User!]!
}
```

✅ **Fortement typé**
✅ **Auto-documenté**
✅ **Validation automatique**

---

# TYPES DE BASE EN GRAPHQL

| Type | Description | Exemple |
|------|-------------|---------|
| **String** | Chaîne de caractères | `"Hello"` |
| **Int** | Nombre entier 32-bit | `42` |
| **Float** | Nombre décimal | `3.14` |
| **Boolean** | Vrai/Faux | `true` |
| **ID** | Identifiant unique | `"abc123"` |

### Custom Scalars:
- Date, DateTime, JSON, Email, URL

---

# TYPES AVANCÉS

<div class="columns">
<div>

### Object & Interface
```graphql
type User {
  id: ID!
  name: String!
}

interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}
```

</div>
<div>

### Enum, Union & Input
```graphql
enum Role {
  ADMIN
  USER
  GUEST
}

union SearchResult =
  User | Post | Comment

input CreateUserInput {
  name: String!
  email: String!
}
```

</div>
</div>

---

# RESOLVERS : LA LOGIQUE MÉTIER

```typescript
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      //      ↓       ↓       ↓        ↓
      //   Résultat Args  Context   Metadata
      //   du parent
    }
  }
}
```

- **parent** → Résultat du resolver parent
- **args** → Arguments de la requête
- **context** → Données partagées (DB, user, etc.)
- **info** → Informations sur la requête

---

# LE PROBLÈME N+1 : L'ENNEMI DE LA PERFORMANCE

<div class="columns">
<div>

### Sans DataLoader
```
Query: posts
  ↓
SELECT * FROM posts (1)
  ↓
post 1 → SELECT author (1)
post 2 → SELECT author (1)
post 3 → SELECT author (1)

Total: 4 queries ❌
```

</div>
<div>

### Avec DataLoader
```
Query: posts
  ↓
SELECT * FROM posts (1)
  ↓
Batch: SELECT * FROM users
WHERE id IN (1, 2, 3) (1)

Total: 2 queries ✅
```

</div>
</div>

**DataLoader = Batching + Caching**

---

# DEUX TYPES DE PAGINATION

<div class="columns">
<div>

### Offset-based
```graphql
posts(
  limit: 10,
  offset: 20
)
```
- ✅ Simple
- ❌ Données dupliquées
- ❌ Problème avec ajouts

</div>
<div>

### Cursor-based (Relay)
```graphql
posts(
  first: 10,
  after: "cursor123"
) {
  edges {
    node { ... }
    cursor
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
```
- ✅ Stable
- ✅ Recommandé

</div>
</div>

---

# PLUGINS APOLLO SERVER : ÉTENDRE LES FONCTIONNALITÉS

<div class="columns">
<div>

### Lifecycle Hooks
- **requestDidStart** → Début requête
- **willSendResponse** → Avant réponse
- **didEncounterErrors** → Gestion erreurs
- **willResolveField** → Avant resolver

### Plugins utiles
- Logging personnalisé
- Limite de complexité
- Cache HTTP
- Métriques & monitoring

</div>
<div>

### Configuration
```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    loggingPlugin,
    complexityPlugin,
    cachePlugin,
    monitoringPlugin,
  ]
});
```

</div>
</div>

---

# SUBSCRIPTIONS : DONNÉES EN TEMPS RÉEL

```graphql
subscription {
  messageAdded(roomId: "1") {
    id
    text
    user { name }
  }
}
```

### WebSocket Flow
1. Client ouvre WebSocket
2. Serveur push les données
3. Client reçoit updates

### Use Cases
• Chat • Notifications • Live feeds • Collaboration • Gaming

---

# 🎯 EXERCICE JOUR 1 : BLOG API

## Fonctionnalités à implémenter :
✅ CRUD Users (Query + Mutation)
✅ CRUD Posts avec auteur
✅ CRUD Comments
✅ Pagination sur Posts
✅ DataLoader pour optimiser
✅ Authentication JWT
✅ Subscription pour nouveaux posts

**Temps : 1h**

---

# JOUR 2 - ARCHITECTURE DISTRIBUÉE & CLIENT

## Matin (9h-12h30)
- Autres serveurs GraphQL
- Schema Stitching
- Apollo Federation
- Monitoring & Observabilité

## Après-midi (14h-17h30)
- Persisted Queries
- Cache (Server & Client)
- Apollo Client
- Subscriptions Client
- Projet Final

---

# CHOIX DU SERVEUR GRAPHQL

### Serveurs populaires

**Apollo Server** : ✅ Mature, Écosystème, Federation | ❌ Plus lourd

**GraphQL Yoga** : ✅ Moderne, Simple, SSE natif

**Mercurius** : ✅ Ultra rapide, Fastify | ❌ Moins features

**Pothos** : ✅ Code-first, Type-safe

**Hasura** : ✅ Auto-generated | ❌ Moins de contrôle

⚠️ **Express-GraphQL** : Déprécié, à éviter

---

# SCHEMA STITCHING : COMPOSER DES SCHÉMAS

<div class="columns">
<div>

### Services séparés
**Users Service**
```graphql
type User {
  id: ID!
  name: String!
}
```

**Posts Service**
```graphql
type Post {
  id: ID!
  title: String!
  authorId: ID!
}
```

</div>
<div>

### Gateway unifié
```graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]! # Ajouté
}

type Post {
  id: ID!
  title: String!
  author: User! # Ajouté
}
```

✅ **Flexible**
❌ **Config manuelle**
❌ **Pas de standard**

</div>
</div>

---

# APOLLO FEDERATION : L'APPROCHE MODERNE

<div class="columns">
<div>

### Subgraphs avec @key
**Users Subgraph**
```graphql
type User @key(fields: "id") {
  id: ID!
  name: String!
}

extend type Post {
  author: User
}
```

**Posts Subgraph**
```graphql
type Post @key(fields: "id") {
  id: ID!
  title: String!
  authorId: ID!
}

extend type User {
  posts: [Post!]!
}
```

</div>
<div>

### Gateway unifié
```graphql
type User {
  id: ID!
  name: String!
  posts: [Post!]! # Extension
}

type Post {
  id: ID!
  title: String!
  authorId: ID!
  author: User! # Extension
}
```

**Apollo Router (Rust) ⚡**

✅ **Standard industriel**
✅ **Séparation des responsabilités**
✅ **Performance optimale**

</div>
</div>

---

# QUAND UTILISER QUOI ?

<div class="columns">
<div>

### Schema Stitching
**✅ Cas d'usage :**
- Migration depuis REST
- Schémas tiers non-modifiables
- Besoin de flexibilité max
- Petit nombre de services

**⚙️ Architecture :**
- Logique au Gateway
- Plus de contrôle
- Plus complexe

</div>
<div>

### Apollo Federation
**✅ Cas d'usage :**
- Nouveau projet microservices
- Équipes indépendantes
- Standard industriel
- Scaling important

**⚙️ Architecture :**
- Logique dans les subgraphs
- Séparation des responsabilités
- Plus simple à maintenir

</div>
</div>

**💡 Recommandation : Federation par défaut, Stitching si besoin spécifique**

---

# SURVEILLER VOS APIS GRAPHQL

### Outils de monitoring
- **Apollo Studio** : Query analytics, Performance, Error tracking
- **OpenTelemetry** : Distributed tracing, Spans, Context
- **Prometheus** : Métriques, Alerting, Grafana

### Métriques clés :
⏱️ Query duration
📊 Operation count
❌ Error rate
🔥 Resolver hotspots
📈 Cache hit ratio

---

# PERSISTED QUERIES : SÉCURITÉ & PERFORMANCE

<div class="columns">
<div>

### ❌ Problèmes
- **Grosse query string** → Bande passante
- **Exposition du schéma** → Sécurité
- **Coût parsing** → Performance

### APQ (Automatic)
```
1. Client: hash
2. Server: "not found"
3. Client: full query
4. Server: cache
```

</div>
<div>

### ✅ Solutions
- **Hash (SHA-256)** → Query compacte
- **Whitelist** → Sécurité maximale
- **Cache** → Performance optimale

### Persisted (Production)
```
1. Build: extract queries
2. Deploy: whitelist
3. Client: hash only
4. Server: lookup
```

</div>
</div>

**Résultat :** `GET /graphql?hash=abc123` → 🚀 Performance + 🔒 Sécurité

---

# STRATÉGIES DE CACHE SERVEUR

<div class="columns">
<div>

### Cache GraphQL
**Response Cache**
```graphql
type User @cacheControl(
  maxAge: 300
) {
  id: ID!
  name: String!
}
```

**Field-level Cache**
```graphql
@cacheControl(
  maxAge: 60,
  scope: PRIVATE
)
```

</div>
<div>

### Cache Infrastructure
**CDN Caching**
- Cache-Control headers
- ETag validation
- Edge locations

**Cache distribué**
- Redis / Memcached
- Cluster partagé
- TTL personnalisé

**DataLoader**
- Request cache
- 1 requête = 1 cache
- Batching automatique

</div>
</div>

---

# APOLLO CLIENT : STATE MANAGEMENT GRAPHQL

### Architecture
```
Query Component
      ↓
Apollo Client
      ↓
Link Chain → Auth → Retry → HTTP
      ↓
InMemory Cache ← Normalisé par ID
      ↓
UI Updates (React)
```

### Features
✅ Cache intelligent
✅ Optimistic UI
✅ Pagination
✅ Subscriptions
✅ DevTools

---

# CACHE CLIENT : NORMALISATION

<div class="columns">
<div>

### ❌ Sans normalisation
```json
{
  posts: [{
    author: {
      id: "1",
      name: "Alice"
    }
  }],
  users: [{
    id: "1",
    name: "Alice"
  }]
}
```

**Problèmes :**
- Duplication des données
- Synchronisation manuelle
- Incohérences possibles
- Mémoire gaspillée

</div>
<div>

### ✅ Avec normalisation
```javascript
User:1 → {
  id: "1",
  name: "Alice"
}

Post:1 → {
  id: "1",
  author: {
    __ref: "User:1"
  }
}
```

**Avantages :**
- Pas de duplication
- Cohérence automatique
- Updates efficaces
- Cache optimisé

</div>
</div>

---

# FETCH POLICIES

| Policy | Comportement | Usage |
|--------|-------------|--------|
| **cache-first** | Cache → Network si vide | Données stables |
| **cache-and-network** | Cache + Network en parallèle | UX optimale |
| **network-only** | Network uniquement | Données critiques |
| **no-cache** | Network, pas de cache | Données sensibles |
| **cache-only** | Cache uniquement | Offline mode |

---

# OPTIMISTIC UI : UX INSTANTANÉE

<div class="columns">
<div>

### ❌ Sans Optimistic
```
1. User clicks
2. Loading spinner 🔄
3. Wait server ⏳
4. Update UI
```

**Problèmes :**
- UX lente
- Feeling de lag
- Frustration utilisateur
- Perte d'engagement

</div>
<div>

### ✅ Avec Optimistic
```
1. User clicks
2. Update UI instantly ⚡
3. Send to server
4. Confirm or rollback
```

**Code :**
```typescript
useMutation(CREATE_POST, {
  optimisticResponse: {
    createPost: { id: 'temp-123' }
  }
})
```

**Avantages :**
- ✨ Feeling instantané
- 🚀 UX fluide
- ↩️ Rollback si erreur

</div>
</div>

---

# GESTION DES ERREURS : BONNES PRATIQUES

<div class="columns">
<div>

### Server-Side
**Flow de gestion :**
```
GraphQLError
    ↓
Custom Error Classes
    ↓
Error Codes
    ↓
Formatting
```

**Codes standards :**
- `UNAUTHENTICATED` (401)
- `FORBIDDEN` (403)
- `BAD_USER_INPUT` (400)
- `INTERNAL_SERVER_ERROR` (500)

</div>
<div>

### Client-Side
**Flow de gestion :**
```
onError Link
    ↓
Error handling global
    ↓
UI Feedback
    ↓
Retry logic
```

**Implémentation :**
```typescript
const errorLink = onError(
  ({ graphQLErrors }) => {
    // Handle errors
  }
);
```

</div>
</div>

---

# STRATÉGIE DE TEST GRAPHQL

| Type | Cible | Outils |
|------|-------|---------|
| **Unit Tests** | Resolvers isolés, Mock context | Vitest/Jest |
| **Integration Tests** | Queries end-to-end, Real schema | @apollo/server/testing |
| **E2E Tests** | GraphQL + DB + UI | Playwright/Cypress |
| **Client Tests** | Components, Hooks | MockedProvider, RTL |

---

# GRAPHQL CODE GENERATOR : TYPE SAFETY

<div class="columns">
<div>

### Schema GraphQL
```graphql
type User {
  id: ID!
  name: String!
}

query GetUsers {
  users {
    id
    name
  }
}
```

**Config :** `codegen.ts`

</div>
<div>

### Types TypeScript générés
```typescript
interface User {
  id: string;
  name: string;
}

function useGetUsersQuery(): {
  data: { users: User[] }
}
```

**Avantages :**
- ✅ 100% Type-safe
- ✅ Auto-complete
- ✅ Refactoring safe
- ✅ Erreurs à la compilation

</div>
</div>

---

# AUTHORIZATION : DIRECTIVES & MIDDLEWARE

```graphql
type Query {
  posts: [Post!]!
  adminPanel: Admin! @auth(requires: ADMIN)
}
```

### Approches :
1. **Directives** (déclaratif) : `@auth`, `@rateLimit`, `@cost`
2. **Resolver middleware**
3. **Context + guards**
4. **Field-level permissions**

### Permission Systems:
- Rule-based
- Role-based (RBAC)
- Attribute-based (ABAC)

---

# SÉCURISER VOS APIS GRAPHQL

<div class="columns">
<div>

### ✅ Protections à implémenter
**Limites**
- Query Depth/Complexity
- Rate Limiting
- Timeout

**Auth**
- Authentication
- Authorization
- CSRF/HTTPS

**🔒 Production**
- Disable Introspection
- Persisted Queries
- Input Validation

</div>
<div>

### ❌ Vulnérabilités courantes
**Attaques possibles**
- **Recursive queries** → DoS
- **Introspection publique** → Schema exposure
- **Pas de rate limit** → Abuse
- **Over-permissive resolvers** → Data leak

**Exemple de protection :**
```typescript
depthLimit(5),
costAnalysis({
  maximumCost: 1000
})
```

</div>
</div>

---

# OPTIMISATION DES PERFORMANCES

<div class="columns">
<div>

### 🚀 Server
**Cache**
- DataLoader
- Response/Field caching

**Database**
- Indexes
- Connection pooling

**Monitoring**
- Query complexity
- Resolver timing

</div>
<div>

### ⚡ Client
**Cache**
- Cache policies
- Query batching
- Persisted queries

**Loading**
- Code splitting
- Pagination

**Monitoring**
- N+1 detection
- Cache hit ratio

</div>
</div>

---

# PATTERNS AVANCÉS

**Polling** → `pollInterval: 5000` (Auto-refresh)

**Lazy Queries** → `useLazyQuery()` (Trigger manuel)

**Prefetching** → `onMouseEnter` (Anticiper navigation)

**Partial Data** → `returnPartialData` (Affichage progressif)

**Infinite Scroll** → `fetchMore + cursor` (Pagination continue)

**Defer & Stream** → `@defer` / `@stream` (Loading progressif)

---

# UPLOAD DE FICHIERS

<div class="columns">
<div>

### GraphQL Upload
**Schema**
```graphql
scalar Upload

mutation {
  uploadFile(file: Upload!) {
    url
    filename
  }
}
```

**Avantages**
- ✅ Support natif
- ✅ Multiple files
- ⚠️ Taille limite

</div>
<div>

### Processing & Storage
**Flow**
```
createReadStream()
    ↓
S3 / Local / CDN
    ↓
URL retournée
```

**Alternative**
- Pre-signed URLs (S3)
- Direct upload
- Meilleure performance
- Pas de limite serveur

</div>
</div>

---

# ÉVOLUTION DU SCHÉMA SANS BREAKING CHANGES

<div class="columns">
<div>

### ❌ Breaking Changes
**À éviter**
- Supprimer field
- Renommer field
- Changer type
- Rendre non-nullable

**Impact**
- Clients cassés
- Downtime
- Migration forcée

</div>
<div>

### ✅ Safe Evolution
**Stratégie**
```graphql
# 1. Déprécier
@deprecated(
  reason: "Use newField"
)

# 2. Ajouter
newField: String

# 3. Migrer clients
# 4. Supprimer
```

**Avantages**
- Rétrocompatibilité
- Migration progressive
- **No versioning needed!**

</div>
</div>

---

# 🎯 PROJET FINAL : BLOG SIMPLE

<div class="columns">
<div>

### Backend (1h)
**Schema de base**
- User (id, name, email)
- Post (id, title, content)
- Comment (id, text)

**Features**
- CRUD operations
- Authentication JWT
- DataLoader
- Une subscription

</div>
<div>

### Frontend (1h)
**Pages simples**
- Liste des posts
- Détail d'un post
- Créer un post
- Login

**À implémenter**
- Apollo Client
- Cache
- Optimistic UI
- Error handling

</div>
</div>

**💡 Objectif : Application fonctionnelle, pas parfaite**

---

# RESSOURCES POUR CONTINUER

<div class="columns">
<div>

### 📚 Documentation
- **graphql.org** - Spec officielle
- **apollographql.com/docs** - Apollo
- **relay.dev** - Relay Modern
- **graphql-code-generator.com** - Codegen

### 🛠️ Outils
- **Apollo Studio** - Monitoring
- **GraphiQL** - Playground
- **Altair** - Client GraphQL
- **Postman** - API Testing

</div>
<div>

### 🌐 Communauté
- **Twitter** - @GraphQL
- **Discord** - GraphQL Community
- **Summit** - GraphQL Summit
- **Tutorial** - How To GraphQL

### 🚀 Next Steps
1. Pratiquer sur projets perso
2. Contribuer open source
3. Partager vos learnings
4. Rejoindre la communauté

</div>
</div>

---

# QUESTIONS / RÉPONSES

🔗 GitHub : github.com/captainjojo

## Merci d'avoir participé! 🎉

### Feedback :
👍 Ce qui a bien fonctionné
💡 Suggestions d'amélioration
🤔 Sujets à approfondir

---

# GRAPHQL SCHEMA CHEAT SHEET

```graphql
Scalar      String, Int, Float, Boolean, ID
Object      type User { id: ID! name: String! }
Input       input CreateUser { name: String! }
Enum        enum Role { ADMIN USER }
Interface   interface Node { id: ID! }
Union       union Result = User | Post
List        [String!]!
Non-null    String!
Arguments   user(id: ID!): User
Directive   @deprecated(reason: "...")
Default     field: String = "default"
```

---

# APOLLO CLIENT HOOKS

**useQuery** → Fetch data
**useLazyQuery** → Fetch on demand
**useMutation** → Modify data
**useSubscription** → Real-time data
**useFragment** → Fragment data
**useApolloClient** → Client instance

**Options courantes :**
`variables`, `fetchPolicy`, `pollInterval`, `onCompleted`, `onError`, `skip`