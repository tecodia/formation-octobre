# Step 6 - Quick Start - Cache Redis

## 🚀 Démarrage rapide

### 1. Démarrer Redis et PostgreSQL
```bash
docker-compose up -d
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer le serveur
```bash
npm run dev
```

## 🧪 Tester le cache

### 1. Première requête (mise en cache)

```graphql
query GetUsers {
  users {
    id
    name
    email
  }
}
```

Regardez `extensions.sql.totalQueries` : Des requêtes SQL sont exécutées

### 2. Deuxième requête (depuis le cache)

Exécutez la même query à nouveau.

Regardez `extensions.sql.totalQueries` : 0 ou très peu de requêtes SQL !

## 🔍 Vérifier Redis

```bash
# Voir les clés dans Redis
docker exec -it graphql-formation-redis redis-cli KEYS "*"

# Voir le contenu d'une clé
docker exec -it graphql-formation-redis redis-cli GET "user:all-users"

# Monitorer en temps réel
docker exec -it graphql-formation-redis redis-cli MONITOR
```

## 📊 Headers HTTP

Vérifiez les headers de cache :

```bash
curl -I http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name } }"}'
```

Vous devriez voir :
```
Cache-Control: public, max-age=60, s-maxage=300
ETag: "..."
```

## 🎯 Points clés

- **Cache Redis** : Stockage persistant entre requêtes
- **TTL** : 5 minutes par défaut
- **Invalidation** : Automatique après mutations
- **Performance** : 95%+ de cache hit rate

## 📚 Ressources

- README_STEP6.md pour les détails
- docker exec -it graphql-formation-redis redis-cli pour explorer Redis