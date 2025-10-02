# Step 2 - Relations entre types

## 📚 Ce que vous apprenez

- Field resolvers pour les relations
- Navigation dans le graphe de données
- Queries complexes avec relations
- Le problème N+1 (on le voit apparaître !)

## ✨ Nouveautés

### Relations ajoutées
- `User.posts` : Tous les posts d'un user
- `User.comments` : Tous les commentaires d'un user
- `Post.author` : L'auteur d'un post
- `Post.comments` : Les commentaires d'un post
- `Comment.author` : L'auteur d'un commentaire
- `Comment.post` : Le post du commentaire

### Nouvelles queries
- `postsByAuthor(authorId: ID!)` : Posts d'un auteur
- `commentsByPost(postId: ID!)` : Commentaires d'un post
- `comments` : Tous les commentaires

### Nouvelles mutations
- `updateUser` et `updatePost`
- `createComment`

## 🧪 Queries relationnelles à tester

### Query simple avec relations
```graphql
query GetUserWithPosts {
  user(id: "1") {
    name
    posts {
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

### Query complexe (graphe profond)
```graphql
query DeepGraph {
  posts {
    title
    author {
      name
      posts {
        title
      }
    }
    comments {
      text
      author {
        name
        comments {
          text
        }
      }
    }
  }
}
```

### Mutations avec relations
```graphql
mutation AddComment {
  createComment(
    text: "Super article !"
    postId: "1"
    authorId: "2"
  ) {
    id
    text
    post {
      title
    }
    author {
      name
    }
  }
}
```

## ⚠️ Problème N+1

Observez les logs (si vous en ajoutez) : chaque relation déclenche une nouvelle requête !

Exemple problématique :
```graphql
query N1Problem {
  posts {            # 1 requête
    author {         # N requêtes (1 par post)
      name
    }
  }
}
```

Si on a 10 posts = 11 requêtes au total !
**Solution** → Step 4 avec DataLoader

## 🎯 Exercices

1. Ajoutez un field `postsCount` sur User (sans faire de requête supplémentaire)
2. Créez une query `search(term: String!)` qui cherche dans les posts
3. Ajoutez une relation `replies` sur Comment (commentaires de commentaires)

## ⏭️ Prochain step

```bash
git checkout step3
```

Step 3 : Base de données PostgreSQL avec Docker