# Step 9: Vérification de l'installation

## Checklist de vérification

### 1. Structure des fichiers

Vérifiez que la structure suivante existe :

```
graphql-formation/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Feed.tsx
│   │   ├── apollo-client.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── node_modules/
├── package.json
├── node_modules/
├── README.md
├── README_STEP9.md
└── STEP9_QUICKSTART.md
```

### 2. Vérification des dépendances

#### Root
```bash
cd /Users/captainjojo/Sites/formation-octobre/graphql-formation
cat package.json
# Doit contenir: concurrently
```

#### Backend
```bash
cd backend
cat package.json
# Doit contenir: @apollo/server, prisma, graphql, etc.
```

#### Frontend
```bash
cd frontend
cat package.json
# Doit contenir: @apollo/client, react, graphql, vite
```

### 3. Tests d'installation

```bash
# Test 1: Installation root
npm install
# Doit installer concurrently

# Test 2: Installation backend
cd backend && npm install
# Doit installer toutes les dépendances backend

# Test 3: Installation frontend
cd frontend && npm install
# Doit installer toutes les dépendances frontend

# Ou tout en une commande depuis le root:
npm run install:all
```

### 4. Test de la base de données

```bash
# Depuis le root
npm run db:setup

# Vérifications:
# 1. Docker doit être lancé
# 2. PostgreSQL doit tourner sur le port 5432
# 3. Prisma doit générer le client
# 4. Les migrations doivent s'exécuter
# 5. Le seed doit insérer des données
```

### 5. Test du backend

```bash
# Lancer le backend
npm run dev:backend

# Vérifications:
# - Le serveur doit démarrer sur http://localhost:4000
# - Ouvrir http://localhost:4000/graphql dans le navigateur
# - Apollo Studio doit s'afficher
# - Exécuter cette query:

query GetFeed {
  feed {
    id
    description
    url
    postedBy {
      id
      name
    }
  }
}

# Doit retourner des posts
```

### 6. Test du frontend

```bash
# Lancer le frontend (dans un autre terminal)
npm run dev:frontend

# Vérifications:
# - Le serveur Vite doit démarrer sur http://localhost:3000
# - Ouvrir http://localhost:3000 dans le navigateur
# - La page doit afficher "GraphQL Formation - Step 9"
# - Le feed doit s'afficher avec les posts
```

### 7. Test full-stack

```bash
# Lancer backend + frontend simultanément
npm run dev

# Vérifications:
# - Les deux serveurs doivent démarrer
# - Backend: http://localhost:4000/graphql
# - Frontend: http://localhost:3000
# - Le frontend doit récupérer les données du backend
# - Les posts doivent s'afficher dans l'interface
```

## Résolution des problèmes courants

### Problème 1: Port déjà utilisé

```bash
# Vérifier quel processus utilise le port 4000
lsof -i :4000

# Tuer le processus
kill -9 <PID>

# Ou pour le port 3000
lsof -i :3000
kill -9 <PID>
```

### Problème 2: Docker n'est pas lancé

```bash
# Vérifier Docker
docker ps

# Si erreur, lancer Docker Desktop
```

### Problème 3: Base de données ne se connecte pas

```bash
# Vérifier les variables d'environnement
cd backend
cat .env

# Doit contenir:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/graphql_formation"

# Vérifier que PostgreSQL tourne
docker ps | grep postgres
```

### Problème 4: Erreur CORS

Si vous voyez des erreurs CORS dans la console du navigateur:

1. Vérifiez que le backend tourne sur le port 4000
2. Vérifiez la configuration dans `backend/src/index.ts`
3. Le CORS doit être configuré pour accepter les requêtes de localhost:3000

### Problème 5: GraphQL query ne retourne rien

```bash
# 1. Vérifier que la base de données a des données
npm run prisma:studio

# 2. Si vide, réinitialiser les données
npm run prisma:seed

# 3. Tester la query directement dans Apollo Studio
# http://localhost:4000/graphql
```

## Commandes utiles

```bash
# Réinitialiser complètement le projet
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all

# Réinitialiser la base de données
cd backend
npx prisma migrate reset
npm run prisma:seed

# Voir les logs en temps réel
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Ou utiliser concurrently (tout dans un terminal)
npm run dev

# Ouvrir Prisma Studio pour voir les données
npm run prisma:studio
```

## Vérification finale

Une fois que tout fonctionne, vous devriez voir:

1. Backend GraphQL sur http://localhost:4000/graphql
2. Frontend React sur http://localhost:3000
3. Le feed affiche plusieurs posts avec:
   - Description
   - URL cliquable
   - Auteur du post
4. Pas d'erreurs dans la console du navigateur
5. Pas d'erreurs dans les terminaux

## Prochaines étapes

Si tout fonctionne correctement, vous êtes prêt pour le Step 10 qui ajoutera:
- Mutations pour créer des posts
- Formulaires React
- Gestion d'erreurs avancée
- Optimistic UI
