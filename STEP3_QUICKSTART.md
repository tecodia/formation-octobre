# Step 3 - Guide de démarrage rapide

## Installation et démarrage

### 1. Prérequis
- Docker Desktop installé et lancé
- Node.js installé

### 2. Installation des dépendances
```bash
npm install
```

### 3. Démarrer PostgreSQL
```bash
docker-compose up -d
```

### 4. Configurer la base de données
```bash
# Créer le fichier .env
cp .env.example .env

# Configurer Prisma
npm run db:setup
```

Cette commande va :
- Générer le client Prisma
- Créer les tables dans PostgreSQL
- Initialiser les données de test

### 5. Démarrer le serveur GraphQL
```bash
npm run dev:prisma
```

Le serveur démarre sur http://localhost:4000

## Accès aux interfaces

| Service | URL | Credentials |
|---------|-----|-------------|
| GraphQL Playground | http://localhost:4000 | - |
| Adminer (DB Admin) | http://localhost:8080 | System: PostgreSQL<br>Server: postgres<br>Username: graphql_user<br>Password: graphql_password<br>Database: graphql_formation |
| Prisma Studio | `npm run prisma:studio` | http://localhost:5555 |

## Test rapide

Ouvrez http://localhost:4000 et testez cette query :

```graphql
query GetUsersWithPosts {
  users {
    id
    name
    email
    posts {
      id
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

## Commandes utiles

### Base de données
```bash
# Réinitialiser la base
npx prisma migrate reset

# Ouvrir Prisma Studio (GUI)
npm run prisma:studio

# Voir les données dans Adminer
# Ouvrir http://localhost:8080
```

### Docker
```bash
# Voir les logs
docker-compose logs -f

# Arrêter les conteneurs
docker-compose down

# Supprimer les données (⚠️)
docker-compose down -v
```

## Structure des fichiers créés

```
├── docker-compose.yml          # Configuration Docker
├── .env.example               # Template des variables d'environnement
├── prisma/
│   ├── schema.prisma         # Schéma de la base de données
│   ├── seed.ts               # Données initiales
│   └── migrations/           # Historique des migrations
├── src/
│   ├── lib/
│   │   └── prisma.ts        # Client Prisma
│   ├── index.prisma.ts      # Serveur avec Prisma
│   └── resolvers/
│       ├── *.prisma.ts      # Resolvers avec Prisma
```

## Données de test créées

Le seed initialise :
- **3 utilisateurs** : Alice, Bob, Charlie
- **4 posts** avec du contenu sur GraphQL et Prisma
- **7 commentaires** sur les différents posts

## Prochaines étapes

Consultez `README_STEP3.md` pour :
- Documentation complète de l'API
- Exemples de queries et mutations
- Détails techniques sur Prisma
- Résolution de problèmes

## Problèmes courants

### Docker n'est pas lancé
```bash
# Lancer Docker Desktop puis :
docker-compose up -d
```

### Erreur de connexion PostgreSQL
```bash
# Attendre que PostgreSQL soit prêt
docker-compose logs postgres

# Vérifier le statut
docker-compose ps
```

### Client Prisma non généré
```bash
npm run prisma:generate
```
