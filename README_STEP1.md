# Step 1 - Organisation modulaire

## 📚 Ce que vous apprenez

- Organiser le code en modules
- Séparer typeDefs et resolvers
- Structure de projet scalable
- Types TypeScript pour les données

## 📁 Nouvelle structure

```
src/
├── index.ts              # Point d'entrée
├── schema/
│   └── typeDefs.ts       # Définitions GraphQL
├── resolvers/
│   ├── index.ts          # Export principal
│   ├── queryResolvers.ts # Resolvers de queries
│   └── mutationResolvers.ts # Resolvers de mutations
└── data/
    └── mockData.ts       # Données mockées + types TS
```

## ✨ Nouveautés

1. **Code modulaire** : Chaque partie a son fichier
2. **TypeScript types** : Interfaces pour User, Post, Comment
3. **Mutations** : createUser et createPost
4. **Plus de données** : Posts et Comments ajoutés

## 🧪 Queries et Mutations à tester

### Queries

```graphql
# Récupérer tous les posts
query GetPosts {
  posts {
    id
    title
    content
    authorId
  }
}

# Récupérer un post spécifique
query GetPost {
  post(id: "1") {
    title
    content
  }
}
```

### Mutations

```graphql
# Créer un nouvel utilisateur
mutation CreateUser {
  createUser(name: "David", email: "david@example.com") {
    id
    name
    email
  }
}

# Créer un nouveau post
mutation CreatePost {
  createPost(
    title: "Mon nouveau post"
    content: "Contenu intéressant..."
    authorId: "1"
  ) {
    id
    title
    content
  }
}
```

## 🎯 Exercices

1. Ajoutez une mutation `updateUser`
2. Ajoutez une query `postsByAuthor(authorId: ID!)`
3. Créez un resolver pour `Comment`

## ⏭️ Prochain step

```bash
git checkout step2
```

Step 2 : Relations entre types (author dans Post, posts dans User)