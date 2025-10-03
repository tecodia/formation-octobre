# 📚 Step 10: Pagination Cursor-based (style Relay)

## Objectifs de cette étape

Implémenter une pagination performante et scalable avec la méthode cursor-based, standard de l'industrie pour les APIs GraphQL modernes.

## 🎯 Ce qui a été implémenté

### Backend - Pagination Cursor-based

1. **Nouveaux Types GraphQL**
   - `PageInfo` : Métadonnées de pagination
   - `FeedEdge` : Container pour chaque nœud avec son cursor
   - `FeedConnection` : Structure complète de pagination

2. **DataSource pour la logique métier**
   - `FeedDataSource` : Encapsule toute la logique de pagination
   - Gestion des cursors (encodage/décodage base64)
   - Support bidirectionnel (forward/backward)

3. **Query GraphQL**
   ```graphql
   feedPaginated(
     first: Int,
     after: String,
     last: Int,
     before: String
   ): FeedConnection!
   ```

### Frontend - Composant React avec "Voir plus"

1. **Composant FeedPaginated**
   - Affiche 2 posts par page
   - Bouton "Voir plus" pour charger les suivants
   - Accumulation des résultats (pas de remplacement)
   - Indicateur de fin de liste

2. **Apollo Client**
   - Utilisation de `fetchMore` pour la pagination
   - Mise à jour du cache avec les nouveaux résultats
   - Gestion de l'état de chargement

## 📁 Structure des fichiers ajoutés

```
backend/
├── src/
│   ├── datasources/
│   │   └── FeedDataSource.ts       # Nouvelle DataSource pour la pagination
│   ├── resolvers/
│   │   └── Query/
│   │       └── feedPaginated.ts    # Resolver simplifié
│   └── schema/
│       └── types/
│           ├── PageInfo.ts         # Type pour les infos de pagination
│           └── FeedConnection.ts   # Types pour la structure de pagination

frontend/
└── src/
    └── components/
        └── FeedPaginated.tsx       # Composant avec pagination
```

## 🚀 Comment tester

### 1. Tester la query backend

```bash
# Récupérer les 2 premiers posts
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { feedPaginated(first: 2) { edges { cursor node { id author { name } content { __typename ... on ArticlePost { title content } } } } pageInfo { hasNextPage endCursor } totalCount } }"
  }'

# Récupérer les 2 suivants avec le cursor
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { feedPaginated(first: 2, after: \"CURSOR_FROM_PREVIOUS_QUERY\") { edges { cursor node { id author { name } content { __typename } } } pageInfo { hasNextPage endCursor } } }"
  }'
```

### 2. Tester le frontend

1. Ouvrir http://localhost:3000
2. Par défaut, le feed paginé est affiché
3. Cliquer sur "Voir plus" pour charger 2 posts supplémentaires
4. Le bouton disparaît quand tous les posts sont chargés
5. Toggle avec "Voir Feed Complet" pour comparer

## 💡 Points clés d'apprentissage

### Avantages de la pagination cursor-based

1. **Performance** : Pas de problème avec OFFSET sur de grandes datasets
2. **Stabilité** : Résultats cohérents même si des données sont ajoutées
3. **Scalabilité** : Fonctionne bien avec des millions d'enregistrements
4. **Standard** : Compatible avec Relay et autres clients GraphQL

### Architecture DataSource

```typescript
// Séparation des responsabilités
Resolver → DataSource → Prisma

// Le resolver est simple
export async function feedPaginated(args, context) {
  const feedDataSource = new FeedDataSource();
  return feedDataSource.getFeedPaginated(args);
}

// La logique métier est dans la DataSource
class FeedDataSource {
  async getFeedPaginated(args) {
    // Validation, cursors, requêtes, transformation
  }
}
```

### Pattern Frontend avec Apollo

```typescript
const { data, fetchMore } = useQuery(QUERY);

const handleLoadMore = () => {
  fetchMore({
    variables: { after: data.pageInfo.endCursor },
    updateQuery: (prev, { fetchMoreResult }) => {
      // Fusionner les résultats
    }
  });
};
```

## 🔧 Configuration importante

### Cursor encoding

Les cursors sont encodés en base64 pour :
- Cacher l'implémentation interne
- Éviter les manipulations client
- Permettre de changer la stratégie sans casser l'API

```typescript
// Encodage
Buffer.from(id).toString('base64');

// Décodage
Buffer.from(cursor, 'base64').toString('utf-8');
```

### Ordering

La pagination fonctionne avec un ordre par `createdAt DESC` pour :
- Afficher les posts les plus récents en premier
- Avoir un ordre stable pour la pagination
- Permettre la pagination bidirectionnelle

## ✅ Checklist de validation

- [ ] La query `feedPaginated` fonctionne avec `first` et `after`
- [ ] Le `pageInfo.hasNextPage` est correct
- [ ] Les cursors sont encodés en base64
- [ ] Le frontend affiche 2 posts initialement
- [ ] Le bouton "Voir plus" charge les posts suivants
- [ ] Les posts s'accumulent (pas de remplacement)
- [ ] Le message "Vous avez tout vu" apparaît à la fin
- [ ] Le toggle entre feed paginé et complet fonctionne

## 🎓 Pour aller plus loin

1. **Pagination bidirectionnelle** : Implémenter `last` et `before`
2. **Cursors composites** : Utiliser plusieurs champs pour le tri
3. **Pagination temps réel** : Gérer l'ajout de nouveaux posts
4. **Infinite scroll** : Remplacer le bouton par un scroll automatique
5. **Cache optimisé** : Utiliser les field policies d'Apollo Client

## 📚 Ressources

- [Relay Cursor Connections Specification](https://relay.dev/graphql/connections.htm)
- [Apollo Client Pagination](https://www.apollographql.com/docs/react/pagination/cursor-based/)
- [GraphQL Pagination Best Practices](https://graphql.org/learn/pagination/)