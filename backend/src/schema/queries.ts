// Step 6: Queries avec directives @cacheControl

export const QueriesTypeDef = `#graphql
  type Query {
    # Query de test
    hello: String! @cacheControl(maxAge: 60)

    # Users - Cache court pour les listes
    users: [User!]! @cacheControl(maxAge: 60, scope: PUBLIC)
    user(id: ID!): User @cacheControl(maxAge: 300, scope: PUBLIC)

    # Posts - Step 7: Utilisation du Feed avec Union
    posts: [Post!]! @cacheControl(maxAge: 60, scope: PUBLIC) # Ancien format pour compatibilité
    post(id: ID!): Post @cacheControl(maxAge: 300, scope: PUBLIC)
    postsByAuthor(authorId: ID!): [Post!]! @cacheControl(maxAge: 120, scope: PUBLIC)

    # Feed avec unions
    feed: [Feed!]! @cacheControl(maxAge: 60, scope: PUBLIC)
    feedItem(id: ID!): Feed @cacheControl(maxAge: 300, scope: PUBLIC)

    # Step 10: Feed avec pagination cursor-based
    feedPaginated(first: Int, after: String, last: Int, before: String): FeedConnection! @cacheControl(maxAge: 30, scope: PUBLIC)

    # Comments - Cache court car souvent mis à jour
    comments: [Comment!]! @cacheControl(maxAge: 30, scope: PUBLIC)
    commentsByPost(postId: ID!): [Comment!]! @cacheControl(maxAge: 120, scope: PUBLIC)
  }
`;
