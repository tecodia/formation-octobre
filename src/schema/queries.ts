// Définition de toutes les queries disponibles

export const QueriesTypeDef = `#graphql
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

    # home Page
    homePage: HomePage!
  }
`;
