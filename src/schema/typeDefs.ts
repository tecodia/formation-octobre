// Step 1: TypeDefs dans un fichier séparé

export const typeDefs = `#graphql
  # Type User pour notre application
  type User {
    id: ID!
    name: String!
    email: String!
  }

  # Type Post pour notre blog
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    user: User!
    # On ajoutera la relation author plus tard
  }

  # Type Comment (préparation)
  type Comment {
    id: ID!
    text: String!
    postId: ID!
    authorId: ID!
  }

  # Queries disponibles
  type Query {
    # Query de test
    hello: String!

    # Users
    users: [User!]!
    user(id: ID!): User

    # Posts
    posts: [Post!]!
    post(id: ID!): Post
  }

  # Mutations (préparation pour Step 2)
  type Mutation {
    # Créer un user
    createUser(name: String!, email: String!): User!

    # Créer un post
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }
`;