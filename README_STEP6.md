# Step 6 : Cache Redis et Persisted Queries

## 🎯 Objectifs de ce step

Ce step introduit un système de cache multi-niveaux avec Redis et prépare le support des Persisted Queries pour optimiser les performances.

### Nouveautés du Step 6 :
- ✅ **Cache Redis** pour les DataSources
- ✅ **Cache HTTP** avec headers Cache-Control
- ✅ **Persisted Queries** pour réduire la bande passante
- ✅ **Invalidation intelligente** du cache
- ✅ **Docker Redis** intégré

## 🏗️ Architecture du cache

### Niveaux de cache

```
┌─────────────┐
│   Client    │ ← Cache navigateur (Cache-Control)
└──────┬──────┘
       │
┌──────▼──────┐
│     CDN     │ ← Cache CDN (s-maxage)
└──────┬──────┘
       │
┌──────▼──────┐
│Apollo Server│ ← Persisted Queries (Redis)
└──────┬──────┘
       │
┌──────▼──────┐
│ DataSources │ ← Cache applicatif (Redis)
└──────┬──────┘
       │
┌──────▼──────┐
│  PostgreSQL │
└─────────────┘
```

## 📦 Installation Redis

### Docker Compose

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  command: redis-server --appendonly yes
  volumes:
    - redis_data:/data
```

### Démarrer Redis

```bash
docker-compose up -d redis
```

## 💾 Cache DataSources

### Implementation

```typescript
// src/datasources/UserDataSource.ts
export class UserDataSource {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager('user', 300); // TTL 5 minutes
  }

  async getUserById(id: string) {
    return await this.cache.withCache(
      `user:${id}`,
      async () => {
        return await prisma.user.findUnique({ where: { id } });
      }
    );
  }

  async createUser(name: string, email: string) {
    const user = await prisma.user.create({ data: { name, email } });

    // Invalider le cache
    await this.cache.delete('all-users');

    return user;
  }
}
```

### Stratégies de cache

| Type | TTL | Invalidation |
|------|-----|--------------|
| Liste complète | 1 minute | Sur création/suppression |
| Entité unique | 5 minutes | Sur mise à jour |
| Relations | 5 minutes | Sur modification relation |

## 🌐 Cache HTTP

### Headers Cache-Control

```typescript
// Queries - Cacheable
Cache-Control: public, max-age=60, s-maxage=300

// Mutations - Non cacheable
Cache-Control: no-store
```

### Exemples de réponse

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=60, s-maxage=300
ETag: "1234567890"
Content-Type: application/json

{
  "data": { ... }
}
```

## 📝 Persisted Queries

### Comment ça marche

1. **Premier appel** : Envoi de la query complète avec son hash
2. **Apollo** : Stocke la query dans Redis avec le hash comme clé
3. **Appels suivants** : Envoi uniquement du hash
4. **Économie** : ~90% de réduction de la bande passante

### Exemple

```javascript
// Premier appel
{
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "abc123..."
    }
  },
  "query": "query GetUser { ... }"
}

// Appels suivants (query omise)
{
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "abc123..."
    }
  }
}
```

## 🔍 Vérification du cache

### Redis CLI

```bash
# Se connecter à Redis
docker exec -it graphql-formation-redis redis-cli

# Voir toutes les clés
KEYS *

# Voir le contenu d'une clé
GET "user:user:1"

# Voir le TTL d'une clé
TTL "user:all-users"

# Monitorer en temps réel
MONITOR
```

### GraphQL Response

Vérifiez les headers HTTP :

```bash
curl -I http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name } }"}'
```

## 📊 Métriques de performance

### Sans cache

| Query | Requêtes SQL | Temps |
|-------|--------------|-------|
| Users avec posts | 11 | ~50ms |
| Post avec commentaires | 15 | ~75ms |

### Avec cache Redis

| Query | Requêtes SQL | Temps | Cache Hit Rate |
|-------|--------------|-------|----------------|
| Users avec posts | 11 → 0 | ~5ms | 95% |
| Post avec commentaires | 15 → 0 | ~3ms | 98% |

## 🚀 Démarrage rapide

```bash
# 1. Démarrer Redis
docker-compose up -d redis

# 2. Démarrer le serveur
npm run dev

# 3. Tester une query
curl http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name } }"}'

# 4. Vérifier le cache Redis
docker exec -it graphql-formation-redis redis-cli KEYS "*"
```

## ⚙️ Configuration

### Variables d'environnement

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cache TTL (secondes)
CACHE_DEFAULT_TTL=300
CACHE_USER_TTL=300
CACHE_POST_TTL=300
```

### Invalidation du cache

Le cache est automatiquement invalidé :
- Après une mutation (create, update, delete)
- Après expiration du TTL
- Manuellement via Redis CLI

## 🎯 Best Practices

### ✅ À faire
- Cacher les queries coûteuses
- Utiliser des TTL courts pour les données volatiles
- Invalider le cache après les mutations
- Monitorer le hit rate du cache

### ❌ À éviter
- Cacher les mutations
- TTL trop longs pour données critiques
- Oublier l'invalidation
- Cacher des données sensibles

## 🔄 Différences avec le Step 5

| Aspect | Step 5 | Step 6 |
|--------|--------|--------|
| **Cache requête** | DataLoader only | DataLoader + Redis |
| **Persistance cache** | Non | Oui (Redis) |
| **Cache HTTP** | Non | Oui (headers) |
| **Persisted Queries** | Non | Oui |
| **Performance** | Bonne | Excellente |

## 📚 Ressources

- [Redis Documentation](https://redis.io/docs/)
- [Apollo Cache Control](https://www.apollographql.com/docs/apollo-server/performance/caching/)
- [Persisted Queries](https://www.apollographql.com/docs/apollo-server/performance/apq/)