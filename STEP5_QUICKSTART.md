# Step 5 - Quick Start - DataLoader

## 🚀 Démarrage rapide

### 1. Installation
```bash
npm install
```

### 2. Démarrer PostgreSQL
```bash
docker-compose up -d
```

### 3. Démarrer le serveur
```bash
npm run dev
```

## 🧪 Test de l'optimisation

### Query de test (problème N+1)

Ouvrez http://localhost:4000 et exécutez :

```graphql
query TestDataLoader {
  posts {
    id
    title
    author {
      id
      name
      email
    }
    comments {
      id
      text
      author {
        id
        name
      }
    }
  }
}
```

### Vérifiez les requêtes SQL

Dans la réponse, regardez `extensions.sql` :

**Sans DataLoader (Step 4)** : ~20+ requêtes
```json
{
  "extensions": {
    "sql": {
      "totalQueries": 25,
      "totalDuration": 45.2
    }
  }
}
```

**Avec DataLoader (Step 5)** : ~3-4 requêtes
```json
{
  "extensions": {
    "sql": {
      "totalQueries": 3,
      "totalDuration": 5.4
    }
  }
}
```

## 📊 Exemples de queries optimisées

### Posts avec auteurs
```graphql
query PostsWithAuthors {
  posts {
    title
    author { name }  # 1 seule requête pour tous les auteurs
  }
}
```

### Users avec leurs posts et commentaires
```graphql
query UsersWithContent {
  users {
    name
    posts {          # 1 requête batchée
      title
      comments {     # 1 requête batchée
        text
      }
    }
  }
}
```

## 🎯 Points clés

- **DataLoader** batch automatiquement les requêtes similaires
- **Cache par requête** : évite les requêtes dupliquées
- **Transparent** : pas de changement dans les queries GraphQL
- **Performance** : réduction de 80-90% des requêtes SQL

## 🔍 Comment vérifier que ça marche

1. Exécutez une query complexe
2. Regardez `extensions.sql.queries`
3. Vous devriez voir des requêtes avec `WHERE id IN (...)`
4. Le nombre total de requêtes devrait être très bas

## 📚 Ressources

- README_STEP5.md pour les détails techniques
- src/loaders/ pour voir l'implémentation