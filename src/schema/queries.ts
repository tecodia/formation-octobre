// Step 6: Queries avec directives @cacheControl

export const QueriesTypeDef = `#graphql
  type Query {
    # Query de test
    hello: String! @cacheControl(maxAge: 60)

    feed: [Feed!]!
    articles: [Article!]!

    # Users - Cache court pour les listes
    users: [User!]! @cacheControl(maxAge: 60, scope: PUBLIC)
    user(id: ID!): User @cacheControl(maxAge: 300, scope: PUBLIC)

    # Posts - Cache moyen
    posts: [Post!]! @cacheControl(maxAge: 60, scope: PUBLIC)
    post(id: ID!): Post @cacheControl(maxAge: 300, scope: PUBLIC)
    postsByAuthor(authorId: ID!): [Post!]! @cacheControl(maxAge: 120, scope: PUBLIC)

    # Comments - Cache court car souvent mis à jour
    comments: [Comment!]! @cacheControl(maxAge: 30, scope: PUBLIC)
    commentsByPost(postId: ID!): [Comment!]! @cacheControl(maxAge: 120, scope: PUBLIC)
  }
`;
