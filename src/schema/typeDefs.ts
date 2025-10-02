// Step 2: Relations entre types

export const typeDefs = `#graphql
  # Type User avec ses relations
  type User {
    id: ID!
    name: String!
    email: String!
    # Relations
    posts: [Post!]!
    comments: [Comment!]!
  }

  # Type Post avec ses relations
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    # Relations
    author: User!
    comments: [Comment!]!
  }

  # Type Comment avec ses relations
  type Comment {
    id: ID!
    text: String!
    postId: ID!
    authorId: ID!
    # Relations
    post: Post!
    author: User!
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
    postsByAuthor(authorId: ID!): [Post!]!

    # Comments
    comments: [Comment!]!
    commentsByPost(postId: ID!): [Comment!]!
  }

  # Mutations
  type Mutation {
    # Users
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User

    # Posts
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post

    # Comments
    createComment(text: String!, postId: ID!, authorId: ID!): Comment!
  }
`;