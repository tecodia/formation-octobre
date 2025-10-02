# 🗺️ Roadmap de la Formation GraphQL

## ✅ Steps Complétés

### Step 0 (main) - Apollo Server basique
- ✅ Serveur GraphQL minimal
- ✅ Un fichier unique (monolithe)
- ✅ Types User et Post basiques
- ✅ Queries simples

### Step 1 - Organisation modulaire
- ✅ Séparation typeDefs/resolvers
- ✅ Structure de dossiers scalable
- ✅ Types TypeScript
- ✅ Mutations basiques

### Step 2 - Relations entre types
- ✅ Field resolvers
- ✅ Navigation dans le graphe
- ✅ Relations User ↔ Post ↔ Comment
- ✅ Mise en évidence du problème N+1

## 🚧 Steps À Venir

### Step 3 - PostgreSQL avec Docker
- Docker Compose pour PostgreSQL
- Prisma ORM
- Migration des données mockées
- Context avec database

### Step 4 - DataLoader
- Installation de dataloader
- Résolution du problème N+1
- Batching des requêtes
- Cache par requête

### Step 5 - Cache HTTP
- Cache-Control headers
- ETags
- Cache Apollo Server
- Response caching

### Step 6 - Plugin Monitoring
- Plugin custom pour logger
- Tracking des calls DB
- Tracking du cache
- Métriques de performance

### Step 7 - Pagination Cursor
- Implémentation Relay-style
- PageInfo et edges
- First/after, last/before
- HasNextPage/hasPreviousPage

### Step 8 - Frontend React
- Create React App
- Apollo Client setup
- InMemoryCache
- ApolloProvider

### Step 9 - Queries & Mutations Frontend
- useQuery hook
- useMutation hook
- Variables
- Loading/Error states

### Step 10 - Persisted Queries
- Extraction des queries
- Hash generation
- APQ configuration
- Whitelist mode

### Step 11 - Subscriptions
- WebSocket server
- Subscription resolver
- useSubscription hook
- Real-time updates

### Step 12 - Optimistic UI
- optimisticResponse
- Cache updates
- Rollback on error
- Instant feedback

### Step 13 - Authentication JWT
- JWT generation
- Context authentication
- Protected resolvers
- @auth directive

### Step 14 - Error Handling
- Custom error classes
- Error formatting
- onError link
- Retry logic

### Step 15 - Federation (Bonus)
- Split en subgraphs
- Gateway setup
- @key et @extends
- Distributed schema

## 🎯 Objectif

Chaque step est conçu pour être :
- **Autonome** : Peut être testé indépendamment
- **Progressif** : Build sur les concepts précédents
- **Pratique** : Code qui fonctionne, pas juste théorique
- **Fallback** : Si bloqué, checkout la branche suivante

## 📝 Pour les formateurs

- Prévoir ~30-45min par step
- Les étudiants peuvent skip des steps s'ils sont à l'aise
- Steps 1-7 : Jour 1 (Backend)
- Steps 8-15 : Jour 2 (Frontend + Avancé)
- Step 15 est optionnel/bonus

## 💡 Tips

```bash
# Voir toutes les branches
git branch -a

# Passer au step suivant
git checkout stepX

# Voir les différences avec le step précédent
git diff stepX-1..stepX

# Revenir au main
git checkout main
```