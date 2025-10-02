# Formation GraphQL avec Apollo Server 🚀

Formation pratique pour apprendre GraphQL étape par étape avec Apollo Server et Apollo Client.

## 📚 Structure de la formation

Chaque étape est sur une branche différente. Si vous êtes bloqués, vous pouvez checkout la branche suivante.

### Branches disponibles

#### Backend (Jour 1)
- **main** (Step 0) : Apollo Server basique monofichier ✅
- **step1** : Séparation typeDefs/resolvers en modules
- **step2** : Schema complet Blog (User, Post, Comment)
- **step3** : PostgreSQL + Docker
- **step4** : DataLoader (résolution N+1)
- **step5** : Cache HTTP
- **step6** : Plugin monitoring (DB/Cache calls)
- **step7** : Pagination cursor

#### Frontend (Jour 2)
- **step8** : Frontend React + Apollo Client
- **step9** : Queries & Mutations
- **step10** : Persisted Queries
- **step11** : Subscriptions
- **step12** : Optimistic UI
- **step13** : Authentication JWT
- **step14** : Error Handling avancé
- **step15** : Federation (bonus)

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Lancer en développement (avec hot-reload)
npm run dev

# Lancer en production
npm start
```

Le serveur GraphQL se lance sur http://localhost:4000

## 📝 Step 0 - Apollo Server basique (branche actuelle)

### Ce que vous apprenez :
- Setup initial d'Apollo Server
- Définition de types GraphQL
- Écriture de resolvers simples
- Queries de base

### Structure actuelle :
```
src/
└── index.ts       # Tout dans un fichier pour commencer
```

### Queries à tester :

```graphql
# Query de test
query Hello {
  hello
}

# Récupérer tous les users
query GetUsers {
  users {
    id
    name
    email
  }
}

# Récupérer un user par ID
query GetUser {
  user(id: "1") {
    name
    email
  }
}
```

## 🎯 Objectif du Step 0

1. Comprendre la structure basique d'un serveur GraphQL
2. Écrire votre première query
3. Comprendre la relation typeDefs/resolvers
4. Utiliser Apollo Studio (interface GraphQL)

## ⏭️ Passer au Step 1

```bash
git checkout step1
```

Le Step 1 va organiser le code en modules séparés pour une meilleure structure.

## 📖 Ressources

- [Documentation Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Spec](https://graphql.org/)
- [Slides de la formation](../formation-graphql.md)

## 👨‍🏫 Formateur

Jonathan Jalouzot - [GitHub](https://github.com/captainjojo)